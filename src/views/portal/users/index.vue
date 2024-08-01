<script setup lang="ts">
import { ref, onMounted } from 'vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { tableFixedHeaderData } from '@/_mockApis/components/table/basicTables';
import ApiService from '@/services/ApiService';
import { useRoute } from 'vue-router';
import { PlusIcon, EditIcon, TrashIcon, CheckIcon, XIcon, ArrowBackUpIcon } from 'vue-tabler-icons';

// theme breadcrumb
const page = ref({ title: 'مدیریت کاربران' });
const breadcrumbs = ref([
    {
        title: 'داشبورد',
        disabled: false,
        to: { name: 'user-dashboard' }
    },
    {
        title: 'مدیریت کاربران',
        disabled: true,
        href: '#'
    }
]);

const headers = ref([
    { title: 'نام کاربری', key: 'username' },
    { title: 'ایمیل', key: 'email' },
    { title: 'شماره همراه', key: 'phone' },
    { title: 'سطح دسترسی', key: 'role' },
    { title: 'وضعیت', key: 'status' },
    { title: 'عملیات', key: 'actions' }
]);
const tableData = ref([]);
const form = ref({
    email: null,
    role: null
});
const route = useRoute();
const is_visible_create = ref(false);
const roles = ref([]);

const fetchData = async () => {
    try {
        const { data } = await ApiService.get(`application/portal/projects/${route.params.id}/users`);
        tableData.value = data.data.members;
    } catch (error) {}
};

const fetchRoles = async () => {
    try {
        const data = await ApiService.get(`application/portal/projects/${route.params.id}/roles/select/values`);
        roles.value = data.data.roles;
    } catch (error) {}
};

onMounted(() => {
    fetchData();
    fetchRoles();
});
</script>

<template>
    <!-- ---------------------------------------------------- -->
    <!-- Table Header Fixed -->
    <!-- ---------------------------------------------------- -->
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12">
            <UiParentCard>
                <v-data-table no-data-text="دیتایی پیدا نشد" :headers="headers" :items="tableData">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title>لیست کاربران</v-toolbar-title>

                            <v-btn
                                @click="is_visible_create = true"
                                class="me-2 text-none"
                                flat
                                color="primary"
                                prepend-icon="mdi-plus"
                                variant="flat"
                            >
                                ایجاد کاربر
                            </v-btn>
                        </v-toolbar>
                    </template>

                    <template v-slot:item.status="{ value }">
                        <div>
                            <v-chip color="success"> فعال </v-chip>
                        </div>
                    </template>
                    <template v-slot:item.actions="{ value }">
                        <v-btn size="30" icon variant="flat" class="grey100">
                            <v-avatar size="22">
                                <DotsVerticalIcon size="20" color="grey100" />
                            </v-avatar>
                            <v-menu activator="parent">
                                <v-list>
                                    <v-list-item value="action" hide-details min-height="38">
                                        <v-list-item-title>
                                            <v-avatar size="20" class="mr-2">
                                                <component :is="EditIcon" stroke-width="2" size="20" />
                                            </v-avatar>
                                            ویرایش
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-btn>
                    </template>
                </v-data-table>
            </UiParentCard>
        </v-col>
        <v-dialog v-model="is_visible_create" max-width="500px">
            <v-card>
                <v-card-title class="py-4">
                    <span class="">ایجاد عضو جدید </span>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field type="email" v-model="form.email" label="ایمیل کاربر را وارد کنید"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-select item-title="title" itme-value="id" :items="roles" label="سطح دسترسی کاربر*" required></v-select>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <div>
                        <v-btn color="primary" text="ذخیره" variant="tonal" @click="is_visible_create = false"></v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="is_visible_create = false"> لغو </v-btn>
                    </div>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
