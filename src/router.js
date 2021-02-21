import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

import Boombox from "./components/Boombox.vue";
import Player from "./components/Player.vue";
import NotFound404 from "./components/NotFound404.vue"

const router = new Router({
    mode: 'history',
    routes: [
        {
            name: "Boombox",
            path: '/boombox',
            component: Boombox,
        },
        {
            name: "Player",
            path: '/player',
            component: Player,
        },
        {
            name: "NotFound404",
            path: "*",
            component: NotFound404,
        },
    ]
})

export default router;