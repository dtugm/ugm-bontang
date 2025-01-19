<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const auth = getAuth();
const Login = () => {
  signInWithEmailAndPassword(auth, "test1@gmail.com", "password_test1")
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
    });
};
</script>
<template>login</template>
