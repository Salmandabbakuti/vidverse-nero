import { Contract, JsonRpcProvider } from "ethers";
import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { VIDVERSE_CONTRACT_ADDRESS } from "./constants";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

export const thirdwebClient = createThirdwebClient({ clientId });

export const neroTestnetChain = defineChain({
  id: 689,
  name: "Nero Testnet",
  rpc: "https://rpc-testnet.nerochain.io",
  icon: "https://docs.nerochain.io/assets/nerologo.svg",
  nativeCurrency: {
    name: "Nero",
    symbol: "NERO",
    decimals: 18
  },
  testnet: true,
  blockExplorers: [
    {
      name: "Nero Testnet Explorer",
      url: "https://testnet.neroscan.io/"
    }
  ],
  faucets: [
    "https://app.testnet.nerochain.io/faucet",
    "https://faucet-testnet.nerochain.io/"
  ]
});

export const neroMainnetChain = defineChain({
  id: 1689,
  name: "Nero Mainnet",
  rpc: "https://rpc.nerochain.io",
  icon: "https://docs.nerochain.io/assets/nerologo.svg",
  nativeCurrency: {
    name: "Nero",
    symbol: "NERO",
    decimals: 18
  },
  testnet: false,
  blockExplorers: [
    {
      name: "Nero Mainnet Explorer",
      url: "https://explorer.nerochain.io/"
    }
  ]
});

export const defaultProvider = new JsonRpcProvider(
  "https://rpc-testnet.nerochain.io",
  689,
  {
    staticNetwork: true
  }
);

const abi = []; // ABI of the contract

export const contract = new Contract(
  VIDVERSE_CONTRACT_ADDRESS,
  abi,
  defaultProvider
);

export const ellipsisString = (str, first, last) =>
  str.slice(0, first) + "..." + str.slice(-last);
