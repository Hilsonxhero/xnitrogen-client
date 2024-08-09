<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ApiService from '@/services/ApiService';
import { useRoute } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { router } from '@/router';

const page = ref({ title: 'ایجاد   پوشه صفحات ' });
const breadcrumbs = ref([
    {
        title: 'داشبورد',
        disabled: false,
        to: { name: 'user-dashboard' }
    },
    {
        title: 'ایجاد   پوشه صفحات ',
        disabled: true,
        href: '#'
    }
]);

const form = ref({
    title: null,
    description: null,
    is_common_access: false
});
const route = useRoute();

const handleSubmit = async () => {
    try {
        const formData = {
            title: form.value.title,
            description: form.value.description,
            is_common_access: form.value.is_common_access
        };
        const { data } = await ApiService.post(`application/portal/projects/${route.params.id}/pages`, formData);
        if (data.success) {
            form.value.title = null;
            form.value.description = null;
            form.value.is_common_access = false;
            router.push({ name: 'portal-pages-index', params: { id: route.params.id } });
        } else {
        }

        // loader.value = false;
    } catch ({ response }) {
        // loader.value = false;
        // validation_errros.value = response._data.data;
    }
};

onMounted(() => {});
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12">
            <UiParentCard>
                <div>
                    <Form @submit="handleSubmit">
                        <v-row>
                            <v-col cols="12">
                                <v-label class="mb-2 font-weight-medium">عنوان </v-label>
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
                                <v-label class="mb-2 font-weight-medium">توضیحات </v-label>
                                <Field mode="passive" name="description" v-slot="{ field }" rules="required" label=" توضیحات">
                                    <v-textarea v-bind="field" v-model="form.description" hide-details="auto" label="توضیحات"></v-textarea>
                                </Field>
                                <div class="invalid-feedback d-block">
                                    <ErrorMessage name="description" />
                                </div>
                            </v-col>

                            <v-col cols="12">
                                <v-label class="mb-2 font-weight-medium">دسترسی عمومی </v-label>
                                <Field mode="passive" name="is_common_access" v-slot="{ field }" label=" دسترسی عمومی">
                                    <div class="ml-auto">
                                        <v-switch v-model="form.is_common_access" hide-details color="primary" inset></v-switch>
                                    </div>
                                </Field>
                                <div class="invalid-feedback d-block">
                                    <ErrorMessage name="is_common_access" />
                                </div>
                            </v-col>

                            <v-col>
                                <v-btn type="submit" class="submit-btn mt-2" flat color="primary">ذخیره</v-btn>
                            </v-col>
                        </v-row>
                    </Form>
                </div>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
