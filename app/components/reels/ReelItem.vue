<template>
    <div class="relative w-full h-[100dvh] bg-black flex items-center justify-center overflow-hidden">

        <!-- Video -->
        <video
            ref="videoEl"
            :src="videoUrl"
            class="w-full h-full object-cover"
            loop
            playsinline
            :muted="isMuted"
            @click="togglePlay"
        />

        <!-- Dim overlay for paused state -->
        <Transition name="fade">
            <div v-if="!isPlaying" class="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                <div class="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Icon name="mdi:play" size="36" class="text-white ml-1" />
                </div>
            </div>
        </Transition>

        <!-- Gradient overlays -->
        <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        <div class="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

        <!-- Right action bar -->
        <div class="absolute right-3 bottom-28 flex flex-col items-center gap-5 z-10">
            <!-- Avatar -->
            <div class="relative">
                <NuxtLink :to="`/profile/${reel.author?.username}`">
                    <img
                        :src="reel.author?.avatar || ''"
                        class="w-11 h-11 rounded-full border-2 border-white object-cover bg-neutral-700"
                    />
                </NuxtLink>
                <button aria-label="Follow user" class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-brand rounded-full flex items-center justify-center border-2 border-black">
                    <Icon name="mdi:plus" size="10" class="text-white" />
                </button>
            </div>

            <!-- Like -->
            <button :aria-label="isLiked ? `Unlike reel, ${localLikeCount} likes` : `Like reel, ${localLikeCount} likes`" @click.stop="handleLike" class="flex flex-col items-center gap-1">
                <div class="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <Icon
                        :name="isLiked ? 'mdi:heart' : 'mdi:heart-outline'"
                        size="24"
                        :class="isLiked ? 'text-brand' : 'text-white'"
                    />
                </div>
                <span class="text-white text-[11px] font-semibold" aria-hidden="true">{{ formatCount(localLikeCount) }}</span>
            </button>

            <!-- Comment -->
            <button :aria-label="`Open comments, ${reel.commentCount || 0} comments`" @click.stop="$emit('open-comments', reel)" class="flex flex-col items-center gap-1">
                <div class="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <Icon name="mdi:comment-outline" size="22" class="text-white" />
                </div>
                <span class="text-white text-[11px] font-semibold" aria-hidden="true">{{ formatCount(reel.commentCount || 0) }}</span>
            </button>

            <!-- Share -->
            <button :aria-label="`Share reel, ${reel.shareCount || 0} shares`" @click.stop="handleShare" class="flex flex-col items-center gap-1">
                <div class="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <Icon name="mdi:share-outline" size="22" class="text-white" />
                </div>
                <span class="text-white text-[11px] font-semibold" aria-hidden="true">{{ formatCount(reel.shareCount || 0) }}</span>
            </button>

            <!-- Mute -->
            <button :aria-label="isMuted ? 'Unmute video' : 'Mute video'" @click.stop="isMuted = !isMuted" class="flex flex-col items-center gap-1">
                <div class="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <Icon :name="isMuted ? 'mdi:volume-off' : 'mdi:volume-high'" size="22" class="text-white" />
                </div>
            </button>
        </div>

        <!-- Bottom info -->
        <div class="absolute bottom-6 left-4 right-16 z-10">
            <NuxtLink :to="`/profile/${reel.author?.username}`" class="flex items-center gap-2 mb-2">
                <span class="text-white font-bold text-sm">@{{ reel.author?.username }}</span>
            </NuxtLink>
            <p v-if="reel.caption" class="text-white/90 text-sm leading-snug line-clamp-2">{{ reel.caption }}</p>

            <!-- Tagged product -->
            <NuxtLink
                v-if="taggedProduct"
                :to="`/discover?product=${taggedProduct.id}`"
                class="mt-2 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5"
                @click.stop
            >
                <Icon name="mdi:shopping-outline" size="14" class="text-white" />
                <span class="text-white text-xs font-semibold truncate max-w-[140px]">{{ taggedProduct.title }}</span>
            </NuxtLink>

            <!-- Progress bar -->
            <div class="mt-3 h-0.5 bg-white/20 rounded-full overflow-hidden">
                <div class="h-full bg-white/70 transition-none" :style="{ width: `${progress}%` }" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IFeedItem } from '~~/layers/feed/app/types/feed.types'
import { usePostStore } from '~~/layers/post/app/store/post.store'
import { usePost } from '~~/layers/post/app/composables/usePost'

const props = defineProps<{
    reel: IFeedItem
    isActive: boolean
    index: number
}>()

defineEmits<{ 'open-comments': [reel: IFeedItem] }>()

const videoEl = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const progress = ref(0)
const { settings } = useSettings()
const isMuted = ref(settings.value.autoMute)

const postStore = usePostStore()
const { likePost, unlikePost } = usePost()

const videoUrl = computed(() => props.reel.media?.type === 'VIDEO' ? props.reel.media.url : '')
const taggedProduct = computed(() => props.reel.taggedProducts?.[0] ?? null)
const isLiked = computed(() => postStore.isPostLiked(props.reel.id))
const localLikeCount = ref(props.reel.likeCount || 0)

// Play/pause based on isActive
watch(() => props.isActive, (active) => {
    if (!videoEl.value) return
    if (active) {
        videoEl.value.play().then(() => { isPlaying.value = true }).catch(() => {})
    } else {
        videoEl.value.pause()
        videoEl.value.currentTime = 0
        isPlaying.value = false
        progress.value = 0
    }
}, { immediate: true })

// Progress bar
let progressTimer: ReturnType<typeof setInterval> | null = null
watch(() => props.isActive, (active) => {
    if (progressTimer) clearInterval(progressTimer)
    if (active) {
        progressTimer = setInterval(() => {
            if (!videoEl.value) return
            const { currentTime, duration } = videoEl.value
            progress.value = duration ? (currentTime / duration) * 100 : 0
        }, 250)
    } else {
        progress.value = 0
    }
})

onUnmounted(() => { if (progressTimer) clearInterval(progressTimer) })

const togglePlay = () => {
    if (!videoEl.value) return
    if (videoEl.value.paused) {
        videoEl.value.play().then(() => { isPlaying.value = true }).catch(() => {})
    } else {
        videoEl.value.pause()
        isPlaying.value = false
    }
}

const handleLike = async () => {
    if (isLiked.value) {
        localLikeCount.value--
        await unlikePost(props.reel.id)
    } else {
        localLikeCount.value++
        await likePost(props.reel.id)
    }
}

const handleShare = async () => {
    if (navigator.share) {
        await navigator.share({ url: window.location.href, title: props.reel.caption || 'Check this reel' }).catch(() => {})
    } else {
        await navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
}

const formatCount = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n.toString()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>