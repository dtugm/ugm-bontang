<template>
  <div class="relative w-full h-[93vh]">
    <div id="map" class="map"></div>
    
    <div class="overlay-component">
      <CesiumLandParcelFeature />
    </div>
    <div class="absolute top-4 left-4 p-3">
      <AppButton 
          label="Filter Data"
          variant="flat"
          @click="() => showFilter = !showFilter"
        />
      <div v-if="showFilter" class="mt-1 p-3" style="width: 300px; background-color: ghostwhite; border-radius: 5px;">
        <div class="mb-6">
          <label for="" style="font-size: larger; font-weight: bold;">Filter</label>
          <AppInputSelect
            class-label="text-info font-semibold"
            label="Kecamatan"
            placeholder="Pilih Nama Kecamatan"
            v-model="filters.kecamatan"
            :items="SurveyLapanganConstant.kecamatans"
            chips
            hide-details
            clearable
            />
          <AppInputSelect
            class-label="text-info font-semibold"
            label="Kelurahan"
            placeholder="Pilih Nama Kelurahan"
            v-model="filters.kelurahan"
            :items="SurveyLapanganConstant.kelurahans"
            chips
            hide-details
            clearable
            />
          <AppInputSelect
            class-label="text-info font-semibold"
            label="Hak Milik"
            placeholder="Pilih Tipe Hak"
            v-model="filters.tipeHak"
            :items="SurveyLapanganConstant.tipeHaks"
            chips
            hide-details
            clearable
            />
        </div>
        <div>
          <label for="" style="font-size: larger; font-weight: bold;">Cari</label>
          <div class="" style="background-color: aliceblue;">
            <v-select
              v-model="filters.searchOption"
              :items="SurveyLapanganConstant.searchOptions"
              item-title="text"
              item-value="value"
              label="Pilih Opsi Pencarian"
              variant="outlined"
              bg-color="white"
              density="compact"
              placeholder="Choose a country"
            />
          </div>
          <AppInputText
            class-label="text-info font-semibold"
            append-inner-icon="mdi-magnify"
            :placeholder="searchOptionPlaceholder"
            v-model="filters.search"
            chips
            hide-details
            clearable
            density="compact"
            class="w-full"
            />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import maplibregl, { type ExpressionInputType, type ExpressionSpecification, type LngLatBoundsLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
let map: maplibregl.Map | null = null;
import SurveyLapanganConstant from "~/app/constant/SurveyLapangan.constant";
import { AppButton, AppInputText } from "#components";

const sources = reactive<string[]>([])

const searchOptionPlaceholder = ref("Search by: ")
const showFilter = ref<boolean>(false);
const filters = ref<{
  kecamatan?: string | null,
  kelurahan?: string | null,
  tipeHak?: string | null,
  search?: string | null,
  searchOption?: string | null
}>({
  kecamatan: null,
  kelurahan: null,
  tipeHak: null,
  search: null,
  searchOption: null
});

const surveyDataStore = useSurveyDataStore();

const useLotSurveyMonitoringStore = useLotSurveyMonitoring();
const openDetail = async (id: any) => {
  await useLotSurveyMonitoringStore.getDetailPersil(id);
};

// Update color dynamically
const updateHighlightColor = (feature: maplibregl.MapGeoJSONFeature, newColor: string) => {
  const layerId = `${feature.source}-layer-highlight`
  
  map?.setFeatureState(
    { source: feature.source, id: feature.id },
    { isSelected: true, highlightColor: newColor }
  );

  // Update filter to show the highlight
  map?.setFilter(layerId, ['==', ['get', 'UUID'], feature?.properties?.UUID]);
}

watch(filters, async (newFilters) => {
  if (!map) return;

  const filterExpressions: any[] = [];

  if (newFilters.kecamatan) {
    filterExpressions.push(['==', ['get', 'KECAMATAN'], newFilters.kecamatan]);
  }
  if (newFilters.kelurahan) {
    filterExpressions.push(['==', ['get', 'KELURAHAN'], newFilters.kelurahan]);
  }
  if (newFilters.tipeHak) {
    filterExpressions.push(['==', ['get', 'TIPEHAK'], newFilters.tipeHak]);
  }
  if (newFilters.search && newFilters.searchOption) {
    // Case insensitive search
    filterExpressions.push([
      ">=",
      [
        "index-of",
        newFilters.search.toLowerCase(),
        ["downcase", ["get", newFilters.searchOption]]
      ],
      0
    ])
  }
  if (newFilters.searchOption) {
    searchOptionPlaceholder.value = `Search by: ${SurveyLapanganConstant.searchOptions.find((option) => option.value === newFilters.searchOption)?.text || ""}`;
  }

  sources.forEach(source => {
    const layerId = `${source}-layer`;

    if (filterExpressions.length > 0) {
      map?.setFilter(layerId, ['all', ...filterExpressions]);
    } else {
      map?.setFilter(layerId, null);
    }
  });

  // fly to the filtered features
  const searchOption = newFilters.searchOption || ""
  let columnName = "";
  type ColumnKeys = keyof typeof SurveyLapanganConstant.columnName;
  if (searchOption && searchOption in SurveyLapanganConstant.columnName) {
    columnName = SurveyLapanganConstant.columnName[searchOption as ColumnKeys];
  }

  await surveyDataStore.getParcelBoundary({
    kecamatan: newFilters.kecamatan || "",
    kelurahan: newFilters.kelurahan || "",
    tipeHak: newFilters.tipeHak || "",
    columnName,
    columnValue: newFilters.search || ""
  }).then(() => {
    const { minx, miny, maxx, maxy } = surveyDataStore.parcelBoundary;
    const bounds: LngLatBoundsLike = [
      [minx, miny],
      [maxx, maxy]
    ]
    map?.fitBounds(bounds, {
      padding: 40, 
      duration: 1200
    });
  }).catch((error) => {
    if (error.status === 404) {
      useAppStore().toastError("Data persil tidak ditemukan");
    } else {
      useAppStore().toastError("Gagal mendapatkan data persil");
    }
  })
}, { deep: true });

const initMap = () => {
  map = new maplibregl.Map({
    container: "map",
    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors",
        },
        ortho: {
          type: "raster",
          tiles: [
            "https://basemap-ortho.s3.ap-southeast-2.amazonaws.com/bontang-ortho-tiles/{z}/{x}/{y}.png"
          ],
          attribution: "Ortho AWS S3",
          minzoom: 12,
          scheme: "tms"
        }
      },
      layers: [
        {
          id: "osm-layer",
          type: "raster",
          source: "osm",
        },
        {
          id: "ortho-layer",
          type: "raster",
          source: "ortho",
          minzoom: 12,
          maxzoom: 20,
        }
      ]
    },
    center: [117.484326, 0.140267],
    zoom: 15,
  });

  // Add navigation control (the +/- zoom buttons)
  map.addControl(new maplibregl.NavigationControl(), "top-right");

  map.on('load', async ()=> {
    await setupLayers();
    setupEventHandlers();
  });
}

