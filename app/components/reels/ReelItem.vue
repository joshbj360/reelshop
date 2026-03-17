<template>
  <div
    class="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-black"
  >
    <!-- ─── VIDEO PLAYER ─────────────────────────────────────────────── -->
    <video
      ref="videoEl"
      :src="videoUrl"
      class="h-full w-full object-cover"
      loop
      playsinline
      :muted="isMuted"
      @click="togglePlay"
    />

    <!-- Dim overlay for paused state -->
    <Transition name="fade">
      <div
        v-if="!isPlaying"
        class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/30"
      >
        <div
          class="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-sm"
        >
          <Icon name="mdi:play" size="36" class="ml-1 text-white" />
        </div>
      </div>
    </Transition>

    <!-- Gradient overlays for text readability -->
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
    />
    <div
      class="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 bg-gradient-to-b from-black/50 to-transparent"
    />

    <!-- ─── RIGHT ACTION BAR ─────────────────────────────────────────── -->
    <div
      class="absolute bottom-28 right-3 z-20 flex flex-col items-center gap-5"
    >
      <!-- Avatar & Follow -->
      <div class="relative mb-2">
        <NuxtLink :to="`/profile/${reel.author?.username}`">
          <img
            :src="
              reel.author?.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${reel.author?.username}`
            "
            class="h-12 w-12 rounded-full border-2 border-white bg-neutral-800 object-cover shadow-lg"
          />
        </NuxtLink>
        <!-- Quick Follow Button -->
        <button
          class="absolute -bottom-2 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-black bg-brand transition-transform hover:scale-110"
        >
          <Icon name="mdi:plus" size="14" class="text-white" />
        </button>
      </div>

      <!-- Like -->
      <button
        @click.stop="handleLike"
        class="group flex flex-col items-center gap-1"
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md transition-colors group-hover:bg-black/40"
        >
          <Icon
            :name="isLiked ? 'mdi:heart' : 'mdi:heart-outline'"
            size="26"
            class="transition-transform group-active:scale-75"
            :class="
              isLiked
                ? 'text-brand drop-shadow-[0_0_8px_rgba(240,44,86,0.8)]'
                : 'text-white'
            "
          />
        </div>
        <span class="text-shadow text-[12px] font-bold text-white">{{
          formatCount(localLikeCount)
        }}</span>
      </button>

      <!-- Comment -->
      <button
        @click.stop="$emit('open-comments', reel)"
        class="group flex flex-col items-center gap-1"
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md transition-colors group-hover:bg-black/40"
        >
          <Icon
            name="mdi:comment-processing-outline"
            size="24"
            class="text-white transition-transform group-active:scale-75"
          />
        </div>
        <span class="text-shadow text-[12px] font-bold text-white">{{
          formatCount(reel.commentCount || 0)
        }}</span>
      </button>

      <!-- Share -->
      <button
        @click.stop="handleShare"
        class="group flex flex-col items-center gap-1"
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md transition-colors group-hover:bg-black/40"
        >
          <Icon
            name="mdi:share-variant"
            size="24"
            class="text-white transition-transform group-active:scale-75"
          />
        </div>
        <span class="text-shadow text-[12px] font-bold text-white">{{
          formatCount(reel.shareCount || 0)
        }}</span>
      </button>

      <!-- Mute Toggle -->
      <button
        @click.stop="isMuted = !isMuted"
        class="mt-2 flex flex-col items-center gap-1"
      >
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur-md"
        >
          <Icon
            :name="isMuted ? 'mdi:volume-off' : 'mdi:volume-high'"
            size="16"
            class="text-white"
          />
        </div>
      </button>
    </div>

    <!-- ─── BOTTOM INFO OVERLAY ──────────────────────────────────────── -->
    <div class="absolute bottom-6 left-4 right-16 z-20 flex flex-col gap-2.5">
      <!-- Author Info -->
      <div class="flex items-center gap-2">
        <NuxtLink
          :to="`/profile/${reel.author?.username}`"
          class="text-shadow text-[15px] font-bold text-white hover:underline"
        >
          @{{ reel.author?.username || 'User' }}
        </NuxtLink>
        <span
          v-if="reel.contentType === 'POST'"
          class="rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md"
        >
          Buyer Post
        </span>
      </div>

      <!-- Caption -->
      <p
        v-if="reel.caption"
        class="text-shadow line-clamp-2 pr-4 text-sm leading-snug text-white/95"
      >
        {{ reel.caption }}
      </p>

      <!-- Shop Now CTA (If Product Tagged) -->
      <NuxtLink
        v-if="taggedProduct"
        :to="`/product/${taggedProduct.slug || taggedProduct.id}`"
        class="mt-1 inline-flex w-max items-center gap-2 rounded-full border border-white/50 bg-white/95 px-5 py-2.5 text-sm font-bold text-black shadow-xl backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
        @click.stop
      >
        <div class="rounded-full bg-brand/10 p-1 text-brand">
          <Icon name="mdi:shopping" size="16" />
        </div>
        Shop Now • {{ formatPrice(taggedProduct.price || 0) }}
      </NuxtLink>

      <!-- Progress Bar -->
      <div
        class="relative mt-2 h-1 w-full cursor-pointer overflow-hidden rounded-full bg-white/20"
        @click.stop="seekVideo"
      >
        <div
          class="h-full bg-white transition-none"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import type { IFeedItem } from '~~/layers/feed/app/types/feed.types'
import { usePostStore } from '~~/layers/post/app/store/post.store'
import { usePost } from '~~/layers/post/app/composables/usePost'
import { useSettings } from '~/composables/useSettings' // Adjust path if needed

const props = defineProps<{
  reel: IFeedItem
  isActive: boolean
  index: number
}>()

const emit = defineEmits<{
  'open-comments': [reel: IFeedItem]
}>()

// DOM & Media State
const videoEl = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const progress = ref(0)
const { settings } = useSettings() // Assuming this manages global app settings
const isMuted = ref(settings.value?.autoMute ?? false)

// Stores & Actions
const postStore = usePostStore()
const { likePost, unlikePost } = usePost()

// Computed Data
const videoUrl = computed(() =>
  props.reel.media?.type === 'VIDEO' ? props.reel.media.url : '',
)
const taggedProduct = computed(
  () => props.reel.taggedProducts?.[0] ?? props.reel.product ?? null,
)
const isLiked = computed(() => postStore.isPostLiked(props.reel.id))
const localLikeCount = ref(props.reel.likeCount || 0)

// ─── PLAYBACK CONTROL ─────────────────────────────────────────────────
watch(
  () => props.isActive,
  (active) => {
    if (!videoEl.value) return

    if (active) {
      // Play when active
      videoEl.value
        .play()
        .then(() => {
          isPlaying.value = true
        })
        .catch((err) => {
          console.warn('Autoplay prevented:', err)
          isPlaying.value = false
        })
    } else {
      // Reset when inactive
      videoEl.value.pause()
      videoEl.value.currentTime = 0
      isPlaying.value = false
      progress.value = 0
    }
  },
  { immediate: true },
)

const togglePlay = () => {
  if (!videoEl.value) return
  if (videoEl.value.paused) {
    videoEl.value
      .play()
      .then(() => {
        isPlaying.value = true
      })
      .catch(() => {})
  } else {
    videoEl.value.pause()
    isPlaying.value = false
  }
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────
let progressTimer: ReturnType<typeof setInterval> | null = null

watch(
  () => props.isActive,
  (active) => {
    if (progressTimer) clearInterval(progressTimer)

    if (active) {
      progressTimer = setInterval(() => {
        if (!videoEl.value) return
        const { currentTime, duration } = videoEl.value
        progress.value = duration ? (currentTime / duration) * 100 : 0
      }, 100) // Faster interval for smoother bar
    } else {
      progress.value = 0
    }
  },
)

const seekVideo = (e: MouseEvent) => {
  if (!videoEl.value) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const clickPos = (e.clientX - rect.left) / rect.width
  videoEl.value.currentTime = clickPos * videoEl.value.duration
}

onUnmounted(() => {
  if (progressTimer) clearInterval(progressTimer)
})

// ─── INTERACTIONS ─────────────────────────────────────────────────────
const handleLike = async () => {
  // Optimistic UI update
  if (isLiked.value) {
    localLikeCount.value--
    await unlikePost(props.reel.id)
  } else {
    localLikeCount.value++
    await likePost(props.reel.id)
  }
}

const handleShare = async () => {
  const url = `${window.location.origin}/post/${props.reel.id}`
  if (navigator.share) {
    await navigator
      .share({
        url,
        title:
          props.reel.caption ||
          `Check out this Reel from @${props.reel.author?.username}`,
      })
      .catch(() => {})
  } else {
    await navigator.clipboard.writeText(url).catch(() => {})
    // Optionally trigger a toast notification here
  }
}

// ─── UTILS ────────────────────────────────────────────────────────────
const formatCount = (n: number) => {
  if (!n) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

const { formatPrice } = useCurrency()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Clean, readable text shadow for overlaying text on videos */
.text-shadow {
  text-shadow:
    1px 1px 3px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(0, 0, 0, 0.4);
}
</style>
