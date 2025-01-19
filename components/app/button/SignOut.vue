<template>
  <v-btn @click="handleSignOut"> Sign Out </v-btn>
</template>
<script setup>
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();
const router = useRouter();
const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      router.replace("/auth/login");
    })
    .catch((error) => {
      // An error happened.
    });
};
</script>
