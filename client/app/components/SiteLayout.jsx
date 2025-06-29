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
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          boxShadow:
            "0 4px 32px rgba(102, 126, 234, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.3)",
          transition: "all 0.3s ease",
          height: "80px",
          minHeight: "80px",
          borderBottom: "1px solid rgba(102, 126, 234, 0.1)"
        }}
        className="header-glass"
      >
        {/* Header Background Gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(90deg, rgba(102, 126, 234, 0.02) 0%, rgba(240, 147, 251, 0.02) 50%, rgba(79, 172, 254, 0.02) 100%)",
            pointerEvents: "none",
            zIndex: -1
          }}
        />

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
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "48px 0 24px 0",
          color: "white",
          marginTop: "60px"
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 32px"
          }}
        >
          {/* Main Footer Content */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "40px",
              marginBottom: "40px"
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
                    color: "white"
                  }}
                >
                  V
                </div>
                <div>
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "800",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}
                  >
                    VidVerse
                  </span>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      fontWeight: "600"
                    }}
                  >
                    DECENTRALIZED VIDEO PLATFORM
                  </div>
                </div>
              </div>

              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  marginBottom: "24px",
                  maxWidth: "280px"
                }}
              >
                Empowering creators with true ownership and direct monetization
                in Web3.
              </p>

              {/* Social Links */}
              <div
                style={{
                  display: "flex",
                  gap: "12px"
                }}
              >
                {[
                  {
                    icon: "✕",
                    href: "#",
                    color: "#1da1f2",
                    label: "X (Twitter)"
                  },
                  { icon: "💬", href: "#", color: "#5865f2", label: "Discord" },
                  { icon: "⚡", href: "#", color: "#24292e", label: "GitHub" },
                  { icon: "✉️", href: "#", color: "#ea4335", label: "Email" }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      border: "1px solid rgba(255, 255, 255, 0.1)"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = social.color + "20";
                      e.target.style.borderColor = social.color + "40";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.1)";
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.target.style.transform = "translateY(0)";
                    }}
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3
                style={{
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "20px"
                }}
              >
                Quick Links
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                {[
                  { text: "Upload", href: "/upload" },
                  { text: "Browse", href: "/" },
                  { text: "Dashboard", href: "#" },
                  { text: "About Us", href: "#" },
                  { text: "Privacy Policy", href: "#" },
                  { text: "Terms of Service", href: "#" }
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    style={{
                      color: "#e2e8f0",
                      textDecoration: "none",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      fontWeight: "500"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#667eea";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#e2e8f0";
                    }}
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3
                style={{
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "20px"
                }}
              >
                Resources
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                {[
                  { text: "Documentation", href: "#" },
                  { text: "API Reference", href: "#" },
                  { text: "Developer Guide", href: "#" },
                  { text: "Community Forum", href: "#" },
                  { text: "Help Center", href: "#" },
                  { text: "Contact Support", href: "#" }
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    style={{
                      color: "#e2e8f0",
                      textDecoration: "none",
                      fontSize: "15px",
                      transition: "all 0.3s ease",
                      fontWeight: "500"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#667eea";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#e2e8f0";
                    }}
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Built With Section */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "40px",
              padding: "24px 0"
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#94a3b8",
                fontWeight: "600",
                letterSpacing: "0.05em",
                marginBottom: "20px"
              }}
            >
              POWERED BY
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "24px",
                flexWrap: "wrap"
              }}
            >
              {[
                { name: "NERO Chain", color: "#667eea", icon: "⚡" },
                { name: "IPFS", color: "#4facfe", icon: "🔗" },
                { name: "TheGraph", color: "#f093fb", icon: "🌐" },
                { name: "Reown AppKit", color: "#48bb78", icon: "🔐" },
                { name: "Next.js", color: "#000000", icon: "▲" }
              ].map((tech, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#e2e8f0",
                    transition: "all 0.3s ease",
                    cursor: "default"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.12)";
                    e.target.style.borderColor = tech.color + "40";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.06)";
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{tech.icon}</span>
                  <span style={{ color: tech.color }}>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.15)",
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
                gap: "24px",
                flexWrap: "wrap"
              }}
            >
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                ©{new Date().getFullYear()} VidVerse. All rights reserved.
              </div>

              <a
                href="https://github.com/Salmandabbakuti"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#94a3b8",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#667eea";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#94a3b8";
                }}
              >
                🔗 Open Source
              </a>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "12px",
                color: "#64748b"
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  background: "rgba(255, 255, 255, 0.08)",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  border: "1px solid rgba(255, 255, 255, 0.15)"
                }}
              >
                v0.4.3
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "#10b981",
                    borderRadius: "50%",
                    boxShadow: "0 0 8px #10b981"
                  }}
                />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  );
}
