import { useEffect, useState } from "react";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWalletChain
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import {
  thirdwebClient,
  neroTestnetChain,
  neroMainnetChain,
  ellipsisString
} from "@/app/utils";
import { getAAWalletAddress } from "@/app/utils/aaUtils";

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
  const [aaWalletAddress, setAAWalletAddress] = useState("");

  const activeChain = useActiveWalletChain();
  const accountObj = useActiveAccount() || {};
  const account = accountObj?.address?.toLowerCase();

  const resolveAAWalletAddress = async () => {
    if (!account) return;
    try {
      const signer = ethers6Adapter.signer.toEthers({
        client: thirdwebClient,
        chain: activeChain,
        account: accountObj
      });
      const aaWalletAddress = await getAAWalletAddress(signer);
      console.log(
        `Resolved AA Wallet Address for account ${account}: ${aaWalletAddress}`
      );
      setAAWalletAddress(aaWalletAddress?.toLowerCase() || "");
    } catch (err) {
      console.error("Error resolving AA Wallet Address:", err);
    }
  };

  useEffect(() => {
    resolveAAWalletAddress();
  }, [account]);

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
        connectedAccountName: `${ellipsisString(
          aaWalletAddress,
          5,
          5
        )} (AA Wallet)`,
        connectedAccountAvatarUrl: `https://api.dicebear.com/5.x/open-peeps/svg?seed=${aaWalletAddress}`,
        style: {
          borderRadius: "15px"
        }
      }}
      detailsModal={{
        connectedAccountName: `${ellipsisString(
          aaWalletAddress,
          5,
          5
        )} (AA Wallet)`,
        connectedAccountAvatarUrl: `https://api.dicebear.com/5.x/open-peeps/svg?seed=${aaWalletAddress}`
      }}
      appMetadata={{
        name: "VidVerse",
        description: "A decentralized video sharing platform.",
        url: "https://vidverse.io",
        logoUrl: "https://vidverse.io/logo.png"
      }}
      theme={"light"} // light | dark
    />
  );
}
