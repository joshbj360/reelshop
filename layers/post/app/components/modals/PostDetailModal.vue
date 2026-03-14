<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-300 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="post"
        class="fixed inset-0 z-40 bg-black/70"
        @click="$emit('close')"
      />
    </transition>

    <!-- Modal container -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="translate-y-full sm:translate-y-0 sm:opacity-0 sm:scale-95"
      leave-to-class="translate-y-full sm:translate-y-0 sm:opacity-0 sm:scale-95"
    >
      <div
        v-if="post"
        class="pointer-events-none fixed inset-x-0 bottom-0 z-50 sm:inset-0 sm:flex sm:items-center sm:justify-center"
      >
        <div
          @click.stop
          class="pointer-events-auto flex w-full flex-col overflow-hidden bg-white shadow-2xl sm:max-w-3xl sm:flex-row sm:rounded-xl dark:bg-neutral-900"
          :style="{ maxHeight: '92vh' }"
        >
          <!-- Content-type accent stripe (top on mobile, left on desktop) -->
          <div
            class="h-[3px] w-full shrink-0 sm:h-auto sm:w-[3px]"
            :class="accentBgClass"
          />

          <!-- ── LEFT: Media carousel (desktop only) ─────────────── -->
          <div
            v-if="hasMedia"
            class="relative hidden shrink-0 items-center justify-center bg-black sm:flex sm:w-[55%]"
          >
            <!-- Media item -->
            <video
              v-if="currentMedia.type === 'VIDEO'"
              :key="currentMedia.url"
              :src="currentMedia.url"
              :poster="currentMedia.thumbnailUrl"
              class="h-full w-full object-contain"
              controls
              playsinline
            />
            <img
              v-else
              :key="currentMedia.url"
              :src="currentMedia.url"
              :alt="post.caption || 'Post'"
              class="h-full w-full object-contain"
            />

            <!-- Prev / Next arrows -->
            <template v-if="mediaItems.length > 1">
              <button
                @click.stop="prev"
                class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70"
                :class="
                  currentIndex === 0 ? 'pointer-events-none opacity-30' : ''
                "
                aria-label="Previous"
              >
                <Icon name="mdi:chevron-left" size="22" />
              </button>
              <button
                @click.stop="next"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70"
                :class="
                  currentIndex === mediaItems.length - 1
                    ? 'pointer-events-none opacity-30'
                    : ''
                "
                aria-label="Next"
              >
                <Icon name="mdi:chevron-right" size="22" />
              </button>

              <!-- Dot indicators -->
              <div
                class="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5"
              >
                <button
                  v-for="(_, i) in mediaItems"
                  :key="i"
                  @click.stop="currentIndex = i"
                  class="h-1.5 w-1.5 rounded-full transition-all duration-200"
                  :class="i === currentIndex ? 'w-3 bg-white' : 'bg-white/50'"
                  :aria-label="`Go to image ${i + 1}`"
                />
              </div>
            </template>

            <!-- Background music mini-player -->
            <div
              v-if="post.bgMusic"
              class="absolute left-3 right-3 top-3 flex items-center gap-2 rounded-xl bg-black/60 px-3 py-2 backdrop-blur-sm"
            >
              <div
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600"
              >
                <Icon name="mdi:music-note" size="14" class="text-white" />
              </div>
              <p class="flex-1 truncate text-[11px] text-white/90">
                {{ post.bgMusic.name ?? 'Background music' }}
              </p>
              <audio
                ref="bgMusicRef"
                :src="post.bgMusic.url"
                loop
                class="hidden"
              />
              <button
                @click.stop="toggleMusic"
                class="shrink-0 text-white/80 transition-colors hover:text-white"
              >
                <Icon
                  :name="isMusicPlaying ? 'mdi:pause' : 'mdi:play'"
                  size="18"
                />
              </button>
            </div>
          </div>

          <!-- ── RIGHT: Details panel ────────────────────────────── -->
          <div class="flex min-h-0 min-w-0 flex-1 flex-col">
            <!-- Mobile: media carousel stacked on top -->
            <div
              v-if="hasMedia"
              class="relative shrink-0 bg-black sm:hidden"
              style="aspect-ratio: 4/5; max-height: 38vh"
            >
              <video
                v-if="currentMedia.type === 'VIDEO'"
                :key="currentMedia.url + '-mob'"
                :src="currentMedia.url"
                :poster="currentMedia.thumbnailUrl"
                class="h-full w-full object-contain"
                controls
                playsinline
              />
              <img
                v-else
                :key="currentMedia.url + '-mob'"
                :src="currentMedia.url"
                :alt="post.caption || 'Post'"
                class="h-full w-full object-contain"
              />

              <!-- Mobile prev/next -->
              <template v-if="mediaItems.length > 1">
                <button
                  @click.stop="prev"
                  class="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
                  :class="
                    currentIndex === 0 ? 'pointer-events-none opacity-30' : ''
                  "
                >
                  <Icon name="mdi:chevron-left" size="20" />
                </button>
                <button
                  @click.stop="next"
                  class="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
                  :class="
                    currentIndex === mediaItems.length - 1
                      ? 'pointer-events-none opacity-30'
                      : ''
                  "
                >
                  <Icon name="mdi:chevron-right" size="20" />
                </button>
                <!-- Mobile dots -->
                <div
                  class="absolute bottom-2 left-0 right-0 flex justify-center gap-1"
                >
                  <button
                    v-for="(_, i) in mediaItems"
                    :key="i"
                    @click.stop="currentIndex = i"
                    class="h-1.5 w-1.5 rounded-full transition-all duration-200"
                    :class="
                      i === currentIndex ? 'w-2.5 bg-white' : 'bg-white/50'
                    "
                  />
                </div>
              </template>

              <!-- Mobile bg music pill -->
              <div
                v-if="post.bgMusic"
                class="absolute left-2 right-2 top-2 flex items-center gap-2 rounded-lg bg-black/60 px-2.5 py-1.5 backdrop-blur-sm"
              >
                <Icon
                  name="mdi:music-note"
                  size="12"
                  class="shrink-0 text-pink-400"
                />
                <p class="flex-1 truncate text-[10px] text-white/90">
                  {{ post.bgMusic.name ?? 'Music' }}
                </p>
                <audio
                  ref="bgMusicRefMob"
                  :src="post.bgMusic.url"
                  loop
                  class="hidden"
                />
                <button
                  @click.stop="toggleMusicMob"
                  class="shrink-0 text-white/80"
                >
                  <Icon
                    :name="isMusicPlayingMob ? 'mdi:pause' : 'mdi:play'"
                    size="16"
                  />
                </button>
              </div>
            </div>

            <!-- Pass post + close emitter to the details panel -->
            <PostDetails :post="post" @close="$emit('close')" />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import PostDetails from '../PostDetails.vue'
