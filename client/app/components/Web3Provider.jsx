"use client";
import { useState, useEffect } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import "@ant-design/v5-patch-for-react-19";

export default function Web3Provider({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return <ThirdwebProvider>{mounted && children}</ThirdwebProvider>;
}
