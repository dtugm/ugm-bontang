<template>
  <v-list nav density="compact" v-if="!isButton">
    <v-list-item
      title="Sign Out"
      prepend-icon="mdi-exit-run"
      @click="signOutDialog = true"
    ></v-list-item>
  </v-list>
  <v-btn
    v-if="isButton"
    class="text-none text-left justify-start"
    variant="flat"
    block
    prepend-icon="mdi-logout"
    @click="signOutDialog = true"
  >
    <template #prepend>
      <v-icon color="grey"></v-icon>
    </template>
    Logout
  </v-btn>
  <AppDialog v-model="signOutDialog" title="Sign out" width="400">
    <v-card>
      <v-card-text> Are you sure u want to exit the app? </v-card-text>
      <v-card-actions>
        <v-btn
          variant="outlined"
          class="flex-grow-1 text-none"
          color="secondary"
          @click="signOutDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          class="flex-grow-1 text-none"
          color="error"
          variant="flat"
          @click="auth.logout"
        >
          Sign Out
        </v-btn>
      </v-card-actions>
    </v-card>
  </AppDialog>
</template>
<script setup>
const signOutDialog = ref(false);
const auth = useAuthenticationStore();
const props = defineProps({
  isButton: {
    type: Boolean,
    required: true,
    default: false,
  },
});
</script>
