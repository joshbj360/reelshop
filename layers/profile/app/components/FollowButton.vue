<template>
    <button
        @click.stop="handleFollow"
        :disabled="isLoading || isProcessing"
        class="text-xs font-semibold transition-colors disabled:opacity-50 leading-none"
        :class="following
            ? 'text-gray-400 dark:text-neutral-500 hover:text-red-500'
            : 'text-brand hover:text-[#d81b36]'"
    >
        {{ label }}
    </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFollow } from '../composables/useFollow';
import { useFollowStore } from '../stores/follow.store';
import { useProfileStore } from '../stores/profile.store';
import { notify } from '@kyvg/vue3-notification';
const { t } = useI18n();

const props = defineProps<{
    userId: string;
    username: string;
}>();

const followStore  = useFollowStore();
const profileStore = useProfileStore();
const { followUser, unfollowUser, isLoading } = useFollow();

const isProcessing = ref(false);

// Follow status keyed by username (matches followStatusCache keys in follow.store)
const following = computed(() => followStore.isFollowing(props.username));

const label = computed(() => {
    if (isProcessing.value || isLoading.value) return '…';
    return following.value ? t('post.following') : t('post.follow');
});

const handleFollow = async () => {
    if (!profileStore.userId) {
        notify({ type: 'warn', text: t('auth.loginToFollow') });
        return;
    }
    isProcessing.value = true;
    try {
        if (following.value) {
            await unfollowUser(props.username);
        } else {
            await followUser(props.username);
        }
    } catch (err: any) {
        notify({ type: 'error', text: err.message || t('errors.failedFollow') });
    } finally {
        isProcessing.value = false;
    }
};
</script>
