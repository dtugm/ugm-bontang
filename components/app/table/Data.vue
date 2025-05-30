<template>
  <v-container>
    <slot name="prepend-title"></slot>
    <v-row no-gutters class="items-center gap-4">
      <slot name="prepend"></slot>
      <AppTextH5 color="primary">{{ title }}</AppTextH5>
      <slot name="action"></slot>
      <v-spacer></v-spacer>
      <v-col v-if="isSearchable" lg="3" class="d-flex gap-2 items-center">
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-icon
              icon="mdi-information"
              color="info"
              density="compact"
              variant="flat"
              v-bind="props"
            ></v-icon>
          </template>
          <p>Use Comma To Multiple Keyword</p>
          <span>Search by: </span>
          <span>{{ readData.tableData.searchable_columns }}</span>
        </v-tooltip>
        <AppInputText
          v-model="readData.tableData.search"
          append-inner-icon="mdi-magnify"
          :placeholder="
            placeholder || 'Search by: ' + readData.tableData.searchable_columns
          "
          density="compact"
          clearable
          hide-details
          class="w-full"
          @update:model-value="readData.debounceSearchData"
        />
      </v-col>
    </v-row>
    <slot name="prepend-table"></slot>

    <v-data-table-server
      v-model:items-per-page="readData.tableData.itemsPerPage"
      :items-per-page-options="itemsPerPageOptions"
      class="pt-1 header-theme"
      multi-sort
      :headers="readData.tableData.headers"
      :items-length="readData.tableData.totalItems"
      :items="readData.tableData.serverItems"
      :loading="readData.tableData.loading"
      v-bind="$attrs"
      @update:options="readData.getData"
    >
      <template #[`item.no`]="{ index }">
        <AppTableNumber
          :index="index"
          :loading="!!readData.tableData.loading"
          :table="readData.tableProps"
        />
      </template>
      <template
        v-for="(_, name, slot_index) in $slots as {}"
        :key="slot_index"
        #[name]="scoped"
      >
        <slot :name="name" v-bind="{ ...(scoped as object) }"></slot>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script lang="ts" setup>
defineProps({
  readData: {
    type: Object,
    default: () => {},
  },
  title: {
    type: String,
    default: "Table Data",
  },
  placeholder: {
    type: String,
    default: "",
  },
  isSearchable: {
    type: Boolean,
    default: true,
  },
  itemsPerPageOptions: {
    type: Array<number | { title: string; value: number }>,
    default: [
      { title: "10", value: 10 },
      { title: "25", value: 25 },
      { title: "50", value: 50 },
      { title: "100", value: 100 },
    ],
  },
});
</script>

<style scoped>
.header-theme:deep() .v-data-table__thead {
  background-color: rgb(var(--v-theme-light-blue));
  color: rgb(var(--v-theme-primary));
}
.header-theme:deep() .v-data-table__thead span {
  font-weight: bold;
}
</style>
