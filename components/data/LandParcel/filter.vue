<template>
  <v-container>
    <v-row>
      <v-col>
        <AppInputAutocomplete label="Kelurahan" is-filter hide-details />
      </v-col>
      <v-col>
        <AppInputAutocomplete
          label="Status Wajib Pajak"
          is-filter
          hide-details
        />
      </v-col>
      <v-col>
        <AppInputAutocomplete label="Jenis Tanah" is-filter hide-details />
      </v-col>
      <v-col cols="auto">
        <AppButton color="tertiary" label="Filter" />
      </v-col>
    </v-row>
  </v-container>
</template>
