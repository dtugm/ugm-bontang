<script setup>
import { ref, onMounted } from "vue";
import L from "leaflet";
import SurveyLapanganConstant from "~/app/constant/SurveyLapangan.constant";
const statusMap = SurveyLapanganConstant.statusMap;
const statusColorMap = SurveyLapanganConstant.statusColorMap;
const ownerTypeMap = SurveyLapanganConstant.ownerTypeMap;
const surveyStore = useSurveyStore();
const latitude = 0.139267;
const longitude = 117.494326;
const zoomLevel = 16;

const totalPolygons = ref(0); // Total bidang dalam GeoJSON
const surveyedCount = ref(0); // Bidang yang sudah disurvei
const progress = ref(0); // Persentase progress

onMounted(async () => {
  const map = L.map("map").setView([latitude, longitude], zoomLevel);
  const osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap contributors",
    }
  ).addTo(map);
  const awsTiles = L.tileLayer(
    "https://basemap-ortho.s3.ap-southeast-2.amazonaws.com/bontang-ortho-tiles/{z}/{x}/{y}.png",
    {
      tms: true,
      minZoom: 12,
      maxZoom: 19,
    }
  ).addTo(map);

  // Fetch Data GeoJSON
  const geoJsonBontangBaru = await fetch(
    "/SurveyPbb/peta_kerja_bontang_baru.geojson"
  );
  const bidangBontangBaru = await geoJsonBontangBaru.json();

  totalPolygons.value = bidangBontangBaru.features.length;

  if (surveyStore.bidang_bontang_baru.length === 0) {
    // await surveyStore.getAllDoneBidangTanah();
  }
  await surveyStore.getAllUpdatedFeature();
  console.log(surveyStore.bidangTanahData);
  // Hitung jumlah bidang yang sudah disurvei
  surveyedCount.value = surveyStore.bidangTanahData.filter(
    (item) => item.status === "ACCURATE"
  ).length;
  progress.value = (surveyedCount.value / totalPolygons.value) * 100; // Kalkulasi progress

  // Fungsi Style GeoJSON
  const getStyle = (feature) => {
    const fid = feature?.properties?.FID;
    const isSurveyed = surveyStore.bidangTanahData.some(
      (item) => item.fid === String(fid) && item.status === "ACCURATE"
    );
    return {
      fillColor: isSurveyed ? "green" : "rgba(139, 146, 152, 1)",
      weight: 1,
      color: "white",
      fillOpacity: isSurveyed ? 1 : 0.5,
    };
  };

  // Event GeoJSON
  const onEachFeature = (feature, layer) => {
    const fid = feature?.properties?.FID;
    const isSurveyed = surveyStore.bidangTanahData.some(
      (item) => item.fid === String(fid) && item.status === "ACCURATE"
    );
    const dataItem = surveyStore.bidangTanahData.find(
      (item) => item.fid == feature.properties.fid
    );

    layer.on({
      mouseover: (e) => e.target.setStyle({ weight: 5, color: "yellow" }),
      mouseout: (e) => e.target.setStyle({ weight: 1, color: "white" }),
    });
    layer.on("click", () => {
      const itemMap = new Map(
        surveyStore.bidangTanahData.map((item) => [item.fid, item])
      );
      console.log(itemMap);
      console.log(feature.properties.FID);
      const detailItem = itemMap.get(String(feature.properties.FID));
      console.log(detailItem);
      if (detailItem) {
        const popupContent = `
                <div style="font-family: Arial, sans-serif; width:400px max-width: 400px;">

            <p><strong>Provinsi:</strong> ${detailItem.province}</p>
                        <p><strong>Tipe Bidang Tanah:</strong> ${
                          ownerTypeMap[detailItem.ownerType]
                        }</p>
            <p><strong>Alamat OP:</strong> ${detailItem.taxObjectAddress}</p>
            <p><strong>Nama WP:</strong> ${detailItem.taxPayerName}</p>
            <p><strong>Status:</strong> <span style='color: ${
              statusColorMap[detailItem.status]
            };'>${statusMap[detailItem.status]}</span></p>
              <p><strong>Polygon ID  :</strong> ${detailItem.polygonId}</p>
              <img src="${detailItem.imageUrls}" 
      style="max-width: 250px; height: auto; display: block; margin: 10px auto; border-radius: 5px;" />
              </div>
          `;
        layer.bindPopup(popupContent, { maxWidth: 700 }).openPopup();
      } else {
        layer
          .bindPopup(
            `
            <div style="font-family: Arial, sans-serif; width:400px max-width: 400px;">
              <p><strong>Status:</strong> <span style='color: red;'>Belum Disurvey</span></p>
              <p><strong>Polygon ID  :</strong> ${feature.properties.ID}</p>
            </div>
            `
          )
          .openPopup();
      }
      console.log("first");
    });
  };

  const geoJsonLayer = L.geoJSON(bidangBontangBaru, {
    style: getStyle,
    onEachFeature: onEachFeature,
  }).addTo(map);

  const baseMaps = { OpenStreetMap: osm };
  const overlayMaps = {
    "AWS Tiles": awsTiles,
    "Bidang Bontang Baru": geoJsonLayer,
  };

  L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);
});
</script>

<template>
  <div class="map-container">
    <!-- Peta -->
    <div id="map" class="map"></div>

    <div class="progress-container">
      <div class="text-left mb-2">
        <p class="text-lg font-semibold">Progres Bontang Baru</p>
        <p class="">
          Selesai {{ surveyedCount }} dari
          {{ totalPolygons }}
        </p>
      </div>
      <v-progress-circular
        :model-value="progress"
        :size="140"
        :width="20"
        color="success"
      >
        {{ Math.round(progress) }}%
      </v-progress-circular>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map {
  height: 100%;
  width: 100%;
}

.progress-circle {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 5px;
  z-index: 999;
}

.progress-container {
  z-index: 999;
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
}

.progress-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}
</style>
