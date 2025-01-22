<template>
  <v-col class="h-full flex flex-col">
    <v-list density="compact" nav @update:selected="changePage">
      <v-list density="compact" nav>
        <AppTextH5>Bontang</AppTextH5>
      </v-list>
      <v-divider></v-divider>
      <v-list-item
        prepend-icon="mdi-monitor-dashboard"
        title="Dashboard"
        value="/"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-map"
        title="Persil Monitoring"
        value="/persil-monitoring"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-map"
        title="Update Survey Area"
        value="/update-survey"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-multiple"
        title="Worker Management"
        value="/worker-management"
      ></v-list-item>
      <v-divider inset></v-divider>
    </v-list>
    <v-divider />
    <v-spacer></v-spacer>
    <AppButtonSignOut append-icon="mdi-logout" />
  </v-col>
</template>
<script lang="ts" setup>
const changePage = (item: any) => {
  navigateTo(item[0]);
  //   console.log(item[0]);
};
</script>
