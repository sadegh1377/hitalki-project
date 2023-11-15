<template>
    <div id="StudentSchedule">
        <v-container>
            <div id="TeacherSchedule" class="week-container mx-10 mt-10 d-flex flex-row">
                <div class="week-cols text-center elevation-1 ml-3 mb-10"
                     v-for="(day,dayIndex) in this.$store.getters.getWeek" :key="dayIndex">
                    <div class="week-header pt-3 mb-6" dir="rtl">
                        <p class="day-name mx-3">{{
                            day.timestamp.toLocaleDateString('fa-FA', {weekday: 'long'})
                            }}</p>
                        <p> {{ day.timestamp.toLocaleDateString('fa-FA', {month: 'long', day: 'numeric'}) }}</p>
                    </div>
                    <div class="flex-column">
                        <div class="hours py-3 mx-3"
                             v-show="hour.reservable === true || hour.reserved === true"
                             :class="{'reserved': hour.reserved,
                             'selected': hour.selected}"
                             v-for="(hour,hourIndex) in day.hours"
                             @click="selectHour(dayIndex,hourIndex,hourIndex+1)"
                             :key="hourIndex">
                            <v-tooltip top
                                       transition="none"
                                       color="#2d2c42">
                                <template v-slot:activator="{ on, attrs }">
                                <span v-bind="attrs"
                                      v-on="on">
                                    {{ getTimeFromDate(hour.timestamp) }}
                                </span>
                                </template>
                                {{ getHourToolTip(day.hours[hourIndex]) }}
                            </v-tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </v-container>
    </div>
</template>

<script>

export default {
    name: "StudentSchedule",
    data() {
        return {
            selectedHourIndex: null,
            selectedNextHourIndex: null,
            selectedDayIndex: null,
            isHourSelected: false
        }
    },
    methods: {
        getHourToolTip(hour) {
            if (hour.reserved) {
                return "رزرو شده"
            }
            const OneHourAfter = new Date(hour.timestamp.getTime() + 60 * 60000)
            const hoveredDate = hour.timestamp.toLocaleDateString('fa-FA', {
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            })
            return `${hoveredDate} ${this.getTimeFromDate(hour.timestamp)} - ${this.getTimeFromDate(OneHourAfter)}`

        },
        getTimeFromDate(timestamp) {
            const pad = num => ("0" + num).slice(-2);
            let hours = timestamp.getHours(),
                minutes = timestamp.getMinutes()
            return pad(hours) + ":" + pad(minutes)
        },
        selectHour(dayIndex, hourIndex, nextHourIndex) {
            let week = this.$store.getters.getWeek
            let nextReservedHour = this.getNextReservedHour(dayIndex, nextHourIndex)

            if (nextReservedHour === undefined) return;

            if (nextHourIndex >= week[dayIndex].hours.length) return;

            if (week[dayIndex].hours[hourIndex].reserved === true ||
                week[dayIndex].hours[nextHourIndex].reserved === true) return;

            if (Math.abs(week[dayIndex].hours[hourIndex].timestamp
                - nextReservedHour.timestamp) / 36e5 > .5) return;

            if (this.isHourSelected) {

                if (this.selectedDayIndex === dayIndex && this.selectedHourIndex === hourIndex &&
                    this.selectedNextHourIndex === nextHourIndex) {
                    week[this.selectedDayIndex].hours[this.selectedHourIndex].selected = !week[this.selectedDayIndex].hours[this.selectedHourIndex].selected
                    week[this.selectedDayIndex].hours[this.selectedNextHourIndex].selected = !week[this.selectedDayIndex].hours[this.selectedNextHourIndex].selected
                    this.isHourSelected = !this.isHourSelected
                } else {
                    week[this.selectedDayIndex].hours[this.selectedHourIndex].selected = false
                    week[this.selectedDayIndex].hours[this.selectedNextHourIndex].selected = false
                    week[dayIndex].hours[hourIndex].selected = true
                    week[dayIndex].hours[nextHourIndex].selected = true
                    this.isHourSelected = true
                }
                // week[this.selectedDayIndex].hours[this.selectedHourIndex].selected = false
                // week[this.selectedDayIndex].hours[this.nextSelectedHourIndex].selected = false
            } else {
                week[dayIndex].hours[hourIndex].selected = true
                week[dayIndex].hours[nextHourIndex].selected = true
                this.isHourSelected = true
            }
            this.selectedHourIndex = hourIndex
            this.selectedNextHourIndex = nextHourIndex
            this.selectedDayIndex = dayIndex

            // console.log(week[dayIndex].hours[hourIndex].timestamp)
            // console.log(week[dayIndex].hours[nextHourIndex].timestamp)
        },
        getNextReservedHour(dayIndex, nextHourIndex) {
            let week = this.$store.getters.getWeek
            for (let i = nextHourIndex; i < week[dayIndex].hours.length; i++) {
                if (week[dayIndex].hours[i].reservable === true) {
                    return week[dayIndex].hours[i]
                }
            }
        }
    },
    mounted() {
        // for (let i = 0; i < 7; i++) {
        //     // this.$store.dispatch('getDaysOfWeekTimestamp', i)
        //     this.$store.dispatch('createDayOfWeek', i)
        // }
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
    min-height: 500px;
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

.hours:hover {
    border: 1px solid #00ade2;
    border-bottom: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.hours:hover + div {
    border: 1px solid #00ade2;
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.reservable {
}

.selected {
    background-color: #33B4EB;
    color: #FFFFFF;
}

.reserved {
    cursor: not-allowed;
    --tw-text-opacity: 1;
    color: rgb(156 163 175 / var(--tw-text-opacity));
}

.reserved:hover {
    border: none !important;
}

.reserved:hover + div {
    border: none !important;
}

.v-tooltip__content {
    opacity: 1 !important;
}
</style>