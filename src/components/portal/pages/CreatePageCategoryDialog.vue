<template>
    <div>
        <v-dialog @afterLeave="handleClose" v-model="visible" max-width="500px">
            <v-card>
                <Form @submit="handleSubmit">
                    <v-card-title class="py-4">
                        <span class="">ایجاد دسته بندی صفحات </span>
                    </v-card-title>

                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <Field mode="passive" name="title" v-slot="{ field }" rules="required" label=" عنوان">
                                    <v-text-field v-bind="field" v-model="form.title" label="عنوان" hide-details="auto"></v-text-field>
                                </Field>
                                <div class="invalid-feedback d-block">
                                    <ErrorMessage name="title" />
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-actions>
                        <div>
                            <v-btn :loading="loader" type="submit" color="primary" text="ذخیره" variant="tonal"></v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click="handleClose"> لغو </v-btn>
                        </div>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </Form>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="visible_snackbar">
            {{ snackbar_text }}

            <template v-slot:actions>
                <v-btn color="pink" variant="text" @click="visible_snackbar = false"> بستن </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import ApiService from '@/services/ApiService';
import { useRoute } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
});

const visible_snackbar = ref(false);
const snackbar_text = ref(null);

const emits = defineEmits(['update:modelValue', 'create']);
const visible = ref(false);

const form = ref({
    title: null
});

const route = useRoute();

const loader = ref(false);

const handleSubmit = async () => {
    try {
        loader.value = true;
        const formData = {
            project_id: route.params.id,
            title: form.value.title,
            name: form.value.title,
            landing_page_id: route.params.item
        };
        const { data } = await ApiService.post(`application/portal/projects/${route.params.id}/page/menu/categories`, formData);

        if (data.success) {
            emits('create', true);
            form.value.title = null;
            snackbar_text.value = 'عملیات  با موفقیت انجام شد';
            visible_snackbar.value = true;
            handleClose();
        }

        loader.value = false;
    } catch (error) {
        loader.value = false;
    }
};

const handleClose = () => {
    emits('update:modelValue', false);
};

watch(
    () => props.modelValue,
    (val: boolean) => {
        visible.value = val;
    },
    { immediate: true }
);
watch(
    () => visible.value,
    (val: boolean) => {}
);

onMounted(() => {});
</script>
