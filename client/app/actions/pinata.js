"use server";
import { PinataSDK } from "pinata";
import { errorResponse } from "./utils";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL
});

export async function uploadVideoAssets(formData) {
  const thumbnailFile = formData.get("thumbnailFile");
  const videoFile = formData.get("videoFile");
  // check if atleast one file is present
  if (!thumbnailFile && !videoFile) {
    return errorResponse(
      "Thumbnail and/or video file is required to upload",
      400,
      true
    );
  }
  try {
    const uploadRes = await pinata.upload.public.fileArray(
      [thumbnailFile, videoFile],
      {}
    );
    console.log("uploadRes in action", uploadRes);
    return {
      thumbnailHash: `${uploadRes?.cid}/${thumbnailFile?.name}`,
      ...(videoFile && { videoHash: `${uploadRes?.cid}/${videoFile?.name}` })
    };
  } catch (error) {
    console.error("Error uploading video assets in action:", error);
    return errorResponse(error);
  }
}
