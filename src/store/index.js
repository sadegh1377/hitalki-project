import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    /**
     * This project has three state that use across of the project
     *
     * week is an array that holding objects that has timestamp and hours.
     * hour is an array of object that has timestamp, reservable, reserved and selected.
     *
     * timeIntervalUntilToday is an array that holding hour difference from the current date.
     *
     * currentDate is an object of current date.
     *
     */
    state: {
        week: [],
        timeIntervalUntilToday: [0, 24, 48, 72, 96, 120, 144],
        currentDate: new Date(),
    },
    getters: {
        /**
         * A getter to get week
         *
         * @param state
         * @returns {[]}
         */
        getWeek: (state) => state.week,
    },
    mutations: {
        /**
         * This mutation is called by createDayOfWeek action inorder to push
         * object in week state
         *
         * @param state is state of the vuex
         * @param payload is an object that describe in the state comment
         */
        fillTheWeekArray(state, payload) {
            state.week.push(payload)
        },
    },
    actions: {

        /**
         * This action is call on mounted of the TeacherSchedule inorder to initialize
         * the week state.
         *
         *
         * @param state is state of the vuex
         * @param commit inorder to call a mutation
         * @param numOfWeek number of the week inorder to get timestamp ro each day
         */
        createDayOfWeek({state, commit}, numOfWeek) {
            // a temporary object to creat week object
            let tempWeek = {}
            // a temporary array to creat hour array
            let hours = []

            // get the timestamp one at a time for every day of week
            let dayOfWeekTimestamp = new Date(state.currentDate.getTime()
                + state.timeIntervalUntilToday[numOfWeek] * 60 * 60 * 1000)

            // set that timestamp in temp object
            tempWeek.timestamp = dayOfWeekTimestamp

            // inorder to start hours of each day from 06:00 am
            dayOfWeekTimestamp.setHours(6, 0, 0)

            // create hour array
            for (let i = 0; i < 36; i++) {
                hours.push({
                    timestamp: new Date(dayOfWeekTimestamp.getTime()),
                    reservable: false,
                    reserved: false,
                    selected: false
                })
                // make timestamps of hours 30 min apart
                dayOfWeekTimestamp = new Date(dayOfWeekTimestamp.getTime() + 30 * 60000)
            }
            // add that temp hour array to temp week
            tempWeek.hours = hours
            // commit that temp object to a mutation to be pushed to week state
            commit('fillTheWeekArray', tempWeek)
        }
    },
})
