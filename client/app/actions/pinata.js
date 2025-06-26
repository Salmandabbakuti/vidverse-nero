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
  try {
    const filesToUpload = [];
    if (thumbnailFile) filesToUpload.push(thumbnailFile);
    if (videoFile) filesToUpload.push(videoFile);
    if (!filesToUpload.length) {
      return errorResponse(
        "No files to upload. Please provide a thumbnail or video file.",
        400,
        true
      );
    }
    const uploadRes = await pinata.upload.public.fileArray(filesToUpload, {});
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
