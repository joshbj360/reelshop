/**
 * useMediaUpload
 * Shared composable for uploading files.
 * Bridges the UI with the MediaApiClient.
 */

import { useMediaApi } from '../services/media.api'
import type {
  IUploadedMedia,
  ICloudinaryUploadResult,
} from '../types/media.types'

export const useMediaUpload = () => {
  const mediaApi = useMediaApi()

  const isUploading = ref(false)
  const uploadError = ref<string | null>(null)

  const uploadMedia = async (
    media: IUploadedMedia,
  ): Promise<ICloudinaryUploadResult> => {
    isUploading.value = true
    uploadError.value = null

    try {
      const response = await mediaApi.upload(media)
      return response.data as ICloudinaryUploadResult
    } catch (error: any) {
      console.error('Upload failed:', error)
      const message =
        error?.data?.statusMessage || error?.message || 'Failed to upload media'
      uploadError.value = message
      throw new Error(message)
    } finally {
      isUploading.value = false
    }
  }

  /**
   * Reset upload state
   */
  const resetUpload = () => {
    isUploading.value = false
    uploadError.value = null
  }

  return {
    // Expose as readonly computed properties for safety
    isUploading: computed(() => isUploading.value),
    uploadError: computed(() => uploadError.value),

    // Methods
    uploadMedia,
    resetUpload,
  }
}
