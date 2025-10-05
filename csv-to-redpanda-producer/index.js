const fetch = require("node-fetch"); // node-fetch v2 for require()
const csv = require("csv-parser");
const { Kafka } = require("kafkajs");
const { Readable } = require("stream");

const kafka = new Kafka({
  clientId: "csv-publisher",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
const topic = "trade-data";

async function publishMessage(message) {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
}

async function readConvertToJson() {
  await producer.connect();

  const url =
    "https://raw.githubusercontent.com/Yebelo-Technologies/assignment-1/main/trades_data.csv";

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch CSV from GitHub");

  const csvText = await response.text();
  const stream = Readable.from(csvText).pipe(csv()); // convert text to Node.js stream

  stream
    .on("data", async (row) => {
      try {
        await publishMessage(row);
        console.log("Published:", row.transaction_signature);
      } catch (err) {
        console.error("Publish error:", err);
      }
    })
    .on("end", async () => {
      console.log("CSV processing completed successfully");
      await producer.disconnect();
    });
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await producer.disconnect();
  process.exit(0);
});

readConvertToJson().catch(console.error);
