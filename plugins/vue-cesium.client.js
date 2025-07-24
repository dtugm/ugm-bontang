import { defineNuxtPlugin } from "#app";
import VueCesium from "vue-cesium";
import "vue-cesium/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueCesium, {
    cesiumPath: "/cesium/Cesium.js",
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzYTQ1MjMyZi02ZDhhLTQwMTgtODBiNy04NDM2MzJkNTE2NWIiLCJpZCI6MjkzOTI5LCJpYXQiOjE3NDQ2MjcyMzJ9.TPQf3RDEt0kzUPtca7yOyZ7RmRTtAXxXZRdsBgGWOM0",
  });
});
