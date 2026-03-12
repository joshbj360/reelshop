<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />
      <div class="relative bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-xl w-full max-w-lg flex flex-col max-h-[85vh]">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-neutral-800 shrink-0">
          <h3 class="text-[15px] font-bold text-gray-900 dark:text-neutral-100">Comments</h3>
          <button @click="$emit('close')" class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
            <Icon name="mdi:close" size="20" class="text-gray-500 dark:text-neutral-400" />
          </button>
        </div>

        <!-- Comment list -->
        <div class="flex-1 overflow-y-auto px-5 py-3 space-y-4">
          <div v-if="isLoading && !comments.length" class="flex justify-center py-8">
            <Icon name="eos-icons:loading" size="28" class="text-brand animate-spin" />
          </div>

          <div v-else-if="!comments.length" class="flex flex-col items-center justify-center py-10 gap-2 text-gray-400 dark:text-neutral-500">
            <Icon name="mdi:comment-outline" size="36" />
            <p class="text-sm">No comments yet. Be the first!</p>
          </div>

          <template v-else>
            <div v-for="c in comments" :key="c.id" class="flex gap-3">
              <img
                v-if="c.author?.avatar"
                :src="c.author.avatar"
                class="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
              />
              <div v-else class="w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="mdi:account" size="16" class="text-gray-400" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="bg-gray-50 dark:bg-neutral-800 rounded-2xl px-3 py-2">
                  <span class="text-[12px] font-bold text-gray-900 dark:text-neutral-100 mr-1.5">{{ c.author?.username }}</span>
                  <span class="text-[13px] text-gray-700 dark:text-neutral-300 leading-relaxed">{{ c.text }}</span>
                </div>
                <div class="flex items-center gap-3 mt-1 pl-1">
                  <span class="text-[11px] text-gray-400 dark:text-neutral-500">{{ timeAgo(c.created_at) }}</span>
                  <span class="text-[11px] text-gray-400 dark:text-neutral-500">{{ c._count?.likes ?? 0 }} likes</span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Input -->
        <ClientOnly>
          <div v-if="profileStore.isLoggedIn" class="px-4 py-3 border-t border-gray-100 dark:border-neutral-800 shrink-0">
            <div class="flex items-center gap-2">
              <input
                v-model="newComment"
                type="text"
                placeholder="Add a comment…"
                maxlength="500"
                @keydown.enter.prevent="submitComment"
                class="flex-1 bg-gray-100 dark:bg-neutral-800 rounded-full px-4 py-2 text-[13px] text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
              <button
                @click="submitComment"
                :disabled="!newComment.trim() || isSubmitting"
                class="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center transition-all disabled:opacity-40 hover:bg-[#d81b36]"
              >
                <Icon v-if="isSubmitting" name="eos-icons:loading" size="16" class="animate-spin" />
                <Icon v-else name="mdi:send" size="16" />
              </button>
            </div>
          </div>
          <div v-else class="px-5 py-3 border-t border-gray-100 dark:border-neutral-800 shrink-0 text-center">
            <NuxtLink to="/login" @click="$emit('close')" class="text-[13px] text-brand font-semibold hover:underline">
              Sign in to comment
            </NuxtLink>
          </div>
        </ClientOnly>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useProfileStore } from '~~/layers/profile/app/stores/profile.store'

const props = defineProps<{ isOpen: boolean; product: any }>()
defineEmits(['close'])

const profileStore = useProfileStore()
const comments = ref<any[]>([])
const newComment = ref('')
const isLoading = ref(false)
const isSubmitting = ref(false)

const loadComments = async () => {
  if (!props.product?.id) return
  isLoading.value = true
  try {
    const res = await $fetch<any>(`/api/commerce/products/${props.product.id}/comments`)
    if (res?.success) comments.value = res.data || []
  } finally {
    isLoading.value = false
  }
}

const submitComment = async () => {
  if (!newComment.value.trim() || isSubmitting.value || !props.product?.id) return
  isSubmitting.value = true
  try {
    const res = await $fetch<any>(`/api/commerce/products/${props.product.id}/comments`, {
      method: 'POST',
      body: { text: newComment.value.trim() },
    })
    if (res?.success && res.data) {
      comments.value.unshift(res.data)
      newComment.value = ''
    }
  } catch {
    // silent fail
  } finally {
    isSubmitting.value = false
  }
}

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

watch(() => [props.isOpen, props.product?.id], ([open]) => {
  if (open) loadComments()
  else comments.value = []
})
</script>
