import {
    CircleIcon,
    HomeIcon,
    ClipboardIcon,
    AlertCircleIcon,
    SettingsIcon,
    LoginIcon,
    UserPlusIcon,
    RotateIcon,
    ZoomCodeIcon,
    FileDescriptionIcon,
    BorderAllIcon,
    AppsIcon,
    PointIcon,
    SettingsAutomationIcon
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    divider?: boolean;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    subCaption?: string;
    class?: string;
    extraclass?: string;
    type?: string;
}

const horizontalItems: menu[] = [
    {
        title: 'داشبورد',
        icon: HomeIcon,
        to: 'user-dashboard',
    },
    // {
    //     title: 'مدیریت  کار ها',
    //     icon: AppsIcon,
    //     to: '#',
    //     children: [
    //         {
    //             title: 'بخش های سفارشی',
    //             icon: CircleIcon,
    //             to: '/apps/chats'
    //         },
    //         {
    //             title: 'لیست کارها',
    //             icon: CircleIcon,
    //             to: '/apps/chats'
    //         },
    //         {
    //             title: 'لیست زمان ها',
    //             icon: CircleIcon,
    //             to: '/apps/chats'
    //         },

    //     ]
    // },

    // {
    //     title: 'صفحات سفارشی',
    //     icon: ClipboardIcon,
    //     to: '#',
    //     children: [
    //         {
    //             title: 'لیست صفحات',
    //             icon: CircleIcon,
    //             to: '/pages/pricing'
    //         },

    //     ]
    // },
    {
        title: 'کاربران',
        icon: FileDescriptionIcon,
        to: '#',
        children: [

            {
                title: 'مدیریت کاربران',
                icon: CircleIcon,
                to: 'portal-users-index'
            },
            {
                title: 'نقش ها و دسترسی ها',
                icon: CircleIcon,
                to: 'portal-roles-index'
            },

        ]
    },
    // {
    //     title: 'تابلو ها',
    //     icon: BorderAllIcon,
    //     to: '#',
    //     children: [
    //         {
    //             title: 'مدیریت  تابلوها',
    //             icon: BorderAllIcon,
    //             to: '/tables/basic'
    //         },

    //     ]
    // },
    // {
    //     title: 'تنظیمات',
    //     icon: SettingsAutomationIcon,
    //     to: '/setting',
    // },
];

export default horizontalItems;
