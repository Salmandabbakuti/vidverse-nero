import { useState } from "react";
import { Modal, Form, Select, Input, Button, Space, message } from "antd";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import { FlagTwoTone } from "@ant-design/icons";
import { contract, thirdwebClient } from "@/app/utils";
import { executeOperation } from "@/app/utils/aaUtils";

const { TextArea } = Input;

const REPORT_REASONS = [
  { label: "Sexual Content", value: 0 },
  { label: "Violent or Repulsive Content", value: 1 },
  { label: "Hateful or Abusive Content", value: 2 },
  { label: "Harmful or Dangerous Acts", value: 3 },
  { label: "Misinformation", value: 4 },
  { label: "Child Abuse", value: 5 },
  { label: "Spam or Misleading Content", value: 6 },
  { label: "Legal Issues", value: 7 },
  { label: "Other", value: 8 }
];

export default function ReportModal({ videoId }) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const accountObj = useActiveAccount() || {};
  const account = accountObj?.address?.toLowerCase();
  const activeChain = useActiveWalletChain();

  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    if (!account) return message.error("Please connect your wallet first");
    if (!videoId) return message.error("Video ID is required to report");
    console.log("Report data:", values);
    setLoading(true);
    try {
      const signer = ethers6Adapter.signer.toEthers({
        client: thirdwebClient,
        chain: activeChain,
        account: accountObj
      });
      // Execute the report operation gaslessly
      const reportTx = await executeOperation(
        signer,
        contract.target,
        "reportVideo",
        [videoId, values.reason, values.description]
      );
      console.log("reportTx", reportTx);
      message.success("Thanks for your report! We will review it shortly.");
      setShowReportModal(false);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting report:", error);
      message.error(
        `Failed to submit report: ${
          error?.shortMessage || "Please try again later."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        title="Report Video"
        icon={<FlagTwoTone />}
        type="text"
        onClick={() => setShowReportModal(true)}
      />
      <Modal
        title="Report Video"
        centered
        open={showReportModal}
        onCancel={() => setShowReportModal(false)}
        footer={null}
      >
        <p>Help us improve the platform by reporting inappropriate content.</p>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            reason: 1,
            description: "" // Default empty description
          }}
        >
          <Form.Item
            label="Reason for Reporting"
            name="reason"
            rules={[{ required: true, message: "Please select a reason" }]}
          >
            {/* <Radio.Group
              style={{ display: "flex", flexDirection: "column" }}
              options={REPORT_REASONS}
            /> */}
            <Select placeholder="Select a reason" options={REPORT_REASONS} />
          </Form.Item>

          <Form.Item label="Additional Description" name="description">
            <TextArea rows={5} placeholder="Add more details (optional)" />
          </Form.Item>

          <Form.Item>
            <Space style={{ float: "right" }}>
              <Button
                shape="round"
                onClick={() => setShowReportModal(false)}
                disabled={loading}
              >
                Cancel
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
        </Form>
      </Modal>
    </>
  );
}
