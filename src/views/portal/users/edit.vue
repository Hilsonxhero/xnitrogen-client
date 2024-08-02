<script setup lang="ts">
import { ref, onMounted, watchEffect, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ApiService from '@/services/ApiService';
import { useRoute } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { router } from '@/router';
import { useDebounceFn } from '@vueuse/core';

const page = ref({ title: 'ویرایش اطلاعات  کاربری' });
const breadcrumbs = ref([
    {
        title: 'داشبورد',
        disabled: false,
        to: { name: 'user-dashboard' }
    },
    {
        title: 'مدیریت اعضای تیم',
        disabled: false,
        to: { name: 'portal-users-index' }
    },
    {
        title: 'ویرایش اطلاعات کاربری',
        disabled: true,
        href: '#'
    }
]);
const formRef = ref<any>(null);
const loading = ref(true);
const permissions = ref([]);
const form = ref({
    username: null,
    role: null,
    status: null
});
const route = useRoute();

const roles = ref([]);

const loader = ref(false);

const statuses = ref([
    { title: 'فعال', id: 'active' },
    { title: 'غیرفعال', id: 'inactive' },
    { title: 'مسدود', id: 'ban' }
]);

const current_page = ref(1);
const roleSearchTerm = ref('');

const fetchRoles = async () => {
    try {
        let params = {
            page: current_page.value,
            q: roleSearchTerm.value
        };
        const { data } = await ApiService.query(`application/portal/projects/${route.params.id}/roles/select/values`, {
            params: params
        });
        roles.value = data.data.roles;
    } catch (error) {}
};

const debouncedFn = useDebounceFn(() => {
    fetchRoles();
}, 300);
const handleOnSearch = () => {
    debouncedFn();
};

const fetchData = async () => {
    try {
        const { data } = await ApiService.get(`application/portal/projects/${route.params.id}/users/${route.params.user}`);

        form.value.username = data.data.username;
        form.value.status = data.data.status;
        form.value.role = data.data.role;

        loading.value = false;
    } catch (error) {}
};

const handleSubmit = async () => {
    try {
        loader.value = true;
        const formData = {
            id: route.params.user,
            username: form.value.username,
            status: form.value.status,
            role_id: form.value.role?.id
        };
        const { data } = await ApiService.put(`application/portal/projects/${route.params.id}/users/${route.params.user}`, formData);
        if (data.success) {
            router.push({ name: 'portal-users-index', params: { id: route.params.id } });
        } else {
        }

        loader.value = false;
    } catch ({ response }) {
        loader.value = false;
        // validation_errros.value = response._data.data;
    }
};
watch(
    () => roleSearchTerm.value,
    (val) => {
        if (val.trim() !== '') {
            handleOnSearch();
        } else {
            roleSearchTerm.value = '';
            fetchRoles();
        }
    }
);
watchEffect(() => {
    if (formRef.value) {
        formRef.value.setValues({
            ...form.value
        });
    }
});

onMounted(async () => {
    await fetchRoles();
    await fetchData();
});
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12">
            <v-skeleton-loader :elevation="9" :loading="loading" type="image">
                <UiParentCard>
                    <div>
                        <Form @submit="handleSubmit" ref="formRef">
                            <v-row>
                                <v-col cols="4">
                                    <v-label class="mb-2 font-weight-medium">نام کاربری</v-label>

                                    <Field mode="passive" name="username" v-slot="{ field }" rules="required" label=" نام کاربری">
                                        <v-text-field
                                            v-bind="field"
                                            v-model="form.username"
                                            label="نام کاربری "
                                            variant="outlined"
                                            hide-details="auto"
                                        ></v-text-field>
                                    </Field>
                                    <div class="invalid-feedback d-block">
                                        <ErrorMessage name="username" />
                                    </div>
                                </v-col>

                                <v-col cols="4">
                                    <v-label class="mb-2 font-weight-medium"> سطح دسترسی کاربر</v-label>

                                    <Field mode="passive" name="role" v-slot="{ field }" rules="required" label="سطح دسترسی کاربر">
                                        <v-select
                                            hide-details="auto"
                                            v-bind="field"
                                            single-line
                                            label="سطح دسترسی کاربر"
                                            :items="roles"
                                            item-title="title"
                                            return-object
                                            item-value="id"
                                            no-data-text="موردی وجود ندارد"
                                            v-model="form.role"
                                        >
                                            <template v-slot:prepend-item>
                                                <v-list-item>
                                                    <v-list-item-content>
                                                        <v-text-field v-model="roleSearchTerm" placeholder="جستجو"></v-text-field>
                                                    </v-list-item-content>
                                                </v-list-item>
                                                <v-divider class="mt-2"></v-divider>
                                            </template>
                                            <template v-slot:item="{ props, item }">
                                                <v-list-item v-bind="props"></v-list-item>
                                            </template>
                                        </v-select>
                                    </Field>
                                    <div class="invalid-feedback d-block">
                                        <ErrorMessage name="role" />
                                    </div>
                                </v-col>

                                <v-col cols="4">
                                    <v-label class="mb-2 font-weight-medium"> وضعیت حساب کاربر</v-label>

                                    <Field mode="passive" name="status" v-slot="{ field }" rules="required" label=" وضعیت حساب کاربر">
                                        <v-select
                                            hide-details="auto"
                                            v-bind="field"
                                            single-line
                                            label=" وضعیت حساب کاربر"
                                            :items="statuses"
                                            item-title="title"
                                            item-value="id"
                                            no-data-text="موردی وجود ندارد"
                                            v-model="form.status"
                                        >
                                        </v-select>
                                    </Field>
                                    <div class="invalid-feedback d-block">
                                        <ErrorMessage name="status" />
                                    </div>
                                </v-col>

                                <v-col>
                                    <v-btn type="submit" :loading="loader" class="submit-btn mt-2" flat color="primary">ذخیره</v-btn>
                                </v-col>
                            </v-row>
                        </Form>
                    </div>
                </UiParentCard>
            </v-skeleton-loader>
        </v-col>
    </v-row>
</template>
