import { useState } from "react";
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
import { useActiveAccount } from "thirdweb/react";

export default function UserDrawer() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { address } = useActiveAccount() || {};
  const account = address?.toLowerCase();

  return (
    <>
      <Badge dot>
        <Avatar
          size={"large"}
          icon={account ? null : <UserOutlined />}
          src={
            account
              ? `https://api.dicebear.com/5.x/open-peeps/svg?seed=${account}`
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
            ...(account
              ? [
                  {
                    key: "channel",
                    label: <Link href={`/channel/${account}`}>My Channel</Link>,
                    icon: <PlayCircleOutlined />
                  },
                  {
                    key: "liked",
                    label: (
                      <Link href={`/channel/${account}?tab=liked`}>
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
