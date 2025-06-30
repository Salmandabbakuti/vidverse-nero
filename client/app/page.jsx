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
          <Card
            style={{
              margin: "0 auto",
              maxWidth: "100%",
              background:
                "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              borderRadius: "24px",
              boxShadow:
                "0 20px 40px rgba(102, 126, 234, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.2)",
              overflow: "hidden",
              position: "relative",
              padding: "50px 40px",
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
                  marginBottom: "24px"
                }}
              >
                <span style={{ fontSize: "16px" }}>⚡</span>
                <Text
                  style={{
                    color: "#667eea",
                    fontWeight: 600,
                    fontSize: "14px",
                    margin: 0
                  }}
                >
                  Gasless Web3 Video Platform
                </Text>
              </div>

              <Title
                level={1}
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                  fontWeight: 800,
                  margin: "0 0 20px 0",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em"
                }}
              >
                Create. Own. Earn.
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
                  Decentralized.
                </span>
              </Title>

              <Text
                style={{
                  fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                  color: "#4a5568",
                  lineHeight: 1.6,
                  fontWeight: 500,
                  maxWidth: "600px",
                  margin: "0 auto 32px auto",
                  display: "block"
                }}
              >
                The first gasless video platform where creators truly own their
                content. Upload to IPFS, mint as NFTs, and earn directly from
                your audience.
              </Text>

              {/* Key Features Pills */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  margin: "32px 0 40px 0"
                }}
              >
                {[
                  { label: "Zero Gas Fees", color: "#10b981", icon: "⚡" },
                  { label: "Social Login", color: "#8b5cf6", icon: "🔐" },
                  { label: "NFT Ownership", color: "#f59e0b", icon: "🎨" }
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${item.color}30`,
                      borderRadius: "50px",
                      padding: "10px 16px",
                      transition: "all 0.3s ease",
                      cursor: "default"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-3px) scale(1.05)";
                      e.currentTarget.style.boxShadow = `0 8px 25px ${item.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>{item.icon}</span>
                    <Text
                      style={{
                        color: "#374151",
                        fontWeight: 600,
                        fontSize: "13px",
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
                className="animate-hero-buttons"
                style={{
                  justifyContent: "center"
                }}
              >
                <Link href="/upload">
                  <Button
                    type="primary"
                    size="large"
                    shape="round"
                    icon={<VideoCameraOutlined />}
                    className=""
                    style={{
                      height: "56px",
                      padding: "0 40px",
                      fontSize: "16px",
                      fontWeight: 700,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      boxShadow: "0 12px 30px rgba(102, 126, 234, 0.4)",
                      letterSpacing: "0.5px",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-3px) scale(1.05)";
                      e.target.style.boxShadow =
                        "0 16px 40px rgba(102, 126, 234, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0) scale(1)";
                      e.target.style.boxShadow =
                        "0 12px 30px rgba(102, 126, 234, 0.4)";
                    }}
                  >
                    Start Creating
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="large"
                    shape="round"
                    className=""
                    style={{
                      height: "56px",
                      padding: "0 32px",
                      fontSize: "15px",
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
                      e.target.style.transform = "translateY(-2px) scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                      e.target.style.background = "rgba(255, 255, 255, 0.9)";
                      e.target.style.transform = "translateY(0) scale(1)";
                    }}
                  >
                    Learn More
                  </Button>
                </Link>
              </Space>
            </div>
          </Card>
        </div>
      )}

      {/* Stats Section */}
      {showHero && (
        <section
          style={{
            padding: "60px 0",
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            margin: "0 0 40px 0"
          }}
        >
          <div
            style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
          >
            <Row gutter={[24, 24]} justify="center">
              {[
                {
                  number: "25K+",
                  label: "Videos Minted",
                  icon: "🎬",
                  description: "NFTs Created"
                },
                {
                  number: "5.2K+",
                  label: "Active Creators",
                  icon: "👥",
                  description: "Building Daily"
                },
                {
                  number: "$180K+",
                  label: "Tips Received",
                  icon: "💰",
                  description: "Creator Earnings"
                },
                {
                  number: "~5TB",
                  label: "IPFS Storage",
                  icon: "🗄️",
                  description: "Decentralized Data"
                }
              ].map((stat, index) => (
                <Col key={index} xs={12} sm={6}>
                  <Card
                    style={{
                      textAlign: "center",
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(15px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: "20px",
                      boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
                      transition: "all 0.3s ease",
                      height: "100%"
                    }}
                    styles={{ body: { padding: "24px 16px" } }}
                    hoverable
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow =
                        "0 16px 48px rgba(102, 126, 234, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 32px rgba(102, 126, 234, 0.1)";
                    }}
                  >
                    <div style={{ fontSize: "28px", marginBottom: "12px" }}>
                      {stat.icon}
                    </div>
                    <Title
                      level={2}
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "2rem",
                        fontWeight: "900",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                      }}
                    >
                      {stat.number}
                    </Title>
                    <Text
                      style={{
                        color: "#1a202c",
                        fontWeight: "600",
                        fontSize: "14px",
                        display: "block",
                        marginBottom: "4px"
                      }}
                    >
                      {stat.label}
                    </Text>
                    <Text
                      style={{
                        color: "#6b7280",
                        fontSize: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}
                    >
                      {stat.description}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>
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
