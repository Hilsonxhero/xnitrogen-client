<script setup lang="ts">
import type { notificationType, profileType, languageType, appsLinkType, quickLinksType, searchType } from '@/types/HeaderTypes';

const quickLink: quickLinksType[] = [
    {
        title: 'پشتیبانی',
        href: ''
    },
    {
        title: 'درباره ایکس نیتروژن',
        href: ''
    }
];
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- language DD -->
    <!-- ---------------------------------------------- -->
    <div v-for="(item, i) in quickLink" :key="i" class="py-2">
        <router-link :to="item.href" class="text-decoration-none text-hover-primary font-weight-semibold text-subtitle-1">{{
            item.title
        }}</router-link>
    </div>
</template>
