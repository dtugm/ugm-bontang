<template>
  <v-container>
    <v-form id="login-form" @submit.prevent="Login()">
      <v-text-field
        v-model="email"
        label="Email"
        density="compact"
        variant="outlined"
        type="email"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        density="compact"
        variant="outlined"
        type="password"
      ></v-text-field>
      <v-btn class="bg-blue" type="submit" form="login-form">Login</v-btn>
    </v-form>
  </v-container>
</template>
<script setup lang="ts">
const email = ref("");
const password = ref("");
definePageMeta({
  layout: "auth",
});
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const auth = getAuth();
const router = useRouter();
const Login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      router.replace("/");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};
</script>
