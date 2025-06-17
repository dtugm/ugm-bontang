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
      // baseLayerPicker: false,
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
  const applyFilter = (tileset: any, idArray: any) => {
    tileset.tileVisible.addEventListener(function (tile: any) {
      const content = tile.content;
      const featuresLength = content.featuresLength;

      for (let i = 0; i < featuresLength; i++) {
        const feature = content.getFeature(i);
        const featureId = feature.getProperty("gml:id");

        feature.show = idArray.includes(featureId);
      }
    });

    viewer.value.scene.requestRender();
  };
  const filterAllTilesets = (idArray: any) => {
    tilesets.value.forEach((t) => {
      applyFilter(t.instance, idArray);
    });
  };
  const resetAllTilesets = () => {
    tilesets.value.forEach((t) => {
      t.instance.tileVisible.addEventListener(function (tile: any) {
        const content = tile.content;
        const featuresLength = content.featuresLength;

        for (let i = 0; i < featuresLength; i++) {
          const feature = content.getFeature(i);
          feature.show = true; // Tampilkan semua fitur
        }
      });
    });

    viewer.value.scene.requestRender();
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
  const propertiesModal = ref(false);
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
        propertiesModal.value = true;
        selectedFeature = pickedFeature;
        pickedFeature.color = Cesium.Color.RED.withAlpha(0.2);
        if (Cesium.defined(highlightedFeature)) {
          highlightedFeature.color = originalHoverColor;
          highlightedFeature = null;
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  const selectedProperties = ref<Record<string, any>>({});
  function enableClickGetProperties(viewer: any, Cesium: any) {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((movement: any) => {
      const pickedFeature = viewer.scene.pick(movement.position);

      if (
        Cesium.defined(pickedFeature) &&
        pickedFeature instanceof Cesium.Cesium3DTileFeature
      ) {
        const propertyIds = pickedFeature.getPropertyIds();
        console.log(propertyIds);
        // const propertyNames = pickedFeature.getProperty();
        const properties: Record<string, any> = {};
        propertyIds.forEach((id: string) => {
          properties[id] = pickedFeature.getProperty(id);
        });
        selectedProperties.value = properties;
        // propertyNames.forEach((name: any) => {
        //   properties[name] = pickedFeature.getProperty(name);
        // });

        console.log("Properties:", properties);
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
  const kelurahanName = [
    { nama: "API-API", lng: 117.490042, lat: 0.130865 },
    { nama: "BELIMBING", lng: 117.458959, lat: 0.153366 },
    { nama: "BERBAS PANTAI", lng: 117.484344, lat: 0.109969 },
    { nama: "BEREBAS TENGAH", lng: 117.479219, lat: 0.116115 },
    { nama: "BONTANG BARU", lng: 117.493761, lat: 0.144252 },
    { nama: "BONTANG KUALA", lng: 117.508149, lat: 0.133507 },
    { nama: "BONTANG LESTARI", lng: 117.442044, lat: 0.055355 },
    { nama: "SATIMPO", lng: 117.461529, lat: 0.10714 },
    { nama: "KANAAN", lng: 117.445876, lat: 0.123544 },
    { nama: "LOKTUAN", lng: 117.47457, lat: 0.164665 },
    { nama: "TANJUNG LAUT", lng: 117.485008, lat: 0.123059 },
    { nama: "GUNTUNG", lng: 117.487831, lat: 0.188374 },
    { nama: "GUNUNG ELAI", lng: 117.478848, lat: 0.143068 },
    { nama: "GUNUNG TELIHAN", lng: 117.452148, lat: 0.136698 },
    { nama: "TANJUNG LAUT INDAH", lng: 117.495981, lat: 0.117112 },
  ];
  const addPin = () => {
    kelurahanName.forEach((item) => {
      const posisi = $Cesium.Cartesian3.fromDegrees(item.lng, item.lat, 100); // label agak melayang
      const posisiTanah = $Cesium.Cartesian3.fromDegrees(item.lng, item.lat, 0); // titik di tanah
      viewer.value.entities.add({
        position: posisi,
        label: {
          text: item.nama,
          font: "20px sans-serif",
          fillColor: $Cesium.Color.BLACK,
          outlineColor: $Cesium.Color.WHITE,
          outlineWidth: 5,
          style: $Cesium.LabelStyle.FILL_AND_OUTLINE,
          // heightReference: $Cesium.HeightReference.CLAMP_TO_GROUND,
          verticalOrigin: $Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new $Cesium.Cartesian2(0, -10),
        },
      });
      viewer.value.entities.add({
        polyline: {
          positions: [posisi, posisiTanah],
          width: 2,
          material: $Cesium.Color.WHITE.withAlpha(1),
          clampToGround: false,
        },
      });
      viewer.value.entities.add({
        position: posisi,
        point: {
          pixelSize: 10,
          color: $Cesium.Color.RED,
          outlineColor: $Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: $Cesium.HeightReference.NONE,
        },
      });
    });
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
    showAll,
    hideAll,
    filterAllTilesets,
    resetAllTilesets,
    setTerrain,

    //Effek 3D
    enableHoverHighlight,
    enableClickSelection,
    enableSingleClickSelection,
    enableClickGetProperties,

    selectedProperties,
    propertiesModal,
    addPin,
  };
}
