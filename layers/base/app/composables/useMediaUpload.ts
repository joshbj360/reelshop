/**
 * useMediaUpload
 * Shared composable for uploading files to Cloudinary via /api/media/upload
 * Returns mediaId, url, and type for use in post/avatar/story creation
 */

export interface IUploadedMedia {
  mediaId: string
  url: string
  public_id: string | null
  type: 'IMAGE' | 'VIDEO' | 'AUDIO'
}

export const useMediaUpload = () => {
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const uploadError = ref<string | null>(null)

  /**
   * Upload a file and return media metadata
   * @param file - The File object to upload
   */
  const uploadMedia = async (file: File): Promise<IUploadedMedia> => {
    isUploading.value = true
    uploadError.value = null
    uploadProgress.value = 0

    try {
      const formData = new FormData()
      formData.append('file', file, file.name)

      const result = await $fetch<{ success: boolean; data: IUploadedMedia }>('/api/media/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (event) => {
          if (event.total) {
            uploadProgress.value = Math.round((event.loaded / event.total) * 100)
          }
        },
      })

      uploadProgress.value = 100
      return result.data
    } catch (error: any) {
      const message = error?.data?.statusMessage || error?.message || 'Failed to upload media'
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
    uploadProgress.value = 0
    uploadError.value = null
  }

  return {
    isUploading,
    uploadProgress,
    uploadError,
    uploadMedia,
    resetUpload,
  }
}
