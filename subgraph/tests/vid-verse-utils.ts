import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  Transfer,
  VideoAdded,
  VideoInfoUpdated,
  VideoTipped
} from "../generated/VidVerse/VidVerse"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createVideoAddedEvent(
  id: BigInt,
  title: string,
  description: string,
  category: string,
  location: string,
  thumbnailHash: string,
  videoHash: string,
  owner: Address
): VideoAdded {
  let videoAddedEvent = changetype<VideoAdded>(newMockEvent())

  videoAddedEvent.parameters = new Array()

  videoAddedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  videoAddedEvent.parameters.push(
    new ethereum.EventParam("title", ethereum.Value.fromString(title))
  )
  videoAddedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  videoAddedEvent.parameters.push(
    new ethereum.EventParam("category", ethereum.Value.fromString(category))
  )
  videoAddedEvent.parameters.push(
    new ethereum.EventParam("location", ethereum.Value.fromString(location))
  )
  videoAddedEvent.parameters.push(
    new ethereum.EventParam(
      "thumbnailHash",
      ethereum.Value.fromString(thumbnailHash)
    )
  )
  videoAddedEvent.parameters.push(
    new ethereum.EventParam("videoHash", ethereum.Value.fromString(videoHash))
  )
  videoAddedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return videoAddedEvent
}

export function createVideoInfoUpdatedEvent(
  id: BigInt,
  title: string,
  description: string,
  category: string,
  location: string,
  thumbnailHash: string
): VideoInfoUpdated {
  let videoInfoUpdatedEvent = changetype<VideoInfoUpdated>(newMockEvent())

  videoInfoUpdatedEvent.parameters = new Array()

  videoInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  videoInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam("title", ethereum.Value.fromString(title))
  )
  videoInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  videoInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam("category", ethereum.Value.fromString(category))
  )
  videoInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam("location", ethereum.Value.fromString(location))
  )
  videoInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "thumbnailHash",
      ethereum.Value.fromString(thumbnailHash)
    )
  )

  return videoInfoUpdatedEvent
}

export function createVideoTippedEvent(
  id: BigInt,
  videoId: BigInt,
  amount: BigInt,
  from: Address
): VideoTipped {
  let videoTippedEvent = changetype<VideoTipped>(newMockEvent())

  videoTippedEvent.parameters = new Array()

  videoTippedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  videoTippedEvent.parameters.push(
    new ethereum.EventParam(
      "videoId",
      ethereum.Value.fromUnsignedBigInt(videoId)
    )
  )
  videoTippedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  videoTippedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )

  return videoTippedEvent
}
