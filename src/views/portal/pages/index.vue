<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ApiService from '@/services/ApiService';
import { useRoute } from 'vue-router';
import { PlusIcon, EditIcon, TrashIcon, CheckIcon, XIcon, ArrowBackUpIcon } from 'vue-tabler-icons';
import { useDebounceFn } from '@vueuse/core';
const debouncedFn = useDebounceFn(() => {
    fetchData();
}, 300);
const handleOnSearch = () => {
    debouncedFn();
};
const page = ref({ title: 'مدیریت نقش های کاربری' });
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

const headers = ref([
    { title: ' عنوان', key: 'title' },
    // { title: 'دسته گروه', key: 'parent_name' },
    { title: 'عملیات', key: 'actions' }
]);
const tableData = ref([]);
const form = ref({
    email: null,
    role: null
});
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
        const { data } = await ApiService.query(`application/portal/projects/${route.params.id}/roles`, {
            params: params
        });
        tableData.value = data.data.roles;
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
                <v-data-table-server
                    v-model:items-per-page="pager.per_page"
                    :items-length="pager.total"
                    page-text=""
                    :loading="table_loading"
                    no-data-text="دیتایی پیدا نشد"
                    items-per-page-text="تعداد نمایش"
                    :headers="headers"
                    :items="tableData"
                    loading-text="در حال  بارگزاری"
                    @update:options="loadItems"
                >
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title>
                                <div class="w-[40%]">
                                    <v-text-field
                                        v-model="search"
                                        label="جستجو کلمات کلیدی .."
                                        prepend-inner-icon="mdi-magnify"
                                        variant="outlined"
                                        hide-details
                                        single-line
                                    ></v-text-field>
                                </div>
                            </v-toolbar-title>

                            <v-btn
                                :to="{ name: 'portal-roles-create', params: { id: $route.params.id } }"
                                class="me-2 text-none"
                                flat
                                color="primary"
                                prepend-icon="mdi-plus"
                                variant="flat"
                            >
                                ایجاد نقش کاربری
                            </v-btn>
                        </v-toolbar>
                    </template>

                    <template v-slot:item.status="{ value }">
                        <div>
                            <v-chip color="success"> فعال </v-chip>
                        </div>
                    </template>

                    <!-- <template v-slot:item.parent_name="{ value }">
                        <div>
                            <template v-if="value?.parent_name">
                                {{ value?.parent_name }}
                            </template>
                            <template v-else>
                                <v-chip> گروه اصلی </v-chip>
                            </template>
                        </div>
                    </template> -->
                    <template v-slot:item.actions="{ item }">
                        <v-btn size="30" icon variant="flat" class="grey100">
                            <v-avatar size="22">
                                <DotsVerticalIcon size="20" color="grey100" />
                            </v-avatar>
                            <v-menu activator="parent">
                                <v-list>
                                    <v-list-item
                                        :link="true"
                                        :to="{ name: 'portal-roles-edit', params: { id: $route.params.id, role: item?.id } }"
                                        hide-details
                                        min-height="38"
                                    >
                                        <v-list-item-title>
                                            <v-avatar size="20" class="mr-2">
                                                <component :is="EditIcon" stroke-width="2" size="20" />
                                            </v-avatar>

                                            ویرایش
                                        </v-list-item-title>
                                    </v-list-item>

                                    <v-list-item @click="deleteItem(item)" value="action" hide-details min-height="38">
                                        <v-list-item-title>
                                            <v-avatar size="20" class="mr-2">
                                                <component :is="TrashIcon" stroke-width="2" size="20" />
                                            </v-avatar>

                                            حذف
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-btn>
                    </template>
                </v-data-table-server>
            </UiParentCard>
        </v-col>
    </v-row>

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
