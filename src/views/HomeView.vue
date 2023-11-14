<template>
    <div>
        <div v-for="(day ,index) in week" :key="index">
            {{ day.day.hours }}
        </div>

        {{addThirtyMinToTimestamp(new Date())}}
    </div>
</template>

<script>

export default {
    name: 'HomeView',
    data() {
        return {
            switch1: false,
            week: [
                {
                    day: {
                        name: 'monday',
                        hours: [
                            {
                                timeStamp: new Date(),
                                selected: false,
                                reserved: false,
                            }
                        ]
                    }
                },
                {
                    day: {
                        name: 'monday',
                        hours: [
                            {
                                timestamp: new Date(),
                                selected: false,
                                reserved: false,
                            }
                        ]
                    }
                }
            ]
        }
    },
    methods: {
        addThirtyMinToTimestamp(date) {
            return new Date(date.getTime() + 30*60000);
        }
    },
    components: {},
}
</script>
