use rdkafka::config::ClientConfig;
use rdkafka::consumer::{Consumer, StreamConsumer};
use rdkafka::message::Message;
use rdkafka::producer::{FutureProducer, FutureRecord};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::time::Duration;
use futures_util::StreamExt;




#[derive(Debug, Deserialize)]
struct Trade {
    token_address: String,
    price_in_sol: f64,
    block_time: String,
}

#[derive(Debug, Serialize)]
struct RsiResult {
    token_address: String,
    rsi: f64,
}

fn calculate_rsi(prices: &[f64]) -> f64 {
    if prices.len() < 15 {
        return 50.0; // Not enough data, neutral RSI
    }

    let gains: f64 = prices.windows(2)
        .map(|w| (w[1] - w[0]).max(0.0))
        .sum();
    let losses: f64 = prices.windows(2)
        .map(|w| (w[0] - w[1]).max(0.0))
        .sum();

    let avg_gain = gains / 14.0;
    let avg_loss = losses / 14.0;

    if avg_loss == 0.0 {
        100.0
    } else {
        let rs = avg_gain / avg_loss;
        100.0 - (100.0 / (1.0 + rs))
    }
}

#[tokio::main]
async fn main() {
    let brokers = "localhost:9092"; // Your Redpanda broker
    let consumer: StreamConsumer = ClientConfig::new()
        .set("group.id", "rsi_group")
        .set("bootstrap.servers", brokers)
        .set("enable.partition.eof", "false")
        .create()
        .expect("Consumer creation failed");

    consumer.subscribe(&["trade-data"]).expect("Can't subscribe");

    let producer: FutureProducer = ClientConfig::new()
        .set("bootstrap.servers", brokers)
        .create()
        .expect("Producer creation failed");

    let mut token_prices: HashMap<String, Vec<f64>> = HashMap::new();

    println!("Listening for trade-data messages...");

    let mut message_stream = consumer.stream();

    while let Some(message) = message_stream.next().await {
        match message {
            Ok(m) => {
                if let Some(payload) = m.payload_view::<str>().unwrap() {
                    if let Ok(trade) = serde_json::from_str::<Trade>(payload) {
                        let prices = token_prices.entry(trade.token_address.clone()).or_insert(Vec::new());
                        prices.push(trade.price_in_sol);

                        if prices.len() > 14 {
                            let rsi = calculate_rsi(prices);
                            let rsi_result = RsiResult {
                                token_address: trade.token_address.clone(),
                                rsi,
                            };
                            let payload = serde_json::to_string(&rsi_result).unwrap();

                            let record = FutureRecord::to("rsi-data")
                                .payload(&payload)
                                .key(&trade.token_address);

                            producer.send(record, Duration::from_secs(0)).await.unwrap();
                            println!("Published RSI: {:?}", rsi_result);
                        }
                    }
                }
            }
            Err(e) => eprintln!("Kafka error: {:?}", e),
        }
    }
}
