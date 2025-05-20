import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  VideoAdded as VideoAddedEvent,
  VideoInfoUpdated as VideoInfoUpdatedEvent,
  VideoTipped as VideoTippedEvent
} from "../generated/VidVerse/VidVerse";
import { Video, Tip, Channel } from "../generated/schema";

export function handleVideoAdded(event: VideoAddedEvent): void {
  const blockTimestamp = event.block.timestamp;
  const channelId = event.params.owner;

  // Create or update channel entity
  getOrInitChannel(channelId, blockTimestamp);

  // Create video entity
  let video = new Video(event.params.id.toString());
  video.title = event.params.title;
  video.description = event.params.description;
  video.category = event.params.category;
  video.location = event.params.location;
  video.thumbnailHash = event.params.thumbnailHash;
  video.videoHash = event.params.videoHash;
  video.channel = channelId.toHex();
  video.eoa = event.params.eoa;
  video.tipAmount = BigInt.fromI32(0);
  video.createdAt = blockTimestamp;
  video.updatedAt = blockTimestamp;
  video.save();
}

export function handleVideoInfoUpdated(event: VideoInfoUpdatedEvent): void {
  let video = Video.load(event.params.id.toString());
  if (video) {
    video.title = event.params.title;
    video.description = event.params.description;
    video.category = event.params.category;
    video.location = event.params.location;
    video.thumbnailHash = event.params.thumbnailHash;
    video.updatedAt = event.block.timestamp;
    video.save();
  }
}

export function handleVideoTipped(event: VideoTippedEvent): void {
  const videoId = event.params.videoId;
  const blockTimestamp = event.block.timestamp;
  const channelId = event.params.from;

  let video = Video.load(videoId.toString());
  // get or create channel
  getOrInitChannel(channelId, blockTimestamp);

  if (video) {
    video.tipAmount = video.tipAmount.plus(event.params.amount);
    video.save();
  }
  let tip = new Tip(videoId.toString() + "-" + event.params.id.toString());
  tip.video = videoId.toString();
  tip.amount = event.params.amount;
  tip.from = channelId.toHex();
  tip.txHash = event.transaction.hash.toHex();
  tip.createdAt = blockTimestamp;
  tip.save();
}

// Helper function to get or initialize channel entity
function getOrInitChannel(channelId: Bytes, initTimestamp: BigInt): Channel {
  let channel = Channel.load(channelId.toHex());
  if (!channel) {
    channel = new Channel(channelId.toHex());
    channel.owner = channelId;
    channel.createdAt = initTimestamp;
    channel.save();
  }
  return channel as Channel;
}
