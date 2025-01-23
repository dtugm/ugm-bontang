<template>
  <v-container>
    <v-row no-gutters class="items-center gap-4">
      <slot name="prepend"></slot>
      <AppTextH5 color="primary"> Update persil Survey</AppTextH5>
      <v-btn class="text-none mx-2" variant="outlined" color="green"
        >Update</v-btn
      >
      <v-spacer></v-spacer>
      <v-col lg="3">
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          placeholder="Search..."
          density="compact"
          clearable
          hide-details
        />
      </v-col>
    </v-row>
    <v-data-table
      v-model="updateId"
      show-select
      item-value="persil_id"
      :search="search"
      :items="persilMock.persil_table_mock"
      :headers="persilConstant.header"
    >
      <template #item.status="{ item }">
        <v-chip :color="item.status ? 'success' : 'error'">
          {{ item.status ? "DONE" : "Not Done" }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>
<script setup>
import persilMock from "~/app/mock/persil.mock";
import persilConstant from "~/app/constant/persil.constant";
const updateId = ref([]);
const search = ref("");
</script>
