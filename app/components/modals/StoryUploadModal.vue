<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />
      <div class="relative bg-white dark:bg-neutral-900 rounded-xl w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-neutral-100">Create Story</h3>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:text-neutral-400">
            <Icon name="mdi:close" class="w-6 h-6" />
          </button>
        </div>

        <!-- Media Preview -->
        <div
          v-if="mediaPreview"
          class="relative mb-4 rounded-lg overflow-hidden aspect-[9/16] max-h-64 bg-black flex items-center justify-center"
        >
          <video v-if="mediaType === 'video'" :src="mediaPreview" class="max-h-full" controls />
          <img v-else :src="mediaPreview" class="max-h-full object-contain" />
          <button
            @click="clearMedia"
            class="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white"
          >
            <Icon name="mdi:close" size="16" />
          </button>
        </div>

        <!-- Upload Area -->
        <div
          v-else
          @click="fileInput?.click()"
          class="border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-brand transition-colors mb-4"
        >
          <Icon name="mdi:image-plus" size="48" class="mx-auto mb-3 text-gray-400" />
          <p class="text-sm font-medium text-gray-700 dark:text-neutral-300">Tap to add photo or video</p>
          <p class="text-xs text-gray-400 dark:text-neutral-500 mt-1">JPG, PNG, MP4 up to 50MB</p>
        </div>

        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4"
          class="hidden"
          @change="handleFileSelect"
        />

        <!-- Upload Progress -->
        <div v-if="isUploading" class="mb-4">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm text-gray-600 dark:text-neutral-400">Uploading...</span>
            <span class="text-sm text-brand">{{ uploadProgress }}%</span>
          </div>
          <div class="h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div class="h-full bg-brand transition-all" :style="{ width: `${uploadProgress}%` }" />
          </div>
        </div>

        <!-- Error -->
        <p v-if="error" class="text-sm text-red-500 mb-4">{{ error }}</p>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            @click="$emit('close')"
            class="flex-1 py-2 border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handlePost"
            :disabled="!selectedFile || isUploading"
            class="flex-1 py-2 bg-brand text-white rounded-lg font-semibold hover:bg-[#d81b36] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isUploading ? 'Uploading...' : 'Share Story' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useMediaUpload } from '~~/layers/base/app/composables/useMediaUpload'
import { useStory } from '~~/layers/feed/app/composables/useStory'

const props = defineProps<{ isOpen: boolean; initialProductId?: number | null }>()
const emit = defineEmits(['close', 'posted'])

const { uploadMedia, isUploading, uploadError, resetUpload } = useMediaUpload()
const { createStory } = useStory()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const mediaPreview = ref<string | null>(null)
const mediaType = ref<'image' | 'video'>('image')
const error = ref<string | null>(null)
const uploadProgress = ref<number>(0)

const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  selectedFile.value = file
  mediaType.value = file.type.startsWith('video') ? 'video' : 'image'
  mediaPreview.value = URL.createObjectURL(file)
  error.value = null
}

const clearMedia = () => {
  selectedFile.value = null
  mediaPreview.value = null
  if (fileInput.value) fileInput.value.value = ''
  resetUpload()
}

const handlePost = async () => {
  if (!selectedFile.value) return
  error.value = null
  try {
    const uploaded = await uploadMedia({ file: selectedFile.value })
    await createStory({ mediaUrl: uploaded.url, mediaPublicId: uploaded.public_id, mediaType: uploaded.type, productId: props.initialProductId ?? undefined })
    emit('posted')
    emit('close')
    clearMedia()
  } catch (e: any) {
    error.value = e.message || uploadError.value || 'Failed to share story'
  }
}

watch(() => props.isOpen, (open) => {
  if (!open) {
    clearMedia()
    error.value = null
    uploadProgress.value = 0
  }
})
</script>
