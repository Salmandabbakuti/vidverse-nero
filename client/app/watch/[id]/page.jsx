"use client";
import { useState, useEffect, use, useMemo } from "react";
import {
  message,
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Skeleton,
  Divider,
  Button,
  Space,
  Tabs,
  List,
  Image,
  Result,
  Modal
} from "antd";
import {
  HeartTwoTone,
  CheckCircleTwoTone,
  LikeOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  DollarCircleOutlined,
  CommentOutlined,
  ExportOutlined,
  LikeFilled
} from "@ant-design/icons";
import dayjs from "dayjs";
import { toEther } from "thirdweb";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import VideoCard from "@/app/components/VideoCard";
import CategoryBar from "@/app/components/CategoryBar";
import VideoEditDrawer from "@/app/components/VideoEditDrawer";
import CommentSection from "@/app/components/CommentSection";
import ReportVideoModal from "@/app/components/ReportVideoModal";
import TipModal from "@/app/components/TipModal";
import {
  ellipsisString,
  contract,
  subgraphClient as client,
  thirdwebClient,
  GET_VIDEOS_QUERY,
  GET_VIDEO_QUERY
} from "@/app/utils";
import { EXPLORER_URL, VIDVERSE_CONTRACT_ADDRESS } from "@/app/utils/constants";
import { executeOperation, getAAWalletAddress } from "@/app/utils/aaUtils";

const { Title, Text, Paragraph } = Typography;
dayjs.extend(relativeTime);

