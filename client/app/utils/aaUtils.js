import { Client, Presets } from "userop";
import { contract } from ".";

// Chain configuration
const NERO_RPC_URL = "https://rpc-testnet.nerochain.io";
const BUNDLER_URL = "https://bundler.service.nerochain.io";
const PAYMASTER_URL = "https://paymaster-testnet.nerochain.io";
const API_KEY =
  process.env.NEXT_PUBLIC_NERO_PLATFORM_API_KEY || "your_api_key_here";

// Contract addresses
const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const ACCOUNT_FACTORY_ADDRESS = "0x9406Cc6185a346906296840746125a0E44976454";

export const getAAWalletAddress = async (accountSigner) => {
  // Ensure we have a valid signer with getAddress method
  if (!accountSigner || typeof accountSigner.getAddress !== "function") {
    throw new Error("Invalid signer object: must have a getAddress method");
  }
  const simpleAccount = await Presets.Builder.SimpleAccount.init(
    accountSigner,
    NERO_RPC_URL,
    {
      overrideBundlerRpc: BUNDLER_URL,
      entryPoint: ENTRYPOINT_ADDRESS,
      factory: ACCOUNT_FACTORY_ADDRESS
    }
  );

  // Get the counterfactual address of the AA wallet
  const address = simpleAccount.getSender();
  console.log("AA wallet address:", address);
  return address;
};

export const initAAClient = async () => {
  // Initialize the AA Client
  const client = await Client.init(NERO_RPC_URL, {
    overrideBundlerRpc: BUNDLER_URL,
    entryPoint: ENTRYPOINT_ADDRESS
  });
  return client;
};

export const initAABuilder = async (accountSigner) => {
  const builder = await Presets.Builder.SimpleAccount.init(
    accountSigner,
    NERO_RPC_URL,
    {
      overrideBundlerRpc: BUNDLER_URL,
      entryPoint: ENTRYPOINT_ADDRESS,
      factory: ACCOUNT_FACTORY_ADDRESS
    }
  );

  // Set paymaster options with API key
  builder.setPaymasterOptions({
    apikey: API_KEY,
    rpc: PAYMASTER_URL,
    type: "0" // Default to free (sponsored gas)
  });

  // Set gas parameters for the UserOperation
  builder.setCallGasLimit("0x88b8"); // 35,000 gas
  builder.setVerificationGasLimit("0x33450"); // 210,000 gas
  builder.setPreVerificationGas("0xc350"); // 50,000 gas
  builder.setMaxFeePerGas("0x417465B6"); // 1.09 Gwei
  builder.setMaxPriorityFeePerGas("0x40dbcf36"); // 1.08 Gwei
  return builder;
};

export const executeOperation = async (
  accountSigner,
  contractAddress,
  functionName,
  functionParams
) => {
  // Initialize client
  const client = await initAAClient();

  // Initialize builder with paymaster
  const builder = await initAABuilder(accountSigner);

  const callData = contract.interface.encodeFunctionData(
    functionName,
    functionParams
  );

  const userOp = builder.execute(contractAddress, 0, callData);

  // Send the user operation
  console.log("Sending UserOperation to bundler");
  const res = await client.sendUserOperation(userOp);

  console.log("UserOperation sent with hash:", res.userOpHash);

  // Wait for the transaction to be included
  const receipt = await res.wait();

  // Log transaction hash when available
  if (receipt && receipt.transactionHash) {
    console.log("Transaction mined:", receipt.transactionHash);
  }
  // Return operation results
  return {
    userOpHash: res.userOpHash,
    transactionHash: receipt?.transactionHash || "",
    receipt: receipt
  };
};
