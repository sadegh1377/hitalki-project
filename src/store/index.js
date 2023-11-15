import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        week: [],
        timeIntervalUntilToday: [0, 24, 48, 72, 96, 120, 144],
        currentDate: new Date(),
    },
    getters: {
        getWeek: (state) => state.week,
    },
    mutations: {
        fillTheWeekArray(state, payload) {
            state.week.push(payload)
        },
        addToReservable(state, payload) {
            state.week.forEach((day) => {
                day.hours.forEach((hour) => {
                    if (hour.timestamp === payload.timestamp) {
                        hour.reserved = false
                        hour.reservable = !hour.reservable
                    }

                })
            })
        }
    },
    actions: {
        // getDaysOfWeekTimestamp({state, commit}, numOfWeek) {
        //     commit('fillTheWeekArray', new Date(new Date().getTime() + state.timeIntervalUntilToday[numOfWeek] * 60 * 60 * 1000))
        // },
        createDayOfWeek({state, commit}, numOfWeek) {
            let tempWeek = {}
            let hours = []
            let dayOfWeekTimestamp = new Date(state.currentDate.getTime()
                + state.timeIntervalUntilToday[numOfWeek] * 60 * 60 * 1000)
            tempWeek.timestamp = new Date(state.currentDate.getTime()
                + state.timeIntervalUntilToday[numOfWeek] * 60 * 60 * 1000)
            dayOfWeekTimestamp.setHours(6, 0, 0)
            for (let i = 0; i < 36; i++) {
                hours.push({
                    timestamp: new Date(dayOfWeekTimestamp.getTime()),
                    reservable: false,
                    reserved: false,
                    selected: false
                })
                dayOfWeekTimestamp = new Date(dayOfWeekTimestamp.getTime() + 30 * 60000)
            }
            tempWeek.hours = hours
            commit('fillTheWeekArray', tempWeek)
        }
    },
})