export default function VideoPage({ params }) {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState(null);
  const [aaWalletAddress, setAAWalletAddress] = useState(null);
  const [isVideoLiked, setIsVideoLiked] = useState(false);
  const [showFlaggedWarning, setShowFlaggedWarning] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const { id } = use(params);
  const accountObj = useActiveAccount() || {};
  const account = accountObj?.address?.toLowerCase();
  const activeChain = useActiveWalletChain();

  const router = useRouter();

  const fetchVideo = () => {
    setLoading(true);
    client
      .request(GET_VIDEO_QUERY, {
        id,
        tips_first: 50,
        tips_skip: 0,
        tips_orderBy: "createdAt",
        tips_orderDirection: "desc",
        comments_first: 50,
        comments_skip: 0,
        comments_orderBy: "createdAt",
        comments_orderDirection: "desc",
        comments_where: {}
      })
      .then((data) => {
        setVideo(data?.video);
        if (data?.video?.isFlagged) {
          setShowFlaggedWarning(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch video:", err);
        message.error("Failed to fetch video. Please try again.");
        setLoading(false);
      });
  };

  const fetchRelatedVideos = (idToExclude) => {
    setLoading(true);
    client
      .request(GET_VIDEOS_QUERY, {
        first: 5,
        skip: 0,
        orderBy: "createdAt",
        orderDirection: "desc",
        where: {
          id_not: idToExclude
        }
      })
      .then((data) => {
        setRelatedVideos(data?.videos);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch related videos:", err);
        message.error("Failed to fetch related videos. Please try again.");
        setLoading(false);
      });
  };

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
      setAAWalletAddress(aaWalletAddress);
    } catch (err) {
      console.error("Error resolving AA Wallet Address:", err);
    }
  };

  const handleToggleLikeVideo = async () => {
    if (!account) return message.error("Please connect your wallet first");
    setIsLiking(true);
    try {
      const signer = ethers6Adapter.signer.toEthers({
        client: thirdwebClient,
        chain: activeChain,
        account: accountObj
      });
      const toggleLikeTx = await executeOperation(
        signer,
        contract.target,
        "toggleLikeVideo",
        [id]
      );

      console.log("Transaction successful:", toggleLikeTx);
      // Update local state to reflect the like
      setIsVideoLiked((prev) => !prev);
      message.success(
        `Video ${isVideoLiked ? "unliked" : "liked"} successfully!`
      );
    } catch (error) {
      console.error("Error liking video:", error);
      message.error("Failed to like video. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const isVideoLikedByUser = async () => {
    if (!account) return false; // If no account is connected, return false
    try {
      const isLiked = await contract.isVideoLikedByUser(id, account);
      console.log(`Video ${id} liked by user ${account}: ${isLiked}`);
      setIsVideoLiked(isLiked);
      return isLiked;
    } catch (err) {
      console.error("Failed to check if video is liked by user:", err);
      return false;
    }
  };

  const isVideoOwner = useMemo(() => {
    if (!video || !aaWalletAddress) return false;
    return video?.channel?.owner === aaWalletAddress?.toLowerCase();
  }, [video, aaWalletAddress]);

  useEffect(() => {
    fetchVideo();
    fetchRelatedVideos(id);
    if (account) {
      resolveAAWalletAddress();
      isVideoLikedByUser();
    }
  }, [id, account]);

  if (!loading && (!video?.videoHash || video?.isRemoved)) {
    return (
      <Result
        status="404"
        title="Video Not Found"
        subTitle="Sorry, the video you are looking for does not exist."
        extra={
          <Link href="/">
            <Button type="primary" shape="round">
              Back Home
            </Button>
          </Link>
        }
      />
    );
  }
  return (
    <div style={{ padding: "20px" }}>
      <CategoryBar />
      {/* Modal for viewers discretion */}
      <Modal
        title="Viewer discretion is advised"
        open={showFlaggedWarning}
        onOk={() => setShowFlaggedWarning(false)}
        onCancel={() => {
          router.push("/");
        }}
        okText="Continue"
        cancelText="Go Back"
        centered
        okButtonProps={{ shape: "round" }}
        cancelButtonProps={{ shape: "round" }}
        closable={false}
      >
        <p>
          This video has been flagged by the community and may contain content
          that is inappropriate or sensitive for some viewers. Viewer discretion
          is advised.
        </p>
      </Modal>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          {loading ? (
            <Card
              loading
              style={{ borderRadius: "20px" }}
              cover={
                <div
                  style={{
                    height: 400,
                    borderRadius: 20
                  }}
                />
              }
            />
          ) : (
            <div
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "white",
                padding: "10px"
              }}
            >
              {/* Video Section */}
              <Plyr
                style={{ borderRadius: "10px", overflow: "hidden" }}
                options={{ autoplay: !showFlaggedWarning }}
                controls
                source={{
                  type: "video",
                  sources: [
                    {
                      src: `https://ipfs.io/ipfs/${video?.videoHash?.trim()}`,
                      type: "video/mp4"
                    }
                  ]
                }}
              />

              {/* Video Title */}
              <Space
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  display: "flex",
                  marginTop: "10px"
                }}
              >
                <Title level={5} style={{ marginTop: "5px" }}>
                  {video?.title}
                </Title>

                {/* Action Buttons - Right-Aligned */}
                <Space size="small" wrap>
                  <Button
                    type="text"
                    loading={isLiking}
                    icon={
                      isVideoLiked ? (
                        <LikeFilled style={{ color: "#1677ff" }} />
                      ) : (
                        <LikeOutlined style={{ color: "#1677ff" }} />
                      )
                    }
                    onClick={handleToggleLikeVideo}
                  >
                    {video?.likeCount || 0}
                  </Button>
                  <TipModal
                    videoData={video}
                    aaWalletAddress={aaWalletAddress}
                  />
                  <Button
                    type="text"
                    icon={<ShareAltOutlined />}
                    onClick={() => {
                      if (navigator.share) {
                        navigator
                          .share({
                            title: `${video?.title} | ThreeTube`,
                            text: `${video?.title} | ThreeTube`,
                            url: window.location.href
                          })
                          .catch((err) =>
                            console.error("Failed to share video:", err)
                          );
                      } else {
                        console.log(
                          "Web Share API not supported in your browser"
                        );
                        navigator.clipboard.writeText(window.location.href);
                        message.success("Link copied to clipboard");
                      }
                    }}
                  />
                  <a
                    href={`https://ipfs.io/ipfs/${video?.videoHash?.trim()}`}
                    target="_blank"
                    rel="noreferrer"
                    download
                  >
                    <Button type="text" icon={<DownloadOutlined />} />
                  </a>
                  {isVideoOwner && <VideoEditDrawer video={video} />}
                  <ReportVideoModal videoId={video?.id} />
                </Space>
              </Space>

              {/* Video Description and Info */}
              <Text type="secondary">
                {`${dayjs(video?.createdAt * 1000).format(
                  "h:mm A MMM D, YYYY"
                )} (${dayjs(video?.createdAt * 1000).fromNow()}) • ${
                  video?.category
                } • ${video?.location}`}
              </Text>
              <Paragraph
                ellipsis={{ rows: 1, expandable: true, symbol: "more" }}
              >
                {video?.description}
              </Paragraph>
              <Space>
                <Typography.Text type="secondary">
                  View Video NFT On:
                </Typography.Text>
                <a
                  title="NERO Scan"
                  href={`${EXPLORER_URL}/token/${VIDVERSE_CONTRACT_ADDRESS}?tab=Transfers&a=${video?.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="https://etherscan.io/favicon.ico"
                    style={{ cursor: "pointer" }}
                    width={20}
                    height={20}
                    preview={false}
                  />
                </a>
              </Space>
              <Divider />
              {/* Channel Information */}
              <Row align="middle" gutter={8} style={{ margin: "5px" }}>
                <Col>
                  <Link href={`/channel/${video?.channel?.id}`}>
                    <Avatar
                      size="large"
                      src={`https://api.dicebear.com/5.x/open-peeps/svg?seed=${video?.channel?.id}`}
                      style={{ cursor: "pointer", border: "1px solid grey" }}
                    />
                  </Link>
                </Col>
                <Col>
                  <Link href={`/channel/${video?.channel?.id}`}>
                    <Text strong>
                      {ellipsisString(video?.channel?.id, 12, 8)}
                    </Text>{" "}
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                  </Link>
                  <br />
                  <Button
                    icon={<HeartTwoTone twoToneColor="#eb2f96" />}
                    type="primary"
                    shape="round"
                    size="small"
                    onClick={() => message.info("Feature coming soon!")}
                    style={{ marginTop: "5px" }}
                  >
                    Subscribe
                  </Button>
                </Col>
              </Row>
            </div>
          )}
          <div
            style={{
              marginTop: "5px",
              overflow: "hidden",
              borderRadius: "10px",
              backgroundColor: "white",
              padding: "10px"
            }}
          >
            <Tabs
              defaultActiveKey="comments"
              // activeKey={activeTab}
              animated
              type="line"
              // onChange={(key) => {
              //   router.push(`${pathname}?tab=${key}`);
              // }}
              items={[
                {
                  key: "comments",
                  label: `Comments (${video?.commentCount || 0})`,
                  icon: <CommentOutlined />,
                  children: (
                    <CommentSection
                      comments={video?.comments || []}
                      videoId={video?.id}
                      dataLoading={loading}
                    />
                  )
                },
                {
                  key: "tips",
                  label: "Tips",
                  icon: <DollarCircleOutlined />,
                  children: (
                    <List
                      itemLayout="horizontal"
                      dataSource={video?.tips || []}
                      rowKey={(item) => item?.id}
                      split
                      loading={loading}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Link
                                href={`/channel/${item?.from?.id}`}
                                passHref
                              >
                                <Avatar
                                  shape="circle"
                                  size="small"
                                  style={{
                                    cursor: "pointer",
                                    border: "1px solid grey"
                                  }}
                                  src={`https://api.dicebear.com/5.x/open-peeps/svg?seed=${item?.from?.id}`}
                                />
                              </Link>
                            }
                            title={
                              <Space>
                                <Link
                                  href={`/channel/${item?.from?.id}`}
                                  passHref
                                >
                                  <Typography.Text strong>
                                    {ellipsisString(item?.from?.id, 8, 5)}
                                  </Typography.Text>
                                </Link>
                                <Typography.Text type="secondary">
                                  {dayjs(item?.createdAt * 1000).format(
                                    "MMM D, YYYY"
                                  )}
                                </Typography.Text>
                                <a
                                  href={`${EXPLORER_URL}/tx/${item?.txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExportOutlined title="View on Explorer" />
                                </a>
                              </Space>
                            }
                            description={`Tipped ${toEther(
                              item?.amount || 0n
                            )} NERO`}
                          />
                        </List.Item>
                      )}
                    />
                  )
                }
              ]}
            />
          </div>
          <Divider />
        </Col>
        <Col xs={24} md={8}>
          <Title level={5}>Related Videos</Title>
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <Card
                  key={index}
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
                >
                  <Card.Meta avatar={<Skeleton.Avatar />} />
                </Card>
              ))
            : relatedVideos.map((relatedVideo) => (
                <Link
                  key={relatedVideo?.id}
                  href={`/watch/${relatedVideo?.id}`}
                >
                  <VideoCard video={relatedVideo} />
                </Link>
              ))}
        </Col>
      </Row>
    </div>
  );
}
