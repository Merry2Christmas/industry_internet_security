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
                // 剧本编排界面 -- 最终版
                path: "/Drama/dramaRunNew",
                name: "DramaRunNew",
                component: () => import("/src/pages/Drama/dramaRunNew.vue")
            },
            {
                // 剧本缩略图
                path: "/Drama/miniMap",
                name: "miniMap",
                component: () => import("/src/pages/Drama/miniMap.vue")
            },
            {
                // 剧本编排界面 -- 第三版
                path: "/Drama/dramaRun",
                name: "DramaRun",
                component: () => import("/src/pages/Drama/dramaRun.vue")
            },
            {
                // 剧本编排界面 -- 第二版
                path: "/Drama/dramaArrange",
                name: "DramaArrange",
                component: () => import("/src/pages/Drama/dramaArrange.vue")
            },
            {
                // 剧本编排界面 -- 第一版
                path: "/Drama/something",
                name: "something",
                component: () => import("/src/pages/Drama/something.vue")
            },
            {
                // 一个单独的小地图界面
                path: 'Drama/antvMinimap',
                name: "antvMinimap",
                component: () => import("/src/pages/Drama/antvMinimap.vue")
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
            },
            {
                // 2D拓扑
                path: "/2D",
                name: "2D",
                component: () => import("/src/pages/Topo/Topo-2D.vue")
            },
            {
                // 3D拓扑
                path: "/3D",
                name: "3D",
                component: () => import("/src/pages/Topo/Topo-3D.vue")
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router