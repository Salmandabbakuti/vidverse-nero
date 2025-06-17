"use client";
import { useState, useEffect } from "react";
import {
  message,
  Row,
  Col,
  Card,
  Empty,
  Select,
  Space,
  Typography,
  Button,
  Divider
} from "antd";
import {
  SwapOutlined,
  RocketOutlined,
  VideoCameraOutlined,
  LockOutlined,
  GlobalOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { subgraphClient as client, GET_VIDEOS_QUERY } from "./utils";
import VideoCard from "./components/VideoCard";
import CategoryBar from "./components/CategoryBar";
import styles from "./page.module.css";

const { Option } = Select;
const { Title, Text } = Typography;

const features = [
  {
    icon: <RocketOutlined style={{ fontSize: 36, color: "#1890ff" }} />,
    title: "Fast & Decentralized",
    description:
      "Powered by NERO Chain and TheGraph for unstoppable video delivery."
  },

  {
    icon: "⛽️",
    title: "Gasless Experience",
    description:
      "Powered by NERO Chain Paymaster, upload and interact with videos without paying gas fees using ETH or stablecoins."
  },
  {
    icon: <VideoCameraOutlined style={{ fontSize: 36, color: "#52c41a" }} />,
    title: "Creator Rewards",
    description: "Earn NERO tokens for your content and engagement."
  },
  {
    icon: <LockOutlined style={{ fontSize: 36, color: "#faad14" }} />,
    title: "Own Your Content",
    description: "Your videos, your rules. No centralized takedowns."
  },
  {
    icon: <GlobalOutlined style={{ fontSize: 36, color: "#eb2f96" }} />,
    title: "Global Community",
    description: "Connect with creators and viewers worldwide."
  },
  {
    icon: "🔗",
    title: "Video NFTs (Soulbound)",
    description:
      "Every video is minted as a unique, non-transferrable NFT. You truly own your content and its provenance."
  },
  {
    icon: "🗄️",
    title: "On-chain Metadata",
    description:
      "Video metadata is stored directly on-chain for integrity, transparency, and immutability."
  }
];

const howItWorksSteps = [
  { icon: "🔐", step: "Connect your wallet" },
  { icon: "🎥", step: "Upload your video" },
  { icon: "🌍", step: "Get discovered globally" },
  { icon: "💰", step: "Earn rewards for engagement" }
];

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQueryParam = searchParams.get("q");
  const categoryParam = searchParams.get("c");
  const sortOptionParam = searchParams.get("sort");

  const fetchVideos = () => {
    console.log("Fetching videos...");
    const searchQuery = searchQueryParam || "";
    const category = categoryParam || "All";
    const sortOption = sortOptionParam || "createdAt_desc";

    console.log("searchQuery:", searchQuery);
    console.log("categoryFilter:", category);
    console.log("sortOption:", sortOption);

    const sortField = sortOption.split("_")[0];
    const sortDirection = sortOption.split("_")[1];

    setLoading(true);
    client
      .request(GET_VIDEOS_QUERY, {
        first: 200,
        skip: 0,
        orderBy: sortField,
        orderDirection: sortDirection,
        where: {
          and: [
            { isRemoved: false },
            ...(category === "All" ? [] : [{ category }]),
            ...(searchQuery
              ? [
                  {
                    or: [
                      { title_contains_nocase: searchQuery },
                      { description_contains_nocase: searchQuery },
                      { category_contains_nocase: searchQuery }
                    ]
                  }
                ]
              : [])
          ]
        }
      })
      .then((data) => {
        setVideos(data?.videos);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch videos:", error);
        message.error("Failed to fetch videos. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    const debounceTimeoutId = setTimeout(fetchVideos, 600);
    return () => clearTimeout(debounceTimeoutId);
  }, [searchQueryParam, categoryParam, sortOptionParam]);

  const showHero = !searchQueryParam && !categoryParam && !sortOptionParam;

  return (
    <>
      {showHero && (
        <Card className={styles.heroSection} variant="borderless">
          <div className={styles.heroContent} style={{ padding: 48 }}>
            <h1 className={styles.heroTitle}>Welcome to VidVerse</h1>
            <p className={styles.heroSubtitle}>
              The decentralized video platform for creators and viewers. Own
              your content. Earn rewards. Join the future of video.
            </p>
            <Space>
              <Link href="/upload">
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  className={styles.uploadButton}
                >
                  Start Creating
                </Button>
              </Link>
              <Link href="#features">
                <Button size="large" shape="round">
                  Learn More
                </Button>
              </Link>
            </Space>
          </div>
        </Card>
      )}

      {/* Existing CategoryBar, Sort, and Video Grid */}
      <CategoryBar />

      {/* Sort Dropdown */}
      <div
        title="Sort videos"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
          marginTop: 10
        }}
      >
        <SwapOutlined
          style={{
            fontSize: 17,
            marginRight: 5,
            transform: "rotate(90deg) scaleY(-1)"
          }}
        />
        <Select
          defaultValue={sortOptionParam || "createdAt_desc"}
          value={sortOptionParam || "createdAt_desc"}
          style={{ width: 150, maxWidth: "100%" }}
          placeholder="Sort by"
          options={[
            { value: "createdAt_desc", label: "Newest First" },
            { value: "createdAt_asc", label: "Oldest First" },
            { value: "likeCount_desc", label: "Most Liked" },
            { value: "likeCount_asc", label: "Least Liked" },
            { value: "commentCount_desc", label: "Most Commented" },
            { value: "commentCount_asc", label: "Least Commented" }
          ]}
          onChange={(value) => {
            // Update the URL with the new sort option
            const urlSearchParams = new URLSearchParams(window.location.search);
            // remove the tab query parameter if present
            if (urlSearchParams.has("tab")) urlSearchParams.delete("tab");
            urlSearchParams.set("sort", value);
            router.push(`/?${urlSearchParams.toString()}`);
          }}
        />
      </div>

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
        ) : videos.length === 0 ? (
          <Empty
            style={{
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
              width: "100%"
            }}
            description={
              <Space direction="vertical" size={2} align="center">
                <Title level={5}>No Videos Found</Title>
                <Text type="secondary">
                  Try adjusting your search or filters, or check back later for
                  new content.
                </Text>
                <Text>
                  <span role="img" aria-label="film">
                    🎬
                  </span>{" "}
                  Discover and share amazing videos on <b>VidVerse</b>!
                </Text>
              </Space>
            }
          />
        ) : (
          videos.map((video) => (
            <Col key={video?.id} xs={24} sm={12} md={8} lg={6}>
              <Link href={`/watch/${video?.id}`}>
                <VideoCard video={video} />
              </Link>
            </Col>
          ))
        )}
      </Row>

      <Divider />
      {/* Features Section in Footer */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "32px 16px 0 16px"
        }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
            fontWeight: 700,
            marginBottom: 32
          }}
        >
          Powerful Features
        </Title>
        <Row gutter={[32, 32]} justify="center">
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={12} lg={6} key={index}>
              <Card
                variant="outlined"
                hoverable
                style={{
                  borderRadius: 18,
                  minHeight: 180,
                  boxShadow: "0 2px 16px #6366f111",
                  textAlign: "center",
                  background: "#fff"
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>
                  {feature.icon}
                </div>
                <Title level={4} style={{ marginBottom: 8 }}>
                  {feature.title}
                </Title>
                <Text style={{ color: "#666" }}>{feature.description}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Divider />
      {/* How It Works Section in Footer (no carousel) */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "32px 16px 64px 16px"
        }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
            fontWeight: 700,
            marginBottom: 32
          }}
        >
          How It Works
        </Title>
        <Row gutter={[24, 24]} justify="center">
          {howItWorksSteps.map((item, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <Card
                variant="outlined"
                style={{
                  borderRadius: 18,
                  minHeight: 140,
                  textAlign: "center",
                  background: "#f8fafc"
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 10 }}>
                  {item.icon}
                </div>
                <Title level={4} style={{ marginBottom: 6 }}>
                  Step {idx + 1}
                </Title>
                <Text style={{ color: "#555", fontSize: 16 }}>{item.step}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}
