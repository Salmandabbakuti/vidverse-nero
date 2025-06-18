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
    icon: <LockOutlined style={{ fontSize: 36, color: "#667eea" }} />,
    title: "Decentralized Storage",
    description:
      "All videos stored on IPFS ensuring censorship resistance, permanence, and true content ownership."
  },
  {
    icon: "⛽️",
    title: "Gasless Experience",
    description:
      "Upload, tip, like, and comment without gas fees using NERO Chain's Paymaster and Account Abstraction."
  },
  {
    icon: "🔗",
    title: "Tokenized Content (NFTs)",
    description:
      "Creators can tokenize videos as NFTs, enabling licensing and access to wider audiences through NFT marketplaces."
  },
  {
    icon: <GlobalOutlined style={{ fontSize: 36, color: "#48bb78" }} />,
    title: "Social Logins",
    description:
      "Easy onboarding with social media accounts - no complex wallet setup required."
  },
  {
    icon: <VideoCameraOutlined style={{ fontSize: 36, color: "#52c41a" }} />,
    title: "Direct Creator Support",
    description:
      "Tip creators directly with 100% of funds going to creators - no intermediaries or platform fees."
  },
  {
    icon: "🗳️",
    title: "Decentralized Moderation",
    description:
      "Community-driven content moderation through voting, ensuring platform freedom while maintaining quality."
  },
  {
    icon: "�",
    title: "Ad-Free Experience",
    description:
      "Clean, private viewing with no ads, tracking, or data collection. Pure content focus."
  },
  {
    icon: "�",
    title: "Creator Channels",
    description:
      "Personalized creator profiles with upload stats, tip analytics, and social interaction metrics."
  }
];

const howItWorksSteps = [
  { icon: "🔐", step: "Connect with Social Login" },
  { icon: "🎥", step: "Upload to IPFS & Mint NFT" },
  { icon: "🌍", step: "Get Discovered Globally" },
  { icon: "💰", step: "Earn Through Direct Tips" }
];

