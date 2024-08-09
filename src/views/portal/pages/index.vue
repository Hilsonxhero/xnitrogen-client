<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ApiService from '@/services/ApiService';
import { useRoute } from 'vue-router';
import { PlusIcon, EditIcon, TrashIcon, CheckIcon, XIcon, ArrowBackUpIcon, CalendarIcon } from 'vue-tabler-icons';
import { useDebounceFn } from '@vueuse/core';
import { followerCard } from '@/_mockApis/components/widget/card';
import proUser2 from '@/assets/images/svgs/icon-inbox.svg';
import NoData from '@/components/common/NoData.vue';
import { userCards } from '@/_mockApis/components/widget/card';

const debouncedFn = useDebounceFn(() => {
    fetchData();
}, 300);
const handleOnSearch = () => {
    debouncedFn();
};
const page = ref({ title: 'مدیریت صفحات سفارشی' });
const breadcrumbs = ref([
    {
        title: 'داشبورد',
        disabled: false,
        to: { name: 'user-dashboard' }
    },
    {
        title: 'مدیریت  صفحات سفارشی',
        disabled: true,
        href: '#'
    }
]);

const headers = ref([
    { title: ' عنوان', key: 'title' },
    // { title: 'دسته گروه', key: 'parent_name' },
    { title: 'عملیات', key: 'actions' }
]);
const pagesData = ref([]);

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
        const { data } = await ApiService.query(`application/portal/projects/${route.params.id}/pages`, {
            params: params
        });

        pagesData.value = data.data;
        pager.value = data.data.pager;
        table_loading.value = false;
    } catch (error) {}
};
const dialogDelete = ref(false);

const deleteItem = (item: any) => {
    editedIndex.value = pagesData.value.indexOf(item);
    editedItem.value = Object.assign({}, item);
    dialogDelete.value = true;
};
const deleteItemConfirm = async () => {
    try {
        const { data } = await ApiService.delete(`application/portal/projects/${route.params.id}/roles/${editedItem.value.id}`);
        if (data.success) {
            pagesData.value.splice(editedIndex.value, 1);
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

// const loadItems = ({ page, itemsPerPage, sortBy }) => {
//     table_loading.value = true;
//     current_page.value = page;
//     fetchData();
// };

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
            <v-card elevation="10" rounded="md">
                <v-card-item>
                    <div class="d-flex align-center justify-end">
                        <v-btn
                            :to="{ name: 'portal-pages-create', params: { id: $route.params.id } }"
                            class="me-2 text-none"
                            color="primary"
                            prepend-icon="mdi-export-variant"
                            variant="tonal"
                        >
                            ایجاد پوشه
                        </v-btn>
                    </div>
                </v-card-item>
            </v-card>
        </v-col>
        <v-col cols="12">
            <template v-if="pagesData && pagesData.length === 0">
                <NoData>صفحه ای تا به الان ایجاد نکردید!</NoData>
            </template>
            <template v-else>
                <v-row>
                    <v-col cols="12" md="3" sm="6" v-for="(page, index) in pagesData" :key="index">
                        <v-card elevation="10" rounded="md">
                            <v-card-item>
                                <v-avatar size="80" rounded="xl">
                                    <img src="@/assets/media/folder-document.svg" width="80" />
                                </v-avatar>
                                <div class="mt-6">
                                    <h5 class="text-h6 mb-2" v-text="page.title"></h5>
                                    <div class="d-flex align-center justify-space-between">
                                        <h6 class="text-subtitle-1 text-medium-emphasis">{{ page.create_at }}</h6>
                                    </div>
                                </div>
                                <!-- <div class="mt-6">
                                    <v-btn class="bg-lightprimary text-primary" block flat>مدیریت</v-btn>
                                    <v-btn variant="tonal" color="info" class="mt-3" block flat>ویرایش</v-btn>
                                    <v-btn variant="tonal" color="error" class="mt-3" block flat>حذف</v-btn>
                                </div> -->

                                <v-menu>
                                    <template v-slot:activator="{ props }">
                                        <!-- <v-btn color="primary" v-bind="props"> Activator slot </v-btn> -->
                                        <v-btn variant="tonal" color="info" class="mt-3" v-bind="props" block flat>عملیات</v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item
                                            :link="true"
                                            :to="{ name: 'portal-pages-manage', params: { id: $route.params.id, item: page?.id } }"
                                            :value="1"
                                        >
                                            <v-list-item-title>مدیریت</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-card-item>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
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
