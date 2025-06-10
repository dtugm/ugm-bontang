<template>
  <AppDialog
    v-model="basicFormDialog.showDialog"
    persistent
    :title="title"
    scrollable
  >
    <v-card-text>
      <slot name="prepend-form"></slot>
      <v-form id="appDialogForm" ref="formRef" @submit.prevent="submit()">
        <AppInputGenerator
          :form-data="basicFormDialog.formData"
          :form-inputs="basicFormInputs"
        />
      </v-form>
      <slot name="append-form"></slot>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        variant="outlined"
        color="secondary"
        @click="basicFormDialog.closeDialog"
      >
        Cancel
      </v-btn>
      <v-btn
        type="submit"
        variant="flat"
        color="primary"
        form="appDialogForm"
        :loading="basicFormDialog.loadingSubmit"
      >
        {{ submitText }}
      </v-btn>
    </v-card-actions>
  </AppDialog>
</template>

<script lang="ts" setup>
defineProps({
  basicFormDialog: {
    type: Object,
    default: () => {},
  },
  basicFormInputs: {
    type: Object,
    default: () => {},
  },
  submitText: {
    type: String,
    default: "Add New",
  },
  title: {
    type: String,
    default: "Add New",
  },
});

const emit = defineEmits(["submit"]);

const formRef = ref();
const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    emit("submit");
  }
};
</script>
