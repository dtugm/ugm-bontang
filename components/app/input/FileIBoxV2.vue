<template>
  <label v-if="label" :for="label">{{ label }}</label>
  <v-card
    class="pa-10 border border-dashed"
    variant="flat"
    :class="{ 'drag-over': isDragOver }"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <v-card-title class="text-center">
      <v-icon size="50">mdi-file-import</v-icon>
      <p color="text">
        Drag your file here or
        <span
          class="text-secondary underline hover:cursor-pointer"
          @click="openFileManager"
        >
          Click to browse
        </span>
      </p>
    </v-card-title>
    <input
      :id="label || undefined"
      ref="photoRef"
      type="file"
      style="display: none"
      @input="changePhoto"
    />
  </v-card>
  <div class="flex items-center mt-2">
    <v-icon>mdi-paperclip</v-icon>
    <p v-if="!file">No File Added</p>
    <v-chip v-if="file" color="primary" text-color="white" outlined>
      {{ file.name }} - {{ formatFileSize(file.size) }}
      <v-btn class="pa-0" icon="mdi-delete" variant="plain" />
    </v-chip>
  </div>
  <!-- Image Preview Section -->
  <div v-if="file || preview_img" class="mt-4">
    <img
      :src="file ? photo_update : preview_img"
      alt="Preview"
      class="max-w-full h-auto rounded"
    />
  </div>
</template>
<script lang="ts" setup>
const file: any = ref<File | null>();
const isDragOver = ref(false);
const handleDragOver = () => {
  isDragOver.value = true;
};
const handleDragLeave = () => {
  isDragOver.value = false;
};
const emit = defineEmits(["update:modelValue"]);
const handleDrop = (event: DragEvent) => {
  isDragOver.value = false;
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    file.value = event.dataTransfer.files[0];
    emit("update:modelValue", event.dataTransfer.files[0]);
  }
};
const formatFileSize = (size: number) => {
  return (size / 1024).toFixed(2) + " KB";
};

defineProps<
  Partial<{
    modelValue: any;
    label: string;
    placeholder: string;
    fileType: string;
    preview_img: string;
  }>
>();

const photoRef = ref<HTMLInputElement>();
function openFileManager() {
  if (photoRef.value) {
    photoRef.value.click();
  }
}

const photo_update = ref("");
function changePhoto(ev: any) {
  if (ev.target.files.length) {
    const photoFile: File = ev.target.files[0];
    file.value = ev.target.files[0];
    photo_update.value = URL.createObjectURL(photoFile);
    emit("update:modelValue", photoFile);
  }
}
</script>
