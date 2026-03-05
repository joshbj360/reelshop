<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="isOpen"
                class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
                @click.self="handleClose()"
            >
                <div class="bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                    <!-- ── Header ── -->
                    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-neutral-800 shrink-0">
                        <button
                            @click="handleClose()"
                            class="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                        >
                            <Icon name="mdi:arrow-left" size="22" class="text-gray-900 dark:text-neutral-100" />
                        </button>
                        <h2 class="text-[15px] font-bold text-gray-900 dark:text-neutral-100 tracking-tight">{{ $t('upload.newPost') }}</h2>
                        <button
                            @click="handlePost"
                            :disabled="!canPost || isPosting"
                            class="px-4 py-1.5 bg-brand text-white rounded-full text-[13px] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#c51230] active:scale-95 transition-all"
                        >
                            {{ isPosting ? $t('upload.sharing') : $t('upload.share') }}
                        </button>
                    </div>

                    <!-- ── Scrollable body ── -->
                    <div class="overflow-y-auto flex-1 overscroll-contain">

                        <!-- Author row -->
                        <div class="flex items-center gap-3 px-4 pt-3 pb-1">
                            <Avatar
                                :username="profileStore?.me?.username ?? 'User'"
                                :avatar="profileStore?.me?.avatar ?? ''"
                                size="md"
                            />
                            <div>
                                <p class="font-semibold text-[14px] text-gray-900 dark:text-neutral-100 leading-tight">
                                    {{ profileStore?.me?.username }}
                                </p>
                                <button
                                    @click="showContentTypeSelector = true"
                                    class="flex items-center gap-1 text-[12px] text-gray-500 dark:text-neutral-400 hover:text-brand transition-colors mt-0.5"
                                >
                                    <Icon name="mdi:label-outline" size="14" />
                                    {{ contentTypeLabel }}
                                    <Icon name="mdi:chevron-down" size="14" />
                                </button>
                            </div>
                        </div>

                        <!-- Caption textarea -->
                        <div class="px-4 pb-3">
                            <textarea
                                v-model="content"
                                :placeholder="$t('upload.whatOnMind')"
                                class="w-full min-h-[90px] p-0 bg-transparent text-[15px] text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none resize-none leading-relaxed"
                                @input="extractHashtags"
                            />
                            <div v-if="hashtags.length > 0" class="flex flex-wrap gap-1.5 mt-1">
                                <span v-for="tag in hashtags" :key="tag" class="text-[13px] text-brand font-medium">#{{ tag }}</span>
                            </div>
                        </div>

                        <!-- ── Media Grid ── -->
                        <div class="px-4 pb-3">
                            <!-- Previews grid -->
                            <div v-if="mediaFiles.length > 0" class="grid gap-1.5 mb-2" :class="gridClass">
                                <div
                                    v-for="(item, idx) in mediaFiles"
                                    :key="idx"
                                    class="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800 group aspect-square"
                                >
                                    <img
                                        v-if="item.type === 'image'"
                                        :src="item.preview"
                                        class="w-full h-full object-cover"
                                    />
                                    <video
                                        v-else-if="item.type === 'video'"
                                        :src="item.preview"
                                        class="w-full h-full object-cover"
                                        muted
                                        playsinline
                                    />
                                    <!-- Video indicator -->
                                    <div v-if="item.type === 'video'" class="absolute top-1 left-1 bg-black/50 rounded-full p-1">
                                        <Icon name="mdi:play-circle" size="14" class="text-white" />
                                    </div>
                                    <!-- Remove -->
                                    <button
                                        @click="removeMediaItem(idx)"
                                        class="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"
                                    >
                                        <Icon name="mdi:close" size="14" class="text-white" />
                                    </button>
                                    <!-- Upload progress -->
                                    <div v-if="item.uploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div class="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    </div>
                                    <!-- Order number -->
                                    <div class="absolute bottom-1 left-1 text-[10px] text-white font-bold bg-black/40 rounded-full w-5 h-5 flex items-center justify-center select-none">
                                        {{ idx + 1 }}
                                    </div>
                                </div>

                                <!-- Add more slot -->
                                <button
                                    v-if="mediaFiles.length < 10"
                                    @click="triggerFileInput"
                                    class="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-neutral-700 flex flex-col items-center justify-center hover:border-brand hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <Icon name="mdi:plus" size="22" class="text-gray-400 dark:text-neutral-500" />
                                    <span class="text-[10px] text-gray-400 mt-0.5">{{ $t('common.add') }}</span>
                                </button>
                            </div>

                            <!-- Empty drop zone -->
                            <div
                                v-if="mediaFiles.length === 0"
                                class="border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer"
                                :class="isDragging
                                    ? 'border-brand bg-brand/5'
                                    : 'border-gray-200 dark:border-neutral-700 hover:border-brand hover:bg-gray-50 dark:hover:bg-neutral-800'"
                                @click="triggerFileInput"
                                @dragover.prevent="isDragging = true"
                                @dragleave.prevent="isDragging = false"
                                @drop.prevent="handleDrop"
                            >
                                <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                                    <Icon name="mdi:image-plus-outline" size="32" class="text-gray-400 dark:text-neutral-500" />
                                </div>
                                <p class="font-semibold text-[14px] text-gray-700 dark:text-neutral-300 mb-1">{{ $t('upload.addPhotosVideos') }}</p>
                                <p class="text-[12px] text-gray-400 dark:text-neutral-500">{{ $t('upload.dragDrop') }}</p>
                            </div>

                            <input ref="fileInput" type="file" accept="image/*,video/*" multiple class="hidden" @change="handleFileSelect" />
                            <input ref="musicInput" type="file" accept="audio/*" class="hidden" @change="handleMusicSelect" />
                        </div>

                        <!-- ── Background music ── -->
                        <div class="px-4 pb-3">
                            <div v-if="!musicFile">
                                <button
                                    @click="triggerMusicInput"
                                    :disabled="mediaFiles.length === 0"
                                    class="flex items-center gap-2 px-3 py-2 rounded-full text-[13px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    :class="mediaFiles.length > 0
                                        ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600 dark:text-pink-400 hover:from-pink-500/20 hover:to-purple-500/20'
                                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-400'"
                                >
                                    <Icon name="mdi:music-note-plus" size="16" />
                                    {{ $t('upload.addMusic') }}
                                </button>
                            </div>
                            <div v-else class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border border-pink-100 dark:border-pink-900/30">
                                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shrink-0">
                                    <Icon name="mdi:music-note" size="16" class="text-white" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-[12px] font-semibold text-gray-900 dark:text-neutral-100 truncate">{{ musicFileName }}</p>
                                    <p class="text-[11px] text-pink-400 dark:text-pink-500">{{ $t('music.backgroundMusic') }}</p>
                                </div>
                                <button @click="removeMusic" class="p-1 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-full transition-colors">
                                    <Icon name="mdi:close" size="16" class="text-gray-500 dark:text-neutral-400" />
                                </button>
                            </div>
                        </div>

                        <!-- Product tagging -->
                        <div v-if="showProductTagging" class="px-4 pb-3 border-t border-gray-100 dark:border-neutral-800 pt-3">
                            <button
                                @click="showProductSelector = true"
                                class="flex items-center gap-2 text-[13px] text-gray-500 dark:text-neutral-400 hover:text-brand transition-colors"
                            >
                                <Icon name="mdi:tag-outline" size="18" />
                                <span>{{ $t('upload.tagProducts') }}</span>
                                <span v-if="taggedProducts.length > 0" class="ml-1 px-1.5 py-0.5 bg-brand/10 text-brand rounded-full text-[11px] font-semibold">{{ taggedProducts.length }}</span>
                            </button>
                            <div v-if="taggedProducts.length > 0" class="flex flex-wrap gap-2 mt-2">
                                <div v-for="product in taggedProducts" :key="product.id" class="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-neutral-800 rounded-full text-[12px]">
                                    <span class="text-gray-800 dark:text-neutral-200">{{ product.name }}</span>
                                    <button @click="removeProduct(product.id)"><Icon name="mdi:close-circle" size="14" class="text-gray-400" /></button>
                                </div>
                            </div>
                        </div>

                        <!-- Advanced options -->
                        <div class="px-4 pb-8 border-t border-gray-100 dark:border-neutral-800 pt-3">
                            <button
                                @click="showAdvancedOptions = !showAdvancedOptions"
                                class="flex items-center justify-between w-full text-[13px] text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 transition-colors"
                            >
                                <div class="flex items-center gap-2">
                                    <Icon name="mdi:tune" size="16" />
                                    {{ $t('upload.advancedOptions') }}
                                </div>
                                <Icon name="mdi:chevron-down" size="18" class="transition-transform" :class="{ 'rotate-180': showAdvancedOptions }" />
                            </button>
                            <Transition name="expand">
                                <div v-if="showAdvancedOptions" class="mt-3 space-y-3">
                                    <div>
                                        <label class="block text-[12px] font-medium text-gray-600 dark:text-neutral-400 mb-1.5">{{ $t('upload.whoCanSee') }}</label>
                                        <select v-model="visibility" class="w-full px-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-[13px] text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand">
                                            <option value="PUBLIC">{{ $t('upload.everyone') }}</option>
                                            <option value="FOLLOWERS">{{ $t('upload.followersOnly') }}</option>
                                            <option value="PRIVATE">{{ $t('upload.onlyMe') }}</option>
                                        </select>
                                    </div>
                                    <label class="flex items-center justify-between cursor-pointer">
                                        <span class="text-[13px] text-gray-700 dark:text-neutral-300">{{ $t('upload.allowComments') }}</span>
                                        <input v-model="allowComments" type="checkbox" class="w-5 h-5 rounded text-brand focus:ring-brand" />
                                    </label>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>

                <ContentTypeSelector v-if="showContentTypeSelector" :current="contentType" @select="handleContentTypeSelect" @close="showContentTypeSelector = false" />
                <ProductSelector v-if="showProductSelector" :selected="taggedProducts" @select="handleProductSelect" @close="showProductSelector = false" />
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const { t } = useI18n()
import { usePost } from '../../composables/usePost'
import ContentTypeSelector from './ContentTypeSelector.vue'
import ProductSelector from './ProductSelector.vue'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import Avatar from '~~/layers/profile/app/components/Avatar.vue'
import type { IUploadedMedia } from '~~/layers/base/app/types/media.types'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'posted'])

