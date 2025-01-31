<template>
  <v-list nav class="h-[calc(100vh-124px-100px)]" lines="two">
    <v-list-item
      v-for="(item, index) in 18"
      :key="index"
      title="Nama"
      @click=""
    >
      <template #subtitle>
        <v-progress-linear :height="12" rounded></v-progress-linear>
      </template>
    </v-list-item>
  </v-list>
</template>
