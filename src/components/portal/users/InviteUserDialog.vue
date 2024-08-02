<template>
    <div>
        <v-dialog @afterLeave="handleClose" v-model="visible" max-width="500px">
            <v-card>
                <Form @submit="handleSubmit">
                    <v-card-title class="py-4">
                        <span class="">ایجاد عضو جدید </span>
                    </v-card-title>

                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <Field mode="passive" name="email" v-slot="{ field }" rules="required" label=" ایمیل">
                                    <v-text-field
                                        v-bind="field"
                                        type="email"
                                        v-model="form.email"
                                        label="ایمیل کاربر را وارد کنید"
                                    ></v-text-field>
                                </Field>
                                <div class="invalid-feedback d-block">
                                    <ErrorMessage name="email" />
                                </div>
                            </v-col>
                            <v-col cols="12">
                                <Field mode="passive" name="role" v-slot="{ field }" rules="required" label="سطح دسترسی کاربر">
                                    <v-select
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
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { tableFixedHeaderData } from '@/_mockApis/components/table/basicTables';
import ApiService from '@/services/ApiService';
import { useRoute } from 'vue-router';
import { PlusIcon, EditIcon, TrashIcon, CheckIcon, XIcon, ArrowBackUpIcon } from 'vue-tabler-icons';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useDebounceFn } from '@vueuse/core';

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

const roleSearchTerm = ref('');

const form = ref({
    email: null,
    role: null
});

const route = useRoute();

const roles = ref([]);

const loader = ref(false);

const pager = ref({});

const current_page = ref(1);

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

const handleSubmit = async () => {
    try {
        loader.value = true;
        const formData = {
            project: route.params.id,
            users: [
                {
                    username: form.value.email,
                    role: form.value.role?.id
                }
            ]
        };
        const { data } = await ApiService.post('application/portal/projects/invite/membership', formData);

        if (data.success) {
            emits('create', true);
            form.value.email = null;
            form.value.role = null;
            snackbar_text.value = 'عملیات  با موفقیت انجام شد';
            visible_snackbar.value = true;
            handleClose();
        }

        loader.value = false;
    } catch (error) {
        loader.value = false;
    }
};

const debouncedFn = useDebounceFn(() => {
    fetchRoles();
}, 300);
const handleOnSearch = () => {
    debouncedFn();
};

const handleClose = () => {
    emits('update:modelValue', false);
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

onMounted(() => {
    fetchRoles();
});
</script>
