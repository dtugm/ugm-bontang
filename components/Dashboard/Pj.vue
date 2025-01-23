<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text> Progress Grid </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-text> Progress Grid </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="h-dvh">
      <v-col>
        <v-data-table :items="items" :headers="header">
          <template #item.status="{ item }">
            <v-chip :color="item.status ? 'success' : 'error'">
              {{ item.status ? "DONE" : "Not Done" }}
            </v-chip>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="5">
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
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
import { collection } from "firebase/firestore";
import appMock from "~/app/mock/app.mock";
const items = appMock.items;
const header = appMock.header;
const db = useFirestore();
// import { getAuth, updateProfile } from "firebase/auth";
// import { collection, doc } from "firebase/firestore";
// const db = useFirestore();
const employees = useCollection(collection(db, "attendance"));
// const auth = getAuth();
// const user = ref(auth.currentUser);
</script>
