<template>
  <v-table class="rounded">
    <thead class="bg-tertiary">
      <tr>
        <th class="text-left font-weight-bold">Attribute</th>
        <th class="text-left">Value</th>
      </tr>
    </thead>
    <tbody v-if="loading">
      <tr>
        <td colspan="2" class="text-center py-4">
          <v-progress-circular indeterminate color="primary" />
          <div class="mt-2">Loading data...</div>
        </td>
      </tr>
    </tbody>
    <tbody v-else-if="isEmptyData">
      <tr>
        <td colspan="2" class="text-center py-4 text-gray-500">
          Data not available at the moment
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr
        v-for="(header, index) in filteredHeaders"
        :key="index"
        :class="[
          highlightFields.includes(header.key)
            ? 'bg-yellow-200 rounded-md p-1'
            : '',
        ]"
      >
        <td class="font-weight-medium">{{ header.title }}</td>
        <td>{{ values?.[header.key] ?? "-" }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    headers: { title: string; key: string }[];
    values: Record<string, any>; // Satu objek berisi semua field
    highlightFields?: string[];
    loading?: boolean;
  }>(),
  {
    highlightFields: () => [],
    loading: false,
  }
);

const filteredHeaders = computed(() =>
  props.headers.filter((h) => {
    const val = props.values?.[h.key];
    return !(
      val === null ||
      val === undefined ||
      (typeof val === "object" && Object.keys(val).length === 0)
    );
  })
);

const isEmptyData = computed(() => filteredHeaders.value.length === 0);

// const isEmptyData = computed(() =>
//   props.headers.every((h) => {
//     const val = props.values?.[h.key];
//     return (
//       val === null ||
//       val === undefined ||
//       (typeof val === "object" && Object.keys(val).length === 0)
//     );
//   })
// );
</script>
