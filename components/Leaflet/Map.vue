<template>
  <div ref="mapContainer" class="leaflet-map">
    <slot />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const props = defineProps({
  center: {
    type: Array,
    default: () => [0, 0],
  },
  zoom: {
    type: Number,
    default: 2,
  },
});

const emit = defineEmits(["map-ready"]);

const mapContainer = ref(null);
const map = ref(null);

onMounted(() => {
  map.value = L.map(mapContainer.value).setView(props.center, props.zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map.value);

  emit("map-ready", map.value);
});

watch(
  () => props.center,
  (newCenter) => {
    map.value.setView(newCenter, map.value.getZoom());
  }
);
</script>

<style scoped>
.leaflet-map {
  width: 100%;
  height: 400px;
}
</style>
