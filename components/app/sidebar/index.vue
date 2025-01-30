<template>
  <v-list>
    <v-list-item
      prepend-avatar="/logo/HD-wallpaper-squid-game-worker-art.jpg"
      :subtitle="authStore.user.email"
      :title="authStore.user.displayName"
    ></v-list-item>
  </v-list>
  <v-list mandatory density="compact" nav @update:selected="changePage">
    <!-- <v-list density="compact" nav>
      <AppTextH5 color="white">Bontang</AppTextH5>
    </v-list> -->
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
          active-class="bg-error"
        ></v-list-item>
      </v-list-group>
      <v-list-item
        v-else
        :prepend-icon="menu.prepend_icon"
        :title="menu.title"
        :value="menu.path"
        :active="menu.path === selectedTab"
        active-class="bg-error"
      ></v-list-item>
    </template>
  </v-list>
</template>
<script lang="ts" setup>
import appConstant from "~/app/constant/app.constant";
import usersConstant from "~/app/constant/users.constant";
const authStore: any = useAuthStore();
const selectedTab = ref("/");
const menus: any = computed(() => {
  return usersConstant.pj_user.includes(authStore.user?.email)
    ? appConstant.menus
    : appConstant.employee_menus;
});
const changePage = (item: any) => {
  selectedTab.value = item[0];
  navigateTo(item[0]);
};
</script>
