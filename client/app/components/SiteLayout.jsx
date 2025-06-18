"use client";
import { Layout, Divider } from "antd";
import NavBar from "@/app/components/Navbar";
import "antd/dist/reset.css";

const { Header, Footer, Content } = Layout;

export default function SiteLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          padding: "0 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.12)",
          transition: "all 0.3s ease",
          height: "70px",
          minHeight: "70px"
        }}
        className="header-glass"
      >
        <NavBar />
      </Header>
      <Content
        style={{
          margin: "20px 16px",
          padding: "20px",
          minHeight: "100%",
          color: "black",
          maxHeight: "100%",
          background: "transparent"
        }}
        className="fade-in"
      >
        {children}
      </Content>
      <Footer
        style={{
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderBottom: "none",
          borderLeft: "none",
          borderRight: "none",
          padding: "60px 0 30px 0",
          position: "relative",
          overflow: "hidden",
          color: "white"
        }}
      >
        {/* Animated Background Elements */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 60% 40%, rgba(79, 172, 254, 0.1) 0%, transparent 50%)
            `,
            pointerEvents: "none"
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px"
          }}
        >
          {/* Main Footer Content */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "48px",
              marginBottom: "48px"
            }}
          >
            {/* Brand Section */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "24px"
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "white",
                    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)"
                  }}
                >
                  V
                </div>
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "900",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  VidVerse
                </span>
              </div>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  marginBottom: "24px",
                  maxWidth: "280px"
                }}
              >
                The future of decentralized video sharing. Own your content,
                earn rewards, and join the Web3 revolution.
              </p>
            </div>

            {/* Product Section */}
            <div>
              <h3
                style={{
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "20px",
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                🚀 Product
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                {[
                  { text: "Upload Videos", href: "/upload" },
                  { text: "Browse Content", href: "/" },
                  { text: "Creator Dashboard", href: "#" },
                  { text: "Video NFTs", href: "#" },
                  { text: "Earnings", href: "#" },
                  { text: "Analytics", href: "#" }
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    style={{
                      color: "#cbd5e1",
                      textDecoration: "none",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      padding: "4px 0"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#4facfe";
                      e.target.style.paddingLeft = "8px";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#cbd5e1";
                      e.target.style.paddingLeft = "0";
                    }}
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Community Section */}
            <div>
              <h3
                style={{
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "20px",
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                🌟 Community
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                {[
                  { text: "Join Discord", href: "#" },
                  { text: "Follow Twitter", href: "#" },
                  { text: "Creator Program", href: "#" },
                  { text: "Bug Bounty", href: "#" },
                  { text: "Governance", href: "#" },
                  { text: "Forum", href: "#" }
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    style={{
                      color: "#cbd5e1",
                      textDecoration: "none",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      padding: "4px 0"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#f093fb";
                      e.target.style.paddingLeft = "8px";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#cbd5e1";
                      e.target.style.paddingLeft = "0";
                    }}
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Company Section */}
            <div>
              <h3
                style={{
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "20px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                🏢 Company
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                {[
                  { text: "About Us", href: "#" },
                  { text: "Whitepaper", href: "#" },
                  { text: "Tokenomics", href: "#" },
                  { text: "Roadmap", href: "#" },
                  { text: "Privacy Policy", href: "#" },
                  { text: "Terms of Service", href: "#" }
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    style={{
                      color: "#cbd5e1",
                      textDecoration: "none",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      padding: "4px 0"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#667eea";
                      e.target.style.paddingLeft = "8px";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#cbd5e1";
                      e.target.style.paddingLeft = "0";
                    }}
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Call-to-Action Section */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              padding: "32px",
              marginBottom: "40px",
              textAlign: "center",
              backdropFilter: "blur(10px)"
            }}
          >
            <h3
              style={{
                color: "white",
                fontSize: "24px",
                fontWeight: "800",
                marginBottom: "12px"
              }}
            >
              Ready to Join the Future? 🚀
            </h3>
            <p
              style={{
                color: "#cbd5e1",
                fontSize: "16px",
                marginBottom: "24px",
                maxWidth: "500px",
                margin: "0 auto 24px auto"
              }}
            >
              Start earning NERO tokens for your content today. Upload, share,
              and monetize your videos on the world's first truly decentralized
              platform.
            </p>
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap"
              }}
            >
              <a
                href="/upload"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "16px",
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
                  transition: "all 0.3s ease",
                  border: "none"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 15px 40px rgba(102, 126, 234, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 10px 30px rgba(102, 126, 234, 0.4)";
                }}
              >
                🎥 Start Creating
              </a>
              <a
                href="#"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                📄 Learn More
              </a>
            </div>
          </div>

          {/* Technology Badges */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginBottom: "32px",
              flexWrap: "wrap"
            }}
          >
            {[
              { icon: "🔗", text: "Decentralized", color: "#4facfe" },
              { icon: "⚡", text: "NERO Chain", color: "#667eea" },
              { icon: "🌐", text: "TheGraph", color: "#f093fb" },
              { icon: "💰", text: "DeFi Ready", color: "#48bb78" },
              { icon: "🔒", text: "Web3 Secure", color: "#ed8936" }
            ].map((tech, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: tech.color,
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <span>{tech.icon}</span>
                <span>{tech.text}</span>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              paddingTop: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap"
              }}
            >
              <a
                href="https://github.com/Salmandabbakuti"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: "600",
                  fontSize: "16px",
                  textDecoration: "none",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                }}
              >
                ©{new Date().getFullYear()} VidVerse
              </a>
              <span
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  fontWeight: "500"
                }}
              >
                Built with ❤️ for the decentralized future
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: "#94a3b8",
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "6px 12px",
                  borderRadius: "12px",
                  fontWeight: "600",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                v0.3.0
              </span>
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  );
}
