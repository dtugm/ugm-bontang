<template>
  <v-dialog
    v-bind="$attrs"
    :value="value"
    :width="width"
    persistent
    @input="input"
  >
    <v-card class="pa-4">
      <v-card-title class="text-h5 grey lighten-2">
        {{ title }}
      </v-card-title>

      <v-card-text class="py-4 px-4">
        <template v-if="$slots.default">
          <slot></slot>
        </template>
        <template v-else>
          <div>This process cannot be reversed</div>
          <div>Deleted data cannot be recovered</div>
          <div>
            If you want the same data, you have to re-enter the data that you
            have deleted
          </div>
        </template>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          variant="outlined"
          class="flex-grow-1 text-none"
          color="secondary"
          @click="onClose"
        >
          {{ closeText }}
        </v-btn>
        <v-btn
          class="flex-grow-1 text-none"
          :color="confirmColor"
          variant="flat"
          :loading="confirmLoading"
          @click="onConfirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Are You Sure?",
    },
    confirmText: {
      type: String,
      default: "Yes, Delete",
    },
    confirmColor: {
      type: String,
      default: "error",
    },
    confirmLoading: {
      type: Boolean,
      default: false,
    },
    closeText: {
      type: String,
      default: "Not Now",
    },
    width: {
      type: String,
      default: "500",
    },
  },
  emits: ["input", "confirm", "close"],
  methods: {
    input(val) {
      this.$emit("input", val);
    },

    onConfirm() {
      this.$emit("confirm");
    },

    onClose() {
      this.$emit("close");
    },
  },
};
</script>
