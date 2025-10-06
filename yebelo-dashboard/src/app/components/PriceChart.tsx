"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface PriceChartProps {
  data: { time: string; price: number }[];
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  return (
    // PriceChart.tsx
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="time" stroke="#4B5563" />
      <YAxis stroke="#4B5563" />
      <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#fff" }} />
      <CartesianGrid stroke="#6B7280" strokeDasharray="5 5" />
      <Line type="monotone" dataKey="price" stroke="#8B5CF6" strokeWidth={2} />
    </LineChart>
  );
};

export default PriceChart;
