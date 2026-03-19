/**
 * Media API Service
 * Handles file uploads and media management.
 * Extends BaseApiClient to inherit auth headers and error handling.
 */

import type {
  IUploadedMedia,
  ICloudinaryUploadResult,
} from '../types/media.types'
import { BaseApiClient } from './base.api'

export class MediaApiClient extends BaseApiClient {
  /**
   * Upload a file to the server/Cloudinary
   * @param file The file object to upload
   */
  async upload(media: IUploadedMedia): Promise<ICloudinaryUploadResult> {
    const formData = new FormData()
    if (!media.file) {
      throw new Error('File is required for upload')
    }

    formData.append('file', media.file, media.file.name)

    return this.request('/api/media/upload', {
      method: 'POST',
      body: formData,
      // Note: We don't set 'Content-Type': 'multipart/form-data'.
      // Fetch automatically sets this with the correct boundary when passing FormData.
    })
  }

  /**
   * Delete media by ID
   */
  async delete(
    mediaId: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/media/${mediaId}`, {
      method: 'DELETE',
    })
  }
}

/**
 * Composable to use MediaApiClient
 */
export const useMediaApi = () => {
  return new MediaApiClient()
}
