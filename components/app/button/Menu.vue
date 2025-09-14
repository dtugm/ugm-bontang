<template>
  <v-menu :close-on-content-click="false" location="right">
    <template v-slot:activator="{ props }">
      <v-tooltip :text="tooltipTitle" location="right">
        <template v-slot:activator="{ props: tooltipProps }">
          <v-btn
            color="tertiary"
            v-bind="{ ...props, ...tooltipProps }"
            class="text-none"
            icon
          >
            <v-icon>{{ icon }}</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>
    <slot />
  </v-menu>
</template>

<script lang="ts" setup>
interface Props {
  tooltipTitle?: string;
  icon?: string;
  buttonColor?: string;
}
const props = withDefaults(defineProps<Props>(), {
  tooltipTitle: "Analisis Solar Panel",
  icon: "mdi-file",
  buttonColor: "tertiary",
});
</script>

<style scoped>
/* Tambahkan custom styles jika diperlukan */
</style>
