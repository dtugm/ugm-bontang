<template>
  <div>
    {{ showNumber() }}
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  loading: boolean;
  index: number;
  table: ITableProps;
}>();
const number = ref(0);
function showNumber() {
  if (props.loading) {
    return number.value;
  }

  const table = props.table;

  const page = table.page;
  const first = table.itemsPerPage * page - table.itemsPerPage + 1;
  number.value = first + props.index;
  return number.value;
}
</script>
