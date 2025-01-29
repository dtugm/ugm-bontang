<template>
  <v-col class="h-full flex flex-col bg-bontangA">
    <v-list density="compact" nav @update:selected="changePage">
      <v-list density="compact" nav>
        <AppTextH5 color="white">Bontang</AppTextH5>
      </v-list>
      <!-- <v-divider></v-divider> -->
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
            :prepend-icon="subMenu.prepend_icon"
            :title="subMenu.title"
            :value="subMenu.path"
          ></v-list-item>
        </v-list-group>
        <v-list-item
          v-else
          :prepend-icon="menu.prepend_icon"
          :title="menu.title"
          :value="menu.path"
        ></v-list-item>
      </template>
      <!-- <v-divider inset></v-divider> -->
    </v-list>
    <v-spacer></v-spacer>

    <v-list density="compact" nav>
      <v-divider />
      <v-menu min-width="200px" rounded location="right">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            class="bg-white py-2"
            prepend-avatar="/logo/HD-wallpaper-squid-game-worker-art.jpg"
            title="Sandra Adams"
          >
          </v-list-item>
        </template>
        <v-card>
          <v-card-text>
            <AppButtonSignOut />
          </v-card-text>
        </v-card>
      </v-menu>
    </v-list>
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