import type { IFeedItem } from '~~/layers/feed/app/types/feed.types'

const props = defineProps<{ post: IFeedItem | null }>()
defineEmits(['close'])

const currentIndex = ref(0)
const bgMusicRef = ref<HTMLAudioElement | null>(null)
const bgMusicRefMob = ref<HTMLAudioElement | null>(null)
const isMusicPlaying = ref(false)
const isMusicPlayingMob = ref(false)

// Reset carousel index when post changes
watch(
  () => props.post?.id,
  () => {
    currentIndex.value = 0
  },
)

const mediaItems = computed(() => {
  if (!props.post) return []
  if (props.post.mediaItems?.length) return props.post.mediaItems
  if (props.post.media?.url) return [props.post.media]
  return []
})

const hasMedia = computed(() => mediaItems.value.length > 0)
const currentMedia = computed(
  () => mediaItems.value[currentIndex.value] ?? mediaItems.value[0],
)

const prev = () => {
  if (currentIndex.value > 0) currentIndex.value--
}
const next = () => {
  if (currentIndex.value < mediaItems.value.length - 1) currentIndex.value++
}

const toggleMusic = () => {
  if (!bgMusicRef.value) return
  if (isMusicPlaying.value) {
    bgMusicRef.value.pause()
    isMusicPlaying.value = false
  } else {
    bgMusicRef.value.play()
    isMusicPlaying.value = true
  }
}
const toggleMusicMob = () => {
  if (!bgMusicRefMob.value) return
  if (isMusicPlayingMob.value) {
    bgMusicRefMob.value.pause()
    isMusicPlayingMob.value = false
  } else {
    bgMusicRefMob.value.play()
    isMusicPlayingMob.value = true
  }
}

const ACCENT: Record<string, string> = {
  EXPERIENCE: 'bg-blue-500',
  INSPIRATION: 'bg-amber-400',
  COMMERCE: 'bg-emerald-500',
  EDUCATIONAL: 'bg-orange-500',
  ENTERTAINMENT: 'bg-pink-500',
}

const accentBgClass = computed(() =>
  props.post
    ? ACCENT[props.post.contentType] ?? 'bg-gray-300 dark:bg-neutral-700'
    : '',
)
</script>
