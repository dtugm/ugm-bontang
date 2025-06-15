// composables/useCesiumViewer.ts
import { ref } from "vue";

export function useCesiumViewer() {
  let viewer = ref<any>(null);
  const layers: Record<string, any> = {};
  let xyzLayer: any = null;
  const createViewer = async (
    containerId: string,
    Cesium: any,
    options = {}
  ) => {
    viewer.value = new Cesium.Viewer(containerId, {
      baseLayerPicker: false,
      shadows: false,
      navigationInstructionsInitiallyVisible: false,
      timeline: false,
      sceneModePicker: false,
      homeButton: false,
      navigationHelpButton: false,
      vrButton: false,
      clock: false,
      animation: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      geocoder: false,
      creditContainer: document.createElement("div"),
      // terrainProvider,
      ...options,
    });
    return viewer.value;
  };

  const flyToLocation = (
    Cesium: any,
    longitude: number,
    latitude: number,
    height: number = 5000
  ) => {
    if (viewer.value) {
      viewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
      });
    }
  };
  const init = (cesiumViewer: any) => {
    viewer = cesiumViewer;
  };
  const addBaseLayers = ($Cesium: any) => {
    if (!viewer) return;

    layers.osm = viewer.value.imageryLayers.addImageryProvider(
      new $Cesium.OpenStreetMapImageryProvider({
        url: "https://a.tile.openstreetmap.org/",
      })
    );

    layers.carto = viewer.value.imageryLayers.addImageryProvider(
      new $Cesium.UrlTemplateImageryProvider({
        url: "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        credit: "CartoDB",
      })
    );
  };
  const toggleLayer = (name: string, visible: boolean) => {
    if (layers[name]) {
      layers[name].show = visible;
    }
  };
  const addXYZLayer = async ($Cesium: any, url: string) => {
    if (!viewer) return;

    xyzLayer = await viewer.value.imageryLayers.addImageryProvider(
      new $Cesium.UrlTemplateImageryProvider({
        url,
        tilingScheme: new $Cesium.WebMercatorTilingScheme(),
        maximumLevel: 19,
      })
    );
  };
  const toggleXYZLayer = (visible: boolean) => {
    if (xyzLayer) {
      xyzLayer.show = visible;
    }
  };

  const addTileset = async (url: string, Cesium: any) => {
    if (viewer.value) {
      const tileset = await Cesium.Cesium3DTileset.fromUrl(url, {
        maximumScreenSpaceError: 64,
      });
      viewer.value.scene.primitives.add(tileset);
    }
  };

  const setTerrain = async (Cesium: any) => {
    const terrainProvider = await viewer.value.scene.setTerrain(
      new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromIonAssetId(3338372))
    );
    viewer.value.scene.globe.depthTestAgainstTerrain = true;
    await terrainProvider.readyPromise;
  };

  return {
    viewer,
    createViewer,
    flyToLocation,

    // 2D
    init,
    addBaseLayers,
    toggleLayer,
    addXYZLayer,
    toggleXYZLayer,

    //3D
    addTileset,

    setTerrain,
  };
}
