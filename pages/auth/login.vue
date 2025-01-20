<template>
  <v-container width="400" class="sm:shadow-md rounded-md py-12 px-5 lg:px-15">
    <div class="pb-5 justify-center flex flex-col items-center">
      <AppTextH2>Welcome Back</AppTextH2>
      <p>Selamat! Anda adalah orang yang terpilih. hehe..</p>
    </div>
    <!-- <v-divider class="py-2" color="primary" :thickness="2">or</v-divider> -->
    <v-form id="login-form" @submit.prevent="Login()">
      <v-text-field
        v-model="email"
        label="Email"
        density="compact"
        variant="outlined"
        type="email"
      ></v-text-field>
      <v-text-field
        :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
        v-model="password"
        label="Password"
        density="compact"
        variant="outlined"
        :type="visible ? 'text' : 'password'"
        @click:append-inner="visible = !visible"
      ></v-text-field>
      <div class="flex flex-col gap-2">
        <AppButton
          color="primary"
          @click="Login"
          label="Sign In"
          class="w-full"
        />
      </div>
    </v-form>
  </v-container>
</template>
<script setup lang="ts">
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const email = ref("");
const password = ref("");
definePageMeta({
  layout: "auth",
});
const visible = ref(false);
const auth = getAuth();
const appStore = useAppStore();
const router = useRouter();
const Login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      appStore.toastSuccess("Login Success!");
      // const user = userCredential.user;
      router.replace("/");
    })
    .catch((error) => {
      appStore.toastError("Login Failed");
    });
};
</script>
