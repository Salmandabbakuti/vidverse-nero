import { useState } from "react";
import { Modal, Button, message, Input } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { toEther, toWei } from "thirdweb";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import { thirdwebClient, contract, ellipsisString } from "@/app/utils";
import { executeOperation } from "@/app/utils/aaUtils";

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
      message.info("Please sign the transaction in your wallet");
      const tipTx = await executeOperation(
        signer,
        contract.target,
        "tipVideo",
        [videoData?.id, tipAmountinWei],
        tipAmountinWei
      );
      console.log("tipTx", tipTx);
      message.success("Thank you for supporting the creator!");
      setOpenModal(false);
      setTipAmountInput("");
    } catch (error) {
      console.error(error);
      message.error(
        `Failed to tip video. Make sure you have enough amount in your smart contract wallet ${ellipsisString(
          aaWalletAddress,
          5,
          5
        )}`
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
      </Modal>
    </>
  );
}
