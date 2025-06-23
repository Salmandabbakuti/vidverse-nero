"use client";
import { useState, useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider, theme } from "antd";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import { neroTestnetChain, neroMainnetChain } from "@/app/utils";

// 1. Get projectId at https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;
const networks = [neroTestnetChain, neroMainnetChain, mainnet, arbitrum];

// 2. Create a metadata object
const metadata = {
  name: "VidVerse",
  description:
    "The decentralized video platform for creators and viewers. Own your content. Earn rewards. Join the future of video.",
  url: "https://vidverse-nero.vercel.app",
  icons: ["https://vidverse-nero.vercel.app/favicon.ico"]
};

// 3. Create the AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks,
  projectId,
  defaultNetwork: neroTestnetChain,
  allowUnsupportedChain: false,
  chainImages: {
    689: "https://testnet.neroscan.io/favicon.svg",
    1689: "https://framerusercontent.com/images/45NncLY0V1ELrMis3GvSCJsN79s.png"
  },
  themeMode: "light",
  themeVariables: {
    "--w3m-accent": "#6c6ace",
    "--w3m-z-index": 9999
  },
  features: {
    analytics: true,
    swaps: false,
    onramp: false,
    email: true,
    connectMethodsOrder: ["wallet", "social", "email"],
    emailShowWallets: true,
    legalCheckbox: true,
    termsConditionsUrl: "https://example.com/terms",
    privacyPolicyUrl: "https://example.com/privacy"
  }
});

export default function Web3Provider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <ConfigProvider
      theme={{
        algorithm: [theme.defaultAlgorithm]
      }}
    >
      {mounted && children}
    </ConfigProvider>
  );
}
