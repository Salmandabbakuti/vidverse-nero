import { useState } from "react";
import Link from "next/link";
import { Input, List, Avatar, Button, Space, Typography, message } from "antd";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { contract, ellipsisString, thirdwebClient } from "@/app/utils";
import { executeOperation } from "@/app/utils/aaUtils";

dayjs.extend(relativeTime);

export default function CommentSection({
  comments,
  videoId,
  dataLoading = false
}) {
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const accountObj = useActiveAccount() || {};
  const account = accountObj?.address?.toLowerCase();
  const activeChain = useActiveWalletChain();

  const handleAddComment = async () => {
    console.log("commentInput", commentInput);
    if (!account) return message.error("Please connect your wallet first");
    if (!commentInput) return message.error("Comment cannot be empty");
    setLoading(true);
    try {
      const signer = ethers6Adapter.signer.toEthers({
        client: thirdwebClient,
        chain: activeChain,
        account: accountObj
      });
      const addCommentTx = await executeOperation(
        signer,
        contract.target,
        "commentVideo",
        [videoId, commentInput]
      );
      setCommentInput("");
      console.log("addCommentTx", addCommentTx);
      // add comment to state
      comments.unshift({
        id: comments.length + 1,
        content: commentInput,
        author: { id: account },
        createdAt: Math.floor(Date.now() / 1000)
      });
      message.success("Comment added!");
    } catch (error) {
      console.error(error);
      message.error("Failed to add comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Input
        type="text"
        autoFocus={true}
        variant="borderless"
        placeholder="Add a public comment..."
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
        style={{ marginBottom: "10px" }}
        addonAfter={
          commentInput && (
            <Space>
              <Button
                shape="round"
                size="small"
                onClick={() => setCommentInput("")}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                shape="round"
                size="small"
                loading={loading}
                onClick={handleAddComment}
              >
                Submit
              </Button>
            </Space>
          )
        }
      />
      <List
        itemLayout="horizontal"
        dataSource={comments}
        rowKey={(item) => item?.id}
        split={false}
        loading={dataLoading}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Link href={`/channel/${item?.author?.id}`}>
                  <Avatar
                    shape="circle"
                    size="small"
                    style={{
                      cursor: "pointer",
                      border: "1px solid grey"
                    }}
                    src={`https://api.dicebear.com/5.x/open-peeps/svg?seed=${item?.author?.id}`}
                  />
                </Link>
              }
              title={
                <Space>
                  <Link href={`/channel/${item?.author?.id}`}>
                    <Typography.Text strong>
                      {ellipsisString(item?.author?.id, 8, 5)}
                    </Typography.Text>
                  </Link>
                  <Typography.Text type="secondary">
                    {dayjs(item?.createdAt * 1000).fromNow()}
                  </Typography.Text>
                </Space>
              }
              description={item?.content}
            />
          </List.Item>
        )}
      />
    </>
  );
}
