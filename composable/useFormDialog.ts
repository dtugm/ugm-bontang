import type { UnwrapRef } from "vue";
import { actionWrapper } from "~/app/helper";

export const useFormDialog = <TPayloadOrParams>(
  apiForm?: any,
  afterSubmit?: any,
  isResetAfterSubmit: boolean = true,
  isResetAfterClose: boolean = true
) => {
  const showDialog = ref(false);
  const confirmDialog = ref(false);
  const isEdit = ref(false);
  const formData = ref<TPayloadOrParams>({} as TPayloadOrParams);
  function resetFormData() {
    const empty = ref<TPayloadOrParams>({} as TPayloadOrParams);
    Object.assign(formData, empty);
  }
  function openEdit() {
    isEdit.value = true;
  }
  function closeEdit() {
    isEdit.value = false;
  }
  function openConfirmDialog() {
    confirmDialog.value = true;
  }
  function closeConfirmDialog() {
    confirmDialog.value = false;
  }
  function openDialog() {
    showDialog.value = true;
  }
  function closeDialog() {
    showDialog.value = false;
    if (isResetAfterClose) resetFormData();
  }
  function closeDialogWithNoReset() {
    showDialog.value = false;
  }

  const loadingSubmit = ref(false);

  const submit = async () => {
    loadingSubmit.value = true;
    return await actionWrapper(async () => {
      return apiForm(formData.value);
    })
      .then((resp) => {
        if (afterSubmit) afterSubmit();
        closeDialog();
        closeConfirmDialog();
        if (isResetAfterSubmit)
          formData.value = {} as UnwrapRef<TPayloadOrParams>;
        return resp;
      })
      .finally(() => {
        loadingSubmit.value = false;
      });
  };

  return {
    showDialog,
    loadingSubmit,
    formData,
    openDialog,
    closeDialog,
    closeDialogWithNoReset,
    submit,
    openConfirmDialog,
    closeConfirmDialog,
    confirmDialog,
    isEdit,
    openEdit,
    closeEdit,
    resetFormData,
  };
};
