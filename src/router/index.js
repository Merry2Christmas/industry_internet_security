import {
    createRouter,
    createWebHistory
} from 'vue-router'

const  routes = [
    {
        path: "/Login",
        name: "Login",
        component: () => import("/src/pages/Login.vue")
    },
    {
        path: '/',
        name: 'Index',
        redirect: '/Drama',
        component: () => import("/src/pages/Index.vue"),
        children:[
            {
                path: "/Drama",
                name: "Drama",
                component: () => import("/src/pages/Drama.vue")
            },
            {
                path: "/Weapon",
                name: "Weapon",
                component: () => import("/src/pages/Weapon.vue")
            },
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router