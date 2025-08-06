<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
const error = useError(); // Ambil error dari context

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <v-app>
    <v-container>
      <v-row class="justify-center align-content-center text-center">
        <v-col class="my-10 py-10">
          <nuxt-link to="/" class="d-flex self-center">
            <!-- <v-img src="/images/bakti.png" width="74px" height="32px"></v-img> -->
          </nuxt-link>

          <v-img
            src="/illustration/dev.svg"
            class="mx-auto"
            style="max-width: 450px"
          >
          </v-img>
          <h1 class="text-h4 mb-2">
            {{
              error?.statusCode != 404
                ? error?.statusCode
                : "Website under development"
            }}
          </h1>
          <p v-if="error?.statusCode == 404">
            This website is currently undergoing scheduled development. We will
            annouce you shortly
          </p>
          <v-btn class="my-3" color="primary" @click="handleError"
            >Back to Home</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
