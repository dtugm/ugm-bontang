<template>
  <v-col class="h-full flex flex-col">
    <v-list density="compact" nav @update:selected="changePage">
      <v-list density="compact" nav>
        <AppTextH5>Bontang</AppTextH5>
      </v-list>
      <v-divider></v-divider>
      <v-list-item
        v-for="(menu, index) in menus"
        :key="index"
        :prepend-icon="menu.prepend_icon"
        :title="menu.title"
        :value="menu.path"
      ></v-list-item>
      <v-divider inset></v-divider>
    </v-list>
    <v-divider />
    <v-spacer></v-spacer>
    <AppButtonSignOut prepend-icon="mdi-exit-run" />
  </v-col>
</template>
<script lang="ts" setup>
import appConstant from "~/app/constant/app.constant";
import usersConstant from "~/app/constant/users.constant";
const authStore: any = useAuthStore();
const menus: any = computed(() => {
  return usersConstant.pj_user.includes(authStore.user?.email)
    ? appConstant.menus
    : appConstant.employee_menus;
});
const changePage = (item: any) => {
  navigateTo(item[0]);
};
</script>
