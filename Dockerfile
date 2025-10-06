# Node build
FROM node:20 AS node-builder
WORKDIR /app/node
COPY ./yebelo-dashboard/package*.json ./
RUN npm install
COPY ./yebelo-dashboard ./
RUN npm run build

# Rust build
FROM rust:1.75 AS rust-builder
WORKDIR /app/rust
RUN apt-get update && apt-get install -y pkg-config libssl-dev librdkafka-dev && rm -rf /var/lib/apt/lists/*
COPY ./rsi_calculator/Cargo.toml ./rsi_calculator/Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src
COPY ./rsi_calculator ./
RUN cargo build --release

# Final runtime image
FROM debian:bullseye-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl librdkafka1 libssl-dev && rm -rf /var/lib/apt/lists/*
COPY --from=node-builder /app/node/dist ./node-app
COPY --from=rust-builder /app/rust/target/release/rsi_calculator ./rust-app
COPY ./csv-to-redpanda-producer ./csv-producer

CMD ["bash"]
