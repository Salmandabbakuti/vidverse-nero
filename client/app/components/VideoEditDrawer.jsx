import { useState } from "react";
import {
  Drawer,
  Form,
  Input,
  Select,
  Space,
  Button,
  message,
  Image,
  Spin,
  Alert
} from "antd";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import { upload } from "thirdweb/storage";
import { contract, thirdwebClient } from "@/app/utils";
import { uploadVideoAssets } from "@/app/actions/pinata";

export default function VideoEditDrawer({ video: videoData }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [thumbnailFileInput, setThumbnailFileInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const accountObj = useActiveAccount() || {};
  const account = accountObj?.address?.toLowerCase();
  const activeChain = useActiveWalletChain();

  const handleSubmit = async (values) => {
    console.log("thumbnail", thumbnailFileInput);
    if (!account) return message.error("Please connect your wallet first");
    let thumbnailHash = videoData?.thumbnailHash || "";
    setLoading(true);
    try {
      if (thumbnailFileInput) {
        message.info("Uploading new thumbnail to IPFS");
        const formData = new FormData();
        formData.append("thumbnailFile", thumbnailFileInput);
        const { thumbnailHash: uploadedThumbnailHash, error } =
          await uploadVideoAssets(formData);
        if (error) {
          console.error("Error uploading thumbnail to IPFS:", error);
          return message.error(`Failed to upload thumbnail to IPFS. ${error}`);
        }
        thumbnailHash = uploadedThumbnailHash;
        console.log("thumbnailHash", thumbnailHash);
        message.success("Thumbnail uploaded to IPFS");
        message.info("Updating video info in the contract");
      }
      if (!thumbnailHash)
        return message.error("Thumbnail is required to update video info");
      const signer = ethers6Adapter.signer.toEthers({
        client: thirdwebClient,
        chain: activeChain,
        account: accountObj
      });
      const updateTx = await contract
        .connect(signer)
        .updateVideoInfo(
          videoData?.id,
          values.title,
          values.description,
          values.category,
          values.location,
          thumbnailHash
        );
      console.log("updateVideoTx", updateTx);
      await updateTx.wait();
      message.success(
        "Video info updated successfully. Refreshing in few seconds..."
      );
      // setDrawerOpen(false);
      // Refresh the page to show the updated video after 5 seconds
      setTimeout(() => window.location.reload(), 5000);
    } catch (error) {
      console.error(error);
      message.error("Failed to update video info. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<EditOutlined />}
        shape="circle"
        title="Edit Video Info"
        onClick={() => setDrawerOpen(true)}
      />
      <Drawer
        title="Edit Video Info"
        width={620}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            title: videoData?.title,
            description: videoData?.description,
            location: videoData?.location,
            category: videoData?.category
          }}
        >
          <Spin spinning={loading} tip="Transaction in progress...">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter the title" }]}
            >
              <Input placeholder="Enter video title" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter the description" }
              ]}
            >
              <Input.TextArea rows={4} placeholder="Enter video description" />
            </Form.Item>
            <Space size={12}>
              <Form.Item
                name="location"
                label="Location"
                rules={[
                  { required: true, message: "Please enter the location" }
                ]}
              >
                <Input placeholder="Enter video location" />
              </Form.Item>
              <Form.Item
                name="category"
                label="Category"
                rules={[
                  { required: true, message: "Please select a category" }
                ]}
              >
                <Select placeholder="Select a category" style={{ width: 180 }}>
                  <Select.Option value="Music">Music</Select.Option>
                  <Select.Option value="Gaming">Gaming</Select.Option>
                  <Select.Option value="Education">Education</Select.Option>
                  <Select.Option value="News">News</Select.Option>
                  <Select.Option value="Entertainment">
                    Entertainment
                  </Select.Option>
                  <Select.Option value="Technology">Technology</Select.Option>
                  <Select.Option value="Lifestyle">Lifestyle</Select.Option>
                  <Select.Option value="Travel">Travel</Select.Option>
                  <Select.Option value="Food">Food</Select.Option>
                  <Select.Option value="Health">Health</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              </Form.Item>
            </Space>
            <Form.Item
              name="thumbnail"
              label="Thumbnail"
              rules={[
                {
                  required: !videoData?.thumbnailHash,
                  message: "Please upload a thumbnail"
                }
              ]}
            >
              <Space direction="vertical">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setThumbnailFileInput(e.target.files[0]);
                  }}
                />
                <Image
                  preview={false}
                  alt={videoData?.title}
                  style={{ border: "1px solid grey" }}
                  src={
                    thumbnailFileInput
                      ? URL.createObjectURL(thumbnailFileInput)
                      : `https://ipfs.io/ipfs/${videoData?.thumbnailHash}`
                  }
                  width={450}
                  height={200}
                />{" "}
              </Space>
            </Form.Item>

            {/* Gas Fee Notice */}
            <Alert
              message="Gas Fee Required"
              description="Updating video info will require a gas fee. Please ensure you have sufficient NERO in your wallet."
              type="info"
              icon={<InfoCircleOutlined />}
              showIcon
              style={{
                marginBottom: "20px",
                borderRadius: "8px"
              }}
            />

            <Form.Item>
              <Space>
                <Button shape="round" onClick={() => setDrawerOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  shape="round"
                  loading={loading}
                  htmlType="submit"
                >
                  Update
                </Button>
              </Space>
            </Form.Item>
          </Spin>
        </Form>
      </Drawer>
    </>
  );
}
