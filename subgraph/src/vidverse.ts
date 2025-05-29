import { BigInt, Bytes, store } from "@graphprotocol/graph-ts";
import {
  VideoAdded as VideoAddedEvent,
  VideoInfoUpdated as VideoInfoUpdatedEvent,
  VideoTipped as VideoTippedEvent,
  VideoLikeToggled as VideoLikeToggledEvent,
  VideoCommented as VideoCommentedEvent,
  VideoReported as VideoReportedEvent,
  VideoRemoved as VideoRemovedEvent,
  VideoFlagToggled as VideoFlagToggledEvent
} from "../generated/VidVerse/VidVerse";
import {
  Video,
  Tip,
  Channel,
  Like,
  Comment,
  Report
} from "../generated/schema";

const REPORT_REASONS = [
  "SexualContent",
  "ViolentOrRepulsive",
  "HatefulOrAbusive",
  "HarmfulOrDangerousActs",
  "Misinformation",
  "ChildAbuse",
  "SpamOrMisleading",
  "Legal",
  "Other"
];

const ZERO_BI = BigInt.fromI32(0);
const ONE_BI = BigInt.fromI32(1);

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
  video.tipAmount = ZERO_BI;
  video.likeCount = ZERO_BI;
  video.commentCount = ZERO_BI;
  video.reportCount = ZERO_BI;
  video.isFlagged = false;
  video.isRemoved = false;
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

export function handleVideoLikeToggled(event: VideoLikeToggledEvent): void {
  const videoId = event.params.videoId;
  const userId = event.params.user;
  const blockTimestamp = event.block.timestamp;
  // create or update channel entity
  getOrInitChannel(userId, blockTimestamp);

  // create/remove like entity
  let video = Video.load(videoId.toString());
  if (video) {
    let likeId = videoId.toString() + "-" + userId.toHex();
    let like = Like.load(likeId);
    if (like) {
      // Remove like entity and decrement video like count if it exists
      store.remove("Like", likeId);
      video.likeCount = video.likeCount.minus(ONE_BI);
      video.save();
    } else {
      // Create like entity
      like = new Like(likeId);
      like.video = videoId.toString();
      like.likedBy = userId.toHex();
      like.createdAt = blockTimestamp;
      like.save();
      // Update video entity with incremented like count
      video.likeCount = video.likeCount.plus(ONE_BI);
      video.save();
    }
  }
}

export function handleVideoCommented(event: VideoCommentedEvent): void {
  const videoId = event.params.videoId;
  const blockTimestamp = event.block.timestamp;
  const channelId = event.params.author;
  // create or update channel entity
  getOrInitChannel(channelId, blockTimestamp);

  // create comment entity and update comment count
  let video = Video.load(videoId.toString());
  if (video) {
    // Create comment entity
    let comment = new Comment(
      videoId.toString() + "-" + event.params.id.toString()
    );
    comment.video = videoId.toString();
    comment.author = channelId.toHex();
    comment.content = event.params.comment;
    comment.createdAt = blockTimestamp;
    comment.save();
    // Update video entity with incremented comment count
    video.commentCount = video.commentCount.plus(ONE_BI);
    video.save();
  }
}

export function handleVideoReported(event: VideoReportedEvent): void {
  const videoId = event.params.videoId;
  const blockTimestamp = event.block.timestamp;
  const channelId = event.params.reporter;

  // create or update channel entity
  getOrInitChannel(channelId, blockTimestamp);

  const video = Video.load(videoId.toString());
  if (video) {
    video.reportCount = video.reportCount.plus(ONE_BI);
    video.updatedAt = blockTimestamp;
    video.save();
  }
  const reportId = event.params.id;
  const report = new Report(videoId.toString() + "-" + reportId.toString());
  report.video = videoId.toString();
  report.reason = REPORT_REASONS[event.params.reason];
  report.description = event.params.description;
  report.reporter = channelId.toHex();
  report.createdAt = blockTimestamp;
  report.save();
}

export function handleVideoRemoved(event: VideoRemovedEvent): void {
  const video = Video.load(event.params.id.toString());
  if (video) {
    // Remove video entity
    // store.remove("Video", video.id);
    // or mark it as removed
    video.isRemoved = true;
    video.updatedAt = event.block.timestamp;
    video.save();
  }
}

export function handleVideoFlagToggled(event: VideoFlagToggledEvent): void {
  // Load the video entity
  const video = Video.load(event.params.videoId.toString());
  if (video) {
    // Update the flagged status
    video.isFlagged = event.params.isFlagged;
    video.updatedAt = event.block.timestamp;
    video.save();
  }
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
