<template>
  <v-list mandatory density="compact" nav @update:selected="changePage">
    <template v-for="(menu, index) in filteredMenus" :key="index">
      <!-- Menu dengan Sub Menu -->
      <v-list-group v-if="menu.sub_menu" :value="menu.title">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :prepend-icon="menu.prepend_icon"
            :title="rail ? '' : menu.title"
            class="mb-1"
          >
            <template v-slot:prepend>
              <v-icon :color="isMenuActive(menu) ? 'tertiary' : 'grey'">
                {{ menu.prepend_icon }}
              </v-icon>
            </template>

            <!-- Tooltip untuk Rail Mode -->
            <v-tooltip v-if="rail" activator="parent" location="end">
              {{ menu.title }}
            </v-tooltip>
          </v-list-item>
        </template>

        <!-- Sub Menu Items -->
        <v-list-item
          v-for="(subMenu, subIndex) in menu.sub_menu"
          :key="subIndex"
          :active="subMenu.path === selectedTab"
          :title="rail ? '' : subMenu.title"
          :value="subMenu.path"
          class="rounded-l-xl ml-2 mb-1"
          active-color="tertiary"
        >
          <template v-slot:prepend>
            <v-icon
              :color="subMenu.path === selectedTab ? 'tertiary' : 'grey'"
              size="20"
            >
              {{ subMenu.prepend_icon }}
            </v-icon>
          </template>

          <v-tooltip v-if="rail" activator="parent" location="end">
            {{ subMenu.title }}
          </v-tooltip>
        </v-list-item>
      </v-list-group>

      <!-- Menu Tanpa Sub Menu -->
      <v-list-item
        v-else
        :ripple="false"
        :prepend-icon="menu.prepend_icon"
        :title="rail ? '' : menu.title"
        :value="menu.path"
        :active="
          route.path === menu.path || route.path.startsWith(menu.path + '/')
        "
        active-color="tertiary"
        class="rounded-l-xl mb-1"
      >
        <template v-slot:prepend>
          <v-icon
            :color="
              route.path === menu.path || route.path.startsWith(menu.path + '/')
                ? 'tertiary'
                : 'grey'
            "
          >
            {{ menu.prepend_icon }}
          </v-icon>
        </template>

        <v-tooltip v-if="rail" activator="parent" location="end">
          {{ menu.title }}
        </v-tooltip>
      </v-list-item>
    </template>
  </v-list>
</template>
<script lang="ts" setup>
import { filterMenuByAccess } from "~/app/helper/auth.helper";
import userMenusConstant from "~/app/constant/user/userMenus.constant";
const authStore = useAuthenticationStore();
const props = defineProps({
  rail: {
    type: Boolean,
    default: false,
  },
});
const isMenuActive = (menu: any) => {
  if (menu.sub_menu) {
    return menu.sub_menu.some((sub: any) => sub.path === selectedTab.value);
  }
  return false;
};
const filteredMenus = computed(() =>
  filterMenuByAccess(userMenusConstant.All_Menus, authStore.userAccessPaths)
);
const route = useRoute();
const selectedTab = ref(route.path);
const changePage = (item: any) => {
  selectedTab.value = item[0];
  navigateTo(item[0]);
};
</script>
<style scoped>
.rounded-left {
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
}
</style>
