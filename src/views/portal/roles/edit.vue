<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ApiService from '@/services/ApiService';
import { useRoute } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as Yup from 'yup';
import TextInput from '@/components/forms/form-validation/TextInput.vue';
import { router } from '@/router';

const page = ref({ title: 'ویرایش نقش  کاربری' });
const breadcrumbs = ref([
    {
        title: 'داشبورد',
        disabled: false,
        to: { name: 'user-dashboard' }
    },
    {
        title: 'ویرایش نقش  کاربری',
        disabled: true,
        href: '#'
    }
]);
const formRef = ref<any>(null);
const loading = ref(true);
const permissions = ref([]);
const form = ref({
    title: null,
    name: null,
    parent_id: null
});
const route = useRoute();
const is_visible_create = ref(false);

const schema = Yup.object().shape({
    title: Yup.string().required()
    // email: Yup.string().email().required(),
    // password: Yup.string().min(6).required(),
    // confirm_password: Yup.string()
    //     .required()
    //     .oneOf([Yup.ref('password')], 'Passwords do not match')
});

// const rules: any = ref({
//     name: (value: string) => value.length > 2 || 'More than two letters required'
// });
const selectedPermissions = ref([]);

const fetchData = async () => {
    try {
        const { data } = await ApiService.get(`application/portal/projects/${route.params.id}/permissions`);
        permissions.value = data.data;
    } catch (error) {}
};

const fetchRole = async () => {
    try {
        const { data } = await ApiService.get(`application/portal/projects/${route.params.id}/roles/${route.params.role}`);

        form.value.title = data.data.title;
        form.value.name = data.data.name;
        selectedPermissions.value = data.data.permissions;
        loading.value = false;
    } catch (error) {}
};

const handleSubmit = async (values) => {
    let test = JSON.stringify(values, null, 2);
    console.log('values', values);

    try {
        const formData = {
            id: route.params.role,
            title: form.value.title,
            name: form.value.title,
            permissions: selectedPermissions.value
        };
        const { data } = await ApiService.put(`application/portal/projects/${route.params.id}/roles/${route.params.role}`, formData);
        console.log('data', data);
        if (data.success) {
            form.value.title = null;
            form.value.name = null;
            form.value.parent_id = null;
            // formRef.value.resetFields();
            router.push({ name: 'portal-roles-index', params: { id: route.params.id } });
        } else {
        }

        // loader.value = false;
    } catch ({ response }) {
        // loader.value = false;
        // validation_errros.value = response._data.data;
    }
};
watchEffect(() => {
    if (formRef.value) {
        formRef.value.setValues({
            ...form.value
        });
    }
});

onMounted(async () => {
    await fetchData();
    await fetchRole();
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
                                <v-col cols="12">
                                    <v-label class="mb-2 font-weight-medium">عنوان نقش کاربری</v-label>
                                    <!-- <TextInput name="title" /> -->

                                    <Field mode="passive" name="title" v-slot="{ field }" rules="required" label=" عنوان">
                                        <v-text-field
                                            v-bind="field"
                                            v-model="form.title"
                                            label="عنوان "
                                            variant="outlined"
                                            hide-details="auto"
                                        ></v-text-field>
                                    </Field>
                                    <div class="invalid-feedback d-block">
                                        <ErrorMessage name="title" />
                                    </div>
                                </v-col>

                                <v-col cols="12">
                                    <div class="grid grid-cols-12 gap-2 mt-8">
                                        <div class="col-span-12 lg:col-span-4" v-for="(permission, index) in permissions" :key="index">
                                            <div>
                                                <h2 class="text-xl">{{ $t(`permissions.${permission?.name}`) }}</h2>
                                            </div>

                                            <v-checkbox
                                                v-for="(childPermission, j) in permission.children"
                                                density="compact"
                                                hide-details
                                                color="primary"
                                                :label="$t(`permissions.${childPermission?.name}`)"
                                                :value="childPermission.id"
                                                v-model="selectedPermissions"
                                            >
                                            </v-checkbox>
                                        </div>
                                    </div>
                                </v-col>

                                <v-col>
                                    <v-btn type="submit" class="submit-btn mt-2" flat color="primary">ذخیره</v-btn>
                                </v-col>
                            </v-row>
                        </Form>
                    </div>
                </UiParentCard>
            </v-skeleton-loader>
        </v-col>
    </v-row>
</template>
