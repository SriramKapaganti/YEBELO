"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

interface RSIChartProps {
  data: { time: string; rsi: number }[];
}

const RSIChart: React.FC<RSIChartProps> = ({ data }) => {
  return (
    // RSIChart.tsx
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="time" stroke="#4B5563" />
      <YAxis domain={[0, 100]} stroke="#4B5563" />
      <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#fff" }} />
      <CartesianGrid stroke="#6B7280" strokeDasharray="5 5" />
      <ReferenceLine y={70} stroke="red" strokeDasharray="3 3" />
      <ReferenceLine y={30} stroke="green" strokeDasharray="3 3" />
      <Line type="monotone" dataKey="rsi" stroke="#10B981" strokeWidth={2} />
    </LineChart>
  );
};

export default RSIChart;
