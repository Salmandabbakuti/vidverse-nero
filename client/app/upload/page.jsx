"use client";
import { useState } from "react";
import {
  Form,
  Input,
  Select,
  Space,
  Button,
  message,
  Spin,
  Card,
  Typography,
  Row,
  Col
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import { useRouter } from "next/navigation";
import { contract, thirdwebClient } from "@/app/utils";
import { executeOperation } from "@/app/utils/aaUtils";
import VideoPreviewCard from "@/app/components/VideoPreviewCard";
import { uploadVideoAssets } from "@/app/actions/pinata";

const { Title, Paragraph } = Typography;

export default function UploadPage() {
  const [thumbnailFileInput, setThumbnailFileInput] = useState(null);
  const [videoFileInput, setVideoFileInput] = useState(null);
  const [loading, setLoading] = useState(false);

  // State for live preview fields
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    category: "Gaming"
  });

  const router = useRouter();

  const accountObj = useActiveAccount() || {};
  const account = accountObj?.address?.toLowerCase();
  const activeChain = useActiveWalletChain();

  const handleSubmit = async (values) => {
    console.log("thumbnail", thumbnailFileInput);
    console.log("video", videoFileInput);
    if (!account) return message.error("Please connect your wallet first");

    if (!thumbnailFileInput || !videoFileInput) {
      message.error("Please upload a video and thumbnail");
      return;
    }
    setLoading(true);
    message.info("Uploading video and thumbnail to IPFS");
    // const [videoHash, thumbnailHash] = await upload({
    //   client: thirdwebClient, // thirdweb client
    //   files: [videoFileInput, thumbnailFileInput]
    // });
    const formData = new FormData();
    formData.append("thumbnailFile", thumbnailFileInput);
    formData.append("videoFile", videoFileInput);

    const { thumbnailHash, videoHash, error } = await uploadVideoAssets(
      formData
    );
    if (error) {
      console.error("Error uploading video assets to IPFS:", error);
      return message.error(`Failed to upload video assets to IPFS. ${error}`);
    }
    message.success("Thumbnail and video are uploaded to IPFS");
    message.info("Adding video info to the contract");
    try {
      const signer = ethers6Adapter.signer.toEthers({
        client: thirdwebClient,
        chain: activeChain,
        account: accountObj
      });
      message.info("Please sign the transaction in your wallet");
      const addVideoTx = await executeOperation(
        signer,
        contract.target,
        "addVideo",
        [
          values.title,
          values.description,
          values.category,
          values.location,
          thumbnailHash,
          videoHash,
          account
        ]
      );
      console.log("addVideoTx", addVideoTx);
      message.success(
        "Video uploaded successfully. Redirecting to home page..."
      );
      // setDrawerOpen(false);
      // Refresh the page to show the new video after 5 seconds
      setTimeout(() => router.push("/"), 5000);
    } catch (error) {
      console.error(error);
      message.error("Failed to upload video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: 24 }}>
      <Card
        style={{
          borderRadius: 18,
          boxShadow: "0 2px 16px #6366f111",
          padding: 20
        }}
      >
        <Title level={4} style={{ marginBottom: 0 }}>
          Upload a New Video
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 32 }}>
          Share your creativity with the world. All videos are minted as
          soulbound NFTs and metadata is stored on-chain for true ownership.
        </Paragraph>
        <Row gutter={[32, 32]} align="top" justify="center">
          {/* Left: Upload Form */}
          <Col xs={24} md={14}>
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                category: "Gaming"
              }}
              onValuesChange={(changed, all) => setFormValues(all)}
            >
              <Spin spinning={loading} tip="Transaction in progress...">
                <Form.Item
                  name="video"
                  label={
                    <span>
                      Video{" "}
                      <InfoCircleOutlined title="MP4, MOV, AVI, max 200MB" />
                    </span>
                  }
                  rules={[{ required: true, message: "Please upload a video" }]}
                >
                  <Input
                    type="file"
                    accept="video/*, audio/*"
                    onChange={(e) => setVideoFileInput(e.target.files[0])}
                  />
                </Form.Item>
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[
                    { required: true, message: "Please enter the title" }
                  ]}
                >
                  <Input
                    placeholder="Enter video title"
                    maxLength={280}
                    showCount
                  />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    { required: true, message: "Please enter the description" }
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter video description"
                    maxLength={1000}
                    showCount
                  />
                </Form.Item>
                <Row gutter={12}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="location"
                      label="Location"
                      rules={[
                        { required: true, message: "Please enter the location" }
                      ]}
                    >
                      <Input placeholder="Enter video location" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[
                        { required: true, message: "Please select a category" }
                      ]}
                    >
                      <Select
                        placeholder="Select video category"
                        showSearch
                        value={formValues.category}
                        options={[
                          { value: "Music", label: "Music" },
                          { value: "Gaming", label: "Gaming" },
                          { value: "Education", label: "Education" },
                          { value: "News", label: "News" },
                          { value: "Entertainment", label: "Entertainment" },
                          { value: "Technology", label: "Technology" },
                          { value: "Lifestyle", label: "Lifestyle" },
                          { value: "Travel", label: "Travel" },
                          { value: "Food", label: "Food" },
                          { value: "Health", label: "Health" },
                          { value: "Other", label: "Other" }
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="thumbnail"
                  label={
                    <span>
                      Thumbnail <InfoCircleOutlined title="JPG, PNG, max 5MB" />
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please upload a thumbnail" }
                  ]}
                >
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFileInput(e.target.files[0])}
                  />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button shape="round" onClick={() => router.back()}>
                      Back
                    </Button>
                    <Button
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      loading={loading}
                    >
                      Submit
                    </Button>
                  </Space>
                </Form.Item>
              </Spin>
            </Form>
          </Col>
          {/* Right: Live Preview */}
          <Col xs={24} md={10}>
            <div
              style={{
                minHeight: 520,
                background: "#f8fafc",
                borderRadius: 18,
                padding: 16
              }}
            >
              <Title level={4} style={{ textAlign: "center" }}>
                Live Preview
              </Title>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16
                }}
              >
                <VideoPreviewCard
                  title={formValues.title || "Video Title"}
                  category={formValues.category || "-"}
                  videoUrl={
                    videoFileInput
                      ? URL.createObjectURL(videoFileInput)
                      : undefined
                  }
                  thumbUrl={
                    thumbnailFileInput
                      ? URL.createObjectURL(thumbnailFileInput)
                      : undefined
                  }
                />
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
