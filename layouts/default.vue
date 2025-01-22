<template>
  <v-layout>
    <v-navigation-drawer>
      <AppSidebar />
    </v-navigation-drawer>
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
const isPersil = () => {
  return route.path == "/persil-monitoring";
};
</script>
