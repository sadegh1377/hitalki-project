<template>
    <div>
        <TeacherSchedule/>
    </div>
</template>

<script>

import TeacherSchedule from "@/components/TeacherSchedule.vue";

export default {
    name: 'HomeView',
    data() {
        return {
            switch1: false,

        }
    },
    components: {TeacherSchedule},
}
</script>
