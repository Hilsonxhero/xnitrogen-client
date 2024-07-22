import { defineStore } from 'pinia';
import { router } from '@/router';

import ApiService from "@/services/ApiService";
import { useAuthStore } from '@/stores/auth';


import { computed, ref } from 'vue'

export const usePortalStore = defineStore("portal", () => {
    const authStore = useAuthStore();

    const selected = ref(window.localStorage.getItem("selected_project") ?? null);



    const selected_project = ref(selected.value ? authStore?.user?.projects?.find((item, index) => item?.id == selected.value) : authStore?.user?.projects[0])

    const projects = ref([]);

    const setSelectedProject = async (payload = null) => {
        try {
            if (payload == null) {

                selected_project.value = selected.value ? authStore?.user?.projects?.find((item, index) => item?.id == selected.value) : authStore?.user?.projects[0]
            } else {
                window.localStorage.setItem("selected_project", payload);
                selected.value = payload;
                selected_project.value = selected.value ? authStore?.user?.projects?.find((item, index) => item?.id == selected.value) : authStore?.user?.projects[0]
            }

        } catch (error) {
            return error;
        }
    };



    // const login = async (form: any) => {
    //     try {
    //         checked.value = false;
    //         const { data } = await ApiService.post(`application/auth/otp/login`, form);
    //         isLoggedIn.value = true;
    //         return data;
    //     } catch (error) {
    //         return error;
    //     }

    // };


    return {
        selected,
        selected_project,
        projects,
        setSelectedProject

    };
});





// export const useAuthStore = defineStore({
//     id: 'auth',
//     state: () => ({
//         // initialize state from local storage to enable user to stay logged in
//         // @ts-ignore
//         user: JSON.parse(localStorage.getItem('user')),
//         returnUrl: null
//     }),
//     actions: {

//         async login(username: string, password: string) {
//             const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });

//             // update pinia state
//             this.user = user;
//             // store user details and jwt in local storage to keep user logged in between page refreshes
//             localStorage.setItem('user', JSON.stringify(user));
//             // redirect to previous url or default to home page
//             router.push(this.returnUrl || '/dashboards/modern');
//         },
//         logout() {
//             this.user = null;
//             localStorage.removeItem('user');
//             router.push('/');
//         }
//     }
// });
