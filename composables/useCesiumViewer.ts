// composables/useCesiumViewer.ts
import { ref } from "vue";

export function useCesiumViewer() {
  let viewer = ref<any>(null);
  const { $Cesium } = useNuxtApp();
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
    longitude: number | null,
    latitude: number | null,
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
  const tilesets = ref<any[]>([]);
  const addTileset = async (id: string, url: string, Cesium: any) => {
    if (viewer.value) {
      const tileset = await Cesium.Cesium3DTileset.fromUrl(url, {
        maximumScreenSpaceError: 64,
      });
      viewer.value.scene.primitives.add(tileset);
      tilesets.value.push({ id, instance: tileset, show: true });
    }
  };
  const showAll = () => {
    tilesets.value.forEach((t: any) => {
      t.show = true;
      t.instance.show = true;
    });
  };

  const hideAll = () => {
    tilesets.value.forEach((t: any) => {
      t.show = false;
      t.instance.show = false;
    });
  };

  const setTerrain = async (Cesium: any) => {
    const terrainProvider = await viewer.value.scene.setTerrain(
      new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromIonAssetId(3338372))
    );
    viewer.value.scene.globe.depthTestAgainstTerrain = true;
    await terrainProvider.readyPromise;
  };

  let highlightedFeature: any = null;
  let originalHoverColor: any = null;

  let selectedFeature: any = null;
  let originalSelectedColor: any = null;

  const selectedFeatures = ref<any[]>([]);

  function enableHoverHighlight(viewer: any, Cesium: any) {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((movement: any) => {
      const pickedFeature = viewer.scene.pick(movement.endPosition);

      if (
        Cesium.defined(pickedFeature) &&
        pickedFeature instanceof Cesium.Cesium3DTileFeature
      ) {
        if (selectedFeature === pickedFeature) return;

        if (
          Cesium.defined(highlightedFeature) &&
          highlightedFeature !== selectedFeature
        ) {
          highlightedFeature.color = originalHoverColor;
        }

        highlightedFeature = pickedFeature;
        originalHoverColor = Cesium.Color.clone(
          pickedFeature.color,
          new Cesium.Color()
        );

        pickedFeature.color = Cesium.Color.YELLOW.withAlpha(0.8);
      } else {
        if (
          Cesium.defined(highlightedFeature) &&
          highlightedFeature !== selectedFeature
        ) {
          highlightedFeature.color = originalHoverColor;
          highlightedFeature = null;
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  function enableSingleClickSelection(viewer: any, Cesium: any) {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((movement: any) => {
      const pickedFeature = viewer.scene.pick(movement.position);

      if (
        Cesium.defined(pickedFeature) &&
        pickedFeature instanceof Cesium.Cesium3DTileFeature
      ) {
        if (Cesium.defined(highlightedFeature)) {
          highlightedFeature.color = originalHoverColor;
          highlightedFeature = null;
        }
        if (Cesium.defined(selectedFeature)) {
          selectedFeature.color = Cesium.Color.WHITE.withAlpha(1.0); // Hardcode warna dasar
        }

        selectedFeature = pickedFeature;
        pickedFeature.color = Cesium.Color.RED.withAlpha(0.2);
        if (Cesium.defined(highlightedFeature)) {
          highlightedFeature.color = originalHoverColor;
          highlightedFeature = null;
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  function enableClickSelection(viewer: any, Cesium: any) {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((movement: any) => {
      const pickedFeature = viewer.scene.pick(movement.position);

      if (
        Cesium.defined(pickedFeature) &&
        pickedFeature instanceof Cesium.Cesium3DTileFeature
      ) {
        if (!selectedFeatures.value.includes(pickedFeature)) {
          // Tambahkan ke selected list
          selectedFeatures.value.push(pickedFeature);

          // Ganti warna selected
          pickedFeature.color = Cesium.Color.RED.withAlpha(0.8);
        } else {
          // Jika diklik ulang, hapus dari selected
          pickedFeature.color = Cesium.Color.WHITE.withAlpha(1.0); // Atau kembalikan ke warna asal
          selectedFeatures.value = selectedFeatures.value.filter(
            (f) => f !== pickedFeature
          );
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
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
    showAll,
    hideAll,

    setTerrain,

    //Effek 3D
    enableHoverHighlight,
    enableClickSelection,
    enableSingleClickSelection,
  };
}
