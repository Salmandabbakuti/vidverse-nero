import { Card, Avatar, Typography, Image, Space } from "antd";
import {
  CheckCircleTwoTone,
  LikeOutlined,
  MessageOutlined,
  DollarCircleOutlined
} from "@ant-design/icons";
import { formatEther } from "ethers";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import styles from "./VideoCard.module.css";
import { IPFS_GATEWAY_URL } from "@/app/utils/constants";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

export default function VideoCard({ video }) {
  return (
    <Card
      style={{
        borderRadius: 20,
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 10px 30px rgba(31, 38, 135, 0.1)",
        transition: "all 0.3s ease",
        overflow: "hidden"
      }}
      hoverable
      cover={
        <div
          className={styles.coverContainer}
          style={{
            position: "relative",
            overflow: "hidden",
            height: "200px",
            minHeight: "200px",
            maxHeight: "200px",
            borderRadius: "20px 20px 0 0",
            background: "#f8fafc"
          }}
        >
          <img
            alt={video?.title}
            src={`${IPFS_GATEWAY_URL}/ipfs/${video?.thumbnailHash}`}
            className={styles.thumbnail}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
              display: "block",
              border: "none"
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(255, 255, 255, 0.32)",
              color: "#222",
              padding: "2px 10px",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: 500,
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 2px 6px rgba(31,38,135,0.08)",
              zIndex: 2,
              minWidth: 0,
              maxWidth: "90px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)"
            }}
          >
            {video?.category}
          </div>
        </div>
      }
      className={styles.card}
    >
      <Card.Meta
        avatar={
          <Avatar
            size="large"
            src={`https://api.dicebear.com/5.x/open-peeps/svg?seed=${video?.channel?.id}`}
            style={{
              border: "2px solid rgba(102, 126, 234, 0.2)",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)"
            }}
          />
        }
        title={
          <div className={styles.metaTitle}>
            <Title
              level={5}
              className={styles.title}
              style={{
                fontWeight: "700",
                color: "#2d3748",
                marginBottom: "8px",
                lineHeight: "1.3"
              }}
            >
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
            <Text
              className={styles.text}
              style={{
                marginTop: "4px"
              }}
            >
              {video?.location +
                " • " +
                dayjs(video?.createdAt * 1000).fromNow()}
            </Text>
            <Space
              size="small"
              style={{ marginTop: "8px", display: "flex", gap: "8px" }}
            >
              <LikeOutlined style={{ color: "#4299e1" }} />
              {video?.likeCount || 0}
              <MessageOutlined style={{ color: "#4299e1" }} />
              {video?.commentCount || 0}
              <DollarCircleOutlined style={{ color: "#f56565" }} />
              {formatEther(video?.tipAmount || 0n) + " NERO"}
            </Space>
          </div>
        }
      />
    </Card>
  );
}
