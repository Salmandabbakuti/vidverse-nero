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
import ConnectWalletButton from "./ConnectWalletButton";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import { getAAWalletAddress } from "@/app/utils/aaUtils";
import { thirdwebClient } from "@/app/utils";

export default function UserDrawer() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aaWalletAddress, setAAWalletAddress] = useState(null);
  const accountObj = useActiveAccount() || {};
  const account = accountObj?.address?.toLowerCase();
  const activeChain = useActiveWalletChain();

  const resolveAAWalletAddress = async () => {
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
      setAAWalletAddress(aaWalletAddress?.toLowerCase());
    } catch (err) {
      console.error("Error resolving AA Wallet Address:", err);
    }
  };

  useEffect(() => {
    if (account) {
      resolveAAWalletAddress();
    }
  }, [account]);

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
        width={320}
        onClose={() => setDrawerOpen(false)}
        forceRender
        title={<ConnectWalletButton />}
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
