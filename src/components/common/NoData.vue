<template>
    <ClientOnly>
        <!-- <div class="bg-gray-100 px-5 py-6 flex flex-col justify-center items-center rounded-xl my-10"></div> -->
        <v-card elevation="10" rounded="md" class="flex flex-col justify-center items-center">
            <div class="flex flex-col justify-center items-center px-5 py-6">
                <img :src="proUser2" width="80" height="80" />

                <div class="mt-4">
                    <h5 class="text-h5">
                        <slot></slot>
                    </h5>
                </div>
            </div>
        </v-card>
    </ClientOnly>
</template>

<script setup lang="ts">
import proUser2 from '@/assets/images/svgs/icon-inbox.svg';

// const props = defineProps({
//     icon: {
//         type: String,
//         default: 'box'
//     }
// });
</script>
