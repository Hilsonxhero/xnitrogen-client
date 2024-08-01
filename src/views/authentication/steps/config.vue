<script setup lang="ts">
import Logo from '@/layouts/full/logo/Logo.vue';

import { ref, defineEmits } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import ApiService from '@/services/ApiService';
import { usePortalStore } from '@/stores/portal';

const router = useRouter();

const form = ref({
    name: ''
});
const loader = ref(false);
const authStore = useAuthStore();
const portalStore = usePortalStore();

async function validate(values: any, { setErrors }: any) {
    loader.value = true;
    const formDate = {
        title: form.value.name,
        description: form.value.name
    };

    const data = await ApiService.post('application/portal/projects/setup', formDate);

    if (data?.data?.success) {
        await authStore.verify();
        portalStore.setSelectedProject(data.data.data.id);
        router.push({ name: 'user-dashboard', params: { id: data.data.data.id } });
    }

    // emit('change', end.value);
    loader.value = false;
}
</script>

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
                    <img src="@/assets/images/backgrounds/login-bg.svg" class="position-relative d-none d-lg-flex" alt="login-background" />
                </div>
            </v-col>
            <v-col cols="12" lg="5" xl="4" class="d-flex align-center justify-center">
                <div class="mt-xl-0 mt-5 mw-100 auth-form-content">
                    <h2 class="text-h3 font-weight-bold mb-2">تنظیمات اولیه</h2>
                    <div class="text-subtitle-1 mb-6"></div>

                    <Form @submit="validate" v-slot="{ errors, isSubmitting }" class="mt-5">
                        <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">نام شرکت و یا تیم</v-label>
                        <VTextField v-model="form.name" class="mb-8" required hide-details="auto"> </VTextField>

                        <div class="d-flex flex-wrap align-center my-3 ml-n2"></div>
                        <v-btn size="large" :loading="isSubmitting" color="primary" :disabled="valid" block type="submit" flat>ادامه</v-btn>
                        <div v-if="errors.apiError" class="mt-2">
                            <v-alert color="error">{{ errors.apiError }}</v-alert>
                        </div>
                    </Form>
                </div>
            </v-col>
        </v-row>
    </div>
</template>
