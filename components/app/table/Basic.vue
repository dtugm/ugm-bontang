<template>
  <v-container>
    <slot name="prepend-title"></slot>
    <div class="flex gap-3 items-center">
      <AppTextH5 color="tertiary" class="mb-2">{{ title }}</AppTextH5>
      <slot name="action"></slot>
    </div>
    <div class="flex justify-between items-center gap-2">
      <slot name="prepend-table"></slot>
      <slot name="validate-table"></slot>
    </div>
    <v-data-table class="header-theme mt-2 rounded-lg border" v-bind="$attrs">
      <template #[`item.no`]="{ internalItem }">
        <div>
          {{ internalItem.index + 1 }}
        </div>
      </template>
      <template
        v-for="(_, name, slot_index) in $slots as {}"
        :key="slot_index"
        #[name]="scoped"
      >
        <slot :name="name" v-bind="{ ...(scoped as object) }"></slot>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "Table Data",
  },
});
</script>
<style scoped>
.header-theme:deep() thead {
  background-color: #eef5ff;
  color: rgb(var(--v-theme-tertiary));
}
.header-theme:deep() .v-data-table-header__content span {
  font-weight: bold;
}
</style>