const profileStore = useProfileStore()
const { createPost } = usePost()
const { uploadMedia, isUploading } = useMediaUpload()

// ── Form state ──────────────────────────────────────────────────────────────
const content = ref('')
const contentType = ref<'EXPERIENCE' | 'INSPIRATION' | 'EDUCATIONAL' | 'ENTERTAINMENT'>('EXPERIENCE')
const visibility = ref<'PUBLIC' | 'FOLLOWERS' | 'PRIVATE'>('PUBLIC')
const allowComments = ref(true)
const hashtags = ref<string[]>([])
const taggedProducts = ref<any[]>([])

// ── Media items ──────────────────────────────────────────────────────────────
interface MediaItem {
    file: File
    type: 'image' | 'video'
    preview: string
    uploading?: boolean
}
const mediaFiles = ref<MediaItem[]>([])

// ── Music ─────────────────────────────────────────────────────────────────────
const musicFile = ref<File | null>(null)
const musicPreview = ref<string | null>(null)
const musicFileName = computed(() => musicFile.value?.name ?? '')

// ── UI ────────────────────────────────────────────────────────────────────────
const isPosting = ref(false)
const isDragging = ref(false)
const showAdvancedOptions = ref(false)
const showContentTypeSelector = ref(false)
const showProductSelector = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const musicInput = ref<HTMLInputElement | null>(null)

