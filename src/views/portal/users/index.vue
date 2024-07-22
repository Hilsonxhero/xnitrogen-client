<script setup lang="ts">
import { ref } from 'vue';
// common components
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { tableFixedHeaderData } from '@/_mockApis/components/table/basicTables';
// theme breadcrumb
const page = ref({ title: 'مدیریت کاربران' });
const breadcrumbs = ref([
    {
        text: 'داشبورد',
        disabled: false,
        href: '/portal/dashboard'
    },
    {
        text: 'مدیریت کاربران',
        disabled: true,
        href: '#'
    }
]);

const headers = ref([
    { title: 'Vegetable (100g serving)', key: 'name' },
    { title: 'Calories', key: 'calories' },
    { title: 'Fat (g)', key: 'fat' },
    { title: 'Carbs (g)', key: 'carbs' },
    { title: 'Protein (g)', key: 'protein' },
    { title: 'Iron (%)', key: 'iron' }
]);
const vegetables = ref([
    {
        name: 'Spinach',
        calories: 23,
        fat: 0.4,
        carbs: 3.6,
        protein: 2.9,
        iron: '15%'
    },
    {
        name: 'Kael',
        calories: 49,
        fat: 0.9,
        carbs: 8.8,
        protein: 4.3,
        iron: '16%'
    },
    {
        name: 'Broccoli',
        calories: 34,
        fat: 0.4,
        carbs: 6.6,
        protein: 2.8,
        iron: '6%'
    },
    {
        name: 'Brussels Sprouts',
        calories: 43,
        fat: 0.3,
        carbs: 8.9,
        protein: 3.4,
        iron: '9%'
    },
    {
        name: 'Avocado',
        calories: 160,
        fat: 15,
        carbs: 9,
        protein: 2,
        iron: '3%'
    },
    {
        name: 'Sweet Potato',
        calories: 86,
        fat: 0.1,
        carbs: 20.1,
        protein: 1.6,
        iron: '3%'
    },
    {
        name: 'Corn',
        calories: 96,
        fat: 1.5,
        carbs: 21,
        protein: 3.4,
        iron: '2%'
    },
    {
        name: 'Potato',
        calories: 77,
        fat: 0.1,
        carbs: 17.5,
        protein: 2,
        iron: '8%'
    },
    {
        name: 'Butternut Squash',
        calories: 45,
        fat: 0.1,
        carbs: 11.7,
        protein: 1,
        iron: '4%'
    },
    {
        name: 'Beetroot',
        calories: 43,
        fat: 0.2,
        carbs: 10,
        protein: 1.6,
        iron: '6%'
    },
    {
        name: 'Parsnip',
        calories: 75,
        fat: 0.3,
        carbs: 18,
        protein: 1.2,
        iron: '4%'
    },
    {
        name: 'Yam',
        calories: 118,
        fat: 0.2,
        carbs: 27.9,
        protein: 1.5,
        iron: '4%'
    },
    {
        name: 'Acorn Squash',
        calories: 40,
        fat: 0.1,
        carbs: 10,
        protein: 1,
        iron: '5%'
    },
    {
        name: 'Artichoke',
        calories: 47,
        fat: 0.2,
        carbs: 10.5,
        protein: 3.3,
        iron: '7%'
    },
    {
        name: 'Peas',
        calories: 81,
        fat: 0.4,
        carbs: 14.5,
        protein: 5.4,
        iron: '25%'
    },
    {
        name: 'Green Beans',
        calories: 31,
        fat: 0.1,
        carbs: 6.9,
        protein: 1.8,
        iron: '8%'
    },
    {
        name: 'Red Bell Pepper',
        calories: 26,
        fat: 0.2,
        carbs: 6.0,
        protein: 1.0,
        iron: '3%'
    },
    {
        name: 'Cauliflower',
        calories: 25,
        fat: 0.1,
        carbs: 5.0,
        protein: 1.9,
        iron: '4%'
    },
    {
        name: 'Zucchini',
        calories: 17,
        fat: 0.3,
        carbs: 3.1,
        protein: 1.2,
        iron: '3%'
    },
    {
        name: 'Asparagus',
        calories: 20,
        fat: 0.1,
        carbs: 3.9,
        protein: 2.2,
        iron: '16%'
    },
    {
        name: 'Eggplant',
        calories: 25,
        fat: 0.2,
        carbs: 6,
        protein: 1,
        iron: '1%'
    },
    {
        name: 'Pumpkin',
        calories: 26,
        fat: 0.1,
        carbs: 6.5,
        protein: 1,
        iron: '4%'
    },
    {
        name: 'Celery',
        calories: 16,
        fat: 0.2,
        carbs: 3,
        protein: 0.7,
        iron: '1%'
    },
    {
        name: 'Cucumber',
        calories: 15,
        fat: 0.1,
        carbs: 3.6,
        protein: 0.7,
        iron: '2%'
    },
    {
        name: 'Leek',
        calories: 61,
        fat: 0.3,
        carbs: 14.2,
        protein: 1.5,
        iron: '12%'
    },
    {
        name: 'Fennel',
        calories: 31,
        fat: 0.2,
        carbs: 7,
        protein: 1.2,
        iron: '6%'
    },
    {
        name: 'Green Peas',
        calories: 81,
        fat: 0.4,
        carbs: 14.5,
        protein: 5.4,
        iron: '25%'
    },
    {
        name: 'Okra',
        calories: 33,
        fat: 0.2,
        carbs: 7.5,
        protein: 1.9,
        iron: '3%'
    },
    {
        name: 'Chard',
        calories: 19,
        fat: 0.2,
        carbs: 3.7,
        protein: 1.8,
        iron: '22%'
    },
    {
        name: 'Collard Greens',
        calories: 32,
        fat: 0.6,
        carbs: 5.4,
        protein: 3,
        iron: '2%'
    }
]);
</script>

