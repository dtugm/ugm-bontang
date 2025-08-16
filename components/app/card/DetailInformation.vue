<template>
  <AppCardContainerBorder :title="title">
    <div
      v-for="(item, index) in displayItems"
      :key="index"
      :class="[
        'flex justify-between ',
        isStacked ? 'flex-col items-start' : ' items-center',
      ]"
    >
      <AppTextH5 color="text">
        {{ items[index] || stringHelper.titleCase(index) }}
      </AppTextH5>
      <v-chip
        v-if="chipsField?.includes(index)"
        :color="value[index] ? 'success' : 'error'"
        :class="[isStacked ? 'text-start' : 'text-end']"
      >
        <p>
          {{ handleEmptyOrNull(value[index]) }}
        </p>
      </v-chip>
      <p
        v-else
        class="text-start"
        :class="[
          highlightFields.includes(index) ? 'bg-yellow-200 rounded-md p-1' : '',
        ]"
      >
        {{ handleEmptyOrNull(value[index]) }}
      </p>
    </div>
  </AppCardContainerBorder>
</template>
<script setup lang="ts">
import stringHelper from "~/app/helper/string.helper";
import { handleEmptyOrNull } from "~/utils/globalFunction";
const props = withDefaults(
  defineProps<{
    items?: any;
    value: any;
    title?: any;
    chipsField?: any[];
    isStacked: boolean;
    highlightFields?: any[];
  }>(),
  {
    chipsField: () => [],
    isStacked: false,
    title: "Detail",
    items: {},
    highlightFields: () => [],
  }
);

const displayItems = computed(() => {
  if (props.items && Object.keys(props.items).length > 0) {
    return props.items;
  }
  return Object.keys(props.value).reduce((acc, key) => {
    acc[key] = key;
    return acc;
  }, {} as Record<string, string>);
});
</script>
