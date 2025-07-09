import { useState, useEffect } from "react";
import Link from "next/link";
import { Drawer, Menu, Avatar, message, Button, Badge, Tag } from "antd";
import {
  PlayCircleOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LikeOutlined,
  UserOutlined,
  BellOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider } from "ethers";
import { getAAWalletAddress } from "@/app/utils/aaUtils";
import { contract } from "@/app/utils";

export default function UserDrawer() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aaWalletAddress, setAAWalletAddress] = useState(null);
  const [isModerator, setIsModerator] = useState(false);

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

  const checkIfModerator = async () => {
    if (!account) return;
    try {
      const moderator = await contract.moderator();
      console.log("Current moderator:", moderator);
      const isCurrentUserModerator =
        account?.toLowerCase() === moderator?.toLowerCase();
      setIsModerator(isCurrentUserModerator);
    } catch (err) {
      console.error("Error checking moderator status:", err);
    }
  };

  useEffect(() => {
    if (account && walletProvider) {
      resolveAAWalletAddress();
      checkIfModerator();
    }
  }, [account, walletProvider]);

  const getMenuItems = () => {
    const menuItems = [];

    // Moderator Dashboard - Highest priority
    if (isModerator) {
      menuItems.push({
        key: "moderator",
        label: (
          <Link href="/moderator/dashboard">
            Dashboard{" "}
            <Tag title="Moderator" color="red" size="small" bordered={false}>
              Mod
            </Tag>
          </Link>
        ),
        icon: <SafetyCertificateOutlined />
      });
    }

    // User specific items
    if (aaWalletAddress) {
      menuItems.push(
        {
          key: "channel",
          label: <Link href={`/channel/${aaWalletAddress}`}>My Channel</Link>,
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
      );
    }
    // Global items - Always visible
    menuItems.push({
      key: "help",
      label: "Help & FAQ",
      icon: <QuestionCircleOutlined />
    });
    return menuItems;
  };

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
        <Menu onClick={() => setDrawerOpen(false)} items={getMenuItems()} />
      </Drawer>
    </>
  );
}
