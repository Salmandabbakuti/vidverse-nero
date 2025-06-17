import { Card, Avatar, Typography, Image, Space } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import styles from "./VideoCard.module.css";
const { Title, Text } = Typography;

export default function VideoPreviewCard({
  title,
  videoUrl,
  thumbUrl,
  category
}) {
  return (
    <Card
      style={{ borderRadius: 10 }}
      hoverable
      variant="outlined"
      cover={
        <div
          style={{
            minHeight: 200,
            maxHeight: 320,
            width: "100%",
            borderRadius: "10px 10px 0 0",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: !videoUrl && !thumbUrl ? "#f5f5f5" : undefined
          }}
        >
          {!videoUrl && !thumbUrl ? (
            <span style={{ color: "#aaa", fontSize: 15, padding: 10 }}>
              No preview available. Please select a video and thumbnail.
            </span>
          ) : (
            <>
              {thumbUrl && (
                <Image
                  preview={false}
                  alt={title}
                  src={thumbUrl}
                  className={styles.thumbnail}
                  style={{
                    minHeight: 200,
                    maxHeight: 320,
                    width: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    borderRadius: "10px 10px 0 0",
                    top: 0,
                    left: 0,
                    zIndex: 1
                  }}
                />
              )}
              {videoUrl && (
                <video
                  src={videoUrl}
                  controls
                  style={{
                    width: "100%",
                    minHeight: 200,
                    maxHeight: 320,
                    objectFit: "cover",
                    borderRadius: "10px 10px 0 0",
                    position: "relative",
                    zIndex: 2,
                    background: "transparent",
                    opacity: 0.95
                  }}
                  poster={thumbUrl}
                />
              )}
            </>
          )}
        </div>
      }
      className={styles.card}
    >
      <Card.Meta
        avatar={
          <Avatar
            size="large"
            src={"https://api.dicebear.com/5.x/open-peeps/svg?seed=0x000...000"}
            style={{ border: "1px solid grey", cursor: "pointer" }}
          />
        }
        title={
          <div className={styles.metaTitle}>
            <Title level={5} className={styles.title}>
              {title}
            </Title>
          </div>
        }
        description={
          <Space wrap>
            <Text className={styles.text}>
              0x000...000 <CheckCircleTwoTone twoToneColor="#52c41a" />
            </Text>
            <Text className={styles.text}>
              {category + " • a few seconds ago"}
            </Text>
          </Space>
        }
      />
    </Card>
  );
}