// Helper function for step descriptions
const getStepDescription = (index) => {
  const descriptions = [
    "Sign in easily using your social media accounts through secure social logins. No complex wallet setup or private key management required.",
    "Upload videos directly to IPFS for decentralized storage and automatically mint them as NFTs. Your content is truly owned by you forever.",
    "Share your content with a global, decentralized audience. No algorithmic suppression - your content reaches viewers via smart contracts, not algorithms and can be viewable on secondary NFT marketplaces like OpenSea, Rarible, and more.",
    "Receive direct tips from viewers with 100% going to you. No platform fees, intermediaries, or revenue sharing with corporations."
  ];
  return descriptions[index] || "";
};

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
        <Card
          className="fade-in"
          style={{
            margin: "0 0 40px 0",
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "24px",
            boxShadow: "0 20px 40px rgba(31, 38, 135, 0.1)",
            overflow: "hidden",
            position: "relative",
            minHeight: "400px"
          }}
          variant="borderless"
        >
          {/* Animated Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: `
                radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(240, 147, 251, 0.3) 0%, transparent 50%)
              `,
              animation: "rotate 20s linear infinite",
              pointerEvents: "none",
              zIndex: 0
            }}
          />

          <Row
            justify="center"
            align="middle"
            style={{ position: "relative", zIndex: 1, minHeight: "350px" }}
          >
            <Col xs={24} sm={22} md={20} lg={16} xl={14}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%", textAlign: "center" }}
              >
                <Title
                  level={1}
                  className="slide-up"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    fontWeight: 800,
                    margin: 0,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.2,
                    animation: "slideUp 0.8s ease-out 0.2s both"
                  }}
                >
                  Welcome to VidVerse
                </Title>

                <Text
                  className="fade-in"
                  style={{
                    fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                    color: "#4a5568",
                    lineHeight: 1.6,
                    fontWeight: 500,
                    maxWidth: "600px",
                    margin: "0 auto",
                    display: "block",
                    animation: "fadeIn 1s ease-out 0.4s both"
                  }}
                >
                  The decentralized video platform for creators and viewers. Own
                  your content. Earn rewards. Join the future of video.
                </Text>

                <Space
                  direction="horizontal"
                  size="middle"
                  wrap
                  style={{
                    justifyContent: "center",
                    width: "100%",
                    marginTop: "32px",
                    animation: "slideUp 0.8s ease-out 0.6s both"
                  }}
                >
                  {" "}
                  <Link href="/upload">
                    <Button
                      type="primary"
                      size="large"
                      shape="round"
                      icon={<VideoCameraOutlined />}
                      className="scale-in"
                      style={{
                        height: "48px",
                        padding: "0 32px",
                        fontSize: "16px",
                        fontWeight: 600,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                        animation: "scaleIn 0.6s ease-out 0.8s both"
                      }}
                    >
                      Start Creating
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      size="large"
                      shape="round"
                      className="scale-in"
                      style={{
                        height: "48px",
                        padding: "0 32px",
                        fontSize: "16px",
                        fontWeight: 600,
                        background: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        color: "#667eea",
                        animation: "scaleIn 0.6s ease-out 1s both"
                      }}
                    >
                      Learn More
                    </Button>
                  </Link>
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>
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
          <div
            id="features"
            style={{
              maxWidth: 1200,
              margin: "60px auto",
              padding: "60px 24px",
              textAlign: "center"
            }}
            className="fade-in"
          >
            {" "}
            <Title
              level={2}
              style={{
                fontWeight: 700,
                marginBottom: 16,
                fontSize: "2.5rem",
                color: "#1a202c"
              }}
            >
              Core Features
            </Title>
            <Text
              style={{
                display: "block",
                fontSize: "18px",
                color: "#64748b",
                marginBottom: "48px",
                maxWidth: "600px",
                margin: "0 auto 48px auto",
                lineHeight: "1.6"
              }}
            >
              Empowering creators with decentralized technology and gasless Web3
              experience
            </Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "32px",
                marginTop: "48px"
              }}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    padding: "32px 24px",
                    background: "rgba(255, 255, 255, 0.6)",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    textAlign: "center"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.6)";
                  }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      marginBottom: "16px",
                      color: "#667eea"
                    }}
                  >
                    {feature.icon}
                  </div>
                  <Title
                    level={4}
                    style={{
                      margin: "0 0 12px 0",
                      color: "#1a202c",
                      fontWeight: "600",
                      fontSize: "18px"
                    }}
                  >
                    {feature.title}
                  </Title>
                  <Text
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      lineHeight: "1.5"
                    }}
                  >
                    {feature.description}
                  </Text>
                </div>
              ))}
            </div>
          </div>
          <Divider
            style={{
              margin: "60px 0",
              borderColor: "rgba(226, 232, 240, 0.8)"
            }}
          />
          <div
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              padding: "60px 24px",
              textAlign: "center"
            }}
            className="fade-in"
          >
            <Title
              level={2}
              style={{
                fontWeight: 700,
                marginBottom: 16,
                fontSize: "2.5rem",
                color: "#1a202c"
              }}
            >
              How It Works
            </Title>{" "}
            <Text
              style={{
                display: "block",
                fontSize: "18px",
                color: "#64748b",
                marginBottom: "48px",
                maxWidth: "500px",
                margin: "0 auto 48px auto",
                lineHeight: "1.6"
              }}
            >
              Experience Web3 video sharing with social login simplicity
            </Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "32px",
                marginTop: "48px"
              }}
            >
              {howItWorksSteps.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "32px 24px",
                    background: "rgba(255, 255, 255, 0.6)",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    textAlign: "center",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.6)";
                  }}
                >
                  {/* Step Number */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "white",
                      margin: "0 auto 16px auto",
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
                    }}
                  >
                    {idx + 1}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      fontSize: "32px",
                      marginBottom: "16px"
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Step Title */}
                  <Title
                    level={4}
                    style={{
                      margin: "0 0 12px 0",
                      color: "#1a202c",
                      fontWeight: "600",
                      fontSize: "18px"
                    }}
                  >
                    {item.step}
                  </Title>

                  {/* Step Description */}
                  <Text
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      lineHeight: "1.5"
                    }}
                  >
                    {getStepDescription(idx)}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
