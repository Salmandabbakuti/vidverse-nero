"use client";
import { Layout, Divider } from "antd";
import NavBar from "@/app/components/Navbar";
import "antd/dist/reset.css";

const { Header, Footer, Content } = Layout;

export default function SiteLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 99,
          padding: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0"
        }}
      >
        <NavBar />
      </Header>
      <Content
        style={{
          margin: "12px 8px",
          padding: 12,
          minHeight: "100%",
          color: "black",
          maxHeight: "100%"
        }}
      >
        {children}
      </Content>
      <Divider />
      <Footer style={{ textAlign: "center" }}>
        <a
          href="https://github.com/Salmandabbakuti"
          target="_blank"
          rel="noopener noreferrer"
        >
          ©{new Date().getFullYear()} Salman Dabbakuti. Powered by NERO Chain &
          TheGraph
        </a>
        <p style={{ fontSize: "12px" }}>v0.0.2</p>
      </Footer>
    </Layout>
  );
}
