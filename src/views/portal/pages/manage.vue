<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ApiService from '@/services/ApiService';
import { useRoute } from 'vue-router';
import { PlusIcon, EditIcon, TrashIcon, CheckIcon, XIcon, ArrowBackUpIcon } from 'vue-tabler-icons';
import { useDebounceFn } from '@vueuse/core';
import CreatePageCategoryDialog from '@/components/portal/pages/CreatePageCategoryDialog.vue';
import ManagePageDialog from '@/components/portal/pages/ManagePageDialog.vue';

const debouncedFn = useDebounceFn(() => {
    fetchData();
}, 300);
const handleOnSearch = () => {
    debouncedFn();
};
const page = ref({ title: 'مدیریت صفحات ' });
const breadcrumbs = ref([
    {
        title: 'داشبورد',
        disabled: false,
        to: { name: 'user-dashboard' }
    },
    {
        title: 'مدیریت نقش های کاربری',
        disabled: true,
        href: '#'
    }
]);
const is_visible_manage_page = ref(false);
const expanded = ref([]);

const dessertHeaders = ref([
    {
        title: 'عنوان',
        align: 'start',
        sortable: false,
        key: 'title',
        width: '200px'
    },
    { title: 'نام', key: 'name', width: '200px' },
    { title: 'وضعیت', key: 'status' },
    { title: 'عملیات', key: 'actions' },
    { title: '', key: 'data-table-expand' }
]);
const tableData = ref([]);
const form = ref({
    email: null,
    role: null
});
const is_visible_create = ref(false);
const route = useRoute();
const editedIndex = ref(-1);
const editedItem = ref({});
const defaultItem = ref({});
const visible_snackbar = ref(false);
const snackbar_text = ref(null);
const pager = ref({});
const current_page = ref(1);
const table_loading = ref(true);
const search = ref('');
const fetchData = async () => {
    try {
        let params = {
            page: current_page.value,
            q: search.value
        };
        const { data } = await ApiService.query(`application/portal/projects/${route.params.id}/page/${route.params.item}/children`, {
            params: params
        });
        tableData.value = data.data.pages;
        pager.value = data.data.pager;
        table_loading.value = false;
    } catch (error) {}
};
const dialogDelete = ref(false);

const deleteItem = (item: any) => {
    editedIndex.value = tableData.value.indexOf(item);
    editedItem.value = Object.assign({}, item);
    dialogDelete.value = true;
};
const deleteItemConfirm = async () => {
    try {
        const { data } = await ApiService.delete(`application/portal/projects/${route.params.id}/roles/${editedItem.value.id}`);
        if (data.success) {
            tableData.value.splice(editedIndex.value, 1);
            closeDelete();
            snackbar_text.value = 'عملیات حذف با موفقیت انجام شد';
            visible_snackbar.value = true;
        }
    } catch (error) {}
};
const closeDelete = () => {
    dialogDelete.value = false;
    nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem.value);
        editedIndex.value = -1;
    });
};

const handleOnCreatePageCategory = () => {
    console.log('handleOnCreatePageCategory');
};
const handleOnCreatePage = () => {
    console.log('handleOnCreatePage');
};
const handleShowCreatePage = () => {
    is_visible_manage_page.value = true;
};

const loadItems = ({ page, itemsPerPage, sortBy }) => {
    table_loading.value = true;
    current_page.value = page;
    fetchData();
};

watch(
    () => search.value,
    (val) => {
        if (val.trim() !== '') {
            handleOnSearch();
        } else {
            search.value = '';
            fetchData();
        }
    }
);

onMounted(() => {
    fetchData();
});
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12">
            <UiParentCard>
                <v-data-table v-model:expanded="expanded" :headers="dessertHeaders" :items="tableData" item-value="title" show-expand>
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title> لیست دسته بندی صفحات </v-toolbar-title>
                            <v-btn
                                @click="is_visible_create = true"
                                class="me-2 text-none"
                                color="primary"
                                prepend-icon="mdi-export-variant"
                                variant="tonal"
                            >
                                ایجاد دسته بندی صفحات
                            </v-btn>
                        </v-toolbar>
                    </template>

                    <template v-slot:item.status="{ item }">
                        <div>
                            <template v-if="item?.status == 'active'">
                                <v-chip color="success"> فعال </v-chip>
                            </template>
                            <template v-if="item?.status == 'inactive'">
                                <v-chip color="warning"> غیرفعال </v-chip>
                            </template>
                            <template v-if="item?.status == 'ban'">
                                <v-chip color="error"> مسدود </v-chip>
                            </template>
                        </div>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <div class="flex items-center">
                            <v-btn
                                @click="handleShowCreatePage(item)"
                                class=""
                                color="primary"
                                prepend-icon="mdi-file-document-edit-outline"
                                variant="tonal"
                            >
                                ایجاد صفحه
                            </v-btn>

                            <v-btn class="ml-3" color="info" prepend-icon="mdi-pencil-box-outline" variant="tonal"> ویرایش </v-btn>
                            <div class="ml-3">
                                <v-btn class="" color="error" prepend-icon="mdi-trash-can-outline" variant="tonal"> حذف </v-btn>
                            </div>
                        </div>
                    </template>

                    <template v-slot:expanded-row="{ columns, item }">
                        <template v-for="(sub_page, index) in item?.children" :key="index">
                            <tr>
                                <td>
                                    {{ sub_page?.title }}
                                </td>
                                <td>
                                    {{ sub_page?.name }}
                                </td>
                                <td>
                                    <template v-if="sub_page?.status == 'active'">
                                        <v-chip color="success"> فعال </v-chip>
                                    </template>
                                    <template v-if="sub_page?.status == 'inactive'">
                                        <v-chip color="warning"> غیرفعال </v-chip>
                                    </template>
                                    <template v-if="sub_page?.status == 'ban'">
                                        <v-chip color="error"> مسدود </v-chip>
                                    </template>
                                </td>
                                <td>
                                    <div class="flex items-center">
                                        <v-btn density="default" class="" color="info" icon="mdi-pencil-box-outline" variant="tonal">
                                        </v-btn>
                                        <div class="ml-3">
                                            <v-btn density="default" class="" color="error" icon="mdi-trash-can-outline" variant="tonal">
                                            </v-btn>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </template>
                </v-data-table>
            </UiParentCard>
        </v-col>
    </v-row>

    <CreatePageCategoryDialog @create="handleOnCreatePageCategory" v-model="is_visible_create" />
    <ManagePageDialog @create="handleOnCreatePage" v-model="is_visible_manage_page" />

    <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
            <v-card-title class="text-h5"> آیا از حذف {{ editedItem?.title }} اطمینان دارید ؟ </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">تایید</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">لغو</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-snackbar v-model="visible_snackbar">
        {{ snackbar_text }}

        <template v-slot:actions>
            <v-btn color="pink" variant="text" @click="visible_snackbar = false"> بستن </v-btn>
        </template>
    </v-snackbar>
</template>
