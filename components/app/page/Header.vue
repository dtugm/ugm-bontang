<template>
  <div class="bg-background">
    <v-container>
      <v-row class="justify-between items-center">
        <div class="flex items-center gap-3">
          <AppButtonBack :to="backLink" />
          <AppTextH5 color="secondary">{{ title }}</AppTextH5>
        </div>
        <slot name="navigation"></slot>
        <template v-if="!mobile">
          <slot name="actions"></slot>
        </template>
      </v-row>

      <slot name="below"></slot>
    </v-container>
    <div v-if="mobile" class="fab">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
withDefaults(defineProps<{ backLink?: string; title?: string }>(), {
  backLink: "/",
  title: "",
});
const appStore = useAppStore();
</script>
<style scoped>
.fab {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
}
</style>
