// types/cesium.d.ts
import * as Cesium from "cesium";

declare module "#app" {
  interface NuxtApp {
    $Cesium: typeof Cesium;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $Cesium: typeof Cesium;
  }
}
