<template>
    <div class="pa-3 h-100">
        <v-row class="h-100vh mh-100 auth">
            <v-col cols="12" lg="7" xl="8" class="d-lg-flex align-center justify-center authentication position-relative">
                <div class="auth-header pt-lg-6 pt-2 px-sm-6 px-3 pb-lg-6 pb-0">
                    <div class="position-relative">
                        <Logo />
                    </div>
                </div>
                <div class="">
                    <img src="@/assets/media/25.svg" class="position-relative d-none d-lg-flex" alt="login-background" />
                </div>
            </v-col>
            <v-col cols="12" lg="5" xl="4" class="d-flex align-center justify-center">
                <div class="mt-xl-0 mt-5 mw-100 auth-form-content">
                    <div class="mt-8">
                        <div class="my-8 flex justify-center">
                            <img class="w-36 h-w-36" src="@/assets/media/colb.svg" alt="" />
                        </div>
                        <h2 class="text-2xl text-gray-700">
                            کاربر <span class="text-blue-600">{{ invite.user }}</span> شما را به پروژه
                            <span class="font-bold underline">{{ invite.project?.title }}</span>
                            دعوت کرده است.
                        </h2>
                        <div class="flex justify-center items-center mt-8">
                            <v-btn class="ml-2" size="large" @click="handleConfirmInvite" :loading="loader" color="success" flat
                                >تایید درخواست</v-btn
                            >

                            <v-btn class="ml-2" size="large" @click="handleDeclineInvite" :loading="decline_loader" color="error" flat
                                >رد درخواست</v-btn
                            >
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted, watch } from 'vue';
import ApiService from '@/services/ApiService';
import { useRoute } from 'vue-router';
import { router } from '@/router';

const invite = ref({});
const invite_id = ref(null);
const token = ref(null);
const route = useRoute();
const loader = ref(false);
const loading = ref(false);
const decline_loader = ref(false);
const store = useAuthStore();
const handleConfirmInvite = async () => {
    try {
        loader.value = true;
        const formData = {
            token: token.value
        };
        const { data } = await ApiService.post('application/portal/projects/invite/membership/confirmation', formData);
        if (data.success) {
            await store.verify();
            router.push({ name: 'user-dashboard', params: { id: invite.value.project?.id } });
        }

        loader.value = false;
    } catch (error) {
        loader.value = false;
    }
};

const handleDeclineInvite = async () => {
    try {
        decline_loader.value = true;
        const formData = {
            token: token.value
        };
        const { data } = await ApiService.post('application/portal/projects/invite/membership/decline', formData);
        if (data.success) {
            router.push({ name: 'landing' });
        }

        decline_loader.value = false;
    } catch (error) {
        decline_loader.value = false;
    }
};

const fetchInvite = async () => {
    try {
        loading.value = true;
        const { data } = await ApiService.get(`application/portal/projects/invite/show/${invite_id.value}`);
        invite.value = data.data;
        loading.value = false;
    } catch (error) {
        loading.value = false;
    }
};

onMounted(() => {
    token.value = route.query.token;
    invite_id.value = route.query.id;
    fetchInvite();
});
</script>
