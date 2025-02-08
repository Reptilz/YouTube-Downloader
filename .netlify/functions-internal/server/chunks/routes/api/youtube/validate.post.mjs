import { d as defineEventHandler, r as readBody, c as createError } from '../../../_/nitro.mjs';
import { yt_validate, video_info } from 'play-dl';
import 'node:http';
import 'node:https';
import '@distube/ytdl-core';
import 'node:fs';
import 'node:path';

const validate_post = defineEventHandler(async (event) => {
  var _a, _b;
  console.log("[API] D\xE9but de la validation de l'URL YouTube");
  try {
    const body = await readBody(event);
    console.log("[API] Body re\xE7u:", body);
    const { url } = body;
    if (!url) {
      console.log("[API] Erreur: URL manquante");
      throw createError({
        statusCode: 400,
        statusMessage: "URL is required",
        data: { received: body }
      });
    }
    console.log("[API] Validation de l'URL:", url);
    if (!yt_validate(url)) {
      console.log("[API] Erreur: URL YouTube invalide");
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid YouTube URL",
        data: { url }
      });
    }
    console.log("[API] R\xE9cup\xE9ration des informations de la vid\xE9o");
    const info = await video_info(url);
    console.log("[API] Informations vid\xE9o r\xE9cup\xE9r\xE9es");
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
      console.log("[API] Erreur: Aucun format vid\xE9o disponible");
      throw createError({
        statusCode: 404,
        statusMessage: "No video formats available",
        data: { url }
      });
    }
    console.log("[API] Formats disponibles:", formats.length);
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
    console.error("[API] Erreur lors de la validation:", error);
    if (error.message.includes("private video")) ; else if (error.message.includes("not found")) ; else if (error.message.includes("copyright")) ;
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: {
        message: error.message,
        name: error.name,
        stack: void 0
      }
    });
  }
});

export { validate_post as default };
//# sourceMappingURL=validate.post.mjs.map
