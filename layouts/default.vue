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
          <!-- <AppSidebar /> -->
        </div>
        <div class="absolute md:-right-3 -right-5 z-50 top-12">
          <v-btn
            color="grey"
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            density="compact"
            @click.stop="rail = !rail"
          ></v-btn>
        </div>
        <template v-slot:append>
          <AppButtonSignOut />
        </template>
      </v-navigation-drawer>
    </div>
    <v-main class="bg-gray">
      <slot />
    </v-main>
    <!-- <v-navigation-drawer
      expand-on-hover
      rail
      v-if="isPersil()"
      location="right"
    >
      <AppSidebarTools />
    </v-navigation-drawer> -->
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
