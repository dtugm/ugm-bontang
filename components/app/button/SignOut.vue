<template>
  <v-btn
    block
    class="text-none"
    color="error"
    prepend-icon="mdi-exit-run"
    @click="signOutDialog = true"
  >
    Sign Out
  </v-btn>
  <AppDialog v-model="signOutDialog" title="Sign out" width="400">
    <v-card>
      <!-- <v-card-title class="text-h5 grey lighten-2"> Sign Out? </v-card-title> -->
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
          @click="handleSignOut"
        >
          Sign Out
        </v-btn>
      </v-card-actions>
    </v-card>
  </AppDialog>
</template>
<script setup>
import { getAuth, signOut } from "firebase/auth";
const signOutDialog = ref(false);
const auth = getAuth();
const router = useRouter();
const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      router.replace("/auth/login");
    })
    .catch((error) => {
      // An error happened
    });
};
</script>
