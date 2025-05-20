import { Contract, JsonRpcProvider } from "ethers";
import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { GraphQLClient, gql } from "graphql-request";
import { VIDVERSE_CONTRACT_ADDRESS } from "./constants";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

export const thirdwebClient = createThirdwebClient({ clientId });

export const neroTestnetChain = defineChain({
  id: 689,
  name: "Nero Testnet",
  rpc: "https://rpc-testnet.nerochain.io",
  icon: "https://docs.nerochain.io/assets/nerologo.svg",
  nativeCurrency: {
    name: "Nero",
    symbol: "NERO",
    decimals: 18
  },
  testnet: true,
  blockExplorers: [
    {
      name: "Nero Testnet Explorer",
      url: "https://testnet.neroscan.io/"
    }
  ],
  faucets: [
    "https://app.testnet.nerochain.io/faucet",
    "https://faucet-testnet.nerochain.io/"
  ]
});

export const neroMainnetChain = defineChain({
  id: 1689,
  name: "Nero Mainnet",
  rpc: "https://rpc.nerochain.io",
  icon: "https://docs.nerochain.io/assets/nerologo.svg",
  nativeCurrency: {
    name: "Nero",
    symbol: "NERO",
    decimals: 18
  },
  testnet: false,
  blockExplorers: [
    {
      name: "Nero Mainnet Explorer",
      url: "https://explorer.nerochain.io/"
    }
  ]
});

export const defaultProvider = new JsonRpcProvider(
  "https://rpc-testnet.nerochain.io",
  689,
  {
    staticNetwork: true
  }
);

const abi = [
  "function addVideo(string _title, string _description, string _category, string _location, string _thumbnailHash, string _videoHash, address _eoa)",
  "function tipVideo(uint256 _videoId, uint256 _amount) payable",
  "function updateVideoInfo(uint256 _videoId, string _title, string _description, string _category, string _location, string _thumbnailHash)"
]; // ABI of the contract

export const contract = new Contract(
  VIDVERSE_CONTRACT_ADDRESS,
  abi,
  defaultProvider
);

export const ellipsisString = (str, first, last) =>
  str.slice(0, first) + "..." + str.slice(-last);

const subgraphUrl =
  process.env.NEXT_PUBLIC_SUBGRAPH_API_URL ||
  "https://subgraph.testnet.nero.metaborong.com/subgraphs/name/vidverse-nero";

export const subgraphClient = new GraphQLClient(subgraphUrl);

// subgraph queries

export const GET_VIDEOS_QUERY = gql`
  query videos(
    $first: Int
    $skip: Int
    $orderBy: Video_orderBy
    $orderDirection: OrderDirection
    $where: Video_filter
  ) {
    videos(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      id
      title
      category
      thumbnailHash
      tipAmount
      createdAt
      channel {
        id
        createdAt
      }
    }
  }
`;

export const GET_VIDEO_QUERY = gql`
  query video(
    $id: ID!
    $tips_first: Int
    $tips_skip: Int
    $tips_orderBy: Tip_orderBy
    $tips_orderDirection: OrderDirection
    $tips_where: Tip_filter
  ) {
    video(id: $id) {
      id
      title
      description
      location
      category
      thumbnailHash
      videoHash
      tipAmount
      createdAt
      channel {
        id
        owner
        createdAt
      }
      tips(
        first: $tips_first
        skip: $tips_skip
        orderBy: $tips_orderBy
        orderDirection: $tips_orderDirection
        where: $tips_where
      ) {
        id
        amount
        txHash
        from {
          id
        }
        createdAt
      }
    }
  }
`;

// Get channel query for channel page with videos uploaded, tips received, and channel info
export const GET_CHANNEL_QUERY = gql`
  query channel(
    $id: ID!
    $videos_first: Int
    $videos_skip: Int
    $videos_orderBy: Video_orderBy
    $videos_orderDirection: OrderDirection
    $videos_where: Video_filter
    $tips_first: Int
    $tips_skip: Int
    $tips_orderBy: Tip_orderBy
    $tips_orderDirection: OrderDirection
    $tips_where: Tip_filter
  ) {
    channel(id: $id) {
      id
      owner
      createdAt
      videos(
        first: $videos_first
        skip: $videos_skip
        orderBy: $videos_orderBy
        orderDirection: $videos_orderDirection
        where: $videos_where
      ) {
        id
        title
        category
        thumbnailHash
        createdAt
        channel {
          id
          createdAt
        }
      }
      tips(
        first: $tips_first
        skip: $tips_skip
        orderBy: $tips_orderBy
        orderDirection: $tips_orderDirection
        where: $tips_where
      ) {
        id
        amount
        txHash
        createdAt
        video {
          id
          title
          thumbnailHash
        }
        from {
          id
        }
      }
    }
  }
`;
