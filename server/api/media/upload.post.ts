// POST /api/media/upload - Upload media to Cloudinary and create Media record
import { requireAuth } from '../../layers/shared/middleware/requireAuth'
import { UserError } from '../../layers/profile/types/user.types'
import { prisma } from '../../utils/db'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
const MAX_SIZE_BYTES = 50 * 1024 * 1024 // 50MB

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)

    // Parse multipart form data
    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
      throw new UserError('NO_FILE', 'No file provided', 400)
    }

    const fileField = formData.find(f => f.name === 'file')
    if (!fileField || !fileField.data) {
      throw new UserError('NO_FILE', 'No file field in form data', 400)
    }

    const mimeType = fileField.type || 'image/jpeg'
    if (!ALLOWED_TYPES.includes(mimeType)) {
      throw new UserError('INVALID_TYPE', `File type ${mimeType} not allowed. Allowed: ${ALLOWED_TYPES.join(', ')}`, 400)
    }

    if (fileField.data.length > MAX_SIZE_BYTES) {
      throw new UserError('FILE_TOO_LARGE', 'File must be under 50MB', 400)
    }

    const config = useRuntimeConfig()
    const cloudName = config.public.cloudName
    const uploadPreset = config.public.cloudinaryUploadPreset

    if (!cloudName) {
      throw new UserError('CONFIG_ERROR', 'Cloudinary not configured', 500)
    }

    // Determine resource type
    const resourceType = mimeType.startsWith('video/') ? 'video' : 'image'

    // Upload to Cloudinary via REST API (no SDK needed)
    const uploadFormData = new FormData()
    const blob = new Blob([fileField.data], { type: mimeType })
    uploadFormData.append('file', blob, fileField.filename || 'upload')
    uploadFormData.append('folder', 'reelshop')

    if (uploadPreset) {
      uploadFormData.append('upload_preset', uploadPreset)
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

    // If using signed upload (with API key/secret)
    const cloudinaryApiKey = config.public.CloudinaryApiKey
    const cloudinaryApiSecret = config.private?.cloudinary?.apiSecret

    if (cloudinaryApiKey && cloudinaryApiSecret && !uploadPreset) {
      // Signed upload
      const timestamp = Math.round(Date.now() / 1000)
      uploadFormData.append('api_key', cloudinaryApiKey)
      uploadFormData.append('timestamp', timestamp.toString())
    }

    const uploadResult = await $fetch<{
      secure_url: string
      public_id: string
      resource_type: string
      format: string
      width?: number
      height?: number
      duration?: number
    }>(uploadUrl, {
      method: 'POST',
      body: uploadFormData,
    })

    // Determine MediaType for DB
    const mediaType = resourceType === 'video' ? 'VIDEO' : 'IMAGE'

    // Create Media record in database
    const media = await prisma.media.create({
      data: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        type: mediaType as any,
        authorId: user.id,
        altText: fileField.filename || null,
        metadata: {
          format: uploadResult.format,
          width: uploadResult.width,
          height: uploadResult.height,
          duration: uploadResult.duration,
          resourceType: uploadResult.resource_type,
        },
      }
    })

    return {
      success: true,
      data: {
        mediaId: media.id,
        url: media.url,
        public_id: media.public_id,
        type: media.type,
      }
    }
  } catch (error: any) {
    if (error instanceof UserError) {
      throw createError({ statusCode: error.status, statusMessage: error.message })
    }
    console.error('[Media Upload] Error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to upload media' })
  }
})
