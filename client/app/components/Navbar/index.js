"use client";
import { Input, Button, Space, Dropdown } from "antd";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SearchOutlined,
  PlayCircleOutlined,
  VideoCameraAddOutlined,
  MenuOutlined
} from "@ant-design/icons";
import UserDrawer from "./UserDrawer";
import "antd/dist/reset.css";

export default function NavBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQueryParam = searchParams.get("q") || "";

  const handleSearch = (value) => {
    console.log("search input changed. preserving in url state", value);
    const urlSearchParams = new URLSearchParams(window.location.search);
    // remove the tab query parameter if present(could be preset if search happened from different route)
    if (urlSearchParams.has("tab")) urlSearchParams.delete("tab");
    if (value) urlSearchParams.set("q", value);
    else urlSearchParams.delete("q");
    router.push(`/?${urlSearchParams.toString()}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 8px"
      }}
    >
      {/* Logo Section - Natural Design */}
      <Link href="/">
        <div
          style={{
            display: "flex",
            fontWeight: "bold",
            alignItems: "center",
            gap: "12px",
            padding: "8px 4px",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {/* Enhanced Logo */}

          <Button
            type="text"
            shape="circle"
            size="large"
            style={{
              // width: "48px",
              // height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              transition: "all 0.3s ease"
            }}
            icon={
              <PlayCircleOutlined
                style={{ color: "white", fontWeight: "bold" }}
              />
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(102, 126, 234, 0.4)";
            }}
          />
          {/* Enhanced Title */}
          <span
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.01em"
            }}
            className="nav-title"
          >
            VidVerse
          </span>
        </div>
      </Link>
      {/* Search Box - Enhanced & Responsive */}
      <div
        style={{
          flex: 1,
          maxWidth: "600px",
          margin: "0 24px",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Input.Search
          defaultValue={searchQueryParam}
          allowClear
          enterButton
          size="large"
          placeholder="Search videos, creators, categories..."
          className="nav-search"
          style={{
            width: "100%",
            // maxWidth: "600px",
            borderRadius: "24px",
            fontSize: "15px",
            height: "48px"
            // margin: "0 20px"
          }}
          onPressEnter={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
        />
      </div>
      {/* Action Buttons - Enhanced */}
      <Space
        size="middle"
        style={{
          alignItems: "center",
          display: "flex",
          padding: "0 5px"
        }}
      >
        <Link href="/upload">
          <Button
            type="primary"
            shape="circle"
            icon={<VideoCameraAddOutlined />}
            size="large"
          />
        </Link>
        <UserDrawer />
      </Space>
    </div>
  );
}
