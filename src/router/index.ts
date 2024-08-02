import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import InviteRoutes from './InviteRoutes';


import { useAuthStore } from '@/stores/auth';

import { storeToRefs } from "pinia";
import { usePortalStore } from '@/stores/portal';



export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/authentication/Error.vue')
        },
        MainRoutes,
        AuthRoutes,
        InviteRoutes
    ]
});



router.beforeEach(async (to, from, next) => {
    const store = useAuthStore();
    const portalStore = usePortalStore();

    if (to.name !== "auth") {
        await store.init();
    }

    if (
        (to.meta.requiresAuth || to.matched.some((parent) => parent.meta.requiresAuth)) &&
        !store.loggedIn
    ) {


        next({ name: "auth" });
    }

    if (to.meta.guest && store.loggedIn) {

        next({ name: "user-dashboard", params: { id: portalStore.selected } });
    }

    next();
});
