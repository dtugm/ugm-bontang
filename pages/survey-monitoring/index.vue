<template>
  <div class="relative w-full h-screen">
    <div class="map-container">
      <div id="map" class="map"></div>
    </div>
    <div class="overlay-component">
      <AppCardLeafletDetail
        v-if="showCard"
        @close="showCard = false"
        :title="'Detail'"
        :value="selectedFeature"
        @toggle-picture="getPicture"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SurveyLapanganConstant from "~/app/constant/SurveyLapangan.constant";
import L, { Layer, Path } from "leaflet";
const showCard = ref(false);

const JENIS_TNH: any = SurveyLapanganConstant.JENIS_TNH;
const KODE_WWC: any = SurveyLapanganConstant.statusMapAngkaColor;
const JENIS_BGN = SurveyLapanganConstant.JENIS_BGN;
const surveyDataStore = useSurveyDataStore();
const selectedFeature = ref({});
const finalSelectedFeature = computed(() => {
  // Cek apakah selectedDetail adalah object kosong
  return isEmptyObject(surveyDataStore.selectedData)
    ? selectedFeature
    : surveyDataStore.selectedData;
});
const latitude = 0.139267;
const longitude = 117.494326;
const zoomLevel = 16;
onMounted(async () => {
  surveyDataStore.leafletMap.initializeMap(
    "map",
    latitude,
    longitude,
    zoomLevel
  );
  surveyDataStore.leafletMap.addTileLayer(
    "https://basemap-ortho.s3.ap-southeast-2.amazonaws.com/bontang-ortho-tiles/{z}/{x}/{y}.png",
    "Ortho AWS S3",
    19,
    { tms: true, minZoom: 12 }
  );

  await surveyDataStore.getDataVectorPersil().then(() => {
    surveyDataStore.dataVectorPersil.map((item: any) => {
      surveyDataStore.leafletMap.loadGeoJsonFromUrl(item.name, item.url, {
        style: getApiApiStyle,
        onEachFeature: onEachFeatureHandler,
      });
    });
  });
  surveyDataStore.getDataVectorBangunan().then(() => {
    surveyDataStore.dataVectorBangunan.map((item: any) => {
      surveyDataStore.leafletMap.loadGeoJsonFromUrl(item.name, item.url, {
        style: getBuildingStyle,
        onEachFeature: onEachFeatureHandler,
      });
    });
  });
});
// onUnmounted(() => {
//   surveyDataStore.leafletMap.destroyMap();
// });
const getApiApiStyle = (feature: any) => {
  const tanah = feature.properties?.JENIS_TNH;
  const kode = feature.properties?.KODE_WWC;
  let fillColor = "rgba(139, 146, 152, 1)"; // default

  if (tanah && JENIS_TNH[tanah]) {
    fillColor = JENIS_TNH[tanah];
  } else if (kode && KODE_WWC[kode]) {
    fillColor = KODE_WWC[kode];
  }
  return {
    fillColor: fillColor,
    weight: 1,
    color: "white",
    fillOpacity: tanah ? 0.7 : 0.5,
  };
};
const getBuildingStyle = (feature: any) => {
  const tanah = feature.properties?.JENIS_TNH;
  const kode = feature.properties?.KODE_WWC;
  let fillColor = "rgba(139, 146, 152, 1)"; // default

  if (tanah && JENIS_TNH[tanah]) {
    fillColor = JENIS_TNH[tanah];
  } else if (kode && KODE_WWC[kode]) {
    fillColor = KODE_WWC[kode];
  }
  return {
    fillColor: fillColor,
    weight: 1,
    color: "yellow",
    fillOpacity: tanah ? 0.7 : 0.5,
  };
};

const highlightFeature = (e: L.LeafletMouseEvent) => {
  const layer = e.target;
  // Jangan highlight kalau ini layer yang sedang terpilih
  if (layer === selectedLayer.value) return;
  layer.setStyle({
    weight: 3,
    color: "#666",
    fillOpacity: 0.9,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
};

const resetHighlight = (e: L.LeafletMouseEvent, defaultStyle: any) => {
  const layer = e.target;
  // Jangan reset kalau ini layer yang sedang terpilih
  if (layer === selectedLayer.value) return;
  layer.setStyle(defaultStyle);
};
const selectedLayer = ref<L.Path | null>(null);
const selectedStyle = ref<any>(null);
const onEachFeatureHandler = (feature: any, layer: L.Layer) => {
  if (layer instanceof L.Path) {
    const defaultStyle = getApiApiStyle(feature);

    layer.on({
      mouseover: (e) => highlightFeature(e),
      mouseout: (e) => resetHighlight(e, defaultStyle),
      click: (e) => {
        if (selectedLayer.value && selectedLayer.value !== layer) {
          selectedLayer.value.setStyle(selectedStyle.value);
        }
        layer.setStyle({
          weight: 3,
          color: "red",
          fillOpacity: 1,
        });
        selectedLayer.value = layer;
        selectedStyle.value = defaultStyle;
        selectedFeature.value = feature.properties;
        console.log("Clicked feature:", feature.properties);
        openDetail(feature.properties.UUID || feature.properties.UUID_BGN);
      },
    });
  }
};
const getPicture = () => {
  console.log("first");
};
const openDetail = (id: any) => {
  surveyDataStore.getDataDetail(id);
  showCard.value = true;
};
function isEmptyObject(obj: any) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh; /* Buat peta memenuhi layar */
}

.map {
  width: 100%;
  height: 100%;
}
.overlay-component {
  z-index: 999;
  position: absolute;
  bottom: 20px;
  right: 20px;
  /* background: rgba(255, 255, 255, 0.9); */
  /* border-radius: 10px; */
  /* padding: 10px; */
  text-align: start;
  /* box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2); */
}
</style>