// ── Computed ──────────────────────────────────────────────────────────────────
const canPost = computed(() =>
    (content.value.trim().length > 0 || mediaFiles.value.length > 0) && !isPosting.value && !isUploading.value
)

const contentTypeLabel = computed(() =>
    t(`contentTypeLabel.${contentType.value}`, contentType.value)
)

const showProductTagging = computed(() =>
    ['EXPERIENCE', 'INSPIRATION', 'EDUCATIONAL'].includes(contentType.value)
)

// Grid: 1 → full-width, 2 → 2-col, 3+ → 3-col
const gridClass = computed(() => {
    const n = mediaFiles.value.length
    return n === 1 ? 'grid-cols-1' : n === 2 ? 'grid-cols-2' : 'grid-cols-3'
})

// ── File handling ─────────────────────────────────────────────────────────────
const triggerFileInput = () => fileInput.value?.click()
const triggerMusicInput = () => musicInput.value?.click()

const handleFileSelect = (event: Event) => {
    const files = (event.target as HTMLInputElement).files
    if (files) addFiles(Array.from(files))
    ;(event.target as HTMLInputElement).value = ''
}

const handleDrop = (event: DragEvent) => {
    isDragging.value = false
    const files = event.dataTransfer?.files
    if (files) addFiles(Array.from(files))
}

