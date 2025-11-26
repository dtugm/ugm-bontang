<template>
  <v-app>
    <v-row
      :class="[
        mobile ? `bg-[url('/illustration/peta_bontang_bg.webp')]` : '',
        `h-full bg-cover`,
      ]"
    >
      <v-col
        v-if="!mobile"
        cols="12"
        md="6"
        class="d-flex align-center justify-center pa-0 position-relative"
        :class="[
          !mobile ? `bg-[url('/illustration/peta_bontang_bg.webp')]` : '',
          `h-full bg-cover`,
        ]"
      >
        <v-img
          :src="logoImage"
          width="400"
          height="600"
          class="rotate-image"
        ></v-img>
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="d-flex align-center justify-center px-5 text-center"
      >
        <slot />
      </v-col>
    </v-row>
  </v-app>
</template>

<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
const logoImage = "/logo/kota_bontang_putih.webp";
</script>

<style scoped>
.rotate-image {
  transform: rotate(-15deg);
  transition: transform 0.3s ease-in-out;
}
.position-absolute {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.fill-height {
  height: 100vh;
}
</style>
