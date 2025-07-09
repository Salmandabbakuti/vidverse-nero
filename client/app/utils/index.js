import { Contract, JsonRpcProvider } from "ethers";
import { defineChain } from "@reown/appkit/networks";
import { GraphQLClient, gql } from "graphql-request";
import { VIDVERSE_CONTRACT_ADDRESS } from "./constants";

// Define the Nero Testnet chain
export const neroTestnetChain = defineChain({
  id: 689,
  caipNetworkId: "eip155:689",
  chainNamespace: "eip155",
  name: "Nero Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Nero",
    symbol: "NERO"
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-testnet.nerochain.io"],
      webSocket: ["wss://rpc-testnet.nerochain.io"]
    }
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://testnet.neroscan.io" }
  }
});

export const neroMainnetChain = defineChain({
  id: 1689,
  caipNetworkId: "eip155:1689",
  chainNamespace: "eip155",
  name: "Nero Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Nero",
    symbol: "NERO"
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.nerochain.io"],
      webSocket: ["wss://rpc.nerochain.io"]
    }
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://neroscan.io" }
  }
});

// Default provider for Nero Mainnet
const defaultProvider = new JsonRpcProvider("https://rpc.nerochain.io", 1689, {
  staticNetwork: true
});

const abi = [
  "function addVideo(string _title, string _description, string _category, string _location, string _thumbnailHash, string _videoHash, address _eoa)",
  "function tipVideo(uint256 _videoId, uint256 _amount) payable",
  "function updateVideoInfo(uint256 _videoId, string _title, string _description, string _category, string _location, string _thumbnailHash)",
  "function commentVideo(uint256 _videoId, string _comment)",
  "function toggleLikeVideo(uint256 _videoId)",
  "function reportVideo(uint256 _videoId, uint8 _reason, string _description)",
  "function removeVideo(uint256 _videoId)",
  "function clearVideoFlag(uint256 _videoId)",
  "function moderator() view returns (address)",
  "function isVideoLikedByUser(uint256 videoId, address user) view returns (bool)"
];

export const contract = new Contract(
  VIDVERSE_CONTRACT_ADDRESS,
  abi,
  defaultProvider
);

export const ellipsisString = (str = "", first, last) =>
  str.slice(0, first) + "..." + str.slice(-last);

const subgraphUrl =
  process.env.NEXT_PUBLIC_SUBGRAPH_API_URL ||
  "https://subgraph.mainnet.nero.metaborong.com/subgraphs/name/vidverse-nero";

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
      location
      thumbnailHash
      tipAmount
      likeCount
      commentCount
      isFlagged
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
    $comments_first: Int
    $comments_skip: Int
    $comments_orderBy: Comment_orderBy
    $comments_orderDirection: OrderDirection
    $comments_where: Comment_filter
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
      likeCount
      commentCount
      reportCount
      isFlagged
      isRemoved
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
      comments(
        first: $comments_first
        skip: $comments_skip
        orderBy: $comments_orderBy
        orderDirection: $comments_orderDirection
        where: $comments_where
      ) {
        id
        content
        author {
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
    $likes_first: Int
    $likes_skip: Int
    $likes_orderBy: Like_orderBy
    $likes_orderDirection: OrderDirection
    $likes_where: Like_filter
    $comments_first: Int
    $comments_skip: Int
    $comments_orderBy: Comment_orderBy
    $comments_orderDirection: OrderDirection
    $comments_where: Comment_filter
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
        location
        likeCount
        commentCount
        thumbnailHash
        createdAt
        channel {
          id
          createdAt
        }
      }
      likes(
        first: $likes_first
        skip: $likes_skip
        orderBy: $likes_orderBy
        orderDirection: $likes_orderDirection
        where: $likes_where
      ) {
        id
        video {
          id
          title
          category
          location
          likeCount
          commentCount
          thumbnailHash
          createdAt
          channel {
            id
            createdAt
          }
        }
      }
      comments(
        first: $comments_first
        skip: $comments_skip
        orderBy: $comments_orderBy
        orderDirection: $comments_orderDirection
        where: $comments_where
      ) {
        id
        content
        createdAt
        video {
          id
          title
          thumbnailHash
        }
        author {
          id
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

export const GET_VIDEOS_WITH_REPORTS = gql`
  query videos(
    $first: Int
    $skip: Int
    $orderBy: Video_orderBy
    $orderDirection: OrderDirection
    $where: Video_filter
    $reports_first: Int
    $reports_skip: Int
    $reports_orderBy: Report_orderBy
    $reports_orderDirection: OrderDirection
    $reports_where: Report_filter
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
      thumbnailHash
      reportCount
      isFlagged
      isRemoved
      reports(
        first: $reports_first
        skip: $reports_skip
        orderBy: $reports_orderBy
        orderDirection: $reports_orderDirection
        where: $reports_where
      ) {
        id
        reason
        description
        createdAt
        reporter {
          id
        }
      }
    }
  }
`;
