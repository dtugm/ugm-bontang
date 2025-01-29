<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer">
      <AppSidebar />
    </v-navigation-drawer>
    <v-app-bar :elevation="0">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-title>Dashboard</v-app-bar-title>
    </v-app-bar>
    <v-main>
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
const drawer = ref(false);
const isPersil = () => {
  return route.path == "/survey-monitoring";
};
</script>
