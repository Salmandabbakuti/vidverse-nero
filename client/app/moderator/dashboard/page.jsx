"use client";
import { useState, useEffect } from "react";
import {
  List,
  Button,
  Drawer,
  Typography,
  Tag,
  Space,
  Avatar,
  message,
  Input,
  Spin,
  Alert
} from "antd";
import {
  DeleteOutlined,
  SafetyCertificateTwoTone,
  SyncOutlined,
  FileExclamationTwoTone
} from "@ant-design/icons";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import {
  subgraphClient as client,
  GET_VIDEOS_WITH_REPORTS,
  contract,
  thirdwebClient,
  ellipsisString
} from "@/app/utils";

const { Title, Text } = Typography;
const { Search } = Input;
dayjs.extend(relativeTime);

export default function ModeratorDashboard() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [moderator, setModerator] = useState("");

  const accountObj = useActiveAccount() || {};
  const account = accountObj?.address?.toLowerCase();
  const activeChain = useActiveWalletChain();

  const fetchVideosWithReports = async (searchQuery = "") => {
    // Reset state to avoid stale data
    setVideos([]);
    setSelectedVideo(null);
    console.log("searchQuery:", searchQuery);
    setDataLoading(true);
    try {
      // check if connected account is the moderator onchain. if not return early
      const moderator = await contract.moderator();
      console.log("Current moderator:", moderator);
      setModerator(moderator);
      if (account !== moderator?.toLowerCase()) {
        message.error(
          "Only moderator can access this dashboard. Please connect as moderator wallet."
        );
        return;
      }
      console.log("Fetching videos with reports...");
      const data = await client.request(GET_VIDEOS_WITH_REPORTS, {
        first: 100,
        skip: 0,
        orderBy: "reportCount",
        orderDirection: "desc",
        where: {
          and: [
            // { reportCount_gt: 0 }, // Only fetch videos with reports
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
        }, // Only fetch videos with reports, also you can add more filters here e.g isFlagged: true
        reports_first: 50,
        reports_skip: 0,
        reports_orderBy: "createdAt",
        reports_orderDirection: "desc",
        reports_where: {}
      });
      console.log("Fetched videos with reports:", data?.videos);
      setVideos(data?.videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      message.error("Failed to fetch videos with reports.");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchVideosWithReports();
  }, [account]);

  const handleClearVideoFlag = async (videoId) => {
    if (!account) return message.error("Please connect your wallet first");
    if (!videoId) return message.error("Invalid video ID");
    console.log("Unflag video", videoId);
    setLoading(true);
    try {
      const signer = ethers6Adapter.signer.toEthers({
        client: thirdwebClient,
        chain: activeChain,
        account: accountObj
      });

      const unflagTx = await contract.connect(signer).clearVideoFlag(videoId);
      console.log("Unflag transaction:", unflagTx);
      await unflagTx.wait();
      message.success("Video unflagged successfully!");
    } catch (error) {
      console.error("Error unflagging video:", error);
      message.error(
        `Failed to unflag video. ${error?.shortMessage || "Please try again."}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    if (!account) return message.error("Please connect your wallet first");
    if (!videoId) return message.error("Invalid video ID");
    setLoading(true);
    try {
      const signer = ethers6Adapter.signer.toEthers({
        client: thirdwebClient,
        chain: activeChain,
        account: accountObj
      });
      const removeVideoTx = await contract.connect(signer).removeVideo(videoId);
      console.log("removeVideoTx", removeVideoTx);
      await removeVideoTx.wait();
      message.success("Video removed successfully!");
    } catch (error) {
      console.error("Error removing video:", error);
      message.error(
        `Failed to remove video. ${error?.shortMessage || "Please try again."}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Alert
        message={
          <Typography.Text strong>
            Current Moderator: {ellipsisString(moderator, 6, 4)}
          </Typography.Text>
        }
        description="Only the moderator can perform actions on this page."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
      <Title level={4}>Reported Videos</Title>
      <Spin spinning={loading} tip="Transaction in progress...">
        <List
          itemLayout="horizontal"
          loading={dataLoading}
          dataSource={videos}
          header={
            // search and refresh buttons
            <Space wrap>
              <Search
                defaultValue={""}
                type="primary"
                enterButton
                placeholder="Search videos by title"
                allowClear
                onSearch={fetchVideosWithReports}
                style={{ width: 300 }}
              />
              <Button
                shape="circle"
                onClick={() => fetchVideosWithReports()}
                icon={<SyncOutlined spin={dataLoading} />}
              />
            </Space>
          }
          pagination={{
            size: "small",
            responsive: true,
            hideOnSinglePage: true,
            showLessItems: true,
            pageSizeOptions: [5, 10, 25, 50],
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize: 10
          }}
          renderItem={(video) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Link href={`/watch/${video?.id}`}>
                    <Avatar
                      shape="square"
                      size="large"
                      src={`https://ipfs.io/ipfs/${video.thumbnailHash}`}
                      alt={video.title}
                      style={{ width: 120, height: 90 }}
                    />
                  </Link>
                }
                title={video?.title}
                description={
                  <Space wrap>
                    <Tag
                      color={video?.reportCount ? "blue" : "red"}
                      bordered={false}
                    >
                      {video?.reportCount} Reports
                    </Tag>
                    <Tag color={video?.isFlagged ? "orange" : "cyan"}>
                      {video?.isFlagged ? "Flagged" : "Not Flagged"}
                    </Tag>
                    <Tag color={video?.isRemoved ? "red" : "green"}>
                      {video?.isRemoved ? "Removed" : "Active"}
                    </Tag>
                  </Space>
                }
              />
              <Space>
                <Button
                  variant="outlined"
                  icon={<FileExclamationTwoTone />}
                  shape="circle"
                  title="View Reports"
                  onClick={() => setSelectedVideo(video)}
                />
                <Button
                  type="default"
                  icon={<SafetyCertificateTwoTone />}
                  shape="circle"
                  title="Unflag Video"
                  onClick={() => handleClearVideoFlag(video?.id)}
                  disabled={!video?.isFlagged}
                />
                <Button
                  icon={<DeleteOutlined />}
                  shape="circle"
                  type="primary"
                  title="Remove Video"
                  danger
                  onClick={() => handleRemoveVideo(video?.id)}
                />
              </Space>
            </List.Item>
          )}
        />
      </Spin>

      <Drawer
        title={`Reports for "${selectedVideo?.title}"`}
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        width={520}
      >
        <List
          itemLayout="vertical"
          split
          dataSource={selectedVideo?.reports || []}
          pagination={{
            size: "small",
            responsive: true,
            hideOnSinglePage: true,
            showLessItems: true,
            pageSizeOptions: [5, 10, 25, 50],
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize: 10
          }}
          renderItem={(report) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <Text type="secondary">{report?.reporter?.id}</Text>
                    <Text type="secondary">
                      {dayjs(report?.createdAt * 1000 || 0).fromNow()}
                    </Text>
                  </Space>
                }
                description={
                  <Space direction="vertical">
                    <Tag color="red" style={{ fontWeight: "bold" }}>
                      {report?.reason}
                    </Tag>
                    <Text strong={Boolean(report?.description)}>
                      {report?.description || "<No description provided>"}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
}
