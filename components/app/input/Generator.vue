<template>
  <v-row class="my-1">
    <template v-for="(input, index) in formInputs" :key="index">
      <template v-if="input">
        <v-col
          class="py-0 ma-0"
          :class="['py-' + input.py, 'px-' + input.px]"
          :cols="input.cols"
          :sm="input.sm"
          :md="input.md"
          :lg="input.lg"
        >
          <component
            :is="getInputComponent(input)"
            v-if="input.type == 'richtexteditor'"
            v-model:content="formData[index]"
            v-bind="getInputProp(input)"
          ></component>
          <component
            :is="getInputComponent(input)"
            v-else
            v-model="formData[index]"
            hide-details
            v-bind="getInputProp(input)"
            v-on="getEmitHandlers(input, index)"
          ></component>
        </v-col>
      </template>
    </template>
  </v-row>
</template>

<script setup lang="ts">
type InputType = NonNullable<IFormInput["type"]>;

const componentMap: Record<InputType, any> = {
  autocomplete: resolveComponent("AppInputAutocomplete"),
  autocomplete_server: resolveComponent("AppInputAutocompleteServer"),
  checkbox: resolveComponent("AppInputCheckbox"),
  combobox: resolveComponent("AppInputCombobox"),
  datepicker: resolveComponent("AppInputDatePicker"),
  datepicker_v2: resolveComponent("AppInputDatePickerV2"),
  daterange: resolveComponent("AppInputDateRange"),
  file: resolveComponent("AppInputFile"),
  file_v2: resolveComponent("AppInputFileV2"),
  file_image: resolveComponent("AppInputFileImage"),
  file_image_v2: resolveComponent("AppInputFileImageV2"),
  icon: resolveComponent("AppInputIcon"),
  parent_menu: resolveComponent("AppInputParentMenu"),
  password: resolveComponent("AppInputPassword"),
  select: resolveComponent("AppInputSelect"),
  textarea: resolveComponent("AppInputTextarea"),
  usergroup: resolveComponent("AppInputUsergroup"),
  usergroupaccess: resolveComponent("AppInputUsergroupAccess"),
  provider: resolveComponent("AppInputProvider"),
  project_phase: resolveComponent("AppInputProjectPhase"),
  text: resolveComponent("AppInputText"),
  number: resolveComponent("AppInputText"),
  richtexteditor: resolveComponent("AppInputRichTextEditor"),
  filebox: resolveComponent("AppInputFileBox"),
  milestone: resolveComponent("AppInputMilestone"),
  kontraktor: resolveComponent("AppInputKontraktor"),
  radio: resolveComponent("AppInputRadio"),
  siteRealId: resolveComponent("AppInputSiteRealList"),
};

defineProps<{
  formInputs: TFormInputs<any>;
  formData: any;
}>();

function getInputProp(input: IFormInput) {
  return { ...input };
}
function getInputComponent(input: IFormInput) {
  return componentMap[input.type || "text"];
}
function getEmitHandlers(input: any, index: any) {
  const handlers: Record<string, Function> = {};
  if (input.emit) {
    Object.entries(input.emit).forEach(([event, handler]: any) => {
      handlers[event] = (...args: any[]) => handler(...args, index);
    });
  }
  return handlers;
}
</script>
