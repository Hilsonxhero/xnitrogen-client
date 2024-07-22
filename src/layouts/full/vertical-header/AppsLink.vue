<script setup lang="ts">
import type { notificationType, profileType, languageType, appsLinkType, quickLinksType, searchType } from '@/types/HeaderTypes';

import img1 from '@/assets/images/svgs/icon-dd-chat.svg';
import img2 from '@/assets/images/svgs/icon-dd-cart.svg';
import img3 from '@/assets/images/svgs/icon-dd-invoice.svg';
import img4 from '@/assets/images/svgs/icon-dd-date.svg';
import img5 from '@/assets/images/svgs/icon-dd-mobile.svg';
import img6 from '@/assets/images/svgs/icon-dd-lifebuoy.svg';
import img7 from '@/assets/images/svgs/icon-dd-message-box.svg';
import img8 from '@/assets/images/svgs/icon-dd-application.svg';
const appsLink: appsLinkType[] = [
    {
        avatar: img1,
        title: 'مدیریت گفتگو و کاربران',
        subtext: 'تعامل با اعضای پروژه',
        href: '/apps/chats'
    },
    {
        avatar: img2,
        title: 'مدیریت فروش',
        subtext: 'حسابداری سیستم فروش',
        href: '/ecommerce/products'
    },
    {
        avatar: img8,
        title: 'مدیریت تابلو های پروژه',
        subtext: 'مدیریت وظایف با ایجاد تابلو های مختلف',
        href: '/apps/user/profile'
    },
    {
        avatar: img4,
        title: 'مدیریت تقویم و رویداد ها',
        subtext: 'رویداد ها را برنامه ریزی کنید',
        href: '/apps/calendar'
    },
    {
        avatar: img5,
        title: 'مدیریت مخاطبین',
        subtext: 'مدیریت مخاظبین شما',
        href: '/apps/contacts'
    },
    {
        avatar: img6,
        title: 'مدیریت وظایف اعضای پروژه',
        subtext: 'مدیریت مسئله ها و کارهای اعضای پروژه',
        href: '/pages/account-settings'
    },
    {
        avatar: img7,
        title: 'مدیریت ایمیل',
        subtext: 'ارسال و دریافت ایمیل های شخصی و سازمانی',
        href: '/'
    },
    {
        avatar: img8,
        title: 'مدیریت یادداشت ها',
        subtext: 'مدیریت یادداشت های شخصی',
        href: '/apps/notes'
    }
];
</script>
<template>
    <!-- ---------------------------------------------- -->
    <!-- apps link -->
    <!-- ---------------------------------------------- -->
    <v-row>
        <v-col cols="12" lg="6" v-for="(item, i) in appsLink" :key="i">
            <router-link :to="item.href" class="text-decoration-none custom-text-primary">
                <div class="d-flex align-center">
                    <v-avatar size="45" color="grey100" rounded="md">
                        <v-img :src="item.avatar" width="24" height="24" :alt="item.avatar" />
                    </v-avatar>
                    <div class="ml-3">
                        <h6 class="text-subtitle-1 mb-1 textPrimary font-weight-semibold custom-title">{{ item.title }}</h6>
                        <p class="text-subtitle-2 textSecondary">{{ item.subtext }}</p>
                    </div>
                </div>
            </router-link>
        </v-col>
    </v-row>
</template>
