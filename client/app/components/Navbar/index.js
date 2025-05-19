"use client";
import { Input, Button } from "antd";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchOutlined, PlayCircleOutlined } from "@ant-design/icons";
import UserDrawer from "./UserDrawer";
import UploadDrawer from "./UploadDrawer";
import "antd/dist/reset.css";

export default function NavBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQueryParam = searchParams.get("q") || "";

  return (
    <>
      <Link href="/">
        <div
          style={{
            display: "flex",
            fontWeight: "bold",
            alignItems: "center",
            gap: "3px",
            padding: "0 10px",
            cursor: "pointer"
          }}
        >
          {/* Logo */}
          <Button
            size="middle"
            icon={<PlayCircleOutlined />}
            type="primary"
            shape="circle"
            style={{ padding: 0 }}
          />
          {/* Title */}
          <h3 style={{ margin: 0 }} className="nav-title">
            VidVerse
          </h3>
        </div>
      </Link>
      {/* Search Box */}
      <Input
        size="large"
        prefix={<SearchOutlined />}
        value={searchQueryParam}
        placeholder="Search"
        className="nav-search"
        style={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 20px",
          borderRadius: "20px"
        }}
        onChange={(e) => {
          console.log(
            "search input changed. preserving in url state",
            e.target.value
          );
          const urlSearchParams = new URLSearchParams(window.location.search);
          // remove the tab query parameter if present(could be preset if search happened from different route)
          if (urlSearchParams.has("tab")) urlSearchParams.delete("tab");
          if (e.target.value) urlSearchParams.set("q", e.target.value);
          else urlSearchParams.delete("q");
          router.push(`/?${urlSearchParams.toString()}`);
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 20px"
        }}
      >
        <UploadDrawer />
        <UserDrawer />
      </div>
    </>
  );
}
