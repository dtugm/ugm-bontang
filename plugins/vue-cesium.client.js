import { defineNuxtPlugin } from "#app";
import VueCesium from "vue-cesium";
import "vue-cesium/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueCesium, {
    cesiumPath: "/cesium/Cesium.js",
    accessToken: useRuntimeConfig().public.CESIUM_TOKEN_FK,
    locale: "en",
  });
});
