<template>
  <v-dialog
    v-bind="$attrs"
    :model-value="modelValue"
    :width="width"
    :scrollable="scrollable"
    @update:model-value="input"
  >
    <v-card :loading="loading" class="rounded-lg">
      <div>
        <v-card variant="flat">
          <v-card-text class="pb-1">
            <div class="flex justify-between items-center pb-0">
              <AppTextH5>
                {{ title }}
              </AppTextH5>
              <v-btn
                icon
                @click="input(false)"
                density="comfortable"
                color="error"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <slot></slot>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    scrollable: {
      type: Boolean,
      default: true,
    },

    width: {
      type: String,
      default: "720",
    },
    title: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    colorBg: {
      type: String,
      default: "primary",
    },
  },
  emits: ["update:modelValue"],
  methods: {
    input(val) {
      this.$emit("update:modelValue", val);
    },
  },
};
</script>
