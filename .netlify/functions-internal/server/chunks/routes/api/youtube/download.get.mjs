import { d as defineEventHandler, a as getQuery, c as createError, s as setHeaders, b as sendStream } from '../../../_/nitro.mjs';
import { yt_validate, video_info, stream } from 'play-dl';
import 'node:http';
import 'node:https';
import '@distube/ytdl-core';
import 'node:fs';
import 'node:path';

const download_get = defineEventHandler(async (event) => {
  var _a;
  try {
    const query = getQuery(event);
    const { url, itag } = query;
    if (!url || !itag) {
      throw createError({
        statusCode: 400,
        message: "URL and itag are required"
      });
    }
    if (!yt_validate(url)) {
      throw createError({
        statusCode: 400,
        message: "Invalid YouTube URL"
      });
    }
    const info = await video_info(url);
    const format = info.format.find((f) => f.itag === parseInt(itag));
    if (!format) {
      throw createError({
        statusCode: 400,
        message: "Format not found"
      });
    }
    const safeFilename = info.video_details.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const fileExtension = ((_a = format.mimeType) == null ? void 0 : _a.split(";")[0].split("/")[1]) || "mp4";
    const filename = `${safeFilename}.${fileExtension}`;
    try {
      const videoStream = await stream(url, {
        quality: parseInt(itag),
        htmldata: info.html,
        language: "en"
      });
      setHeaders(event, {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": format.mimeType || "video/mp4",
        "Cache-Control": "no-cache",
        "Content-Transfer-Encoding": "binary"
      });
      return sendStream(event, videoStream.stream);
    } catch (streamError) {
      console.error("Streaming error:", streamError);
      throw createError({
        statusCode: 500,
        message: "Error while streaming the video"
      });
    }
  } catch (error) {
    console.error("YouTube download error:", error);
    let errorMessage = "An error occurred while downloading the video";
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

export { download_get as default };
//# sourceMappingURL=download.get.mjs.map
