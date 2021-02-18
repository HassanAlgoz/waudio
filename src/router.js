import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

import Boombox from "./components/Boombox.vue";
// import Boombox from "./components/Boombox.vue";
import NotFound404 from "./components/NotFound404.vue"

const router = new Router({
    mode: 'history',
    routes: [
        {
            name: "Boombox",
            path: '/boombox',
            component: Boombox,
        },
        // {
        //     name: "Boombox",
        //     path: '/boombox',
        //     component: Boombox,
        // },
        {
            name: "NotFound404",
            path: "*",
            component: NotFound404,
        },
    ]
})

export default router;