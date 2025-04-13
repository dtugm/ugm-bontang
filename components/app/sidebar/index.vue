<template>
  <v-list>
    <v-list-item
      prepend-icon="mdi-account"
      :title="`${authStore.user.firstName} ${authStore.user.lastName}`"
      :subtitle="authStore.user.username"
    ></v-list-item>
  </v-list>
  <v-list mandatory density="compact" nav @update:selected="changePage">
    <template v-for="(menu, index) in menus" :key="index">
      <v-list-group v-if="menu.sub_menu">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :prepend-icon="menu.prepend_icon"
            :title="menu.title"
          ></v-list-item>
        </template>
        <v-list-item
          v-for="(subMenu, index) in menu.sub_menu"
          :key="index"
          :active="subMenu.path === selectedTab"
          :prepend-icon="subMenu.prepend_icon"
          :title="subMenu.title"
          :value="subMenu.path"
          active-class="bg-primary"
        ></v-list-item>
      </v-list-group>
      <v-list-item
        v-else
        :prepend-icon="menu.prepend_icon"
        :title="menu.title"
        :value="menu.path"
        :active="menu.path === selectedTab"
        active-class="bg-primary"
      ></v-list-item>
    </template>
  </v-list>
</template>
<script lang="ts" setup>
import appConstant from "~/app/constant/app.constant";
import usersConstant from "~/app/constant/users.constant";
const authStore = useAuthenticationStore();
const route = useRoute();
const selectedTab = ref(route.path);
const arrays = [
  usersConstant.pj_user,
  usersConstant.stakeHolder_user,
  usersConstant.superadmin_user,
  usersConstant.leader_studio_users,
  usersConstant.member_lidar_users,
  usersConstant.member_3d_users,
];
const menuMap: any = {
  0: appConstant.pj_menus,
  1: appConstant.stakeHolder_menus,
  2: appConstant.superadmin_menus,
  3: appConstant.leader_studio_menus,
  4: appConstant.member_lidar_users,
  5: appConstant.member_3d_users,
};
const foundIndexes: any = arrays
  .map((arr, index) => (arr.includes(authStore.user.email) ? index : -1))
  .filter((index) => index !== -1);

const menus: any = computed(() => {
  return menuMap[foundIndexes];
});
const changePage = (item: any) => {
  selectedTab.value = item[0];
  navigateTo(item[0]);
};
</script>
