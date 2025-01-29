<template>
  <v-layout>
    <div class="relative">
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        @click="rail = false"
        class="bg-secondary"
      >
        <div class="absolute w-full">
          <AppSidebar />
        </div>
        <div class="absolute -right-3 z-50 top-14">
          <v-btn
            color="grey"
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            density="compact"
            @click.stop="rail = !rail"
          ></v-btn>
        </div>
        <template v-slot:append>
          <div class="p-2">
            <AppButtonSignOut />
          </div>
        </template>
      </v-navigation-drawer>
    </div>
    <!-- <v-app-bar :elevation="0">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-title>Dashboard</v-app-bar-title>
    </v-app-bar> -->
    <v-main class="bg-gray">
      <slot />
    </v-main>
    <v-navigation-drawer
      expand-on-hover
      rail
      v-if="isPersil()"
      location="right"
    >
      <AppSidebarTools />
    </v-navigation-drawer>
  </v-layout>
</template>
<script lang="ts" setup>
const route = useRoute();
const drawer = ref(true);
const rail = ref(false);

const isPersil = () => {
  return route.path == "/survey-monitoring";
};
</script>
