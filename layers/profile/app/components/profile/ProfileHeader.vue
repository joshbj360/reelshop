<template>
    <div class="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
        <!-- Accent stripe -->
        <div class="h-[3px] w-full" :class="accentClass" />

        <div class="p-5">
            <div class="flex gap-5 items-start">

                <!-- Avatar -->
                <div class="shrink-0 relative">
                    <img
                        :src="profile.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${profile.username}`"
                        :alt="profile.username || 'Avatar'"
                        class="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover ring-2 ring-gray-100 dark:ring-neutral-800"
                    />
                    <div
                        v-if="profile.role === 'SELLER'"
                        class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center ring-2 ring-white dark:ring-neutral-900"
                    >
                        <Icon name="mdi:store" size="13" class="text-white" />
                    </div>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">

                    <!-- Username + actions -->
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                        <h1 class="text-[17px] font-bold text-gray-900 dark:text-neutral-100 leading-tight">
                            {{ profile.username }}
                        </h1>
                        <span
                            v-if="profile.role === 'SELLER'"
                            class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 select-none"
                        >
                            <Icon name="mdi:store" size="9" />
                            {{ $t('profile.seller') }}
                        </span>

                        <!-- Own profile -->
                        <template v-if="isOwnProfile">
                            <button
                                @click="$emit('edit')"
                                class="ml-auto px-3.5 py-1.5 bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 rounded-lg text-[13px] font-semibold hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                            >{{ $t('profile.editProfile') }}</button>
                            <button
                                @click="$emit('settings')"
                                class="p-1.5 bg-gray-100 dark:bg-neutral-800 text-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <Icon name="mdi:cog-outline" size="18" />
                            </button>
                        </template>

                        <!-- Other profile -->
                        <template v-else>
                            <button
                                @click="isFollowing ? $emit('unfollow') : $emit('follow')"
                                :disabled="isFollowLoading"
                                class="ml-auto px-5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-60 min-w-[80px] text-center"
                                :class="isFollowing
                                    ? 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                                    : 'bg-brand text-white hover:bg-[#d81b36]'"
                            >
                                <Icon v-if="isFollowLoading" name="eos-icons:loading" size="14" class="inline animate-spin" />
                                <span v-else>{{ $t(isFollowing ? 'post.following' : 'post.follow') }}</span>
                            </button>
                            <button
                                @click="$emit('message')"
                                class="px-4 py-1.5 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-lg text-[13px] font-semibold hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                            >{{ $t('profile.message') }}</button>
                            <button
                                class="p-1.5 bg-gray-100 dark:bg-neutral-800 text-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <Icon name="mdi:dots-horizontal" size="18" />
                            </button>
                        </template>
                    </div>

                    <!-- Stats -->
                    <div class="flex items-center gap-5 mb-3">
                        <div class="text-center">
                            <div class="text-[15px] font-bold text-gray-900 dark:text-neutral-100 leading-tight">{{ formatNum(stats.postsCount) }}</div>
                            <div class="text-[11px] text-gray-400 dark:text-neutral-500">{{ $t('profile.posts') }}</div>
                        </div>
                        <button @click="$emit('show-followers')" class="text-center hover:opacity-70 transition-opacity">
                            <div class="text-[15px] font-bold text-gray-900 dark:text-neutral-100 leading-tight">{{ formatNum(stats.followersCount) }}</div>
                            <div class="text-[11px] text-gray-400 dark:text-neutral-500">{{ $t('profile.followers') }}</div>
                        </button>
                        <button @click="$emit('show-following')" class="text-center hover:opacity-70 transition-opacity">
                            <div class="text-[15px] font-bold text-gray-900 dark:text-neutral-100 leading-tight">{{ formatNum(stats.followingCount) }}</div>
                            <div class="text-[11px] text-gray-400 dark:text-neutral-500">{{ $t('profile.following') }}</div>
                        </button>
                        <div v-if="stats.likesCount" class="text-center">
                            <div class="text-[15px] font-bold text-gray-900 dark:text-neutral-100 leading-tight">{{ formatNum(stats.likesCount) }}</div>
                            <div class="text-[11px] text-gray-400 dark:text-neutral-500">{{ $t('profile.likes') }}</div>
                        </div>
                    </div>

                    <!-- Bio -->
                    <p v-if="profile.bio" class="text-[13px] text-gray-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap mb-1.5">{{ profile.bio }}</p>

                    <!-- Links -->
                    <div class="flex flex-wrap items-center gap-3 text-[12px]">
                        <a
                            v-if="profile.profileUrl"
                            :href="profile.profileUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex items-center gap-1 text-brand hover:underline"
                        >
                            <Icon name="mdi:link-variant" size="13" />
                            {{ profile.profileUrl.replace(/^https?:\/\//, '').split('/')[0] }}
                        </a>
                        <span v-if="profile.stateOfResidence" class="flex items-center gap-1 text-gray-400 dark:text-neutral-500">
                            <Icon name="mdi:map-marker-outline" size="13" />
                            {{ profile.stateOfResidence }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { IProfile, IProfileStats } from '../../types/profile.types';

const props = defineProps<{
    profile: IProfile;
    stats: IProfileStats;
    isOwnProfile: boolean;
    isFollowing: boolean;
    isFollowLoading?: boolean;
}>();

defineEmits(['edit', 'settings', 'message', 'follow', 'unfollow', 'show-followers', 'show-following']);

const accentClass = computed(() => {
    if (props.isOwnProfile) return 'bg-brand';
    return props.profile.role === 'SELLER' ? 'bg-emerald-500' : 'bg-blue-500';
});

const formatNum = (n: number = 0) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
};
</script>