<template>
    <!-- ---------------------------------------------------- -->
    <!-- Table Header Fixed -->
    <!-- ---------------------------------------------------- -->
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12">
            <UiParentCard title="لیست کاربران">
                <v-card class="border" elevation="0">
                    <!-- <v-table class="month-table" fixed-header height="400px">
                        <thead>
                            <tr>
                                <th class="text-h6">Customer</th>
                                <th class="text-h6">Status</th>
                                <th class="text-h6">Email Address</th>
                                <th class="text-h6">Teams</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in tableFixedHeaderData" :key="item.name" class="month-item">
                                <td>
                                    <div class="d-flex align-center">
                                        <v-avatar size="40">
                                            <img :src="item.avatar" alt="avatar" height="40" />
                                        </v-avatar>
                                        <div class="ml-4">
                                            <h6 class="text-h6">{{ item.name }}</h6>
                                            <div class="text-subtitle-1 text-medium-emphasis">{{ item.handle }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <v-chip
                                        rounded="lg"
                                        v-if="item.statusoffline"
                                        class="font-weight-bold pl-1 pr-2"
                                        :color="item.statuscolor"
                                        size="small"
                                    >
                                        <ClockHour4Icon size="15" class="mr-1" />
                                        {{ item.status }}
                                    </v-chip>

                                    <v-chip rounded="lg" v-else class="font-weight-bold pl-1 pr-2" :color="item.statuscolor" size="small">
                                        <CircleIcon size="15" class="mr-1" />
                                        {{ item.status }}
                                    </v-chip>
                                </td>
                                <td>
                                    <div class="text-subtitle-1 text-medium-emphasis">{{ item.email }}</div>
                                </td>
                                <td>
                                    <div class="d-flex align-center">
                                        <div class="d-flex">
                                            <v-chip
                                                v-for="team in item.teams"
                                                :key="team.status"
                                                rounded="lg"
                                                :class="'font-weight-bold px-2 mr-2 bg-' + team.statuscolor"
                                                size="small"
                                            >
                                                {{ team.status }}
                                            </v-chip>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table> -->

                    <v-data-table :headers="headers" :items="vegetables">
                        <template v-slot:item.calories="{ value }">
                            <v-chip>
                                {{ value }}
                            </v-chip>
                        </template>
                    </v-data-table>
                </v-card>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
