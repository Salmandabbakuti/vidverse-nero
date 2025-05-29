# VidVerse - Decentralized Video Sharing Platform

## Overview

VidVerse is a decentralized, ad-free video sharing platform empowering content creators and making Web3 accessible to everyone. Leveraging NERO Chain’s Paymaster and Account Abstraction (AA), VidVerse delivers a gasless, frictionless, and Web2-like experience with powerful creator monetization and videos stored on decentralized storage (IPFS).

## Vision

Today’s creator platforms are controlled by centralized entities that decide who gets reach, how they get paid, and how creators interact with their audience. This leads to a lack of transparency, unfair monetization practices, and a disconnect between creators and their audience. VidVerse aims to change that by providing a decentralized platform that puts creators in control of their content and their audience.

- **Decentralization**: VidVerse is built around the Blockchain and IPFS, which means that no single entity controls the platform. Media content will be stored on IPFS, ensuring that it is censorship-resistant and accessible to everyone. This ensures that creators have full ownership of their content and can interact with their audience without intermediaries.

- **Tokenized Content**: VidVerse will allow creators to tokenize their content, enabling them to license their videos as NFTs and wider access to content on NFT marketplaces. This gives creators more control over their content and allows them to monetize it in new ways.

- **Easy onboarding & Gasless interactions**: VidVerse uses Nero Chain's Account Abstraction (AA) and Paymaster to enable easy onboarding through secure social logins, programmable authorizations, and gasless interactions. Creators and viewers can interact with the platform without worrying about gas fees or complex wallet setups. This makes it easier for creators to engage with their audience and for viewers to access content.

- **Content Moderation**: VidVerse will use a decentralized moderation system that allows the community to vote on content. This ensures that the platform remains free from harmful or inappropriate content while giving creators the freedom to express themselves. Also, moderation system is planned to ensure video social dynamics(likes, comments, etc.) are not manipulated by bots or malicious actors.

- **Ad-free**: VidVerse is ad-free. No ads, no tracking, and no data collection. Enjoy a clean and private viewing experience. This also means that creators can monetize their content in a fairer way, without relying on ad revenue.

- **Direct Creator Support**: Viewers can tip creators, ensuring that creators receive the full amount without any intermediaries.

- **Familiar user experience**: VidVerse is designed to be familiar to users of traditional video sharing platforms like YouTube. This means that creators can easily transition to VidVerse without having to learn a new platform, and viewers can easily find and interact with content.

By using NERO Chain's Native Account Abstraction(AA), Paymaster features, VidVerse onboards the next billion users to Web3 with a truly frictionless experience, allowing them to interact with the platform without worrying about gas fees or complex wallet setups. This makes it easier for creators and viewers to engage with the platform and helps to drive adoption of decentralized technologies.

