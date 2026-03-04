<template>
    <div class="w-full space-y-6">

        <!-- Stories skeleton -->
        <div class="flex gap-4 overflow-hidden">
            <div v-for="i in 6" :key="i" class="flex flex-col items-center gap-2 shrink-0">
                <div class="w-[70px] h-[70px] rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse" />
                <div class="w-12 h-2.5 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse" />
            </div>
        </div>

        <!-- Post card skeletons -->
        <div
            v-for="i in 3"
            :key="i"
            class="bg-white dark:bg-neutral-950 rounded-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden"
        >
            <!-- Author header -->
            <div class="flex items-center gap-3 px-4 py-3">
                <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse shrink-0" />
                <div class="flex-1 space-y-2">
                    <div class="w-28 h-3 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse" />
                    <div class="w-16 h-2.5 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse" />
                </div>
                <div class="w-14 h-5 rounded-md bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            </div>

            <!-- Media placeholder — alternates 4:5 and 1:1 -->
            <div
                class="w-full bg-gray-100 dark:bg-neutral-800 animate-pulse"
                :style="i % 2 === 0 ? 'aspect-ratio: 1 / 1' : 'aspect-ratio: 4 / 5'"
            />

            <!-- Action bar -->
            <div class="flex items-center justify-between px-4 py-3">
                <div class="flex items-center gap-5">
                    <div class="w-10 h-5 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse" />
                    <div class="w-10 h-5 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse" />
                    <div class="w-6 h-5 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse" />
                </div>
                <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse" />
            </div>
        </div>

    </div>
</template>