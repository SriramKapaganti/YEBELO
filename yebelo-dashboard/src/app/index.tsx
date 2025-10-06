"use client";

import React, { useState, useEffect } from "react";
import TokenSelector from "./components/TokenSelector";
import PriceChart from "./components/PriceChart";
import RSIChart from "./components/RSIChart";

const tokens = ["TOKEN1", "TOKEN2", "TOKEN3", "TOKEN4", "TOKEN5"];

const Dashboard: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [priceData, setPriceData] = useState<{ time: string; price: number }[]>(
    []
  );
  const [rsiData, setRsiData] = useState<{ time: string; rsi: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const price = Math.random() * 100;
      const rsi = Math.random() * 100;
      setPriceData((prev) => [...prev.slice(-19), { time, price }]);
      setRsiData((prev) => [...prev.slice(-19), { time, rsi }]);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedToken]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          🚀 YEBELO Dashboard
        </h1>

        {/* Token Selector Card */}
        <div className="bg-white text-gray-800 rounded-xl p-4 shadow-lg mb-6 w-60 mx-auto">
          <h2 className="font-semibold mb-2">Select Token</h2>
          <TokenSelector
            tokens={tokens}
            selectedToken={selectedToken}
            onChange={setSelectedToken}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white text-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="font-bold mb-2">Current Price</h2>
            <p className="text-3xl">
              ${priceData[priceData.length - 1]?.price.toFixed(2)}
            </p>
          </div>
          <div className="bg-white text-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="font-bold mb-2">Current RSI</h2>
            <p className="text-3xl">
              {rsiData[rsiData.length - 1]?.rsi.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white text-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="font-bold mb-4">Price Chart</h2>
            <PriceChart data={priceData} />
          </div>
          <div className="bg-white text-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="font-bold mb-4">RSI Chart</h2>
            <RSIChart data={rsiData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
