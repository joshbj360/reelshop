<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="product"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center"
        @click.self="$emit('close')"
      >
        <!-- Modal Container -->
        <div
          class="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl md:h-[88vh] md:max-h-[860px] md:rounded-3xl lg:max-w-6xl dark:bg-neutral-900"
        >
          <!-- Mobile drag indicator -->
          <div
            class="pointer-events-none absolute left-1/2 top-3 z-50 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/20 md:hidden dark:bg-white/20"
          ></div>

          <!-- Close button (Mobile) -->
          <button
            @click="$emit('close')"
            class="absolute right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 shadow-sm backdrop-blur-md md:hidden"
          >
            <Icon name="mdi:close" size="20" class="text-white" />
          </button>

          <!-- ── LAYOUT WRAPPER ── -->
          <!-- Mobile: single column scroll. Desktop: fixed two-column, each side scrolls independently -->
          <div
            class="relative flex flex-1 flex-col overflow-y-auto bg-white md:flex-row md:overflow-hidden dark:bg-neutral-900"
          >
            <!-- ── Left: Image Gallery ── -->
            <div
              class="sticky top-0 z-0 flex h-[45vh] w-full shrink-0 flex-col bg-gray-50 md:relative md:h-full md:w-[46%] md:shrink-0 dark:bg-neutral-800"
            >
              <template v-if="mediaItems.length">
                <!-- Main image — click to zoom -->
                <div
                  class="group relative flex flex-1 cursor-zoom-in items-center justify-center overflow-hidden"
                  @click="isZoomed = true"
                >
                  <img
                    :src="mediaItems[currentIndex]?.url"
                    :alt="product.title"
                    class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <!-- Zoom hint -->
                  <div
                    class="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
                  >
                    <Icon name="mdi:magnify-plus-outline" size="13" />
                    Zoom
                  </div>
                </div>

                <!-- Navigation arrows (over image) -->
                <button
                  v-if="mediaItems.length > 1 && currentIndex > 0"
                  @click.stop="currentIndex--"
                  class="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 shadow-sm backdrop-blur-md transition-colors hover:bg-black/60"
                >
                  <Icon name="mdi:chevron-left" size="24" class="pr-0.5 text-white" />
                </button>
                <button
                  v-if="mediaItems.length > 1 && currentIndex < mediaItems.length - 1"
                  @click.stop="currentIndex++"
                  class="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 shadow-sm backdrop-blur-md transition-colors hover:bg-black/60"
                >
                  <Icon name="mdi:chevron-right" size="24" class="pl-0.5 text-white" />
                </button>

                <!-- Mobile: Pagination Dots -->
                <div
                  v-if="mediaItems.length > 1"
                  class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/20 p-2 backdrop-blur-md md:hidden"
                >
                  <button
                    v-for="(_, i) in mediaItems"
                    :key="i"
                    @click.stop="currentIndex = i"
                    class="h-1.5 rounded-full transition-all"
                    :class="i === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'"
                  />
                </div>

                <!-- Desktop: Thumbnail strip -->
                <div
                  v-if="mediaItems.length > 1"
                  class="hidden shrink-0 gap-2 bg-gray-100 p-2 md:flex dark:bg-neutral-900"
                >
                  <button
                    v-for="(m, i) in mediaItems"
                    :key="i"
                    @click="currentIndex = i"
                    class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-all dark:bg-neutral-800"
                    :class="i === currentIndex ? 'border-brand shadow-sm shadow-brand/20' : 'border-transparent opacity-60 hover:opacity-100'"
                  >
                    <img :src="m.url" class="h-full w-full object-contain" />
                  </button>
                </div>
              </template>

              <div v-else class="flex h-full w-full items-center justify-center">
                <Icon name="mdi:image-outline" size="64" class="text-gray-300 dark:text-neutral-600" />
              </div>
            </div>

            <!-- ── Right: Details (slides over image on mobile, fixed scroll on desktop) ── -->
            <div
              class="custom-scrollbar relative z-10 -mt-8 flex min-h-[65vh] flex-1 flex-col rounded-t-3xl bg-white pt-2 shadow-[0_-16px_32px_rgba(0,0,0,0.12)] md:mt-0 md:h-full md:min-h-0 md:overflow-y-auto md:rounded-none md:pt-0 md:shadow-none dark:bg-neutral-900"
            >
              <!-- Sublte drag indicator for the sliding panel -->
              <div
                class="mx-auto mb-1 mt-2 h-1.5 w-10 rounded-full bg-gray-200 md:hidden dark:bg-neutral-700"
              ></div>

              <!-- Header -->
              <div class="shrink-0 px-4 pb-4 pt-3 md:px-8 md:pt-8">
                <div class="min-w-0 flex-1 pr-12">
                  <!-- Seller chip -->
                  <NuxtLink
                    v-if="product.seller"
                    :to="`/sellers/profile/${product.seller.store_slug}`"
                    @click="$emit('close')"
                    class="group/seller mb-3 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 py-1 pl-1 pr-3 transition-colors hover:border-brand/30 hover:bg-brand/5 dark:border-neutral-800 dark:bg-neutral-800"
                  >
                    <img
                      v-if="product.seller.store_logo"
                      :src="product.seller.store_logo"
                      class="h-5 w-5 rounded-full border border-gray-100 object-cover dark:border-neutral-700"
                    />
                    <div
                      v-else
                      class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900"
                    >
                      <Icon
                        name="mdi:store"
                        size="11"
                        class="text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                    <span
                      class="text-[12px] font-semibold text-gray-500 transition-colors group-hover/seller:text-brand dark:text-neutral-400"
                    >
                      {{ product.seller.store_name }}
                    </span>
                  </NuxtLink>

                  <h2
                    class="text-[18px] font-extrabold leading-snug text-gray-900 md:text-2xl dark:text-neutral-100"
                  >
                    {{ product.title }}
                  </h2>

                  <div class="mt-2.5 flex items-baseline gap-2.5">
                    <span
                      class="text-2xl font-black tracking-tight text-gray-900 md:text-3xl dark:text-neutral-100"
                      >{{
                        formatPrice(
                          discountedPrice,
                          product?.seller?.default_currency ?? 'NGN',
                        )
                      }}</span
                    >
                    <span
                      v-if="discountPercent > 0"
                      class="text-[14px] font-medium text-gray-400 line-through dark:text-neutral-500"
                      >{{
                        formatPrice(
                          product.price,
                          product?.seller?.default_currency ?? 'NGN',
                        )
                      }}</span
                    >
                    <span
                      v-if="discountPercent > 0"
                      class="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm shadow-brand/30"
                      >−{{ discountPercent }}%</span
                    >
                  </div>
                </div>

                <!-- Close (Desktop) -->
                <button
                  @click="$emit('close')"
                  class="absolute right-6 top-6 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 md:flex dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <Icon
                    name="mdi:close"
                    size="18"
                    class="text-gray-600 dark:text-neutral-300"
                  />
                </button>

                <!-- Divider -->
                <div class="mt-4 h-px bg-gray-100 dark:bg-neutral-800" />
              </div>

              <!-- Body -->
              <div class="flex-1 space-y-5 px-4 pb-4 md:space-y-6 md:px-8">
                <!-- Badges -->
                <div
                  v-if="product.isThrift || product.isAccessory"
                  class="flex flex-wrap gap-2"
                >
                  <span
                    v-if="product.isThrift"
                    class="rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >Pre-loved Thrift</span
                  >
                  <span
                    v-if="product.isAccessory"
                    class="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    >Accessory</span
                  >
                </div>

                <!-- Description -->
                <div
                  v-if="product.description"
                  class="rounded-2xl bg-gray-50 p-4 dark:bg-neutral-800"
                >
                  <p
                    class="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500"
                  >
                    Description
                  </p>
                  <div class="relative">
                    <p
                      class="text-[13.5px] leading-relaxed text-gray-700 md:text-[14px] dark:text-neutral-300"
                      :class="descExpanded ? '' : 'line-clamp-4'"
                    >
                      {{ product.description }}
                    </p>
                    <!-- Gradient fade when collapsed -->
                    <div
                      v-if="!descExpanded && product.description.length > 150"
                      class="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 dark:from-neutral-800"
                    />
                  </div>
                  <button
                    v-if="product.description.length > 150"
                    @click="descExpanded = !descExpanded"
                    class="mt-2 flex items-center gap-1 text-[12px] font-semibold text-brand hover:underline"
                  >
                    {{ descExpanded ? 'Show less' : 'Read more' }}
                    <Icon
                      :name="descExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                      size="14"
                    />
                  </button>
                </div>

                <!-- Variant selector -->
                <div
                  v-if="product.variants && product.variants.length > 0"
                  class="rounded-2xl bg-gray-50 p-4 dark:bg-neutral-800"
                >
                  <div class="mb-3 flex items-center justify-between">
                    <p
                      class="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500"
                    >
                      Select Size / Option
                    </p>
                    <p
                      v-if="
                        selectedVariant &&
                        selectedVariant.stock <= 5 &&
                        selectedVariant.stock > 0
                      "
                      class="flex items-center gap-1 text-[11px] font-bold text-amber-500"
                    >
                      <Icon name="mdi:fire" size="12" />
                      Only {{ selectedVariant.stock }} left!
                    </p>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="variant in product.variants"
                      :key="variant.id"
                      @click="variant.stock > 0 && (selectedVariant = variant)"
                      :disabled="variant.stock === 0"
                      class="relative overflow-hidden rounded-xl border-2 px-4 py-2.5 text-[13px] font-bold transition-all"
                      :class="[
                        variant.stock === 0
                          ? 'cursor-not-allowed border-gray-200 bg-white/60 text-gray-300 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-600'
                          : selectedVariant?.id === variant.id
                            ? 'border-brand bg-white text-brand shadow-sm shadow-brand/10 dark:bg-neutral-900 dark:bg-brand/10'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-brand/40 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300',
                      ]"
                    >
                      {{ variant.size }}
                      <!-- Strike-through line for out of stock -->
                      <div
                        v-if="variant.stock === 0"
                        class="absolute inset-0 top-1/2 h-0.5 w-full -translate-y-1/2 -rotate-12 bg-gray-300 dark:bg-neutral-600"
                      ></div>
                    </button>
                  </div>
                  <p
                    v-if="!selectedVariant"
                    class="mt-2 flex items-center gap-1 text-[12px] font-medium text-brand"
                  >
                    <Icon name="mdi:alert-circle-outline" size="14" /> Please
                    select an option to continue
                  </p>
                </div>

                <!-- Background music player -->
                <div
                  v-if="bgMusic"
                  class="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                >
                  <audio
                    ref="audioRef"
                    :src="bgMusic.url"
                    loop
                    preload="none"
                    @ended="bgMusicPlaying = false"
                  />
                  <button
                    @click="toggleBgMusic"
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-sm transition-colors hover:bg-[#d81b36]"
                  >
                    <Icon
                      :name="bgMusicPlaying ? 'mdi:pause' : 'mdi:play'"
                      size="20"
                    />
                  </button>
                  <div class="min-w-0 flex-1">
                    <p
                      class="truncate text-[12px] font-bold text-gray-900 dark:text-neutral-100"
                    >
                      Background Audio
                    </p>
                    <div class="mt-0.5 flex items-center gap-1">
                      <Icon
                        name="mdi:music-note"
                        size="12"
                        class="text-brand"
                      />
                      <span
                        class="text-[11px] font-medium text-gray-500 dark:text-neutral-400"
                        >{{
                          bgMusicPlaying ? 'Playing now...' : 'Tap to listen'
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End of Scrollable Wrapper -->

          <!-- ── Footer Actions (Sticky at bottom always) ── -->
          <div
            class="relative z-20 shrink-0 space-y-3 border-t border-gray-100 bg-white px-4 pb-6 pt-4 md:px-8 md:pb-8 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <!-- Quantity and Add to Cart Row -->
            <div class="flex items-center gap-2 md:gap-3">
              <!-- Quantity -->
              <div
                v-if="canAddToCart || selectedVariant"
                class="flex h-[50px] shrink-0 items-center overflow-hidden rounded-xl border-2 border-gray-200 bg-white md:h-[52px] dark:border-neutral-700 dark:bg-neutral-900"
              >
                <button
                  @click="qty = Math.max(1, qty - 1)"
                  class="flex h-full w-10 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 md:w-11 dark:text-neutral-400 dark:hover:bg-neutral-800"
                >
                  <Icon name="mdi:minus" size="16" />
                </button>
                <span
                  class="w-8 text-center text-[14px] font-extrabold text-gray-900 dark:text-neutral-100"
                  >{{ qty }}</span
                >
                <button
                  @click="qty = Math.min(maxQty, qty + 1)"
                  class="flex h-full w-10 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 md:w-11 dark:text-neutral-400 dark:hover:bg-neutral-800"
                >
                  <Icon name="mdi:plus" size="16" />
                </button>
              </div>

              <!-- Add to Cart Button -->
              <button
                @click="handleAddToCart"
                :disabled="!canAddToCart || isAdding"
                class="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-xl text-[14px] font-bold transition-all md:h-[52px] md:text-[15px]"
                :class="
                  cartAdded
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : canAddToCart
                      ? 'bg-brand text-white shadow-lg shadow-brand/20 hover:bg-[#d81b36] active:scale-[0.98]'
                      : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-neutral-800'
                "
              >
                <template v-if="cartAdded">
                  <Icon name="mdi:check-circle" size="20" /> Added!
                </template>
                <template v-else-if="isAdding">
                  <Icon
                    name="eos-icons:loading"
                    size="20"
                    class="animate-spin"
                  />
                  Adding…
                </template>
                <template v-else-if="!product.variants?.length">
                  Not available
                </template>
                <template v-else-if="isSoldOut"> Sold out </template>
                <template v-else>
                  <Icon name="mdi:cart-plus" size="20" /> Add to Cart
                </template>
              </button>
            </div>

            <!-- Create content buttons (logged-in users) -->
            <ClientOnly>
              <div
                v-if="profileStore.isLoggedIn"
                class="flex gap-2 pt-2 md:gap-3"
              >
                <button
                  @click="showPostModal = true"
                  class="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-gray-100 bg-gray-50 py-2.5 text-[12px] font-bold text-gray-600 transition-all hover:border-brand hover:bg-brand/5 hover:text-brand dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
                >
                  <Icon name="mdi:camera-plus-outline" size="18" />
                  Create Post
                </button>
                <button
                  @click="showStoryModal = true"
                  class="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-gray-100 bg-gray-50 py-2.5 text-[12px] font-bold text-gray-600 transition-all hover:border-brand hover:bg-brand/5 hover:text-brand dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
                >
                  <Icon name="mdi:image-plus-outline" size="18" />
                  Add to Story
                </button>
              </div>
            </ClientOnly>

            <!-- Stats -->
            <div
              v-if="product._count"
              class="flex items-center justify-center gap-6 pt-1 text-[12px] font-medium text-gray-400 dark:text-neutral-500"
            >
              <span class="flex items-center gap-1.5"
                ><Icon name="mdi:heart" size="14" class="text-brand/70" />
                {{ product._count.likes }}</span
              >
              <button
                @click="$emit('open-comments', product)"
                class="flex items-center gap-1.5 transition-colors hover:text-blue-400"
              >
                <Icon
                  name="mdi:comment-processing"
                  size="14"
                  class="text-blue-400/70"
                />
                {{ product._count.comments }}
              </button>
              <span class="flex items-center gap-1.5"
                ><Icon
                  name="mdi:share-variant"
                  size="14"
                  class="text-green-400/70"
                />
                {{ product._count.shares }}</span
              >
              <!-- Direct product link -->
              <NuxtLink
                :to="`/product/${product.slug}`"
                target="_blank"
                class="ml-auto flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500 transition-colors hover:border-brand hover:text-brand dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                @click.stop
              >
                <Icon name="mdi:open-in-new" size="12" />
                View page
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Post creation modal (product pre-tagged) -->
    <PostUploadModal
      v-if="showPostModal"
      :is-open="showPostModal"
      :initial-tagged-product="
        product ? { id: product.id, name: product.title } : null
      "
      @close="showPostModal = false"
      @posted="showPostModal = false"
    />

    <!-- Story creation modal (product linked) -->
    <StoryUploadModal
      v-if="showStoryModal"
      :is-open="showStoryModal"
      :initial-product-id="product?.id ?? null"
      @close="showStoryModal = false"
      @posted="showStoryModal = false"
    />

    <!-- ── Image Lightbox ── -->
    <Transition name="lightbox">
      <div
        v-if="isZoomed"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
        @click.self="isZoomed = false"
      >
        <!-- Close -->
        <button
          @click="isZoomed = false"
          class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <Icon name="mdi:close" size="22" />
        </button>

        <!-- Counter -->
        <div
          v-if="mediaItems.length > 1"
          class="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[13px] font-semibold text-white backdrop-blur-md"
        >
          {{ currentIndex + 1 }} / {{ mediaItems.length }}
        </div>

        <!-- Image -->
        <img
          :src="mediaItems[currentIndex]?.url"
          :alt="product?.title"
          class="max-h-[90vh] max-w-[92vw] object-contain drop-shadow-2xl"
        />

        <!-- Prev -->
        <button
          v-if="mediaItems.length > 1 && currentIndex > 0"
          @click="currentIndex--"
          class="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
        >
          <Icon name="mdi:chevron-left" size="28" />
        </button>

        <!-- Next -->
        <button
          v-if="mediaItems.length > 1 && currentIndex < mediaItems.length - 1"
          @click="currentIndex++"
          class="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
        >
          <Icon name="mdi:chevron-right" size="28" />
        </button>

        <!-- Thumbnail strip -->
        <div
          v-if="mediaItems.length > 1"
          class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2"
        >
          <button
            v-for="(m, i) in mediaItems"
            :key="i"
            @click="currentIndex = i"
            class="h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-white/5 transition-all"
            :class="i === currentIndex ? 'border-white scale-110' : 'border-white/30 opacity-50 hover:opacity-90'"
          >
            <img :src="m.url" class="h-full w-full object-contain" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type {
  IProduct,
  IProductVariant,
} from '~~/layers/commerce/app/types/commerce.types'
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'
import PostUploadModal from '~~/layers/post/app/components/modals/PostUploadModal.vue'
import StoryUploadModal from '~/components/modals/StoryUploadModal.vue'

// Assume you have a cart composable
const { addToCart } = useCart()

const props = defineProps<{ product: IProduct | null }>()
const emit = defineEmits(['close', 'open-comments'])

const profileStore = useProfileStore()

const currentIndex = ref(0)
const selectedVariant = ref<IProductVariant | null>(null)
const qty = ref(1)
const isAdding = ref(false)
const cartAdded = ref(false)
const descExpanded = ref(false)
const showPostModal = ref(false)
const showStoryModal = ref(false)
const bgMusicPlaying = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)
const isZoomed = ref(false)

watch(
  () => props.product?.id,
  () => {
    currentIndex.value = 0
    selectedVariant.value = null
    qty.value = 1
    cartAdded.value = false
    descExpanded.value = false
    showPostModal.value = false
    showStoryModal.value = false
    bgMusicPlaying.value = false
    isZoomed.value = false
    if (audioRef.value) {
      audioRef.value.pause()
      audioRef.value.currentTime = 0
    }
  },
)

// Keyboard navigation for lightbox
const onKeydown = (e: KeyboardEvent) => {
  if (!isZoomed.value) return
  if (e.key === 'Escape') { isZoomed.value = false; return }
  if (e.key === 'ArrowLeft' && currentIndex.value > 0) currentIndex.value--
  if (e.key === 'ArrowRight' && currentIndex.value < mediaItems.value.length - 1) currentIndex.value++
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

const mediaItems = computed(() =>
  (props.product?.media ?? []).filter((m: any) => !m.isBgMusic),
)
const bgMusic = computed(
  () => (props.product?.media ?? []).find((m: any) => m.isBgMusic) ?? null,
)

const toggleBgMusic = () => {
  if (!audioRef.value) return
  if (bgMusicPlaying.value) {
    audioRef.value.pause()
    bgMusicPlaying.value = false
  } else {
    audioRef.value.play()
    bgMusicPlaying.value = true
  }
}

import { formatProductPrice } from '~/utils/currency'
const formatPrice = (price: number, cur: string) =>
  formatProductPrice(price, cur as any)

const discountPercent = computed(() => props.product?.discount ?? 0)
const discountedPrice = computed(() => {
  if (!props.product) return 0
  if (discountPercent.value > 0)
    return Math.round(props.product.price * (1 - discountPercent.value / 100))
  return props.product.price
})

const maxQty = computed(() =>
  selectedVariant.value ? Math.min(selectedVariant.value.stock, 99) : 99,
)

const isSoldOut = computed(() => {
  const variants = props.product?.variants
  if (!variants?.length) return false
  return variants.every((v) => v.stock === 0)
})

const canAddToCart = computed(() => {
  if (isSoldOut.value) return false
  const variants = props.product?.variants
  if (!variants?.length) return false // no variants = not purchasable
  return !!selectedVariant.value
})

const handleAddToCart = async () => {
  if (!canAddToCart.value || !props.product) return
  const variantId = selectedVariant.value?.id
  if (!variantId) return

  isAdding.value = true
  try {
    await addToCart(variantId, qty.value)
    cartAdded.value = true
    setTimeout(() => {
      cartAdded.value = false
    }, 1800)
  } catch {
    // useCart handles error notification
  } finally {
    isAdding.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: translateY(40px) scale(0.96);
}

/* Lightbox transition */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
.lightbox-enter-active img,
.lightbox-leave-active img {
  transition: transform 0.2s ease;
}
.lightbox-enter-from img,
.lightbox-leave-to img {
  transform: scale(0.92);
}

/* Custom Scrollbar for the details section */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #404040;
}
</style>
