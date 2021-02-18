const state = () => ({
    theme: "light",
    language: "en"
})

const getters = {}

const actions = {
    setTheme: ({ commit }, value) => {
        commit('setTheme', value)
    }
}

const mutations = {
    setTheme: (state, value) => {
        state.theme = value;
    }
}

export default {
    namespaced: false,
    state,
    getters,
    actions,
    mutations
}