const setupLayers = async () => {
    const JENIS_TNH_ARRAY: ExpressionInputType[] = Object.entries(SurveyLapanganConstant.JENIS_TNH)
      .flatMap(([key, value]) => [key, value]);

    const KODE_WWC_ARRAY: ExpressionInputType[] = Object.entries(SurveyLapanganConstant.statusMapAngkaColor)
      .flatMap(([key, value]) => [key, value]);

    await surveyDataStore.getDataVectorPersil().then(() => {
      surveyDataStore.dataVectorPersil.map(async (item: any) => {
        sources.push(item.name)

        const geojson = await fetch(item.url).then(res => res.json());
        geojson.features = geojson.features.map((feature: any) => ({
          ...feature,
        }));

        map?.addSource(item.name, {
          type: 'geojson',
          data: geojson,
          promoteId: 'UUID'
        });
        
        const fillColorExpression = [
          'case',
          ['has', 'JENIS_TNH'],
          ['match', ['get', 'JENIS_TNH'], ...JENIS_TNH_ARRAY, 'rgba(139,146,152,1)'],
          ['has', 'KODE_WWC'],
          ['match', ['get', 'KODE_WWC'], ...KODE_WWC_ARRAY, 'rgba(139,146,152,1)'],
          'rgba(139,146,152,1)'
        ] as unknown as ExpressionSpecification;
        map?.addLayer({
          id: `${item.name}-layer`,
          type: 'fill',
          source: item.name,
          layout: {},
          paint: {
            'fill-color': fillColorExpression,
            'fill-opacity': geojson.feature?.properties?.JENIS_TNH ? 0.7 : 0.5,
            'fill-outline-color': 'white',
          },
          filter: ['all']
        });

        map?.addLayer({
          id: `${item.name}-layer-highlight`,
          type: 'line',
          source: item.name,
          paint: {
            'line-color': [
              'case',
              ['boolean', ['feature-state', 'isSelected'], false], ['feature-state', 'highlightColor'],
              'white'
            ],
            'line-width': 4
          },
          filter: ['==', ['get', 'UUID'], -1]
        });
      });
    });
  }

  const setupEventHandlers = () => {
    map?.on('click', (e) => {
      const features = map?.queryRenderedFeatures(e.point, {
        layers: sources.map(source => `${source}-layer`)
      });
      if (!features || features.length === 0) {
        return;
      }
      const feature = features[0];
      // update highlight color to red
      updateHighlightColor(feature, 'red');
      
      // display feature properties
      openDetail(feature.properties.UUID || feature.properties.UUID_BGN);
    });

    sources.forEach(source => {
      map?.on('mousemove', `${source}-layer`, (e) => {
        map?.getCanvas().style.setProperty('cursor', 'pointer');
        
        if (!e.features || e.features.length === 0) return;
        updateHighlightColor(e.features[0], '#666');
      });
    });

    map?.on('mouseleave', (e) => {
      sources.forEach(source => {
        map?.getCanvas().style.setProperty('cursor', '');
        map?.setFilter(`${source}-layer-highlight`, ['==', ['get', 'UUID'], -1]);
      });
    });
}

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    initMap();
    // initData();
  });
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});

</script>
<style>
.map {
  width: 100%;
  height: 100%;
}
</style>
