import { d as defineEventHandler, r as readBody, c as createError } from '../../../_/nitro.mjs';
import { yt_validate, video_info } from 'play-dl';
import 'node:http';
import 'node:https';
import '@distube/ytdl-core';
import 'node:fs';
import 'node:path';

const validate_post = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const body = await readBody(event);
    const { url } = body;
    if (!url) {
      throw createError({
        statusCode: 400,
        message: "URL is required"
      });
    }
    if (!yt_validate(url)) {
      throw createError({
        statusCode: 400,
        message: "Invalid YouTube URL"
      });
    }
    const info = await video_info(url);
    const formats = info.format.filter((format) => {
      var _a2;
      return ((_a2 = format.mimeType) == null ? void 0 : _a2.includes("video")) && format.audioQuality !== null;
    }).map((format) => {
      var _a2;
      const qualityLabel = format.qualityLabel || (format.quality === "hd1080" ? "1080p" : format.quality === "hd720" ? "720p" : format.quality === "medium" ? "480p" : "360p");
      return {
        quality: qualityLabel,
        format: ((_a2 = format.mimeType) == null ? void 0 : _a2.split(";")[0].split("/")[1]) || "mp4",
        hasAudio: format.audioQuality !== null,
        hasVideo: true,
        contentLength: format.contentLength,
        itag: format.itag,
        mimeType: format.mimeType || "video/mp4",
        fps: format.fps,
        url: format.url
      };
    }).sort((a, b) => {
      const getQualityNumber = (quality) => {
        var _a2;
        return parseInt(((_a2 = quality == null ? void 0 : quality.match(/\d+/)) == null ? void 0 : _a2[0]) || "0");
      };
      return getQualityNumber(b.quality) - getQualityNumber(a.quality);
    });
    if (formats.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No valid formats found for this video"
      });
    }
    return {
      url,
      videoId: info.video_details.id || "",
      title: info.video_details.title || "",
      thumbnail: ((_a = info.video_details.thumbnails[0]) == null ? void 0 : _a.url) || "",
      duration: info.video_details.durationInSec.toString(),
      author: ((_b = info.video_details.channel) == null ? void 0 : _b.name) || "",
      formats
    };
  } catch (error) {
    console.error("YouTube validation error:", error);
    let errorMessage = "An error occurred while processing the video";
    if (error.message.includes("private video")) {
      errorMessage = "Cette vid\xE9o est priv\xE9e";
    } else if (error.message.includes("not found")) {
      errorMessage = "Cette vid\xE9o n'existe pas";
    } else if (error.message.includes("copyright")) {
      errorMessage = "Cette vid\xE9o n'est pas disponible pour des raisons de droits d'auteur";
    }
    throw createError({
      statusCode: error.statusCode || 500,
      message: errorMessage
    });
  }
});

export { validate_post as default };
//# sourceMappingURL=validate.post.mjs.map
