<script setup>
import maplibregl from "maplibre-gl";
import { onMounted, ref } from "vue";
import landParcelConstant from "~/app/constant/landParcel.constant";

// State untuk toggle layers
const layerPanelExpanded = ref(true);
const showCustomRaster = ref(true);
const showBuildings = ref(true);
const showPersil = ref(true);

let map = null;

onMounted(() => {
  map = new maplibregl.Map({
    container: "map",
    style: {
      version: 8,
      sources: {
        "arcgis-imagery": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "© Esri",
        },
        "custom-raster": {
          type: "raster",
          tiles: [
            "https://digital-twin-ugm.s3.ap-southeast-1.amazonaws.com/orthoBontangFull/{z}/{x}/{y}.png",
          ],
          tileSize: 256,
          scheme: "tms",
          attribution: "© Your Attribution",
        },
      },
      layers: [
        {
          id: "arcgis-imagery-layer",
          type: "raster",
          source: "arcgis-imagery",
          minzoom: 0,
          maxzoom: 22,
        },
        {
          id: "custom-raster-layer",
          type: "raster",
          source: "custom-raster",
          minzoom: 0,
          maxzoom: 22,
        },
      ],
    },
    center: [117.494326, 0.139267],
    zoom: 13,
  });

  map.addControl(new maplibregl.NavigationControl(), "top-right");

  new maplibregl.Marker()
    .setLngLat([106.8456, -6.2088])
    .setPopup(new maplibregl.Popup().setHTML("<h3>Jakarta</h3>"))
    .addTo(map);

  // Tambahkan vector layers setelah map loaded
  map.on("load", () => {
    // Add Building Outline Source & Layer dari AWS S3
    map.addSource("buildings", {
      type: "geojson",
      data: "/vectors/WGS_Bangunan_Bontang.geojson",
    });

    map.addLayer({
      id: "building-outline",
      type: "line",
      source: "buildings",
      paint: {
        "line-color": "#FF5722",
        "line-width": 2,
        "line-opacity": 0.8,
      },
    });

    map.addLayer(
      {
        id: "building-fill",
        type: "fill",
        source: "buildings",
        paint: {
          "fill-color": "#FF5722",
          "fill-opacity": 0.3,
        },
      },
      "building-outline"
    );

    // Add Persil Source & Layer dari AWS S3
    map.addSource("persil", {
      type: "geojson",
      data: "https://digital-twin-ugm.s3.ap-southeast-1.amazonaws.com/vectors/WGS_Persil_Bontang.geojson",
    });

    map.addLayer({
      id: "persil-outline",
      type: "line",
      source: "persil",
      paint: {
        "line-color": "#4CAF50",
        "line-width": 1.5,
        "line-opacity": 0.8,
        "line-dasharray": [2, 2],
      },
    });

    map.addLayer(
      {
        id: "persil-fill",
        type: "fill",
        source: "persil",
        paint: {
          "fill-color": "#4CAF50",
          "fill-opacity": 0.2,
        },
      },
      "persil-outline"
    );

    // Tambahkan interaksi hover untuk building
    map.on("mouseenter", "building-outline", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "building-outline", () => {
      map.getCanvas().style.cursor = "";
    });

    // Tambahkan interaksi hover untuk persil
    map.on("mouseenter", "persil-outline", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "persil-outline", () => {
      map.getCanvas().style.cursor = "";
    });

    // Tambahkan popup saat klik building
    map.on("click", "building-outline", (e) => {
      const properties = e.features[0].properties;
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `
          <h3>Building Info</h3>
          <p>${Object.entries(properties)
            .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
            .join("<br>")}</p>
        `
        )
        .addTo(map);
    });

    // Tambahkan popup saat klik persil
    map.on("click", "persil-outline", (e) => {
      const properties = e.features[0].properties;
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `
          <h3>Persil Info</h3>
          <p>${Object.entries(properties)
            .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
            .join("<br>")}</p>
        `
        )
        .addTo(map);
    });

    // Error handling untuk loading GeoJSON
    map.on("error", (e) => {
      console.error("Map error:", e.error);
    });

    map.on("sourcedata", (e) => {
      if (e.sourceId === "buildings" && e.isSourceLoaded) {
        console.log("Buildings GeoJSON loaded successfully");
      }
      if (e.sourceId === "persil" && e.isSourceLoaded) {
        console.log("Persil GeoJSON loaded successfully");
      }
    });
  });
});

// Functions untuk toggle layers
const toggleCustomRaster = () => {
  if (map) {
    const visibility = showCustomRaster.value ? "visible" : "none";
    map.setLayoutProperty("custom-raster-layer", "visibility", visibility);
  }
};

const toggleBuildings = () => {
  if (map) {
    const visibility = showBuildings.value ? "visible" : "none";
    map.setLayoutProperty("building-outline", "visibility", visibility);
    map.setLayoutProperty("building-fill", "visibility", visibility);
  }
};

const togglePersil = () => {
  if (map) {
    const visibility = showPersil.value ? "visible" : "none";
    map.setLayoutProperty("persil-outline", "visibility", visibility);
    map.setLayoutProperty("persil-fill", "visibility", visibility);
  }
};

