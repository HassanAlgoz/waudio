import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex)

import preferences from "./modules/preferences";

export default new Vuex.Store({
    modules: {
        preferences,

    },
    plugins: [
        createPersistedState({
            paths: [
                'preferences',
            ]
        }),
    ],
    state: {
    },
    getters: {

    },
    actions: {

    },
    mutations: {

    },
})
