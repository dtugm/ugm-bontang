<template>
  <AppViewerRelative>
    <div class="absolute top-1 left-5 z-10 mt-4">
      <SolarLegend class="mb-1" />
    </div>

    <div class="absolute bottom-2/3 left-4 z-10 mt-4">
      <AppButtonMenu icon="mdi-solar-panel" class="mt-1">
        <SolarAnalyze @finish="onAnalyzeFinish()" @reset="resetTileset()" />
      </AppButtonMenu>
    </div>
    <div class="absolute bottom-0 right-0 z-10 mt-4">
      <SolarDetail :data="solarData" :keys="detailKeys" />
      <div v-if="showSummary" @click.self="closeSummary">
        <SolarSummary :data="summarySolar" @close="closeSummary" />
      </div>
    </div>
    <vc-viewer
      ref="viewerRef"
      :show-credit="false"
      :infoBox="true"
      :shadows="false"
      @ready="onViewerReady"
    >
      <vc-primitive-tileset
        ref="tilesetRef"
        @ready="onReady"
        enableMouseEvent
        url="https://dt-ugm-api.s3.ap-southeast-2.amazonaws.com/7e1c700f-d8bf-4cfd-8bfd-862bac01f9f3/solar_panels/tileset.json"
      />
      <vc-datasource-geojson
        ref="solarCostPrime"
        data="/solar/solar_cost_savings_prime.geojson"
        stroke="red"
      ></vc-datasource-geojson>
      <vc-datasource-geojson
        ref="datasourceRef"
        data="/new_bontang.geojson"
        :clampToGround="false"
        stroke="red"
        fill="transparent"
        :strokeWidth="10"
      ></vc-datasource-geojson>
      <vc-layer-imagery>
        <vc-imagery-provider-osm />
      </vc-layer-imagery>
    </vc-viewer>
  </AppViewerRelative>
</template>
<script setup lang="ts">
import * as Cesium from "cesium";
import summarySolar from "~/app/json/solar_cost_savings_summary.json";

definePageMeta({
  layout: "viewer",
});
const tilesetRef: any = ref(null);
const viewerRef: any = ref(null);
const showSummary = ref(false);
const closeSummary = () => {
  showSummary.value = false;
};
const onReady = ({ cesiumObject: tileset, viewer }: any) => {
  tilesetRef.value = tileset;
  viewer.zoomTo(tileset);
};
let highlightedFeature: any = null;
let originalHoverColor: any = null;
let selectedFeature: any = null;
const onViewerReady = ({ Cesium, viewer, vm }: any) => {
  viewerRef.value = viewer;
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
      pickedFeature.color = Cesium.Color.YELLOW;
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
  handler.setInputAction(async (movement: any) => {
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
        selectedFeature.color = Cesium.Color.WHITE.withAlpha(1.0);
      }
      selectedFeature = pickedFeature;
      pickedFeature.color = Cesium.Color.BLUE;
      if (Cesium.defined(highlightedFeature)) {
        highlightedFeature.color = originalHoverColor;
        highlightedFeature = null;
      }
      const gmlId = pickedFeature.getProperty("gml:id");
      const detail = await getAttributeFromGeoJson(
        "/solar/merged2.geojson",
        gmlId
      );
      console.log("detail ", detail);
      solarData.value = detail;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
const simulate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();
  const startTime = new Date(year, month, date, 6, 0, 0);
  const endTime = new Date(year, month, date, 18, 0, 0);
  const start = Cesium.JulianDate.fromDate(startTime);
  const stop = Cesium.JulianDate.fromDate(endTime);
  const clock = viewerRef.value.clock;
  clock.startTime = start.clone();
  clock.stopTime = stop.clone();
  clock.currentTime = start.clone();
  clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
  clock.multiplier = 3600;
  clock.shouldAnimate = true;
  const removeListener = viewerRef.value.clock.onTick.addEventListener(() => {
    if (Cesium.JulianDate.greaterThanOrEquals(clock.currentTime, stop)) {
      clock.shouldAnimate = false;
      clock.startTime = Cesium.JulianDate.fromDate(new Date());
      clock.stopTime = Cesium.JulianDate.addDays(
        clock.startTime,
        1,
        new Cesium.JulianDate()
      );
      clock.currentTime = Cesium.JulianDate.clone(clock.startTime);
      clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
      clock.multiplier = 1;
      clock.shouldAnimate = true;
      removeListener();
    }
  });
};
function filterTilesetColor(arr: any[], color: any) {
  const idsToShow = arr;

  tilesetRef.value.tileVisible.addEventListener(function (tile: any) {
    const content = tile.content;
    const featuresLength = content.featuresLength;

    for (let i = 0; i < featuresLength; i++) {
      const feature = content.getFeature(i);
      const featureId = feature.getProperty("gml:id");
      if (idsToShow.includes(featureId)) {
        feature.color = color;
      }
    }
  });
}
async function resetTileset() {
  await tilesetRef.value.tileVisible.addEventListener(function (tile: any) {
    const content = tile.content;
    const featuresLength = content.featuresLength;
    for (let i = 0; i < featuresLength; i++) {
      const feature = content.getFeature(i);
      feature.color = Cesium.Color.WHITE;
    }
  });
}

async function getAttributeFromGeoJson(geoJsonPath: any, id: string) {
  try {
    const response = await fetch(geoJsonPath);
    if (!response.ok) throw new Error("Failed to fetch GeoJSON");
    const geoJson = await response.json();
    console.log("test", geoJson.features[0].properties.obj_name);

    // Find feature with matching id in properties
    console.log(`${id}_gro`);
    const feature = geoJson.features.find(
      (f: any) => f.properties && f.properties.obj_name === `${id}_gro`
    );
    console.log(feature);
    // console.log(feature.properties);
    return feature ? feature.properties : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function filterGeojson(
  geoJsonPath: any,
  suitability_class: "Marginal" | "Prime" | "Suitable" | "Not Recommended"
) {
  try {
    const response = await fetch(geoJsonPath);
    if (!response.ok) throw new Error("Failed to fetch GeoJSON");
    const geoJson = await response.json();
    console.log(geoJson);

    const filteredObjNames = geoJson.features
      .filter(
        (f: any) =>
          f.properties && f.properties.suitability_class === suitability_class
      )
      .map((f: any) => {
        let objName = f.properties.obj_name;
        // Hapus suffix "_gro" jika ada
        if (objName && objName.endsWith("_gro")) {
          objName = objName.slice(0, -4); // Menghapus 4 karakter terakhir "_gro"
        }
        return objName;
      })
      .filter((name: string) => name);

    return filteredObjNames;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const solarData = ref({});
const detailKeys = [
  "suitability_class",
  "suitability_score",
  "safety_level",
  //   "safety_description",
  "installed_capacity_maximum_kw",
  "energy_potential_maximum_kwh_year",
  "R1_1300_maximum_net_annual_savings_rp",
  "R1_900_maximum_net_annual_savings_rp",
  "R2_maximum_net_annual_savings_rp",
];

const onAnalyzeFinish = async () => {
  const marginal = await filterGeojson("/solar/merged2.geojson", "Marginal");
  const prime = await filterGeojson("/solar/merged2.geojson", "Prime");
  const suitable = await filterGeojson("/solar/merged2.geojson", "Suitable");

  filterTilesetColor(marginal, Cesium.Color.YELLOW);
  filterTilesetColor(prime, Cesium.Color.GREEN);
  filterTilesetColor(suitable, Cesium.Color.GREENYELLOW);
  showSummary.value = true;
};
</script>
