import {
    createRouter,
    createWebHistory
} from 'vue-router'

const  routes = [
    {
        // 登录界面
        path: "/Login",
        name: "Login",
        component: () => import("/src/pages/Login.vue")
    },
    // 首页进入界面
    {
        path: '/',
        name: 'Index',
        redirect: '/Drama',
        component: () => import("/src/pages/Index.vue"),
        children:[
            // ------------------------------以下为剧本界面
            {
                // 剧本管理界面
                path: "/Drama",
                name: "Drama",
                component: () => import("/src/pages/Drama.vue"),
            },
            {
                // 剧本运行界面
                path: "/Drama/dramaRun",
                name: "DramaRun",
                component: () => import("/src/pages/Drama/dramaRunNew.vue")
            },
            // {
            //     // 剧本编排界面
            //     path: "/Drama/dramaEdit",
            //     name: "DramaEdit",
            //     component: () => import("/src/pages/Drama/dramaEdit.vue")
            // },
            {
                // 剧本编排界面
                path: "/Drama/dramaArrange",
                name: "DramaArrange",
                component: () => import("/src/pages/Drama/dramaArrange.vue")
            },

            // ------------------------------以下为武器界面
            {
                // 武器管理界面
                path: "/Weapon",
                name: "Weapon",
                component: () => import("/src/pages/Weapon.vue")
            },
            {
                // 武器详情界面
                path: "/Weapon/weaponDetail",
                name: "WeaponDetail",
                component: () => import("/src/pages/Weapon/weaponDetail.vue")
            }
        ]
    },
    // {
    //     // 剧本管理界面的下属界面
    //     path: '/Drama',
    //     name: 'Option',
    //     component: () => import("/src/pages/Index.vue"),
    //     children:[
    //         {
    //             // 剧本运行界面
    //             path: "/Drama/dramaRun",
    //             name: "DramaRun",
    //             component: () => import("/src/pages/Drama/dramaRunNew.vue")
    //         },
    //         // {
    //         //     // 剧本编排界面
    //         //     path: "/Drama/dramaEdit",
    //         //     name: "DramaEdit",
    //         //     component: () => import("/src/pages/Drama/dramaEdit.vue")
    //         // },
    //         {
    //             // 剧本编排界面
    //             path: "/Drama/dramaArrange",
    //             name: "DramaArrange",
    //             component: () => import("/src/pages/Drama/dramaArrange.vue")
    //         }
    //     ]
    // },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router