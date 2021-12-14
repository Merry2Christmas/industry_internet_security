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
            {
                // 剧本管理界面
                path: "/Drama",
                name: "Drama",
                component: () => import("/src/pages/Drama.vue"),
            },
            {
                // 武器管理界面
                path: "/Weapon",
                name: "Weapon",
                component: () => import("/src/pages/Weapon.vue")
            },
        ]
    },
    {
        // 剧本管理界面的下属界面
        path: '/Drama',
        name: 'Option',
        component: () => import("/src/pages/Index.vue"),
        children:[
            {
                // 剧本运行界面
                path: "/Drama/dramaRun",
                name: "DramaRun",
                component: () => import("/src/pages/Drama/dramaRun.vue")
            },
            {
                // 剧本编排界面
                path: "/Drama/dramaEdit",
                name: "DramaEdit",
                component: () => import("/src/pages/Drama/dramaEdit.vue")
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router