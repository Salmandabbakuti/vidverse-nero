import { Card, Avatar, Typography, Image, Space } from "antd";
import {
  CheckCircleTwoTone,
  LikeOutlined,
  MessageOutlined,
  DollarCircleOutlined
} from "@ant-design/icons";
import { toEther } from "thirdweb";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import styles from "./VideoCard.module.css";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

export default function VideoCard({ video }) {
  return (
    <Card
      style={{ borderRadius: 20 }}
      hoverable
      cover={
        <Image
          preview={false}
          alt={video?.title}
          src={`https://ipfs.io/ipfs/${video?.thumbnailHash}`}
          className={styles.thumbnail}
          style={{ minHeight: 200, maxHeight: 200 }}
        />
      }
      className={styles.card}
    >
      <Card.Meta
        avatar={
          <Avatar
            size="large"
            src={`https://api.dicebear.com/5.x/open-peeps/svg?seed=${video?.channel?.id}`}
            style={{ border: "1px solid grey", cursor: "pointer" }}
          />
        }
        title={
          <div className={styles.metaTitle}>
            <Title level={5} className={styles.title}>
              {video?.title}
            </Title>
          </div>
        }
        description={
          <div>
            <Text className={styles.text}>
              {video?.channel?.id?.slice(0, 9) +
                "..." +
                video?.channel?.id?.slice(-5) +
                " "}
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            </Text>
            <Text className={styles.text}>
              {video?.category +
                " • " +
                dayjs(video?.createdAt * 1000).fromNow()}
            </Text>
            <Space className={styles.stats}>
              <span>
                <LikeOutlined /> {video?.likeCount || 0}
              </span>
              <span>
                <MessageOutlined /> {video?.commentCount || 0}
              </span>
              <span>
                <DollarCircleOutlined />{" "}
                {toEther(video?.tipAmount || 0n) + " ETH"}
              </span>
            </Space>
          </div>
        }
      />
    </Card>
  );
}
