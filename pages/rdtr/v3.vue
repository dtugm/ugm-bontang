<template>
  <v-container fluid class="pa-0" style="height: 100vh">
    <v-row no-gutters style="height: 100%">
      <!-- Map Container -->
      <v-col cols="8">
        <div
          ref="mapContainer"
          class="map-container"
          style="width: 100%; height: 100%"
        ></div>
      </v-col>

      <!-- Sidebar untuk menampilkan informasi persil (di kanan) -->
      <v-col cols="4" class="sidebar">
        <v-card class="h-100" flat>
          <v-card-title class="bg-primary white--text">
            <v-icon left color="white">mdi-map-marker</v-icon>
            Informasi Persil Tanah
          </v-card-title>

          <v-card-text class="pa-4">
            <div v-if="!selectedFeature" class="text-center mt-8">
              <v-icon size="64" color="grey lighten-2">mdi-map-search</v-icon>
              <p class="text-h6 grey--text mt-4">
                Klik pada peta untuk melihat informasi persil
              </p>
            </div>

            <div v-else>
              <v-chip color="success" text-color="white" class="mb-4" small>
                <v-icon left small>mdi-check-circle</v-icon>
                Persil Terpilih
              </v-chip>

              <!-- Koordinat pin point -->
              <v-card outlined class="mb-4">
                <v-card-subtitle class="pb-1">
                  <v-icon small color="red">mdi-map-marker</v-icon>
                  Lokasi Pin
                </v-card-subtitle>
                <v-card-text class="pt-1">
                  <div class="text-caption">
                    <strong>Lat:</strong> {{ pinCoordinates.lat.toFixed(6)
                    }}<br />
                    <strong>Lng:</strong> {{ pinCoordinates.lng.toFixed(6) }}
                  </div>
                </v-card-text>
              </v-card>

              <!-- Informasi persil -->
              <v-card outlined>
                <v-card-subtitle>Atribut Persil</v-card-subtitle>
                <v-card-text>
                  <v-list dense class="pa-0">
                    <v-list-item
                      v-for="(value, key) in selectedFeature.properties"
                      :key="key"
                      class="px-0 py-1"
                    >
                      <v-list-item-content>
                        <v-list-item-subtitle class="text-caption grey--text">
                          {{ formatKey(key) }}
                        </v-list-item-subtitle>
                        <v-list-item-title class="text-body-2">
                          {{ value || "-" }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>

              <!-- Tombol aksi -->
              <div class="mt-4">
                <v-btn
                  color="primary"
                  outlined
                  small
                  class="mr-2"
                  @click="zoomToSelected"
                >
                  <v-icon left small>mdi-magnify-plus</v-icon>
                  Zoom
                </v-btn>

                <v-btn color="error" outlined small @click="clearSelection">
                  <v-icon left small>mdi-close</v-icon>
                  Clear
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading overlay -->
    <v-overlay :value="loading" absolute>
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
      <p class="mt-4 text-center">Memuat peta persil...</p>
    </v-overlay>
  </v-container>
</template>

<script>
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default {
  name: "PersilTanahMap",

  data() {
    return {
      map: null,
      loading: true,
      selectedFeature: null,
      selectedMarker: null,
      pinCoordinates: { lat: 0, lng: 0 },
      geojsonPath: "/persil_nib.geojson", // Path ke file GeoJSON
      hoveredFeatureId: null,
      selectedFeatureId: null,
    };
  },

  mounted() {
    this.initializeMap();
  },

  beforeDestroy() {
    if (this.map) {
      if (this.selectedMarker) {
        this.selectedMarker.remove();
      }
      this.map.remove();
    }
  },

  methods: {
    async initializeMap() {
      try {
        // Initialize MapLibre map
        this.map = new maplibregl.Map({
          container: this.$refs.mapContainer,
          style: {
            version: 8,
            sources: {
              osm: {
                type: "raster",
                tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                tileSize: 256,
                attribution: "© OpenStreetMap contributors",
              },
            },
            layers: [
              {
                id: "osm",
                type: "raster",
                source: "osm",
              },
            ],
          },
          center: [106.8456, -6.2088], // Default center (Jakarta)
          zoom: 10,
        });

        // Wait for map to load
        this.map.on("load", () => {
          this.loadGeoJSONData();
        });

        // Add navigation controls
        this.map.addControl(new maplibregl.NavigationControl(), "top-right");

        // Add scale control
        this.map.addControl(new maplibregl.ScaleControl(), "bottom-left");
      } catch (error) {
        console.error("Error initializing map:", error);
        this.loading = false;
      }
    },

    async loadGeoJSONData() {
      try {
        // Load GeoJSON data
        const response = await fetch(this.geojsonPath);
        const geojsonData = await response.json();

        // Add GeoJSON source
        this.map.addSource("persil-tanah", {
          type: "geojson",
          data: geojsonData,
        });

        // Add fill layer for persil polygons
        this.map.addLayer({
          id: "persil-fill",
          type: "fill",
          source: "persil-tanah",
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "#ff7675", // Hover color (red)
              [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                "#00b894", // Selected color (green)
                "#74b9ff", // Default color (blue)
              ],
            ],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.8,
              [
                "case",
                ["boolean", ["feature-state", "selected"], false],
                0.7,
                0.4,
              ],
            ],
          },
        });

        // Add stroke layer for persil borders
        this.map.addLayer({
          id: "persil-stroke",
          type: "line",
          source: "persil-tanah",
          paint: {
            "line-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              "#00b894", // Selected border (green)
              [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                "#ff7675", // Hover border (red)
                "#2d3436", // Default border (dark)
              ],
            ],
            "line-width": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              4, // Selected width
              [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                3, // Hover width
                1, // Default width
              ],
            ],
          },
        });

        // Add highlight layer for selected feature
        this.map.addLayer({
          id: "persil-highlight",
          type: "line",
          source: "persil-tanah",
          paint: {
            "line-color": "#ffeaa7", // Yellow highlight
            "line-width": 6,
            "line-opacity": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              0.8,
              0,
            ],
          },
        });

        // Fit map to GeoJSON bounds
        const bounds = new maplibregl.LngLatBounds();
        geojsonData.features.forEach((feature) => {
          if (feature.geometry.type === "Polygon") {
            feature.geometry.coordinates[0].forEach((coord) => {
              bounds.extend(coord);
            });
          } else if (feature.geometry.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach((polygon) => {
              polygon[0].forEach((coord) => {
                bounds.extend(coord);
              });
            });
          }
        });

        this.map.fitBounds(bounds, { padding: 50 });

        // Add click event
        this.map.on("click", "persil-fill", (e) => {
          this.handlePersilClick(e);
        });

        // Add hover events
        this.map.on("mouseenter", "persil-fill", (e) => {
          this.map.getCanvas().style.cursor = "pointer";

          if (e.features.length > 0) {
            if (
              this.hoveredFeatureId !== null &&
              this.hoveredFeatureId !== this.selectedFeatureId
            ) {
              this.map.setFeatureState(
                { source: "persil-tanah", id: this.hoveredFeatureId },
                { hover: false }
              );
            }

            this.hoveredFeatureId = e.features[0].id;
            if (this.hoveredFeatureId !== this.selectedFeatureId) {
              this.map.setFeatureState(
                { source: "persil-tanah", id: this.hoveredFeatureId },
                { hover: true }
              );
            }
          }
        });

        this.map.on("mouseleave", "persil-fill", () => {
          this.map.getCanvas().style.cursor = "";

          if (
            this.hoveredFeatureId !== null &&
            this.hoveredFeatureId !== this.selectedFeatureId
          ) {
            this.map.setFeatureState(
              { source: "persil-tanah", id: this.hoveredFeatureId },
              { hover: false }
            );
          }

          this.hoveredFeatureId = null;
        });

        this.loading = false;
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
        this.loading = false;

        // Show error message
        this.$toast.error("Gagal memuat data persil tanah");
      }
    },

    handlePersilClick(e) {
      if (e.features.length > 0) {
        const feature = e.features[0];
        const coordinates = e.lngLat;

        // Clear previous selection
        if (this.selectedFeatureId !== null) {
          this.map.setFeatureState(
            { source: "persil-tanah", id: this.selectedFeatureId },
            { selected: false }
          );
        }

        // Remove previous marker
        if (this.selectedMarker) {
          this.selectedMarker.remove();
        }

        // Set new selection
        this.selectedFeature = feature;
        this.selectedFeatureId = feature.id;
        this.pinCoordinates = {
          lat: coordinates.lat,
          lng: coordinates.lng,
        };

        this.map.setFeatureState(
          { source: "persil-tanah", id: feature.id },
          { selected: true }
        );

        // Create custom pin marker
        const markerElement = document.createElement("div");
        markerElement.innerHTML = `
          <div style="
            width: 30px;
            height: 30px;
            background-color: #e74c3c;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: white;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `;

        // Add marker to map
        this.selectedMarker = new maplibregl.Marker({
          element: markerElement,
          anchor: "bottom",
        })
          .setLngLat([coordinates.lng, coordinates.lat])
          .addTo(this.map);

        // Add bounce animation
        markerElement.style.animation = "bounce 0.6s ease-in-out";

        // Center map on selected feature with animation
        this.zoomToSelected();
      }
    },

    zoomToSelected() {
      if (this.selectedFeature) {
        const center = this.getFeatureCenter(this.selectedFeature.geometry);
        this.map.easeTo({
          center: center,
          zoom: Math.max(this.map.getZoom(), 17),
          duration: 1500,
          essential: true,
        });
      }
    },

    getFeatureCenter(geometry) {
      let coordinates;

      if (geometry.type === "Polygon") {
        coordinates = geometry.coordinates[0];
      } else if (geometry.type === "MultiPolygon") {
        coordinates = geometry.coordinates[0][0];
      }

      // Calculate centroid
      let x = 0,
        y = 0;
      coordinates.forEach((coord) => {
        x += coord[0];
        y += coord[1];
      });

      return [x / coordinates.length, y / coordinates.length];
    },

    clearSelection() {
      if (this.selectedFeatureId !== null) {
        this.map.setFeatureState(
          { source: "persil-tanah", id: this.selectedFeatureId },
          { selected: false }
        );
      }

      if (this.selectedMarker) {
        this.selectedMarker.remove();
        this.selectedMarker = null;
      }

      this.selectedFeature = null;
      this.selectedFeatureId = null;
      this.pinCoordinates = { lat: 0, lng: 0 };
    },

    formatKey(key) {
      // Format key untuk display yang lebih baik
      return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    },
  },
};
</script>

<style scoped>
.sidebar {
  border-left: 1px solid #e0e0e0;
  background-color: #fafafa;
}

.map-container {
  position: relative;
}

/* Custom scrollbar untuk sidebar */
.sidebar ::-webkit-scrollbar {
  width: 6px;
}

.sidebar ::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sidebar ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.sidebar ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Bounce animation for marker */
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0) rotate(-45deg);
  }
  40% {
    transform: translateY(-10px) rotate(-45deg);
  }
  60% {
    transform: translateY(-5px) rotate(-45deg);
  }
}

/* Pulse animation for highlight */
@keyframes pulse {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 0.8;
  }
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .sidebar {
    position: absolute !important;
    top: 0;
    right: 0;
    z-index: 1000;
    width: 100% !important;
    max-width: 350px;
    height: 100%;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  }
}
</style>
