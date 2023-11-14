import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userRole: 'مدرس'
    },
    getters: {
        getUserRoll: (state) => state.userRole
    },
    mutations: {
        CHANGE_USER_ROLE: (state, payload) => {
            state.userRole = payload
        }
    },
    actions: {
        changeUserRule(context, payload) {
            context.commit('CHANGE_USER_ROLE', payload)
        }
    },
})
