"use client";
import { useState, useEffect } from "react";
import { message, Row, Col, Card, Empty, Select } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { subgraphClient as client, GET_VIDEOS_QUERY } from "./utils";
import VideoCard from "./components/VideoCard";
import CategoryBar from "./components/CategoryBar";
import styles from "./page.module.css";

const { Option } = Select;

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const category = searchParams.get("c") || "All";
  const sortOption = searchParams.get("sort") || "createdAt_desc";

  const fetchVideos = () => {
    console.log("Fetching videos...");
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
  }, [searchQuery, category, sortOption]);

  return (
    <>
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
          defaultValue="createdAt_desc"
          value={sortOption}
          onChange={(value) => {
            // Update the URL with the new sort option
            const urlSearchParams = new URLSearchParams(window.location.search);
            // remove the tab query parameter if present
            if (urlSearchParams.has("tab")) urlSearchParams.delete("tab");
            urlSearchParams.set("sort", value);
            router.push(`/?${urlSearchParams.toString()}`);
          }}
          style={{ width: 150 }}
        >
          <Option value="createdAt_desc">Newest First</Option>
          <Option value="createdAt_asc">Oldest First</Option>
        </Select>
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
          <Empty description="No videos found" />
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
    </>
  );
}
