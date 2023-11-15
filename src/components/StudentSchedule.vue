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
                             :class="{'reserved': hour.reserved, 'selected': hour.selected}"
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
            selectedHourIndex: null, //
            selectedNextHourIndex: null, //
            selectedDayIndex: null,//
            isHourSelected: false //
        }
    },
    methods: {
        // isHourHoverable(dayIndex) {
        //     let week = this.$store.getters.getWeek
        //     for (let i = 0; i < week[dayIndex].hours.length - 1; i++) {
        //         if (week[dayIndex].hours[i].reserved !== week[dayIndex].hours[i + 1].reserved
        //             || (Math.abs(week[dayIndex].hours[i].timestamp - week[dayIndex].hours[i + 1].timestamp) / 36e5) > .5) {
        //             return "true"
        //         }
        //     }
        //
        // },


        /**
         * This method create the string for the tooltip.
         * if an hour is reserved it shows a different message .
         *
         * @param hour the base hour to get timestamp from
         * @returns {string} the string that shown on tooltip
         */
        getHourToolTip(hour) {

            // check if hour is reserved
            if (hour.reserved) {
                return "رزرو شده"
            }

            // get timestamp one hour after base timestamp
            const OneHourAfter = new Date(hour.timestamp.getTime() + 60 * 60000)
            // changing date to persian
            const hoveredDate = hour.timestamp.toLocaleDateString('fa-FA', {
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            })
            // the getTimeFromDate method called inorder to convert date to minute and hour and sanitized it
            return `${hoveredDate} ${this.getTimeFromDate(hour.timestamp)} - ${this.getTimeFromDate(OneHourAfter)}`

        },
        /**
         * This method call in getHourToolTip method
         *
         * @param timestamp the timestamp to get minute and hour from
         * @returns {string} the sanitized date
         */
        getTimeFromDate(timestamp) {
            // adding 0 to first of each number
            // this make 2 digits number like 06 and 02 and because its getting slice from the end
            // it stays the same
            // for bigger number it makes number like 022 and 030 because its getting slice from the end
            // the 0 get cuts from it
            const pad = num => ("0" + num).slice(-2);
            let hours = timestamp.getHours(),
                minutes = timestamp.getMinutes()
            return pad(hours) + ":" + pad(minutes)
        },
        /**
         * This Method select two hours that are 1 hour apart
         *
         * @param dayIndex the index of the day that hour object belong to
         * @param hourIndex the index of hour object that been clicked
         * @param nextHourIndex the index of next hour object
         */
        selectHour(dayIndex, hourIndex, nextHourIndex) {
            // get the week array from the getter
            let week = this.$store.getters.getWeek

            // get the immediate next hour object that is reservable
            let nextReservableHour = this.getNextReservableHour(dayIndex, nextHourIndex)

            // checking if nextReservableHour is undefined
            if (nextReservableHour === undefined) return;

            // inorder to prevent to cross over hours array length
            if (nextHourIndex >= week[dayIndex].hours.length) return;

            // inorder to prevent selecting 2 reserved hour
            if (week[dayIndex].hours[hourIndex].reserved === true ||
                week[dayIndex].hours[nextHourIndex].reserved === true) return;

            // to make sure that selected object is one hour apart
            if (Math.abs(week[dayIndex].hours[hourIndex].timestamp - nextReservableHour.timestamp) / 36e5 > .5) return;

            // in order to unselect the previous selected hours
            if (this.isHourSelected) {
                // for simplifying code
                let previousHourObject = week[this.selectedDayIndex].hours[this.selectedHourIndex]
                let previousNextHourObject = week[this.selectedDayIndex].hours[this.selectedNextHourIndex]

                // check if the same hour is clicked
                if (this.selectedDayIndex === dayIndex && this.selectedHourIndex === hourIndex &&
                    this.selectedNextHourIndex === nextHourIndex) {

                    // toggle the selected property on hour object
                    previousHourObject.selected = !previousHourObject.selected
                    previousNextHourObject.selected = !previousNextHourObject.selected
                    // toggle isHourSelected to make sure that the user can click another hour
                    this.isHourSelected = !this.isHourSelected
                } else {
                    // if the same hour is not clicked unselect previous selected hour
                    // and select new hour
                    previousHourObject.selected = false
                    previousNextHourObject.selected = false
                    week[dayIndex].hours[hourIndex].selected = true
                    week[dayIndex].hours[nextHourIndex].selected = true
                    // to show that an hour is selected
                    this.isHourSelected = true
                }
            } else {
                // select an hour
                week[dayIndex].hours[hourIndex].selected = true
                week[dayIndex].hours[nextHourIndex].selected = true
                // to show that an hour is selected
                this.isHourSelected = true
            }
            // save current selected hours index to use as previous
            this.selectedHourIndex = hourIndex
            this.selectedNextHourIndex = nextHourIndex
            this.selectedDayIndex = dayIndex

        },
        /**
         * Get the immediate next hour object that is reservable
         *
         * @param dayIndex the index of the day that hour object belong to
         * @param nextHourIndex the index of next hour object
         * @returns {*} the immediate next hour object that is reservable
         */
        getNextReservableHour(dayIndex, nextHourIndex) {
            // get the week array from the getter
            let week = this.$store.getters.getWeek
            // loop through week state to get the immediate next hour object that is reservable
            for (let i = nextHourIndex; i < week[dayIndex].hours.length; i++) {
                if (week[dayIndex].hours[i].reservable === true) {
                    return week[dayIndex].hours[i]
                }
            }
        }
    },
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

.hours[class="reserved"]:hover {
    border: none !important;
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