<template>
    <v-container>
        <div id="TeacherSchedule" class="week-container mx-10 mt-10 d-flex flex-row">
            <div class="week-cols text-center elevation-1 ml-3 mb-10"
                 v-for="(day,index) in week" :key="index">
                <div class="week-header pt-3 mb-6" dir="rtl">
                    <p class="day-name mx-3">{{ day.timestamp.toLocaleDateString('fa-FA', {weekday: 'long'}) }}</p>
                    <p> {{ day.timestamp.toLocaleDateString('fa-FA', {month: 'long', day: 'numeric'}) }}</p>
                </div>
                <div class="flex-column">
                    <div class="hours my-5 mx-6"
                         :class="{'reservable': hour.reservable, 'reserved': hour.reserved}"
                         v-for="(hour,index) in day.hours"
                         @click="determineSingleClickOrDbClick(hour)"
                         :key="index">
                        <v-tooltip top
                                   transition="none"
                                   color="#2d2c42">
                            <template v-slot:activator="{ on, attrs }">
                                <span v-bind="attrs"
                                      v-on="on">
                                    {{ getTimeFromDate(hour.timestamp) }}
                                </span>
                            </template>
                            {{ getHourToolTip(hour.timestamp) }}
                        </v-tooltip>
                    </div>
                </div>
            </div>
        </div>
    </v-container>
</template>

<script>
import DragSelect from "dragselect";

export default {
    name: "TeacherSchedule",
    data() {
        return {
            week: [],
            currentDate: new Date(),
            timeIntervalUntilToday: [0, 24, 48, 72, 96, 120, 144],
            clicks: 0
        }
    },
    methods: {
        determineSingleClickOrDbClick(hour) {
            console.log(hour)
            this.clicks++;
            if (this.clicks === 1) {
                this.timer = setTimeout(() => {
                    this.addToReservable(hour)
                    this.clicks = 0
                }, 200);
            } else {
                clearTimeout(this.timer);
                this.addToReserved(hour)
                this.clicks = 0;
            }
        },
        addToReservable(hour) {
            hour.reserved = false
            hour.reservable = !hour.reservable
        },
        addToReserved(hour) {
            hour.reservable = false
            hour.reserved = !hour.reserved
        },
        getHourToolTip(timestamp) {
            const thirtyMinAfter = new Date(timestamp.getTime() + 30 * 60000)
            const hoveredDate = timestamp.toLocaleDateString('fa-FA', {month: 'long', day: 'numeric', weekday: 'long'})
            return `${hoveredDate} ${this.getTimeFromDate(timestamp)} - ${this.getTimeFromDate(thirtyMinAfter)}`

        },
        getTimeFromDate(timestamp) {
            const pad = num => ("0" + num).slice(-2);
            let hours = timestamp.getHours(),
                minutes = timestamp.getMinutes()
            return pad(hours) + ":" + pad(minutes)
        },
        getHourOfDayTimestamp(numOfWeek) {
            let hours = []
            let dayOfWeekTimestamp = new Date(this.currentDate.getTime()
                + this.timeIntervalUntilToday[numOfWeek] * 60 * 60 * 1000)
            dayOfWeekTimestamp.setHours(6, 0, 0)
            for (let i = 0; i < 36; i++) {
                hours.push({
                    timestamp: new Date(dayOfWeekTimestamp.getTime()),
                    reservable: false,
                    reserved: false
                })
                dayOfWeekTimestamp = new Date(dayOfWeekTimestamp.getTime() + 30 * 60000)
            }
            return hours
        },
        getDaysOfWeekTimestamp(numOfWeek) {
            return new Date(new Date().getTime() + this.timeIntervalUntilToday[numOfWeek] * 60 * 60 * 1000)
        },
        fillTheWeekArray() {
            for (let i = 0; i < 7; i++) {
                this.week.push({
                    timestamp: this.getDaysOfWeekTimestamp(i),
                    hours: this.getHourOfDayTimestamp(i)
                })
            }
        }
    }
    ,
    mounted() {
        this.fillTheWeekArray()
    }
}

</script>

<style scoped>
.week-container {
    width: 1000px;
    height: 500px;
    max-width: 1000px;
    max-height: 500px;
    overflow: auto;
    direction: rtl;
}

.week-cols {
    border-top: 3px red solid;
    border-radius: 5px;
    width: 13%;
    height: fit-content;
}

.week-cols:first-child {
    background-color: #DBEAFE;
}

.week-cols:first-child .day-name {
    background-color: #F44339;
    color: #FFFFFF;
}

.week-header {
    border-bottom: 1px gray solid;
}

.day-name {
    color: #000000;
    border-radius: 5px;
}

.hours {
    border-radius: 3px;
    cursor: pointer;
}

.v-tooltip__content {
    opacity: 1 !important;
}

.reservable {
    background-color: #41C55E;
    color: #FFFFFF;
}

.reserved {
    background-color: #33B4EB;
    color: #FFFFFF;
}
</style>