const addFiles = (files: File[]) => {
    for (const file of files) {
        if (mediaFiles.value.length >= 10) break
        if (file.size > 50 * 1024 * 1024) { alert(`${file.name} exceeds 50MB`); continue }
        const type = file.type.startsWith('image/') ? 'image' as const
            : file.type.startsWith('video/') ? 'video' as const
            : null
        if (!type) continue
        mediaFiles.value.push({ file, type, preview: URL.createObjectURL(file) })
    }
}

const removeMediaItem = (idx: number) => {
    URL.revokeObjectURL(mediaFiles.value[idx]!.preview)
    mediaFiles.value.splice(idx, 1)
}

const handleMusicSelect = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    if (file.size > 50 * 1024 * 1024) { alert('Music file must be under 50MB'); return }
    if (musicPreview.value) URL.revokeObjectURL(musicPreview.value)
    musicFile.value = file
    musicPreview.value = URL.createObjectURL(file)
    ;(event.target as HTMLInputElement).value = ''
}

const removeMusic = () => {
    if (musicPreview.value) URL.revokeObjectURL(musicPreview.value)
    musicFile.value = null
    musicPreview.value = null
}

const extractHashtags = () => {
    hashtags.value = (content.value.match(/#[\w]+/g) ?? []).map(t => t.slice(1))
}

const handleContentTypeSelect = (type: string) => {
    contentType.value = type as any
    showContentTypeSelector.value = false
}

const handleProductSelect = (products: any[]) => {
    taggedProducts.value = products
    showProductSelector.value = false
}

const removeProduct = (id: string) => {
    taggedProducts.value = taggedProducts.value.filter(p => p.id !== id)
}

// ── Post submission ───────────────────────────────────────────────────────────
const handlePost = async () => {
    if (!canPost.value) return
    isPosting.value = true

    try {
        // Upload all content media in parallel
        const uploadedMedia = await Promise.all(
            mediaFiles.value.map(async (item) => {
                item.uploading = true
                const result = await uploadMedia({ file: item.file } as IUploadedMedia)
                item.uploading = false
                return result
            })
        )

        // Upload music if present
        let uploadedMusic: any = null
        const musicName = musicFile.value?.name
        if (musicFile.value) {
            uploadedMusic = await uploadMedia({ file: musicFile.value } as IUploadedMedia)
        }

        await createPost({
            content: content.value,
            contentType: contentType.value,
            mediaData: uploadedMedia.length > 0 ? uploadedMedia : undefined,
            musicData: uploadedMusic ? { ...uploadedMusic, name: musicName } : undefined,
            visibility: visibility.value,
            allowComments: allowComments.value,
            taggedProducts: taggedProducts.value.map(p => p.id),
        })

        emit('posted')
        resetForm()
        emit('close')
    } catch (error) {
        console.error('Failed to create post:', error)
        alert(t('errors.failedPost'))
    } finally {
        isPosting.value = false
        mediaFiles.value.forEach(m => { m.uploading = false })
    }
}

const resetForm = () => {
    content.value = ''
    contentType.value = 'EXPERIENCE'
    mediaFiles.value.forEach(m => URL.revokeObjectURL(m.preview))
    mediaFiles.value = []
    removeMusic()
    hashtags.value = []
    taggedProducts.value = []
    visibility.value = 'PUBLIC'
    allowComments.value = true
    showAdvancedOptions.value = false
}

const handleClose = () => {
    if (isPosting.value) return
    if (content.value.trim() || mediaFiles.value.length > 0) {
        if (!confirm(t('upload.confirmDiscard'))) return
    }
    resetForm()
    emit('close')
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active > div, .modal-leave-active > div { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from > div, .modal-leave-to > div { transform: translateY(40px) scale(0.97); }

.expand-enter-active, .expand-leave-active { transition: all 0.25s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }
.expand-enter-to, .expand-leave-from { max-height: 400px; opacity: 1; }
</style>
