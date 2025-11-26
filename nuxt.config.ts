// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  app: {
    head: {
      title: "Bontang - Pemodelan 3D dan Validasi Data PBB",
    },
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: false,
  modules: [
    "nuxt-maplibre",
    "nuxt-vuefire",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/leaflet",
    ["@pinia/nuxt", { autoImports: ["defineStore", "acceptHMRUpdate"] }],
  ],
  imports: {
    dirs: ["stores/**", "composables/**"],
  },
  runtimeConfig: {
    public: {
      mapTilesKey: process.env.MAPTILES_API_KEY,
      brevoApiKey: process.env.BREVO_API_KEY,
      API_BASE_URL: process.env.API_BASE_URL,
      API_BASE_KEY_NEW: process.env.API_BASE_KEY_NEW,
      CESIUM_TOKEN: process.env.CESIUM_TOKEN,
      CESIUM_TOKEN_FK: process.env.CESIUM_TOKEN_FK,
      CESIUM_BASE_URL: "/cesium",
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      CESIUM_BASE_URL: JSON.stringify("/cesium"),
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    plugins: [
      vuetify({ autoImport: true }), // Enabled by default
    ],
    optimizeDeps: {
      include: ["vue-cesium"],
    },
  },
  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: false,
    },
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
  },
});
