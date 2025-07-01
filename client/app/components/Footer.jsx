"use client";
import { Row, Col, Typography, Space, Divider } from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  HeartFilled,
  RocketOutlined,
  PlayCircleOutlined
} from "@ant-design/icons";
import Link from "next/link";
import styles from "./Footer.module.css";

const { Title, Text, Paragraph } = Typography;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <GithubOutlined />,
      href: "https://github.com/Salmandabbakuti",
      label: "GitHub"
    },
    {
      icon: <TwitterOutlined />,
      href: "https://twitter.com/vidverse",
      label: "Twitter"
    },
    {
      icon: <LinkedinOutlined />,
      href: "https://linkedin.com/company/vidverse",
      label: "LinkedIn"
    }
  ];

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/?c=All", label: "Browse" },
    { href: "/upload", label: "Upload" },
    { href: "#", label: "Dashboard" },
    { href: "#", label: "About" }
  ];

  const resources = [
    { href: "#", label: "Documentation" },
    { href: "#", label: "API Reference" },
    { href: "#", label: "Developer Guide" },
    { href: "#", label: "Community" },
    { href: "#", label: "Help Center" },
    { href: "#", label: "Support" }
  ];

  return (
    <footer className={styles.footerSection}>
      {/* Background decoration */}
      <div className={styles.footerGradient} />

      <div className={`container ${styles.footerContainer}`}>
        {/* Main footer content */}
        <Row gutter={[48, 32]}>
          {/* Brand section */}
          <Col xs={24} sm={12} lg={8}>
            <div style={{ marginBottom: "24px" }}>
              <Title level={3} className={styles.footerLogo}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "50%",
                    marginRight: "12px",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
                  }}
                >
                  <PlayCircleOutlined
                    style={{
                      color: "white",
                      fontSize: "20px",
                      fontWeight: "bold"
                    }}
                  />
                </div>
                VidVerse
              </Title>
              <Paragraph className={styles.footerTagline}>
                The decentralized video platform empowering creators with true
                ownership and direct monetization. Built on NERO Chain with
                seamless content delivery via IPFS.
              </Paragraph>

              {/* Social links */}
              <Space size="middle" className={styles.socialLinks}>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </Space>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={12} sm={6} lg={4}>
            <div className={styles.footerLinkGroup}>
              <h4>Quick Links</h4>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={styles.footerLink}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>

          {/* Resources */}
          <Col xs={12} sm={6} lg={4}>
            <div className={styles.footerLinkGroup}>
              <h4>Resources</h4>
              {resources.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={styles.footerLink}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>

          {/* Technology Stack */}
          <Col xs={24} sm={12} lg={8}>
            <div className={styles.footerLinkGroup}>
              <h4>
                <RocketOutlined style={{ marginRight: "8px" }} />
                Powered By
              </h4>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px"
                  }}
                >
                  {[
                    { name: "NERO Chain", color: "#6366f1" },
                    { name: "Pinata", color: "#ec4899" },
                    { name: "TheGraph", color: "#f093fb" },
                    { name: "Next.js", color: "#fff" },
                    { name: "Ant Design", color: "#1677ff" }
                  ].map((tech, index) => (
                    <span
                      key={index}
                      style={{
                        padding: "4px 12px",
                        background: `${tech.color}15`,
                        color: tech.color,
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "var(--font-weight-medium)",
                        border: `1px solid ${tech.color}30`
                      }}
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    padding: "16px",
                    background: "var(--surface-secondary)",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  <Text
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <PlayCircleOutlined />
                    Empowering creators with{" "}
                    <HeartFilled style={{ color: "var(--error-color)" }} /> for
                    the decentralized web
                  </Text>
                </div>
              </Space>
            </div>
          </Col>
        </Row>

        <Divider className={styles.footerDivider} />

        {/* Bottom section */}
        <Row
          justify="space-between"
          align="middle"
          style={{ flexWrap: "wrap-reverse", gap: "16px" }}
        >
          <Col>
            <Text className={styles.footerCopyright}>
              © {currentYear} VidVerse. All rights reserved.{" "}
              <span style={{ margin: "0 8px" }}>•</span>
              <Link
                href="#"
                style={{
                  color: "var(--text-muted)",
                  textDecoration: "underline"
                }}
              >
                Privacy Policy
              </Link>
              <span style={{ margin: "0 8px" }}>•</span>
              <Link
                href="#"
                style={{
                  color: "var(--text-muted)",
                  textDecoration: "underline"
                }}
              >
                Terms of Service
              </Link>
            </Text>
          </Col>
          <Col>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                background: "var(--surface-secondary)",
                borderRadius: "20px",
                border: "1px solid var(--border-color)"
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--success-color)",
                  animation: "pulse 2s infinite"
                }}
              />
              <Text
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: "var(--font-weight-medium)"
                }}
              >
                v0.4.4 • All systems operational
              </Text>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
}
