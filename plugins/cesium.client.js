// plugins/cesium.client.ts
import { defineNuxtPlugin } from "#app";
import * as Cesium from "cesium";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("Cesium", Cesium);
});
