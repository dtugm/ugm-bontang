<template>
  <v-list
    v-if="boTaskProgress"
    nav
    class="h-[calc(100vh-124px-100px)]"
    lines="two"
  >
    <AppTextH5>Building Outline</AppTextH5>
    <v-list-item
      v-for="(item, index) in boTaskProgress"
      :key="index"
      :title="item.user_name"
      @click=""
    >
      <template #subtitle>
        Submitted {{ item.done_task + item.todoReview_task }} from
        {{ item.bo_tasks_total }}
        <v-progress-linear
          color="success"
          buffer-color="info"
          buffer-opacity="1"
          :model-value="(item.done_task / item.bo_tasks_total) * 100"
          :buffer-value="
            ((item.todoReview_task + item.done_task || 0) /
              item.bo_tasks_total) *
            100
          "
          :height="12"
          rounded
        ></v-progress-linear>
      </template>
    </v-list-item>
  </v-list>
</template>
<script lang="ts" setup>
const employeeStore = useEmployeeStore();
if (employeeStore.boTaskProgress.length == 0) {
  employeeStore.getTasksWithEmployees();
}

const boTaskProgress: any = computed(() => {
  return employeeStore.boTaskProgress;
});
</script>
