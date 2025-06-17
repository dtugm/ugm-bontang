import { ref } from "vue";
import L from "leaflet";

export function useLeaflet() {
  const map = ref<any>(null);
  const layers = reactive({
    baseLayers: {} as Record<string, L.TileLayer>,
    overlayLayers: {} as Record<string, L.Layer>,
  });

  let layerControl: L.Control.Layers | null = null;
  const initializeMap = (
    mapId: string,
    latitude: number,
    longitude: number,
    zoomLevel: number = 16
  ) => {
    const leafletMap = L.map(mapId).setView([latitude, longitude], zoomLevel);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(leafletMap);

    map.value = leafletMap;
    layerControl = L.control
      .layers(layers.baseLayers, layers.overlayLayers)
      .addTo(leafletMap);
  };

  const destroyMap = () => {
    if (map.value) {
      map.value.remove();
      map.value = null;
    }
  };
  const refreshLayerControl = () => {
    if (map.value && layerControl) {
      // Hapus layer control lama
      map.value.removeControl(layerControl);
      // Tambahkan layer control baru yang sudah diupdate
      layerControl = L.control
        .layers(layers.baseLayers, layers.overlayLayers)
        .addTo(map.value);
    }
  };
  const addTileLayer = (
    urlTemplate: string,
    attribution = "",
    maxZoom = 19,
    options: any = {}
  ) => {
    if (!map.value) {
      console.warn("Map is not initialized yet.");
      return;
    }
    const tileLayer = L.tileLayer(urlTemplate, {
      attribution,
      maxZoom,
      ...options,
    });
    tileLayer.addTo(map.value);
    return tileLayer;
  };
  const addGeoJsonLayer = (
    geojsonData: any,
    options: L.GeoJSONOptions = {}
  ) => {
    if (!map.value) {
      console.warn("Map is not initialized yet.");
      return;
    }

    const geoJsonLayer = L.geoJSON(geojsonData, options);
    geoJsonLayer.addTo(map.value);

    return geoJsonLayer;
  };
  const loadGeoJsonFromUrl = async (
    name: any,
    url: string,
    options: L.GeoJSONOptions = {}
  ) => {
    if (!map.value) {
      console.warn("Map is not initialized yet.");
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to fetch GeoJSON: ${response.statusText}`);

      const geojsonData = await response.json();

      const geoJsonLayer = L.geoJSON(geojsonData, options);
      geoJsonLayer.addTo(map.value);
      // Tambahkan ke overlay layers
      layers.overlayLayers[name] = geoJsonLayer;

      refreshLayerControl();
      // Auto zoom to layer
      //   map.value.fitBounds(geoJsonLayer.getBounds());

      return geoJsonLayer;
    } catch (error) {
      console.error("Error loading GeoJSON:", error);
    }
  };
  return {
    map,
    initializeMap,
    destroyMap,
    addTileLayer,
    addGeoJsonLayer,
    loadGeoJsonFromUrl,
  };
}
