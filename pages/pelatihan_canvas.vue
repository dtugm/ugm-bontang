<template>
  <div class="w-screen h-screen relative">
    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="text-white text-lg font-semibold animate-pulse">
        Loading map data...
      </div>
    </div>

    <!-- Map Container -->
    <div ref="mapContainer" class="w-full h-full" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import vectorsApi from "~/app/api/vectors.api";
import {
  staWpopMap,
  jenisTanahMap,
  wwcMap,
  wpMap,
  op1Map,
  op2Map,
  labelJenisTanahMap,
} from "~/app/constant/mapping/inputLandParcel";

definePageMeta({
  layout: "map",
});
const mapContainer = ref<HTMLDivElement | null>(null);
const vectorsList = ref([]);
const isLoading = ref(true);

const getVectors = async () => {
  const vectors: any = await vectorsApi.get_all_vectors({ isActive: true });
  vectorsList.value = vectors.data;
};

onMounted(async () => {
  await getVectors();

  if (!mapContainer.value) return;

  const map = new maplibregl.Map({
    container: mapContainer.value,
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
        },
        {
          id: "custom-raster-layer",
          type: "raster",
          source: "custom-raster",
        },
      ],
    },
    center: [117.47791610794383, 0.16905022727779018],
    zoom: 16,
  });

  map.addControl(new maplibregl.NavigationControl(), "top-right");

  // Load vectors
  for (const v of vectorsList.value as any) {
    const res = await fetch(v.url);
    const geojson = await res.json();

    // Add source
    map.addSource(v.id, {
      type: "geojson",
      data: geojson,
    });

    // Fill Layer
    map.addLayer({
      id: `${v.id}-fill`,
      type: "fill",
      source: v.id,
      paint: {
        "fill-color": v.category === "building" ? "#FF5733" : "yellow",
        "fill-opacity": 0.4,
      },
    });

    // Line Layer
    map.addLayer({
      id: `${v.id}-line`,
      type: "line",
      source: v.id,
      paint: {
        "line-color": v.category === "building" ? "#C0392B" : "yellow",
        "line-width": 1,
      },
    });

    // Interactive popup on click (applies to fill & line)
    const popupLayerId = `${v.id}-fill`;
    map.on("click", popupLayerId, (e: any) => {
      const properties = e.features[0].properties;
      if (
        (properties && "FOTO_WWC" in properties) ||
        "JENIS_TNH" in properties
      ) {
        const htmlContent = formatPopupContent(
          properties,
          persilAttributeMapping,
          "Persil Info"
        );
        new maplibregl.Popup({
          anchor: "right",
        })
          .setLngLat(e.lngLat)
          .setHTML(htmlContent)
          .addTo(map);
      } else if (
        (properties && "FOTO_BGN" in properties) ||
        "F_BGN" in properties
      ) {
        const htmlContent = formatPopupContent(
          properties,
          buildingAttributeMapping,
          "Building Info"
        );
        new maplibregl.Popup({
          anchor: "left",
        })
          .setLngLat(e.lngLat)
          .setHTML(htmlContent)
          .addTo(map);
      }
    });

    // Change cursor to pointer if hover
    map.on("mouseenter", popupLayerId, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", popupLayerId, () => {
      map.getCanvas().style.cursor = "";
    });
  }

  // all done
  isLoading.value = false;
});

const mappingRegistry: any = {
  STA_WPOP: staWpopMap,
  JENIS_TNH: labelJenisTanahMap,
  WWC: wwcMap,
  WP: wpMap,
  OP1: op1Map,
  OP2: op2Map,
};
const formatPopupContent = (
  properties: any,
  attributeMapping: any,
  title: any
) => {
  const imageFields = ["FOTO", "F_BGN", "FOTO_WWC", "FOTO_BGN"];

  const filteredEntries = Object.entries(properties)
    .filter(([key]) => attributeMapping[key])
    .map(([key, value]: any) => {
      const label = attributeMapping[key];

      // 🟢 1. Cek apakah key punya mapping value
      let displayValue = value || "-";

      if (mappingRegistry[key] && value in mappingRegistry[key]) {
        displayValue = mappingRegistry[key][value];
      }

      // 🟢 2. Jika field gambar
      if (imageFields.includes(key) && value?.trim()) {
        return `
          <div style="margin-bottom: 12px;">
            <strong style="color: #555; display: block; margin-bottom: 6px;">${label}:</strong>
            <div style="position: relative; width: 100%;">
              <div class="image-loader" style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 150px;
                background: #f5f5f5;
                border-radius: 8px;
              ">
                <span style="color: #999;">Loading image...</span>
              </div>
              <img
                src="https://dt-ugm-api.s3.ap-southeast-2.amazonaws.com/7e1c700f-d8bf-4cfd-8bfd-862bac01f9f3/photo-collection-survey-monitoring/${value}"
                alt="${label}"
                style="
                  display: none;
                  max-width: 100%;
                  max-height: 300px;
                  width: 100%;
                  object-fit: cover;
                  border-radius: 8px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  cursor: pointer;
                  transition: transform 0.2s;
                "
                onload="this.style.display='block'; this.previousElementSibling.style.display='none';"
                onerror="this.style.display='none'; this.previousElementSibling.innerHTML='<span style=\\'color: #e74c3c;\\'>❌ Failed to load image</span>';"
                onclick="window.open('${value}', '_blank')"
              />
            </div>
            <a
              href="https://dt-ugm-api.s3.ap-southeast-2.amazonaws.com/7e1c700f-d8bf-4cfd-8bfd-862bac01f9f3/photo-collection-survey-monitoring/${value}"
              target="_blank"
              style="display: inline-block; margin-top: 6px; font-size: 11px; color: #4CAF50; text-decoration: none;"
            >
              🔗 Open in new tab
            </a>
          </div>
        `;
      }

      // 🟢 3. Field non-gambar
      return `
        <div style="margin-bottom: 8px;">
          <strong style="color: #555;">${label}:</strong>
          <span style="color: #333;">${displayValue}</span>
        </div>
      `;
    })
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; min-width: 250px; max-width: 350px;">
      <h3 style="margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #4CAF50; color: #2c3e50; font-size: 16px;">
        ${title}
      </h3>
      <div style="font-size: 13px; max-height: 500px; overflow-y: auto;">
        ${filteredEntries || '<p style="color: #999;">No data available</p>'}
      </div>
    </div>
  `;
};

const persilAttributeMapping = {
  // key: label yang akan ditampilkan
  NIB: "NIB",
  NAMA_WP: "Nama Wajib Pajak",
  TIPEHAK: "Tipe Hak",
  LUAS: "Luas (m²)",
  ALAMAT_OP: "Alamat",
  KECAMATAN: "Kecamatan",
  KELURAHAN: "Kelurahan",
  RT: "RT",
  RW: "RW",
  FOTO_WWC: "Foto Kegiatan",
  STA_WPOP: "Satus Objek Pajak",
  JENIS_TNH: "Jenis Tanah",
  // Tambahkan atribut lain yang ingin ditampilkan
};

// Mapping atribut yang ingin ditampilkan untuk Building
const buildingAttributeMapping = {
  NOP: "NOP",
  NAMA_WP: "Nama Wajib Pajak",
  LUAS: "Luas Bangunan (m²)",
  ALAMAT_BGN: "Alamat",
  KECAMATAN: "Kecamatan",
  KELURAHAN: "Kelurahan",
  FOTO_BGN: "Foto Bangunan",
  // Tambahkan atribut lain yang ingin ditampilkan
};
</script>

<style scoped>
#__nuxt {
  height: 100%;
}
</style>