![vidverse-nero-watch-page](https://github.com/user-attachments/assets/68c7e42d-6aae-41d4-a996-8c82a0fb492e)

## Core Features

- **Decentralized Storage**: All videos are stored on IPFS, ensuring censorship resistance and permanence

- **Tokenized Content**: Creators can tokenize their videos as NFTs, allowing them to license their content and access wider audiences through NFT marketplaces.

- **Gasless Interactions**: Users can upload, tip, like, and comment without paying gas, thanks to Nero Chain’s paymaster and account abstraction.

- **Social Logins**: Users can log in using their social media accounts, making it easy to onboard new users.

- **Direct Creator Support**: Viewers can tip creators directly, ensuring that creators receive the full amount without any intermediaries.

- **Creator channels**: Each creator has a personalized profile page showcasing uploaded content, tip stats, and social interactions.

- **Video social dynamics**: Users can like, comment, and share videos, creating a social experience around video content.

- **Decentralized moderation**: The community can vote on content moderation, ensuring that the platform remains free from harmful or inappropriate content.

## Getting Started

### 1. Deploying the Smart Contracts

This project is scaffolded using [hardhat](https://hardhat.org/docs). Please refer to the documentation for more information on folder structure and configuration.

> Copy the `.env.example` file to `.env` and update the environment variables with your own values.

```bash

npm install

npx hardhat compile

npx hardhat ignition deploy ./ignition/modules/VidVerse.ts --network neroTestnet
```

### 2. Deploying Subgraph

> Subgraph will be deployed to NERO Chain's hosted Sandbox environment. Please refer to the [Graph Node documentation](https://thegraph.com/docs/en/indexing/tooling/graph-node/) for more information on how to set up your environment. Update `package.json` scripts to point to your local Graph Node if you are running one.

```bash

cd subgraph

npm install

npm run codegen

npm run create-remote # create a new subgraph on the sandbox environment

npm run deploy-remote # deploy the subgraph to the sandbox environment
```

### 3.Running the Client

> Copy the `.env.example` file to `.env` and update the environment variables with your own values.

```bash
cd client
npm install
npm run dev
```

### Paymaster and AA Integration

The core implemtation of Paymaster and Account Abstraction(AA) can be found in [`client/app/utils/aaUtils.js`](client/app/utils/aaUtils.js)

Interaction flow is demonstrated in [adding a video](https://github.com/Salmandabbakuti/vidverse-nero/blob/ede24e1323c042596dee04cf5bf29d2237b86a86/client/app/components/Navbar/UploadDrawer.jsx#L52) and in [updating video Info](https://github.com/Salmandabbakuti/vidverse-nero/blob/6b769597ff54ce2a81c318b28a139e246910bb7e/client/app/components/VideoEditDrawer.jsx#L57) and [tipping a video](https://github.com/Salmandabbakuti/vidverse-nero/blob/6b769597ff54ce2a81c318b28a139e246910bb7e/client/app/watch/%5Bid%5D/page.jsx#L143), commenting, liking, reporting videos in their respective components.

### Screenshots

![vv0.2-home-sc](https://github.com/user-attachments/assets/1cf03cf6-6e45-429a-a1c8-fc696d02a021)

![vv0.2-watch-comments-view-sc](https://github.com/user-attachments/assets/68c7e42d-6aae-41d4-a996-8c82a0fb492e)

![vv0.2-channel-comments-sc](https://github.com/user-attachments/assets/fdd6e529-2c92-4ca8-a5b6-1e6a2b2cb9b7)

![vv0.2-moderator-dashboard-sc](https://github.com/user-attachments/assets/d9ccd4e6-7f0e-447e-a38f-93893da69db6)

### Deployed Resources

- [VidVerse Contract](https://testnet.neroscan.io/address/0x7d9daBF118482B47ea6D900f0221aB1ECDb19a7a)
- [VidVerse Subgraph](https://subgraph.testnet.nero.metaborong.com/subgraphs/name/vidverse-nero)
- [VidVerse Client](https://vidverse-nero.vercel.app/)

## Architecture

![vidverse5](https://github.com/user-attachments/assets/cb29e309-8fd5-481f-9dc8-5af0d88af336)

### Technology Stack

- **Blockchain**: NERO Chain (EVM compatible)
- **Smart contracts**: Solidity, Openzeppelin, Hardhat
- **Frontend**: React.js, Next.js, Antdesign
- **Wallet Integration**: Thirdweb, ethers.js
- **Smartwallets/AA & Paymaster**: NERO Chain's AA UserOp SDK and Paymaster APIs
- **Web3Client**: ethers.js, viem
- **Storage**: IPFS, Thirdweb Storage
- **Data Indexing**: TheGraph(NERO Chain Subgraph Sandbox Node)

## Changelog

### v0.2.0

- Video social dynamics (likes, comments) implementation in smartcontract and subgraph.
- Introduced video reporting and moderation features, including reporting videos with reasons and descriptions.
- Added comment section, likes, viewer discretion modal for flagged video, and video reporting in watch page.
- Paymaster and AA integration for commenting, liking, and reporting videos.
- Added moderator dashboard for video removal and flagging capabilities.
- Channel Page (Creator Profile) with uploaded videos, likes, comments, and tips sections.
- Added likes, comments, tip amount stats in video card.

Full changelog can be found in https://github.com/Salmandabbakuti/vidverse-nero/pull/3

### v0.1.0

- Initial release with basic features(Video List, Upload Video, Watch, Channels, Tips, Subgraph integration)
- Smart contracts for video upload, edit, tokenization (ERC721), and user channels(profiles).
- Paymaster and Account abstraction platform integration using NERO Chain's AA UserOp SDK and Paymaster APIs for video upload, edit, and tipping.
- Social logins and smartwallets integration using Thirdweb and NERO Chain's AA.
- Subgraph implementation for video metadata and user interactions.
- UI for video upload, edit, tipping, viewing, search, filtering.

## Roadmap

### Phase 1: MVP (2 Months)

- Core smartcontracts for video upload, edit, tokenization (ERC721), and user channels(profiles).
- Social logins and smartwallets integration
- Basic Paymaster and Account abstraction platform integration.
- Subgraph implementation for video metadata and user interactions.
- Basic UI for video upload, viewing, search, filtering.

### Phase 2: Advanced Features (3 Months)

- Video social dynamics (likes, comments, tips) implementation.
- Integrate live streaming capabilities using services like Push, Livepeer, or Huddle01.
- Community voting & Content moderation system integration.
- Enhanced user engagement features, notiifications, analytics for creators and viewers.
- Advanced searching, recommendation, and filtering features.
- Enhanced UI/UX for creators and viewers.
- Integration of analytics dashboard for real-time insights.

## References

- [Introduction - Nero Chain](https://docs.nerochain.io/en/getting-started/introduction)
- [Key Features - Nero Chain](https://docs.nerochain.io/en/getting-started/key-features)
- [Dapp Architecture - Nero Chain](https://docs.nerochain.io/en/getting-started/nero-dapp-architecture)
- [Native Account Abstraction - Nero Chain](https://docs.nerochain.io/en/core-concepts/native-account-abstraction/nativeAccountAbstractionSupport)
- [Creating a Dapp - Nero Chain](https://docs.nerochain.io/en/tutorials/low-level/create-first-dapp)
- [Thirdweb Connect](https://portal.thirdweb.com/react/v5)
- [Thirdweb storage](https://portal.thirdweb.com/typescript/v5/storage)
- [Graph Node Docs](https://thegraph.com/docs/en/indexing/tooling/graph-node/)

## Safety & Security

This is an experimental software and subject to change over time.

This is a proof of concept and is not ready for production use. It is not audited and has not been tested for security. Use at your own risk. I do not give any warranties and will not be liable for any loss incurred through any use of this codebase.

# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
