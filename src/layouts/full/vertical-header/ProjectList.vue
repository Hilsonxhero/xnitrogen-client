<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { usePortalStore } from '@/stores/portal';

const authStore = useAuthStore();
const portalStore = usePortalStore();

import { AppsIcon } from 'vue-tabler-icons';

const list1 = ref([
    {
        name: 'پروژه تست',
        icon: AppsIcon,
        id: 1,
        link: '/basic/list'
    },
    {
        name: 'پروژه تست',
        icon: AppsIcon,
        id: 1,
        link: '/basic/list'
    },
    {
        name: 'پروژه تست',
        icon: AppsIcon,
        id: 1,
        link: '/basic/list'
    },
    {
        name: 'پروژه تست',
        icon: AppsIcon,
        id: 1,
        link: '/basic/list'
    }
]);

const handleProjectClick = (item: any) => {
    console.log('item', item.id);
    portalStore.setSelectedProject(item.id);
};

const selected = computed(() => authStore?.user?.projects?.find((item, index) => item?.id == portalStore.selected_project));
</script>
<template>
    <v-row>
        <!-- <v-col cols="12" lg="12" v-for="(item, i) in 8" :key="i">
            <router-link to="/" class="text-decoration-none custom-text-primary">
                <div class="d-flex align-center">
                    <v-avatar size="45" color="grey100" rounded="md">
                        <v-img :src="card_icon2" width="24" height="24" :alt="card_icon2" />
                    </v-avatar>
                    <div class="ml-3">
                        <h6 class="text-subtitle-1 mb-1 textPrimary font-weight-semibold custom-title">پروژه تست</h6>
                        <p class="text-subtitle-2 textSecondary">پروژه تست</p>
                    </div>
                </div>
            </router-link>
        </v-col> -->
        <v-col cols="12">
            <v-list class="w-100" width="100%">
                <v-list-item
                    class="mb-2 w-100"
                    v-for="(project, i) in authStore?.user?.projects"
                    :value="project?.id"
                    rounded="md"
                    :key="i"
                    active-color="primary"
                    @click="handleProjectClick(project)"
                >
                    <template v-slot:prepend>
                        <component :is="AppsIcon" size="20" class="mr-2" />
                    </template>
                    <router-link :to="{ name: 'user-dashboard', params: { id: project?.id } }" class="text-decoration-none text-inherit">
                        <v-list-item-title v-text="project?.title"> </v-list-item-title>
                    </router-link>
                </v-list-item>
            </v-list>
        </v-col>
    </v-row>
</template>
