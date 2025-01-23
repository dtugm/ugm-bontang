<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer">
      <AppSidebar />
    </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
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
  return route.path == "/persil-monitoring";
};
</script>
