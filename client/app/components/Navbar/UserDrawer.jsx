import { useState, useEffect } from "react";
import Link from "next/link";
import { Drawer, Menu, Avatar, message, Button, Badge } from "antd";
import {
  PlayCircleOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LikeOutlined,
  UserOutlined,
  BellOutlined
} from "@ant-design/icons";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider } from "ethers";
import { getAAWalletAddress } from "@/app/utils/aaUtils";

export default function UserDrawer() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aaWalletAddress, setAAWalletAddress] = useState(null);

  const { address: account } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  const resolveAAWalletAddress = async () => {
    if (!account || !walletProvider) return;
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const aaWalletAddress = await getAAWalletAddress(signer);
      console.log(
        `Resolved AA Wallet Address for account ${account}: ${aaWalletAddress}`
      );
      setAAWalletAddress(aaWalletAddress?.toLowerCase());
    } catch (err) {
      console.error("Error resolving AA Wallet Address:", err);
    }
  };

  useEffect(() => {
    if (account && walletProvider) {
      resolveAAWalletAddress();
    }
  }, [account, walletProvider]);

  return (
    <>
      <Badge dot>
        <Avatar
          size={"large"}
          icon={account ? null : <UserOutlined />}
          src={
            account
              ? `https://api.dicebear.com/5.x/open-peeps/svg?seed=${aaWalletAddress}`
              : null
          }
          onClick={() => setDrawerOpen(true)}
          style={{ cursor: "pointer", border: "1px solid #000" }}
        />
      </Badge>
      <Drawer
        open={drawerOpen}
        width={420}
        onClose={() => setDrawerOpen(false)}
        forceRender
        title={<appkit-button balance="show" />}
        extra={
          <Button
            size="large"
            shape="circle"
            icon={<BellOutlined />}
            onClick={() => message.info("Notifications coming soon!")}
          />
        }
      >
        <Menu
          onClick={() => setDrawerOpen(false)}
          items={[
            ...(aaWalletAddress
              ? [
                  {
                    key: "channel",
                    label: (
                      <Link href={`/channel/${aaWalletAddress}`}>
                        My Channel
                      </Link>
                    ),
                    icon: <PlayCircleOutlined />
                  },
                  {
                    key: "liked",
                    label: (
                      <Link href={`/channel/${aaWalletAddress}?tab=liked`}>
                        Liked Videos
                      </Link>
                    ),
                    icon: <LikeOutlined />
                  },
                  {
                    key: "settings",
                    label: "Settings",
                    icon: <SettingOutlined />
                  }
                ]
              : []),

            {
              key: "help",
              label: "Help & FAQ",
              icon: <QuestionCircleOutlined />
            }
          ]}
        />
      </Drawer>
    </>
  );
}
