<template>
  <v-btn
    v-if="!mobile"
    prepend-icon="mdi-arrow-left"
    variant="outlined"
    color="tertiary"
    class="font-bold"
    density="compact"
    @click="router.back()"
  >
    Back
  </v-btn>
  <v-btn
    v-if="mobile"
    icon
    variant="outlined"
    color="tertiary"
    density="compact"
    @click="router.back()"
  >
    <v-icon color="primary">mdi-arrow-left</v-icon>
  </v-btn>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
const router = useRouter();
// withDefaults(defineProps<{ to: string }>(), { to: '/' })
</script>
