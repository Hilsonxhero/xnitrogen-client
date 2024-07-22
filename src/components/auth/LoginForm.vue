<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';
import Otp from '@/components/auth/otp/OtpForm.vue';

/*Social icons*/
import google from '@/assets/images/svgs/google-icon.svg';
import facebook from '@/assets/images/svgs/facebook-icon.svg';
const loader = ref(false);
const end = ref<any>(null);
const user_data = ref({});
const code = ref(null);
const show_otp_code = ref(false);
const valid = ref(false);
const username = ref('info@wrappixel.com');

const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);
const authStore = useAuthStore();
const emit = defineEmits(['change']);

async function validate(values: any, { setErrors }: any) {
    // return authStore.login(username.value, password.value).catch((error) => setErrors({ apiError: error }));

    loader.value = true;
    const formDate = {
        username: username.value
    };

    const data = await authStore.authenticate(formDate);
    end.value = data.ttl * 1000;
    show_otp_code.value = true;
    user_data.value = data?.data;
    emit('change', end.value);
    loader.value = false;
}
</script>

<template>
    <template v-if="show_otp_code">
        <Otp :data="user_data" :username="username" :end="end" @reset="show_otp_code = false" />
    </template>

    <template v-else>
        <v-row class="d-flex mb-3">
            <v-col cols="6" sm="6">
                <v-btn variant="outlined" size="large" class="border text-subtitle-1" block>
                    <img :src="google" height="16" class="mr-2" alt="google" />
                    <span class="d-sm-flex d-none mr-1">ورود با</span>گوگل
                </v-btn>
            </v-col>
            <v-col cols="6" sm="6">
                <v-btn variant="outlined" size="large" class="border text-subtitle-1" block>
                    <img :src="facebook" width="25" height="25" class="mr-1" alt="facebook" />
                    <span class="d-sm-flex d-none mr-1">ورود با</span>گیت هاب
                </v-btn>
            </v-col>
        </v-row>
        <div class="d-flex align-center text-center mb-6">
            <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
                <span class="bg-surface px-5 py-3 position-relative">ورود با ایمیل</span>
            </div>
        </div>
        <Form @submit="validate" v-slot="{ errors, isSubmitting }" class="mt-5">
            <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText">ایمیل</v-label>
            <VTextField v-model="username" :rules="emailRules" class="mb-8" required hide-details="auto"> </VTextField>

            <div class="d-flex flex-wrap align-center my-3 ml-n2"></div>
            <v-btn size="large" :loading="isSubmitting" color="primary" :disabled="valid" block type="submit" flat>ادامه</v-btn>
            <div v-if="errors.apiError" class="mt-2">
                <v-alert color="error">{{ errors.apiError }}</v-alert>
            </div>
        </Form>
    </template>
</template>
