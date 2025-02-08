<template>
  <v-container class="h-full" fluid>
    <v-card class="h-full" variant="flat">
      <v-container>
        <v-tabs
          v-model="tab"
          color="primary"
          density="compact"
          selected-class="font-weight-bold"
        >
          <v-tab
            v-for="(item, index) in employee"
            :key="index"
            :value="item.id"
            class="text-none"
          >
            {{ item.name }}
          </v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item
            v-for="(item, index) in employee"
            :key="index"
            :value="item.id"
          >
            <ProductionPjBoTaskEmployeeTable :employee="item" />
          </v-window-item>
        </v-window>
      </v-container>
    </v-card>
  </v-container>
</template>
<script lang="ts" setup>
import appMock from "~/app/mock/app.mock";
const tab = ref();
const employee = ref();
onMounted(() => {
  const authStore = useAuthStore();
  const pj = appMock.penanggungJawab.find(
    (item) => item.email == authStore.user?.email
  );
  const selectedEmployees = appMock.employee.filter(
    (item) => item.responsibleId === pj?.id
  );
  employee.value = selectedEmployees;
  tab.value = selectedEmployees[0]?.id;
});
</script>
