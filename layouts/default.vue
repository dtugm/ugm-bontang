<template>
  <v-layout>
    <div class="relative">
      <v-navigation-drawer
        flat
        v-model="drawer"
        :rail="rail"
        @click="rail = false"
        class="bg-white border-none"
      >
        <div class="absolute w-full">
          <AppSidebar />
        </div>

        <template v-slot:append>
          <AppButtonSignOut />
        </template>
      </v-navigation-drawer>
    </div>

    <v-app-bar flat class="shadow-sm bg-transparent">
      <!-- <v-app-bar-nav-icon @click="drawer = !drawer" /> -->
      <v-toolbar-title> {{ stringHelper.titleCase(pathName) }}</v-toolbar-title>
      <v-spacer />
      <v-menu :close-on-content-click="false" location="bottom left">
        <template v-slot:activator="{ props }">
          <v-btn color="tertiary" v-bind="props" icon size="small">
            <v-icon size="32">mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-card min-width="200">
          <v-list>
            <v-list-item
              :subtitle="authStore.user.email"
              :title="authStore.user.username"
            >
              <template v-slot:prepend>
                <v-avatar color="grey-lighten-1">
                  <v-icon color="white">mdi-account</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
            <v-divider></v-divider>

            <v-card-text>
              <AppButtonSignOut :is-button="true" />
            </v-card-text>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-main class="bg-grayish">
      <slot />
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import stringHelper from "~/app/helper/string.helper";
const authStore = useAuthenticationStore();
const route = useRoute();
const drawer = ref(true);
const rail = ref(false);
const pathName = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "Dashboard";
});
</script>
