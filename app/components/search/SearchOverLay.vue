<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 bg-white dark:bg-neutral-950">
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-neutral-800">
          <button @click="$emit('close')" class="md:hidden">
            <Icon name="mdi:arrow-left" size="24" />
          </button>
          <div class="flex-1 relative">
            <Icon name="mdi:magnify" size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products, stores, posts… or @username"
              autofocus
              class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-neutral-800 rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none"
            />
          </div>
          <button v-if="searchQuery" @click="searchQuery = ''" class="text-gray-500 dark:text-neutral-400">
            <Icon name="mdi:close" size="20" />
          </button>
        </div>

        <!-- Results -->
        <div class="flex-1 overflow-y-auto">
          <!-- Empty State -->
          <div v-if="!searchQuery" class="text-center text-gray-500 dark:text-neutral-400 py-20">
            <Icon name="mdi:magnify" size="48" class="mb-3 mx-auto" />
            <p>Search for users, stores, products, or posts</p>
          </div>

          <!-- Loading -->
          <div v-else-if="isSearching" class="flex justify-center py-20">
            <Icon name="eos-icons:loading" size="32" class="text-brand" />
          </div>

          <!-- No Results -->
          <div v-else-if="searchQuery && !hasResults" class="text-center text-gray-500 dark:text-neutral-400 py-20">
            <Icon name="mdi:magnify-close" size="48" class="mb-3 mx-auto" />
            <p>No results for "{{ searchQuery }}"</p>
          </div>

          <!-- Results Sections -->
          <div v-else class="p-4 space-y-6">
            <!-- Users -->
            <div v-if="results.data.users.length">
              <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-3">People</h3>
              <div class="space-y-1">
                <button
                  v-for="user in results.data.users"
                  :key="user.id"
                  @click="navigateToUser(user.username)"
                  class="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <img
                    v-if="user.avatar"
                    :src="user.avatar"
                    :alt="user.username"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div v-else class="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                    <Icon name="mdi:account" size="20" class="text-gray-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 dark:text-neutral-100 truncate">{{ user.full_name || user.username }}</p>
                    <p class="text-sm text-gray-500 dark:text-neutral-400 truncate">@{{ user.username }}</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Stores -->
            <div v-if="results.data.stores.length">
              <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-3">Stores</h3>
              <div class="space-y-1">
                <button
                  v-for="store in results.data.stores"
                  :key="store.id"
                  @click="navigateToStore(store.store_slug)"
                  class="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-neutral-800 flex-shrink-0 flex items-center justify-center">
                    <img
                      v-if="store.store_logo"
                      :src="store.store_logo"
                      :alt="store.store_name"
                      class="w-full h-full object-cover"
                    />
                    <Icon v-else name="mdi:store" size="20" class="text-gray-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 dark:text-neutral-100 truncate">{{ store.store_name }}</p>
                    <p class="text-xs text-gray-500 dark:text-neutral-400 truncate">{{ store.followers_count }} followers</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Products -->
            <div v-if="results.data.products.length">
              <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-3">Products</h3>
              <div class="space-y-1">
                <button
                  v-for="product in results.data.products"
                  :key="product.id"
                  @click="navigateToProduct(product.id)"
                  class="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 flex-shrink-0">
                    <img
                      v-if="product.media?.[0]?.url"
                      :src="product.media[0].url"
                      :alt="product.title"
                      class="w-full h-full object-cover"
                    />
                    <Icon v-else name="mdi:package-variant" size="24" class="text-gray-400 m-auto mt-3" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 dark:text-neutral-100 truncate">{{ product.title }}</p>
                    <p class="text-sm text-brand font-semibold">₦{{ Number(product.price).toLocaleString() }}</p>
                    <p class="text-xs text-gray-400 dark:text-neutral-500 truncate">by {{ product.seller?.store_name }}</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Posts -->
            <div v-if="results.data.posts.length">
              <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400 mb-3">Posts</h3>
              <div class="space-y-1">
                <button
                  v-for="post in results.data.posts"
                  :key="post.id"
                  @click="navigateToPost(post.id)"
                  class="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 flex-shrink-0">
                    <img
                      v-if="post.media?.[0]?.url"
                      :src="post.media[0].url"
                      :alt="post.caption || 'Post'"
                      class="w-full h-full object-cover"
                    />
                    <Icon v-else name="mdi:post-outline" size="24" class="text-gray-400 m-auto mt-3" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-900 dark:text-neutral-100 truncate">{{ post.caption || post.content || 'No caption' }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <img
                        v-if="post.author?.avatar"
                        :src="post.author.avatar"
                        class="w-4 h-4 rounded-full object-cover"
                      />
                      <p class="text-xs text-gray-400 dark:text-neutral-500">@{{ post.author?.username }}</p>
                      <span class="text-xs text-gray-300 dark:text-neutral-600">·</span>
                      <span class="text-xs text-gray-400 dark:text-neutral-500">{{ post._count?.likes ?? 0 }} likes</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useSearchApi } from '~~/layers/base/app/services/search.api'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const router = useRouter()
const searchApi = useSearchApi()

const searchQuery = ref('')
const isSearching = ref(false)
const results = ref<{success: boolean; data: { users: any[]; products: any[]; posts: any[]; stores: any[] }}>({
  success: false,
  data: { users: [], products: [], posts: [], stores: [] },
})

const hasResults = computed(
  () => results.value.data.users.length > 0
    || results.value.data.stores.length > 0
    || results.value.data.products.length > 0
    || results.value.data.posts.length > 0
)

const empty = { users: [], products: [], posts: [], stores: [] }
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  const trimmed = val.trim()
  const isAtSearch = trimmed.startsWith('@')
  const cleanQuery = isAtSearch ? trimmed.slice(1) : trimmed
  const minLen = isAtSearch ? 1 : 2

  if (!cleanQuery || cleanQuery.length < minLen) {
    results.value.data = { ...empty }
    isSearching.value = false
    return
  }

  isSearching.value = true
  debounceTimer = setTimeout(async () => {
    try {
      const searchType = isAtSearch ? 'users' : 'all'
      const res = await searchApi.search(cleanQuery, searchType)
      if (res?.success && res.data) {
        results.value.data = {
          users: (res.data as any).users || [],
          products: (res.data as any).products || [],
          posts: (res.data as any).posts || [],
          stores: (res.data as any).stores || [],
        }
      }
    } catch (e) {
      console.error('Search error:', e)
      results.value.data = { ...empty }
    } finally {
      isSearching.value = false
    }
  }, 350)
})

const navigateToUser = (username: string) => {
  emit('close')
  router.push(`/profile/${username}`)
}

const navigateToStore = (slug: string) => {
  emit('close')
  router.push(`/sellers/profile/${slug}`)
}

const navigateToProduct = (id: number) => {
  emit('close')
  router.push(`/products/${id}`)
}

const navigateToPost = (id: number) => {
  emit('close')
  router.push(`/post/${id}`)
}
</script>
