"use client";

import React from "react";

interface TokenSelectorProps {
  tokens: string[];
  selectedToken: string;
  onChange: (token: string) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokens,
  selectedToken,
  onChange,
}) => {
  return (
    <select value={selectedToken} onChange={(e) => onChange(e.target.value)}>
      {tokens.map((token) => (
        <option key={token} value={token}>
          {token}
        </option>
      ))}
    </select>
  );
};

export default TokenSelector;
