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
  Button
} from "antd";
import {
  SwapOutlined,
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
const { Title, Text } = Typography;

const features = [
  {
    icon: <LockOutlined style={{ fontSize: 48, color: "#667eea" }} />,
    title: "Decentralized Storage",
    description:
      "All videos stored on IPFS ensuring censorship resistance, permanence, and true content ownership. Your content can never be removed by platforms.",
    highlight: "Censorship Resistant"
  },
  {
    icon: "⚡",
    title: "Gasless Interactions",
    description:
      "Upload, tip, like, and comment without gas fees using NERO Chain's Paymaster and Account Abstraction. True Web2-like experience.",
    highlight: "Zero Gas Fees"
  },
  {
    icon: "💎",
    title: "Tokenized Content (NFTs)",
    description:
      "Creators can tokenize videos as NFTs, enabling licensing and access to wider audiences through NFT marketplaces like OpenSea.",
    highlight: "NFT Marketplace Ready"
  },
  {
    icon: <GlobalOutlined style={{ fontSize: 48, color: "#48bb78" }} />,
    title: "Social Logins",
    description:
      "Easy onboarding with social media accounts - no complex wallet setup required. Secure and familiar authentication process.",
    highlight: "Web2 Onboarding"
  },
  {
    icon: <VideoCameraOutlined style={{ fontSize: 48, color: "#52c41a" }} />,
    title: "Direct Creator Support",
    description:
      "Tip creators directly with 100% of funds going to creators - no intermediaries or platform fees. Pure creator economy.",
    highlight: "100% to Creators"
  },
  {
    icon: "🗳️",
    title: "Decentralized Moderation",
    description:
      "Community-driven content moderation through voting, ensuring platform freedom while maintaining quality and preventing manipulation.",
    highlight: "Community Governed"
  },
  {
    icon: "🚫",
    title: "Ad-Free Experience",
    description:
      "Clean, private viewing with no ads, tracking, or data collection. Focus purely on content without invasive advertising.",
    highlight: "Privacy First"
  },
  {
    icon: "👤",
    title: "Creator Channels",
    description:
      "Personalized creator profiles with upload stats, tip analytics, and social interaction metrics. Professional creator tools.",
    highlight: "Professional Analytics"
  }
];

const howItWorksSteps = [
  {
    icon: "🔐",
    step: "Connect with Social Login",
    subtitle: "Secure & Simple"
  },
  {
    icon: "🎥",
    step: "Upload to IPFS & Mint NFT",
    subtitle: "Decentralized Storage"
  },
  {
    icon: "🌍",
    step: "Get Discovered Globally",
    subtitle: "No Algorithmic Suppression"
  },
  {
    icon: "💰",
    step: "Earn Through Direct Tips",
    subtitle: "100% Creator Revenue"
  }
];

const howItWorksStepsDescriptions = [
  "Sign in easily using your social media accounts through secure social logins. No complex wallet setup or private key management required.",
  "Upload videos directly to IPFS for decentralized storage and automatically mint them as NFTs. Your content is truly owned by you forever.",
  "Share your content with a global, decentralized audience. No algorithmic suppression - your content reaches viewers via smart contracts, not algorithms and can be viewable on secondary NFT marketplaces like OpenSea, Rarible, and more.",
  "Receive direct tips from viewers with 100% going to you. No platform fees, intermediaries, or revenue sharing with corporations."
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
        <div style={{ position: "relative", marginBottom: "80px" }}>
          {/* Hero Background Effects */}
          <div
            style={{
              position: "absolute",
              top: "-100px",
              left: "-100px",
              width: "calc(100% + 200px)",
              height: "calc(100% + 200px)",
              background: `
                radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(52, 211, 153, 0.1) 0%, transparent 50%)
              `,
              animation: "float 20s ease-in-out infinite",
              pointerEvents: "none",
              zIndex: 0
            }}
          />

          <Card
            className="fade-in"
            style={{
              margin: "0 auto",
              maxWidth: "1200px",
              background:
                "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              borderRadius: "32px",
              boxShadow:
                "0 32px 64px rgba(102, 126, 234, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)",
              overflow: "hidden",
              position: "relative",
              padding: "80px 40px",
              zIndex: 1
            }}
            variant="borderless"
          >
            {/* Hero Content */}
            <div
              style={{ textAlign: "center", position: "relative", zIndex: 2 }}
            >
              {/* Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(240, 147, 251, 0.1))",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                  borderRadius: "50px",
                  padding: "8px 20px",
                  marginBottom: "32px",
                  animation: "slideUp 0.8s ease-out 0.2s both"
                }}
              >
                <span style={{ fontSize: "16px" }}>🚀</span>
                <Text
                  style={{
                    color: "#667eea",
                    fontWeight: 600,
                    fontSize: "14px",
                    margin: 0
                  }}
                >
                  The Future of Decentralized Video
                </Text>
              </div>

              <Title
                level={1}
                style={{
                  fontSize: "clamp(3rem, 8vw, 5.5rem)",
                  fontWeight: 900,
                  margin: "0 0 24px 0",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.1,
                  animation: "slideUp 0.8s ease-out 0.4s both",
                  letterSpacing: "-0.02em"
                }}
              >
                Welcome to
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #f093fb 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  VidVerse
                </span>
              </Title>

              <Text
                style={{
                  fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                  color: "#2d3748",
                  lineHeight: 1.6,
                  fontWeight: 500,
                  maxWidth: "800px",
                  margin: "0 auto 40px auto",
                  display: "block",
                  animation: "fadeIn 1s ease-out 0.6s both"
                }}
              >
                Create, own, and monetize your content on the world's first{" "}
                <span
                  style={{
                    color: "#667eea",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  gasless Web3 video platform
                </span>
                . Built for creators who demand freedom, ownership, and fair
                compensation.
              </Text>

              {/* Key Features Pills */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  margin: "40px 0 50px 0",
                  animation: "fadeIn 1s ease-out 0.8s both"
                }}
              >
                {[
                  { label: "100% Creator Ownership", color: "#10b981" },
                  { label: "Zero Platform Fees", color: "#8b5cf6" },
                  { label: "NFT Monetization", color: "#f59e0b" }
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${item.color}30`,
                      borderRadius: "50px",
                      padding: "12px 20px",
                      transition: "all 0.3s ease",
                      cursor: "default"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = `0 8px 25px ${item.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: item.color,
                        boxShadow: `0 0 12px ${item.color}60`
                      }}
                    />
                    <Text
                      style={{
                        color: "#374151",
                        fontWeight: 600,
                        fontSize: "14px",
                        margin: 0
                      }}
                    >
                      {item.label}
                    </Text>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <Space
                size="large"
                wrap
                style={{
                  justifyContent: "center",
                  animation: "slideUp 0.8s ease-out 1s both"
                }}
              >
                <Link href="/upload">
                  <Button
                    type="primary"
                    size="large"
                    shape="round"
                    icon={<VideoCameraOutlined />}
                    style={{
                      height: "60px",
                      padding: "0 48px",
                      fontSize: "18px",
                      fontWeight: 700,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      boxShadow: "0 16px 40px rgba(102, 126, 234, 0.4)",
                      letterSpacing: "0.5px",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-3px) scale(1.05)";
                      e.target.style.boxShadow =
                        "0 20px 50px rgba(102, 126, 234, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0) scale(1)";
                      e.target.style.boxShadow =
                        "0 16px 40px rgba(102, 126, 234, 0.4)";
                    }}
                  >
                    Start Creating Now
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="large"
                    shape="round"
                    style={{
                      height: "60px",
                      padding: "0 40px",
                      fontSize: "16px",
                      fontWeight: 600,
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(15px)",
                      border: "2px solid rgba(102, 126, 234, 0.3)",
                      color: "#667eea",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.background = "rgba(102, 126, 234, 0.1)";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                      e.target.style.background = "rgba(255, 255, 255, 0.9)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Explore Platform
                  </Button>
                </Link>
              </Space>
            </div>
          </Card>
        </div>
      )}
      <Title
        level={4}
        style={{
          color: "#1a202c",
          marginBottom: "8px",
          fontWeight: "bolder"
        }}
      >
        Explore Videos
      </Title>
      {/* Existing CategoryBar, Sort, and Video Grid */}
      <CategoryBar />
      {/* Sort Dropdown */}
      <div
        title="Sort videos"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 20,
          marginTop: 20
        }}
        className="fade-in"
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "12px",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 8px 25px rgba(31, 38, 135, 0.1)"
          }}
        >
          <SwapOutlined
            style={{
              fontSize: 17,
              marginRight: 8,
              transform: "rotate(90deg) scaleY(-1)",
              color: "#667eea"
            }}
          />
          <Select
            defaultValue={sortOptionParam || "createdAt_desc"}
            value={sortOptionParam || "createdAt_desc"}
            style={{
              width: 160,
              maxWidth: "100%",
              border: "none",
              background: "transparent"
            }}
            variant="borderless"
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
              const urlSearchParams = new URLSearchParams(
                window.location.search
              );
              // remove the tab query parameter if present
              if (urlSearchParams.has("tab")) urlSearchParams.delete("tab");
              urlSearchParams.set("sort", value);
              router.push(`/?${urlSearchParams.toString()}`);
            }}
          />{" "}
        </div>
      </div>
      {/* Videos Section Title */}
      <Row
        gutter={[24, 24]}
        justify="start"
        className={`${styles.grid} scale-in`}
      >
        {loading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card
                loading
                style={{
                  borderRadius: 20,
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(15px)",
                  WebkitBackdropFilter: "blur(15px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 10px 30px rgba(31, 38, 135, 0.1)"
                }}
                cover={
                  <div
                    style={{
                      height: 180,
                      borderRadius: "20px 20px 0 0",
                      background:
                        "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
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
              minHeight: 400,
              width: "100%"
            }}
            description={
              <Space direction="vertical" size={8} align="center">
                <Title
                  level={4}
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  No Videos Found
                </Title>
                <Text type="secondary" style={{ fontSize: "16px" }}>
                  Try adjusting your search or filters, or check back later for
                  new content.
                </Text>
                <Text style={{ fontSize: "18px", marginTop: "16px" }}>
                  <span role="img" aria-label="film">
                    🎬
                  </span>{" "}
                  Discover and share amazing videos on <b>VidVerse</b>!
                </Text>
              </Space>
            }
          />
        ) : (
          videos.map((video, index) => (
            <Col key={video?.id} xs={24} sm={12} md={8} lg={6}>
              <Link href={`/watch/${video?.id}`}>
                <div
                  style={{
                    animation: `slideUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <VideoCard video={video} />
                </div>
              </Link>
            </Col>
          ))
        )}
      </Row>
      {showHero && (
        <>
          <section
            id="features"
            style={{
              maxWidth: "1400px",
              margin: "120px auto",
              padding: "0 24px",
              position: "relative"
            }}
            className="fade-in"
          >
            {/* Section Background */}
            <div
              style={{
                position: "absolute",
                top: "-50px",
                left: "-50px",
                right: "-50px",
                bottom: "-50px",
                background: `
                  radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
                  radial-gradient(circle at 90% 80%, rgba(240, 147, 251, 0.05) 0%, transparent 50%)
                `,
                borderRadius: "50px",
                zIndex: 0
              }}
            />

            <div
              style={{ position: "relative", zIndex: 1, textAlign: "center" }}
            >
              {/* Section Header */}
              <div style={{ marginBottom: "80px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background:
                      "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(240, 147, 251, 0.1))",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                    borderRadius: "50px",
                    padding: "6px 16px",
                    marginBottom: "24px"
                  }}
                >
                  <span style={{ fontSize: "14px" }}>⭐</span>
                  <Text
                    style={{
                      color: "#667eea",
                      fontWeight: 600,
                      fontSize: "12px",
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}
                  >
                    Core Features
                  </Text>
                </div>

                <Title
                  level={2}
                  style={{
                    fontWeight: 900,
                    marginBottom: "24px",
                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    background:
                      "linear-gradient(135deg, #1a202c 0%, #4a5568 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em"
                  }}
                >
                  Why Creators Choose
                  <br />
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}
                  >
                    VidVerse
                  </span>
                </Title>

                <Text
                  style={{
                    fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                    color: "#4a5568",
                    lineHeight: 1.7,
                    fontWeight: 500,
                    maxWidth: "700px",
                    margin: "0 auto"
                  }}
                >
                  The only platform that puts creators first with true
                  ownership, zero fees, and revolutionary Web3 technology made
                  simple
                </Text>
              </div>{" "}
              {/* Features Grid - Smaller Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "24px",
                  marginTop: "60px"
                }}
              >
                {features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "28px 20px",
                      background:
                        "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
                      backdropFilter: "blur(30px)",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                      borderRadius: "20px",
                      textAlign: "center",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      cursor: "default",
                      boxShadow: "0 6px 24px rgba(102, 126, 234, 0.08)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-6px) scale(1.01)";
                      e.currentTarget.style.boxShadow =
                        "0 16px 32px rgba(102, 126, 234, 0.15)";
                      e.currentTarget.style.background =
                        "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 24px rgba(102, 126, 234, 0.08)";
                      e.currentTarget.style.background =
                        "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)";
                    }}
                  >
                    {/* Smaller Highlight Badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        fontSize: "8px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)"
                      }}
                    >
                      {feature.highlight}
                    </div>

                    {/* Smaller Feature Icon */}
                    <div
                      style={{
                        fontSize: "40px",
                        marginBottom: "16px",
                        color: "#667eea",
                        filter:
                          "drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2))"
                      }}
                    >
                      {feature.icon}
                    </div>

                    {/* Smaller Feature Title */}
                    <Title
                      level={5}
                      style={{
                        margin: "0 0 12px 0",
                        color: "#1a202c",
                        fontWeight: "700",
                        fontSize: "18px",
                        lineHeight: 1.3
                      }}
                    >
                      {feature.title}
                    </Title>

                    {/* Smaller Feature Description */}
                    <Text
                      style={{
                        color: "#4a5568",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        fontWeight: 400
                      }}
                    >
                      {feature.description}
                    </Text>

                    {/* Hover Effect Gradient */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background:
                          "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                        opacity: 0,
                        transition: "opacity 0.3s ease"
                      }}
                      className="feature-gradient"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>{" "}
          <section
            style={{
              maxWidth: "1300px",
              margin: "120px auto 80px auto",
              padding: "0 24px",
              position: "relative"
            }}
            className="fade-in"
          >
            {/* Section Background */}
            <div
              style={{
                position: "absolute",
                top: "-80px",
                left: "-40px",
                right: "-40px",
                bottom: "-80px",
                background: `
                  linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(240, 147, 251, 0.03) 100%)
                `,
                borderRadius: "60px",
                zIndex: 0
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Section Header */}
              <div style={{ textAlign: "center", marginBottom: "80px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background:
                      "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(240, 147, 251, 0.1))",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                    borderRadius: "50px",
                    padding: "6px 16px",
                    marginBottom: "24px"
                  }}
                >
                  <span style={{ fontSize: "14px" }}>🚀</span>
                  <Text
                    style={{
                      color: "#667eea",
                      fontWeight: 600,
                      fontSize: "12px",
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}
                  >
                    How It Works
                  </Text>
                </div>

                <Title
                  level={2}
                  style={{
                    fontWeight: 900,
                    marginBottom: "24px",
                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    background:
                      "linear-gradient(135deg, #1a202c 0%, #4a5568 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em"
                  }}
                >
                  Your Creator Journey
                  <br />
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}
                  >
                    in 4 Simple Steps
                  </span>
                </Title>

                <Text
                  style={{
                    fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                    color: "#4a5568",
                    lineHeight: 1.7,
                    fontWeight: 500,
                    maxWidth: "600px",
                    margin: "0 auto"
                  }}
                >
                  From zero to Web3 creator in minutes. No technical knowledge
                  required.
                </Text>
              </div>{" "}
              {/* Timeline Steps Container */}
              <div
                style={{
                  position: "relative",
                  maxWidth: "900px",
                  margin: "0 auto"
                }}
              >
                {/* Vertical Timeline Line */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "0",
                    bottom: "0",
                    width: "4px",
                    background:
                      "linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    borderRadius: "2px"
                  }}
                />{" "}
                {/* Timeline Steps */}
                <div
                  style={{ position: "relative", zIndex: 2 }}
                  className="desktop-timeline"
                >
                  {howItWorksSteps.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom:
                          idx === howItWorksSteps.length - 1 ? "0" : "80px",
                        position: "relative"
                      }}
                    >
                      {/* Timeline Content - Alternating Left/Right */}
                      <div
                        style={{
                          width: "45%",
                          padding: "32px 24px",
                          background:
                            "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)",
                          backdropFilter: "blur(30px)",
                          border: "1px solid rgba(255, 255, 255, 0.4)",
                          borderRadius: "20px",
                          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
                          transition: "all 0.3s ease",
                          marginLeft: idx % 2 === 0 ? "0" : "auto",
                          marginRight: idx % 2 === 0 ? "auto" : "0",
                          textAlign: idx % 2 === 0 ? "right" : "left"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(-4px) scale(1.02)";
                          e.currentTarget.style.boxShadow =
                            "0 16px 48px rgba(102, 126, 234, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 32px rgba(102, 126, 234, 0.1)";
                        }}
                      >
                        {/* Step Icon */}
                        <div
                          style={{
                            fontSize: "48px",
                            marginBottom: "16px",
                            filter:
                              "drop-shadow(0 4px 8px rgba(102, 126, 234, 0.2))"
                          }}
                        >
                          {item.icon}
                        </div>

                        {/* Step Title */}
                        <Title
                          level={4}
                          style={{
                            margin: "0 0 8px 0",
                            color: "#1a202c",
                            fontWeight: "800",
                            fontSize: "20px",
                            lineHeight: 1.3
                          }}
                        >
                          {item.step}
                        </Title>

                        {/* Step Subtitle */}
                        <div
                          style={{
                            display: "inline-block",
                            background:
                              "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(240, 147, 251, 0.1))",
                            border: "1px solid rgba(102, 126, 234, 0.2)",
                            borderRadius: "16px",
                            padding: "4px 12px",
                            marginBottom: "16px"
                          }}
                        >
                          <Text
                            style={{
                              color: "#667eea",
                              fontSize: "11px",
                              fontWeight: "600",
                              margin: 0,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px"
                            }}
                          >
                            {item.subtitle}
                          </Text>
                        </div>

                        {/* Step Description */}
                        <Text
                          style={{
                            color: "#4a5568",
                            fontSize: "15px",
                            lineHeight: "1.6",
                            fontWeight: 400,
                            display: "block"
                          }}
                        >
                          {howItWorksStepsDescriptions[idx]}
                        </Text>
                      </div>

                      {/* Timeline Node */}
                      <div
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "60px",
                          height: "60px",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                          fontWeight: "900",
                          color: "white",
                          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                          border: "4px solid rgba(255, 255, 255, 0.9)",
                          zIndex: 3
                        }}
                      >
                        {idx + 1}
                      </div>

                      {/* Connector Line to Content */}
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left:
                            idx % 2 === 0
                              ? "calc(45% + 10px)"
                              : "calc(55% - 10px)",
                          width: "calc(5% - 20px)",
                          height: "2px",
                          background:
                            "linear-gradient(90deg, rgba(102, 126, 234, 0.3), rgba(102, 126, 234, 0.1))",
                          transform: "translateY(-50%)",
                          zIndex: 1
                        }}
                      />
                    </div>
                  ))}
                </div>{" "}
                {/* Mobile Timeline - Vertical Stack */}
                <div className="mobile-timeline">
                  {howItWorksSteps.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: "40px",
                        position: "relative"
                      }}
                    >
                      {/* Mobile Timeline Node */}
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          fontWeight: "900",
                          color: "white",
                          marginRight: "20px",
                          flexShrink: 0,
                          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)"
                        }}
                      >
                        {idx + 1}
                      </div>

                      {/* Mobile Content */}
                      <div
                        style={{
                          flex: 1,
                          padding: "24px 20px",
                          background:
                            "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)",
                          backdropFilter: "blur(30px)",
                          border: "1px solid rgba(255, 255, 255, 0.4)",
                          borderRadius: "16px",
                          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)"
                        }}
                      >
                        <div style={{ fontSize: "32px", marginBottom: "12px" }}>
                          {item.icon}
                        </div>
                        <Title
                          level={5}
                          style={{ margin: "0 0 8px 0", color: "#1a202c" }}
                        >
                          {item.step}
                        </Title>
                        <Text
                          style={{
                            color: "#667eea",
                            fontSize: "12px",
                            display: "block",
                            marginBottom: "12px"
                          }}
                        >
                          {item.subtitle}
                        </Text>
                        <Text
                          style={{
                            color: "#4a5568",
                            fontSize: "14px",
                            lineHeight: "1.5"
                          }}
                        >
                          {howItWorksStepsDescriptions[idx]}
                        </Text>
                      </div>

                      {/* Mobile Connecting Line */}
                      {idx < howItWorksSteps.length - 1 && (
                        <div
                          style={{
                            position: "absolute",
                            left: "24px",
                            top: "50px",
                            width: "2px",
                            height: "60px",
                            background:
                              "linear-gradient(180deg, rgba(102, 126, 234, 0.3), rgba(102, 126, 234, 0.1))",
                            zIndex: 1
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
