import { useState } from "react";
import { Modal, Button, message, Input, Alert } from "antd";
import { DollarCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { toEther, toWei } from "thirdweb";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import { thirdwebClient, contract } from "@/app/utils";

export default function TipModal({ videoData, aaWalletAddress }) {
  const [tipAmountInput, setTipAmountInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const accountObj = useActiveAccount() || {};
  const account = accountObj?.address?.toLowerCase();
  const activeChain = useActiveWalletChain();

  const handleTipVideo = async () => {
    if (!account) return message.error("Please connect your wallet first");
    if (!tipAmountInput || tipAmountInput <= 0)
      return message.error("Please enter valid tip amount");
    setLoading(true);
    try {
      console.log("tipAmountInput", tipAmountInput);
      console.log("videoData?.id", videoData?.id);
      const tipAmountinWei = toWei(tipAmountInput);
      console.log("tipAmountinWei", tipAmountinWei);
      const signer = ethers6Adapter.signer.toEthers({
        client: thirdwebClient,
        chain: activeChain,
        account: accountObj
      });
      const tipTx = await contract
        .connect(signer)
        .tipVideo(videoData?.id, tipAmountinWei, {
          value: tipAmountinWei
        });
      console.log("tipTx", tipTx);
      await tipTx.wait();
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
        {toEther(videoData?.tipAmount || 0n) + " NERO"}
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
