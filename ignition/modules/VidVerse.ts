// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VidVerseModule = buildModule("VidVerseModule", (m) => {
  const vidVerse = m.contract("VidVerse", [], {});
  return { vidVerse };
});

export default VidVerseModule;