const BontangBaru = ref([
  {
    title: "Bidang Tanah Bontang Baru",
    total: landParcelConstant.actual.bidang.boba,
    from: landParcelConstant.target.bidang.boba,
    unit: "Feature",
  },
  {
    title: "Bangunan Bontang Baru",
    total: landParcelConstant.actual.bangunan.boba,
    from: landParcelConstant.target.bangunan.boba,
    unit: "Feature",
  },
]);

const Loktuan = ref([
  {
    title: "Bidang Tanah Loktuan",
    total: landParcelConstant.actual.bidang.loktuan,
    from: landParcelConstant.target.bidang.loktuan,
    unit: "Feature",
  },
  {
    title: "Bangunan Loktuan",
    total: landParcelConstant.actual.bangunan.loktuan,
    from: landParcelConstant.target.bangunan.loktuan,
    unit: "Feature",
  },
]);

const ApiApi = computed(() => [
  {
    title: "Bidang Tanah Api Api",
    total: landParcelConstant.actual.bidang.apiapi,
    from: landParcelConstant.target.bidang.apiapi,
    unit: "Feature",
  },
  {
    title: "Bangunan Api Api",
    total: landParcelConstant.actual.bangunan.apiapi,
    from: landParcelConstant.target.bangunan.apiapi,
    unit: "Feature",
  },
]);
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="9">
        <div class="position-relative">
          <div
            id="map"
            style="height: 600px; width: 100%"
            class="rounded"
          ></div>

          <!-- Layer Control Panel -->
          <v-card
            class="position-absolute layer-control"
            style="top: 10px; left: 10px; z-index: 1000; min-width: 180px"
            elevation="2"
          >
            <v-card-title
              class="text-caption py-1 px-3 d-flex align-center justify-space-between"
              style="cursor: pointer"
              @click="layerPanelExpanded = !layerPanelExpanded"
            >
              <div class="d-flex align-center">
                <v-icon size="small" class="mr-1">mdi-layers</v-icon>
                <span style="font-size: 0.75rem">Layers</span>
              </div>
              <v-icon size="small">
                {{ layerPanelExpanded ? "mdi-chevron-up" : "mdi-chevron-down" }}
              </v-icon>
            </v-card-title>

            <v-divider></v-divider>

            <v-expand-transition>
              <v-card-text v-show="layerPanelExpanded" class="py-1 px-3">
                <v-switch
                  v-model="showCustomRaster"
                  @change="toggleCustomRaster"
                  label="Custom Raster"
                  color="tertiary"
                  density="compact"
                  hide-details
                  class="mb-1"
                >
                  <template v-slot:label>
                    <span style="font-size: 0.75rem">Custom Raster</span>
                  </template>
                </v-switch>

                <v-switch
                  v-model="showBuildings"
                  @change="toggleBuildings"
                  label="Buildings"
                  color="tertiary"
                  density="compact"
                  hide-details
                  class="mb-1"
                >
                  <template v-slot:label>
                    <span style="font-size: 0.75rem">Buildings</span>
                  </template>
                </v-switch>

                <v-switch
                  v-model="showPersil"
                  @change="togglePersil"
                  label="Persil"
                  color="tertiary"
                  density="compact"
                  hide-details
                >
                  <template v-slot:label>
                    <span style="font-size: 0.75rem">Persil</span>
                  </template>
                </v-switch>
              </v-card-text>
            </v-expand-transition>
          </v-card>
        </div>

        <v-row class="mt-4">
          <v-col cols="12">
            <div class="flex gap-4">
              <AppCardSimpleProgress
                class="flex-1"
                title="Pelaksanaan Survey PBB"
                :total="13687"
                :from="13105"
                unit="Features"
                icon="mdi-earth"
                color="success"
              />
              <AppCardSimpleProgress
                class="flex-1"
                title="Pembuatan Peta Garis"
                :total="514"
                :from="514"
                unit="Grid"
                icon="mdi-map"
                color="tertiary"
              />
            </div>
          </v-col>
          <v-col cols="12">
            <div class="flex gap-4">
              <AppCardSimpleProgress
                class="flex-1"
                title="Pembuatan 3D Models LOD 1"
                :total="499"
                :from="499"
                unit="RT"
                icon="mdi-cube-outline"
                color="secondary"
              />
              <AppCardSimpleProgress
                class="flex-1"
                title="Pembuatan 3D Models LOD 2"
                :total="499"
                :from="499"
                unit="RT"
                icon="mdi-cube-outline"
                color="secondary"
              />
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="flex flex-col gap-4">
        <AppCardGabunganProgress
          color="tertiary"
          :items="BontangBaru"
          class="flex-1"
        />
        <AppCardGabunganProgress
          color="secondary"
          :items="ApiApi"
          class="flex-1"
        />
        <AppCardGabunganProgress
          color="success"
          :items="Loktuan"
          class="flex-1"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
@import "maplibre-gl/dist/maplibre-gl.css";

.layer-control {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95) !important;
}
.layer-control {
  backdrop-filter: blur(12px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.7) !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
}

.layer-control .v-card-title {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.layer-control .v-switch {
  transform: scale(0.85);
  transform-origin: left;
}
</style>
