"use client";
import { useState, useEffect, use } from "react";
import {
  message,
  Row,
  Col,
  Card,
  Empty,
  Typography,
  Avatar,
  Image,
  Space,
  Tabs,
  List,
  Button
} from "antd";
import { formatEther } from "ethers";
import {
  CheckCircleTwoTone,
  ShareAltOutlined,
  DollarOutlined,
  VideoCameraOutlined,
  LikeOutlined,
  CommentOutlined,
  ExportOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { subgraphClient as client, GET_CHANNEL_QUERY } from "@/app/utils";
import { EXPLORER_URL, IPFS_GATEWAY_URL } from "@/app/utils/constants";
import VideoCard from "@/app/components/VideoCard";
import styles from "./page.module.css";

dayjs.extend(relativeTime);

const { Text } = Typography;

export default function Channel({ params }) {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "uploaded";
  const pathname = usePathname();

  const fetchChannel = async () => {
    console.log("Fetching channel info...");
    setLoading(true);
    client
      .request(GET_CHANNEL_QUERY, {
        id,
        videos_first: 50,
        videos_skip: 0,
        videos_orderBy: "createdAt",
        videos_orderDirection: "desc",
        videos_where: {
          isRemoved: false
        },
        tips_first: 50,
        tips_skip: 0,
        tips_orderBy: "createdAt",
        tips_orderDirection: "desc",
        likes_first: 50,
        likes_skip: 0,
        likes_orderBy: "createdAt",
        likes_orderDirection: "desc",
        likes_where: {
          video_: {
            isRemoved: false
          }
        },
        comments_first: 50,
        comments_skip: 0,
        comments_orderBy: "createdAt",
        comments_orderDirection: "desc",
        comments_where: {
          video_: {
            isRemoved: false
          }
        }
      })
      .then((data) => {
        setChannel(data?.channel);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch channel info:", error);
        message.error("Failed to get channel info. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchChannel();
  }, []);

  return (
    <>
      {/* card with avatar and cover to show channel details */}
      <Card
        loading={loading}
        style={{ borderRadius: 20, marginBottom: 16 }}
        className={styles.card}
        cover={
          <Image
            preview={false}
            alt={id}
            src={`https://picsum.photos/seed/${id}/1200/200`}
            className={styles.thumbnail}
          />
        }
      >
        <Card.Meta
          avatar={
            <Avatar
              size="large"
              src={`https://api.dicebear.com/5.x/open-peeps/svg?seed=${id}`}
              style={{ border: "1px solid grey", cursor: "pointer" }}
            />
          }
          title={
            <>
              <Text>{id}</Text>{" "}
              {channel?.createdAt && (
                <CheckCircleTwoTone twoToneColor="#52c41a" />
              )}
            </>
          }
          description={
            <Space>
              <Text type="secondary" style={{ margin: 0 }}>
                {channel?.createdAt
                  ? `${channel?.videos?.length} Videos • Joined ${dayjs(
                      channel?.createdAt * 1000
                    ).fromNow()}`
                  : "• Not joined yet"}
              </Text>
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: `${id} Channel | ThreeTube`,
                        text: `${id} | ThreeTube`,
                        url: window.location.href
                      })
                      .catch((err) =>
                        console.error("Failed to share channel:", err)
                      );
                  } else {
                    console.log("Web Share API not supported in your browser");
                    navigator.clipboard.writeText(window.location.href);
                    message.success("Link copied to clipboard");
                  }
                }}
              />
            </Space>
          }
        />
      </Card>
      <Tabs
        activeKey={activeTab}
        animated
        type="line"
        onChange={(key) => {
          router.push(`${pathname}?tab=${key}`);
        }}
        items={[
          {
            key: "uploaded",
            label: "Uploaded",
            icon: <VideoCameraOutlined />,
            children: (
              <Row gutter={[16, 16]} justify="start" className={styles.grid}>
                {loading ? (
                  Array.from({ length: 12 }).map((_, index) => (
                    <Col key={index} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        loading
                        style={{ borderRadius: 20 }}
                        cover={
                          <div
                            style={{
                              height: 150,
                              borderRadius: 20
                            }}
                          />
                        }
                      />
                    </Col>
                  ))
                ) : !channel?.videos?.length ? (
                  <Empty description="No videos found" />
                ) : (
                  channel?.videos?.map((video) => (
                    <Col key={video?.id} xs={24} sm={12} md={8} lg={6}>
                      <Link href={`/watch/${video?.id}`}>
                        <VideoCard video={video} />
                      </Link>
                    </Col>
                  ))
                )}
              </Row>
            )
          },
          {
            key: "liked",
            label: "Liked",
            icon: <LikeOutlined />,
            children: (
              <Row gutter={[16, 16]} justify="start" className={styles.grid}>
                {loading ? (
                  Array.from({ length: 12 }).map((_, index) => (
                    <Col key={index} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        loading
                        style={{ borderRadius: 20 }}
                        cover={
                          <div
                            style={{
                              height: 150,
                              borderRadius: 20
                            }}
                          />
                        }
                      />
                    </Col>
                  ))
                ) : !channel?.likes?.length ? (
                  <Empty description="No liked videos found" />
                ) : (
                  channel?.likes?.map((like) => (
                    <Col key={like?.id} xs={24} sm={12} md={8} lg={6}>
                      <Link href={`/watch/${like?.video?.id}`}>
                        <VideoCard video={like?.video} />
                      </Link>
                    </Col>
                  ))
                )}
              </Row>
            )
          },
          {
            key: "comments",
            label: "Comments",
            icon: <CommentOutlined />,
            children: (
              <List
                itemLayout="horizontal"
                split
                loading={loading}
                pagination={{
                  size: "small",
                  responsive: true,
                  hideOnSinglePage: true,
                  showLessItems: true,
                  pageSizeOptions: [5, 10, 25, 50],
                  showSizeChanger: true,
                  defaultCurrent: 1,
                  defaultPageSize: 20
                }}
                dataSource={channel?.comments || []}
                rowKey={(item) => item?.id}
                renderItem={(item) => (
                  <Link href={`/watch/${item?.video?.id}`} key={item?.id}>
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            shape="square"
                            size="large"
                            style={{
                              cursor: "pointer",
                              border: "1px solid grey",
                              width: 120,
                              height: 90
                            }}
                            src={`${IPFS_GATEWAY_URL}/ipfs/${item?.video?.thumbnailHash}`}
                          />
                        }
                        title={
                          <Space>
                            <Typography.Text strong>
                              {`“${item?.content}”`}
                            </Typography.Text>
                            <Typography.Text type="secondary">
                              {dayjs(item?.createdAt * 1000).fromNow()}
                            </Typography.Text>
                          </Space>
                        }
                        description={`Commented on “${item?.video?.title}”`}
                      />
                    </List.Item>
                  </Link>
                )}
              />
            )
          },
          {
            key: "tips",
            label: "Tips",
            icon: <DollarOutlined />,
            children: (
              <List
                itemLayout="horizontal"
                dataSource={channel?.tips || []}
                rowKey={(item) => item?.id}
                split
                loading={loading}
                pagination={{
                  size: "small",
                  responsive: true,
                  hideOnSinglePage: true,
                  showLessItems: true,
                  pageSizeOptions: [5, 10, 25, 50],
                  showSizeChanger: true,
                  defaultCurrent: 1,
                  defaultPageSize: 10
                }}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Link href={`/watch/${item?.video?.id}`}>
                          <Avatar
                            shape="square"
                            size="large"
                            style={{
                              cursor: "pointer",
                              border: "1px solid grey",
                              width: 120,
                              height: 90
                            }}
                            src={`${IPFS_GATEWAY_URL}/ipfs/${item?.video?.thumbnailHash}`}
                          />
                        </Link>
                      }
                      title={
                        <Space>
                          <Typography.Text strong>
                            {`Tipped ${formatEther(item?.amount || 0n)} NERO`}
                          </Typography.Text>
                          <Typography.Text type="secondary">
                            {dayjs(item?.createdAt * 1000).format(
                              "MMM D, YYYY"
                            )}
                          </Typography.Text>
                          {/* link to explorer */}
                          <a
                            href={`${EXPLORER_URL}/tx/${item?.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExportOutlined title="View on Explorer" />
                          </a>
                        </Space>
                      }
                      description={`For “${item?.video?.title}”`}
                    />
                  </List.Item>
                )}
              />
            )
          }
        ]}
      />
    </>
  );
}
