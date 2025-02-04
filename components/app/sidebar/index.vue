<template>
  <v-list>
    <v-list-item
      :prepend-avatar="
        profileMap[authStore.user.email] ??
        '/logo/HD-wallpaper-squid-game-worker-art.jpg'
      "
      :title="NameMap[authStore.user.email] ?? authStore.user.displayName"
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
const profileMap: any = {
  "bontangjaya@gmail.com": "/logo/Logo_1.png",
  "bontangsyafrudin@gmail.com": "/logo/Logo_1.png",
  "bontanggiri@gmail.com": "/logo/Logo_1.png",
  "bontangheru@gmail.com": "/logo/Logo_1.png",
  "bontangsyafriansyah@gmail.com": "/logo/Logo_1.png",
  "hyatma.a.a@mail.ugm.ac.id": "/logo/frontman_2.jpg",
};
const NameMap: any = {
  "bontangjaya@gmail.com": "Syafruddin",
  "bontangsyafrudin@gmail.com": "Syafrudin",
  "bontanggiri@gmail.com": "Giri",
  "bontangheru@gmail.com": "Heru",
  "bontangsyafriansyah@gmail.com": "Syafriansyah",
  "hyatma.a.a@mail.ugm.ac.id": "/logo/frontman_2.jpg",
};
const authStore: any = useAuthStore();
const selectedTab = ref("/");
const arrays = [
  usersConstant.employee_user,
  usersConstant.pj_user,
  usersConstant.superadmin_user,
];
const menuMap: any = {
  0: appConstant.employee_menus,
  1: appConstant.pj_menus,
  2: appConstant.menus,
};
const foundIndexes: any = arrays
  .map((arr, index) => (arr.includes(authStore.user?.email) ? index : -1))
  .filter((index) => index !== -1);

const menus: any = computed(() => {
  return menuMap[foundIndexes];
});
const changePage = (item: any) => {
  selectedTab.value = item[0];
  navigateTo(item[0]);
};
</script>
