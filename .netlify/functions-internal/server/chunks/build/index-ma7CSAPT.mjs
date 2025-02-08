import { useSSRContext, defineComponent, ref, mergeProps, unref, computed, withCtx, openBlock, createBlock, toDisplayString, createVNode, Fragment, renderList, Transition } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/vue/24/solid';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { u as useNotifications } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'play-dl';
import '@distube/ytdl-core';
import 'node:fs';
import 'node:path';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "UrlInput",
  __ssrInlineRender: true,
  emits: ["submit"],
  setup(__props, { emit: __emit }) {
    const url = ref("");
    const isLoading = ref(false);
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full max-w-2xl mx-auto" }, _attrs))}><form class="mt-4"><div class="flex flex-col space-y-4"><label for="youtube-url" class="block text-sm font-medium text-gray-700"> URL de la vid\xE9o YouTube </label><div class="relative rounded-md shadow-sm"><input id="youtube-url"${ssrRenderAttr("value", url.value)} type="text" placeholder="https://www.youtube.com/watch?v=..." class="${ssrRenderClass([{ "border-red-300": error.value }, "block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"])}"><div class="absolute inset-y-0 right-0 flex items-center pr-3">`);
      _push(ssrRenderComponent(unref(MagnifyingGlassIcon), { class: "h-5 w-5 text-gray-400" }, null, _parent));
      _push(`</div></div>`);
      if (error.value) {
        _push(`<div class="text-sm text-red-600">${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">`);
      if (isLoading.value) {
        _push(`<span>Chargement...</span>`);
      } else {
        _push(`<span>Charger la vid\xE9o</span>`);
      }
      _push(`</button></div></form></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/youtube/UrlInput.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "VideoPlayer",
  __ssrInlineRender: true,
  props: {
    videoId: {},
    thumbnail: {},
    title: {},
    author: {},
    duration: {}
  },
  setup(__props) {
    const props = __props;
    const formatDuration = (seconds) => {
      const duration = parseInt(seconds);
      const minutes = Math.floor(duration / 60);
      const remainingSeconds = duration % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };
    const videoUrl = computed(() => {
      if (!props.videoId) return "";
      return `https://www.youtube.com/embed/${props.videoId}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-lg shadow-lg overflow-hidden" }, _attrs))}><div class="relative w-full" style="${ssrRenderStyle({ "padding-top": "56.25%" })}"><iframe${ssrRenderAttr("src", videoUrl.value)} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe></div><div class="p-4"><h2 class="text-xl font-semibold text-gray-900 mb-2">${ssrInterpolate(_ctx.title)}</h2><div class="flex items-center justify-between text-sm text-gray-600"><span>${ssrInterpolate(_ctx.author)}</span><span>${ssrInterpolate(formatDuration(_ctx.duration))}</span></div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/youtube/VideoPlayer.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DownloadButton",
  __ssrInlineRender: true,
  props: {
    video: {},
    isLoading: { type: Boolean }
  },
  emits: ["download"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const selectedFormat = ref(null);
    const formatFileSize = (bytes) => {
      if (!bytes) return "Taille inconnue";
      const size = parseInt(bytes);
      if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
      }
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    };
    const formatMimeType = (mimeType) => {
      const match = mimeType.match(/video\/([^;]+)/);
      return match ? match[1].toUpperCase() : "Unknown";
    };
    const availableFormats = computed(() => {
      return props.video.formats.filter((format) => format.hasVideo && format.hasAudio).sort((a, b) => {
        var _a, _b, _c, _d;
        const qualityA = parseInt(((_b = (_a = a.quality) == null ? void 0 : _a.match(/\d+/)) == null ? void 0 : _b[0]) || "0");
        const qualityB = parseInt(((_d = (_c = b.quality) == null ? void 0 : _c.match(/\d+/)) == null ? void 0 : _d[0]) || "0");
        return qualityB - qualityA;
      });
    });
    const handleDownload = async (format) => {
      try {
        const params = new URLSearchParams({
          url: props.video.url,
          itag: format.itag.toString()
        });
        const downloadUrl = `/api/youtube/download?${params.toString()}`;
        const link = (void 0).createElement("a");
        link.href = downloadUrl;
        (void 0).body.appendChild(link);
        link.click();
        (void 0).body.removeChild(link);
      } catch (error) {
        console.error("Download error:", error);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-4" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(Menu), {
        as: "div",
        class: "relative inline-block text-left w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex space-x-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(MenuButton), {
              class: "w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
              disabled: _ctx.isLoading
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (selectedFormat.value) {
                    _push3(`<span${_scopeId2}>${ssrInterpolate(selectedFormat.value.quality)} - ${ssrInterpolate(formatMimeType(selectedFormat.value.mimeType))}</span>`);
                  } else {
                    _push3(`<span${_scopeId2}>S\xE9lectionner la qualit\xE9</span>`);
                  }
                  _push3(ssrRenderComponent(unref(ChevronDownIcon), {
                    class: "ml-2 -mr-1 h-5 w-5",
                    "aria-hidden": "true"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    selectedFormat.value ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(selectedFormat.value.quality) + " - " + toDisplayString(formatMimeType(selectedFormat.value.mimeType)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "S\xE9lectionner la qualit\xE9")),
                    createVNode(unref(ChevronDownIcon), {
                      class: "ml-2 -mr-1 h-5 w-5",
                      "aria-hidden": "true"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"${ssrIncludeBooleanAttr(!selectedFormat.value || _ctx.isLoading) ? " disabled" : ""}${_scopeId}>`);
            if (_ctx.isLoading) {
              _push2(`<span${_scopeId}>Chargement...</span>`);
            } else {
              _push2(`<span${_scopeId}>T\xE9l\xE9charger</span>`);
            }
            _push2(`</button></div>`);
            _push2(ssrRenderComponent(unref(MenuItems), { class: "origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="py-1"${_scopeId2}><!--[-->`);
                  ssrRenderList(availableFormats.value, (format) => {
                    _push3(ssrRenderComponent(unref(MenuItem), {
                      key: format.itag
                    }, {
                      default: withCtx(({ active }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<button class="${ssrRenderClass([
                            active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                            "block w-full text-left px-4 py-2 text-sm"
                          ])}"${_scopeId3}><div class="flex justify-between items-center"${_scopeId3}><span${_scopeId3}>${ssrInterpolate(format.quality)}${ssrInterpolate(format.fps ? ` ${format.fps}fps` : "")}</span><span class="text-gray-500"${_scopeId3}>${ssrInterpolate(formatMimeType(format.mimeType))} - ${ssrInterpolate(formatFileSize(format.contentLength))}</span></div></button>`);
                        } else {
                          return [
                            createVNode("button", {
                              onClick: ($event) => selectedFormat.value = format,
                              class: [
                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                "block w-full text-left px-4 py-2 text-sm"
                              ]
                            }, [
                              createVNode("div", { class: "flex justify-between items-center" }, [
                                createVNode("span", null, toDisplayString(format.quality) + toDisplayString(format.fps ? ` ${format.fps}fps` : ""), 1),
                                createVNode("span", { class: "text-gray-500" }, toDisplayString(formatMimeType(format.mimeType)) + " - " + toDisplayString(formatFileSize(format.contentLength)), 1)
                              ])
                            ], 10, ["onClick"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]--></div>`);
                } else {
                  return [
                    createVNode("div", { class: "py-1" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(availableFormats.value, (format) => {
                        return openBlock(), createBlock(unref(MenuItem), {
                          key: format.itag
                        }, {
                          default: withCtx(({ active }) => [
                            createVNode("button", {
                              onClick: ($event) => selectedFormat.value = format,
                              class: [
                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                "block w-full text-left px-4 py-2 text-sm"
                              ]
                            }, [
                              createVNode("div", { class: "flex justify-between items-center" }, [
                                createVNode("span", null, toDisplayString(format.quality) + toDisplayString(format.fps ? ` ${format.fps}fps` : ""), 1),
                                createVNode("span", { class: "text-gray-500" }, toDisplayString(formatMimeType(format.mimeType)) + " - " + toDisplayString(formatFileSize(format.contentLength)), 1)
                              ])
                            ], 10, ["onClick"])
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "flex space-x-2" }, [
                createVNode(unref(MenuButton), {
                  class: "w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                  disabled: _ctx.isLoading
                }, {
                  default: withCtx(() => [
                    selectedFormat.value ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(selectedFormat.value.quality) + " - " + toDisplayString(formatMimeType(selectedFormat.value.mimeType)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "S\xE9lectionner la qualit\xE9")),
                    createVNode(unref(ChevronDownIcon), {
                      class: "ml-2 -mr-1 h-5 w-5",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                createVNode("button", {
                  onClick: ($event) => selectedFormat.value && handleDownload(selectedFormat.value),
                  class: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50",
                  disabled: !selectedFormat.value || _ctx.isLoading
                }, [
                  _ctx.isLoading ? (openBlock(), createBlock("span", { key: 0 }, "Chargement...")) : (openBlock(), createBlock("span", { key: 1 }, "T\xE9l\xE9charger"))
                ], 8, ["onClick", "disabled"])
              ]),
              createVNode(Transition, {
                "enter-active-class": "transition ease-out duration-100",
                "enter-from-class": "transform opacity-0 scale-95",
                "enter-to-class": "transform opacity-100 scale-100",
                "leave-active-class": "transition ease-in duration-75",
                "leave-from-class": "transform opacity-100 scale-100",
                "leave-to-class": "transform opacity-0 scale-95"
              }, {
                default: withCtx(() => [
                  createVNode(unref(MenuItems), { class: "origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto" }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "py-1" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(availableFormats.value, (format) => {
                          return openBlock(), createBlock(unref(MenuItem), {
                            key: format.itag
                          }, {
                            default: withCtx(({ active }) => [
                              createVNode("button", {
                                onClick: ($event) => selectedFormat.value = format,
                                class: [
                                  active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                  "block w-full text-left px-4 py-2 text-sm"
                                ]
                              }, [
                                createVNode("div", { class: "flex justify-between items-center" }, [
                                  createVNode("span", null, toDisplayString(format.quality) + toDisplayString(format.fps ? ` ${format.fps}fps` : ""), 1),
                                  createVNode("span", { class: "text-gray-500" }, toDisplayString(formatMimeType(format.mimeType)) + " - " + toDisplayString(formatFileSize(format.contentLength)), 1)
                                ])
                              ], 10, ["onClick"])
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/youtube/DownloadButton.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const video = ref(null);
    const isLoading = ref(false);
    const { showSuccess, showError } = useNotifications();
    const handleUrlSubmit = async (url) => {
      try {
        isLoading.value = true;
        const response = await $fetch("/api/youtube/validate", {
          method: "POST",
          body: { url }
        });
        video.value = response;
        showSuccess("Vid\xE9o charg\xE9e avec succ\xE8s");
      } catch (e) {
        showError(e.message || "Erreur lors du chargement de la vid\xE9o");
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    };
    const handleDownload = async (format) => {
      if (!video.value) return;
      try {
        isLoading.value = true;
        const response = await $fetch("/api/youtube/download", {
          method: "GET",
          params: {
            url: video.value.url,
            itag: format.itag
          }
        });
        const link = (void 0).createElement("a");
        link.href = format.url;
        link.download = `${video.value.title || "video"}.${format.format}`;
        (void 0).body.appendChild(link);
        link.click();
        (void 0).body.removeChild(link);
        showSuccess("T\xE9l\xE9chargement d\xE9marr\xE9");
      } catch (e) {
        showError(e.message || "Erreur lors du t\xE9l\xE9chargement de la vid\xE9o");
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto px-4 py-8" }, _attrs))}><div class="text-center mb-12"><h1 class="text-4xl font-bold text-gray-900 mb-4"> YouTube Downloader </h1><p class="text-lg text-gray-600"> T\xE9l\xE9chargez vos vid\xE9os YouTube pr\xE9f\xE9r\xE9es facilement </p></div><div class="max-w-2xl mx-auto">`);
      _push(ssrRenderComponent(_sfc_main$3, {
        onSubmit: handleUrlSubmit,
        disabled: isLoading.value
      }, null, _parent));
      _push(`</div>`);
      if (video.value) {
        _push(`<div class="mt-8 max-w-2xl mx-auto">`);
        _push(ssrRenderComponent(_sfc_main$2, {
          "video-id": video.value.videoId,
          thumbnail: video.value.thumbnail,
          title: video.value.title,
          author: video.value.author,
          duration: video.value.duration
        }, null, _parent));
        _push(ssrRenderComponent(_sfc_main$1, {
          video: video.value,
          "is-loading": isLoading.value,
          onDownload: handleDownload
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-ma7CSAPT.mjs.map
