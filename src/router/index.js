import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StudentSchedule from "@/components/StudentSchedule.vue";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/student-schedule',
        name: 'StudentSchedule',
        component: StudentSchedule
    }
]

const router = new VueRouter({
    routes
})

export default router
