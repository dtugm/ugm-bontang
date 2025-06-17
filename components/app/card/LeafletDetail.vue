<template>
  <v-card
    width="400"
    class="pa-2"
    :style="{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }"
  >
    <v-card-title class="text-tertiary font-bold pr-0 pt-0">
      <div class="flex justify-between">
        <AppTextH5 color="tertiary">
          {{ title }}
        </AppTextH5>
        <v-btn
          color="error"
          class="rounded-sm ml-1"
          elevation="0"
          size="x-small"
          icon
          @click="$emit('close')"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <v-expand-transition>
      <div v-if="expand">
        <v-card-text class="scroll-container">
          <v-simple-table>
            <tbody>
              <tr
                v-for="(field, index) in computedFields"
                :key="index"
                class="border-b"
              >
                <td class="font-weight-bold border-r pa-2 border-b">
                  {{ field.label }}
                </td>
                <td class="pa-2 border-b">{{ value[field.key] }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </div>
    </v-expand-transition>
    <v-expand-transition>
      <div v-if="picture">
        <v-card-text class="scroll-container">
          <AppTextH5 color="tertiary">Picture</AppTextH5>
          <v-img
            :width="300"
            aspect-ratio="16/9"
            cover
            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  color="grey-lighten-4"
                  indeterminate
                ></v-progress-circular>
              </div>
            </template>
          </v-img>
        </v-card-text>
      </div>
    </v-expand-transition>
    <v-card-actions>
      <v-btn
        :text="!expand ? 'Show Detail' : 'Hide Detail'"
        @click="expand = !expand"
      ></v-btn>
      <v-btn
        :text="!picture ? 'Show Picture' : 'Hide Picture'"
        @click="picture = !picture"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
const cViewerStore = useViewerStore();
import { computed } from "vue";
const expand = ref(true);
const picture = ref(false);
const props = defineProps({
  title: {
    type: String,
    default: "Detail Data",
  },
  fields: {
    type: Array,
    default: () => [],
  },
  value: {
    type: Object,
    required: true,
  },
});

// Logika fallback: Jika fields kosong, generate field dari key object
const computedFields = computed(() => {
  if (props.fields.length > 0) {
    return props.fields;
  }

  // Auto generate fields: label = capitalized key, key = object key
  return Object.keys(props.value).map((key) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));
});
</script>
<style scoped>
.scroll-container {
  max-height: 60vh; /* Atur sesuai kebutuhan */
  overflow-y: auto;
}
</style>
