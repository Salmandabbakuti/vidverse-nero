import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import {
  thirdwebClient,
  neroTestnetChain,
  neroMainnetChain
} from "@/app/utils";

const thirdwebWallets = [
  inAppWallet({
    auth: {
      options: ["google", "discord", "email", "passkey", "phone"]
    }
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("com.trustwallet.app"),
  createWallet("walletConnect"),
  createWallet("org.uniswap")
];

export default function ConnectWalletButton() {
  const { address } = useActiveAccount() || {};
  const account = address?.toLowerCase();

  return (
    <ConnectButton
      client={thirdwebClient}
      chain={neroTestnetChain} // default chain to connect
      chains={[neroTestnetChain, neroMainnetChain]} // chains to connect
      wallets={thirdwebWallets}
      recommendedWallets={[
        thirdwebWallets[0],
        thirdwebWallets[1],
        thirdwebWallets[2],
        thirdwebWallets[5],
        thirdwebWallets[6]
      ]}
      autoConnect={true}
      showAllWallets={false}
      // accountAbstraction={{
      //   chain: arbitrumSepolia,
      //   sponsorGas: true
      // }}
      connectModal={{
        size: "wide",
        title: "Connect",
        termsOfServiceUrl: "https://threetube.io/terms",
        privacyPolicyUrl: "https://threetube.io/privacy"
      }}
      connectButton={{
        label: "Connect Wallet",
        style: {
          borderRadius: "15px"
        }
      }}
      detailsButton={{
        connectedAccountAvatarUrl: `https://api.dicebear.com/5.x/open-peeps/svg?seed=${account}`,
        style: {
          borderRadius: "15px"
        }
      }}
      detailsModal={{
        connectedAccountAvatarUrl: `https://api.dicebear.com/5.x/open-peeps/svg?seed=${account}`
      }}
      appMetadata={{
        name: "ThreeTube",
        description: "A decentralized video sharing platform.",
        url: "https://threetube.io",
        logoUrl: "https://threetube.io/logo.png"
      }}
      theme={"light"} // light | dark
    />
  );
}
