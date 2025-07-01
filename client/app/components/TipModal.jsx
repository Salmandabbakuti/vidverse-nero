import { useState } from "react";
import { Modal, Button, message, Input, Alert } from "antd";
import { DollarCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { BrowserProvider, formatEther, parseEther } from "ethers";
import {
  useAppKitProvider,
  useAppKitAccount,
  useAppKitState
} from "@reown/appkit/react";
import { contract } from "@/app/utils";

export default function TipModal({ videoData }) {
  const [tipAmountInput, setTipAmountInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { isConnected } = useAppKitAccount();
  const { selectedNetworkId } = useAppKitState();
  const { walletProvider } = useAppKitProvider("eip155");

  const handleTipVideo = async () => {
    if (!isConnected) return message.error("Please connect your wallet first");
    if (selectedNetworkId !== "eip155:1689")
      return message.error("Please switch to NERO Mainnet");
    if (!tipAmountInput || tipAmountInput <= 0)
      return message.error("Please enter valid tip amount");
    setLoading(true);
    try {
      console.log("tipAmountInput", tipAmountInput);
      console.log("videoData?.id", videoData?.id);
      const tipAmountinWei = parseEther(tipAmountInput);
      console.log("tipAmountinWei", tipAmountinWei);
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const tipTx = await contract
        .connect(signer)
        .tipVideo(videoData?.id, tipAmountinWei, {
          value: tipAmountinWei
        });
      console.log("tipTx", tipTx);
      message.success("Thank you for supporting the creator!");
      setOpenModal(false);
      setTipAmountInput("");
    } catch (error) {
      console.error("error tipping video", error);
      message.error(
        error?.shortMessage ||
          error?.message ||
          "Failed to tip the video. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="text"
        onClick={() => setOpenModal(true)}
        icon={<DollarCircleOutlined style={{ color: "#eb2f96" }} />}
      >
        {formatEther(videoData?.tipAmount || 0n) + " NERO"}
      </Button>

      <Modal
        title="Support the creator"
        centered
        onOk={handleTipVideo}
        confirmLoading={loading}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        okText="Submit"
        okButtonProps={{ shape: "round" }}
        cancelButtonProps={{ shape: "round" }}
        width={400}
      >
        <p>Like this video? Consider tipping the creator!</p>
        <Input
          type="number"
          size="large"
          addonAfter="NERO"
          value={tipAmountInput}
          placeholder="Enter tip amount"
          onChange={(e) => setTipAmountInput(e.target.value)}
        />
        <p>*100% of the tip goes to the video owner.</p>
        {/* Alert */}
        <Alert
          message="Heads up!"
          description={`Tipping this video will require funds (tip amount + gas fees). Please ensure you have sufficient NERO in your wallet.`}
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          style={{
            marginBottom: "20px",
            borderRadius: "8px"
          }}
        />
      </Modal>
    </>
  );
}
