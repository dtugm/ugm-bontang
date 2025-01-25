<template>
  <v-card>
    <v-card-text>
      Presensi Harian
      <v-list>
        <v-list-item
          lines="two"
          v-for="employee in employees"
          :key="employee.user_id"
          :value="employee.user_id"
          :subtitle="employee.work_type"
          :title="employee.user_email"
        >
          <template v-slot:prepend>
            <v-avatar color="grey-lighten-1">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>
          </template>
          <template v-slot:append>
            <v-chip :color="employee.status ? 'success' : 'error'">
              {{ employee.status ? "Checked In" : "Checked Out" }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import { collection } from "firebase/firestore";
import appMock from "~/app/mock/app.mock";
const items = appMock.items;
const header = appMock.header;
const db = useFirestore();
const employees = useCollection(collection(db, "attendance"));
</script>
