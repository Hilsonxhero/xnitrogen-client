const InviteRoutes = {
    path: '/portal',
    component: () => import('@/layouts/blank/BlankLayout.vue'),
    meta: {
        requiresAuth: true
    },
    children: [
        {
            name: 'portal-invite-confirmation',
            path: 'invite/confirmation',
            component: () => import('@/views/portal/users/invite/confirmation.vue')
        },

    ]
};

export default InviteRoutes;
