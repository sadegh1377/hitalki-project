<template>
    <div>
        <v-container>
            <div id="TeacherSchedule" class="week-container mx-10 mt-10 d-flex flex-row">
                <div class="week-cols text-center elevation-1 ml-3 mb-10"
                     v-for="(day,index) in $store.getters.getWeek" :key="index">
                    <div class="week-header pt-3 mb-6" dir="rtl">
                        <p class="day-name mx-3">
                            <!-- inorder to get the name of week day in persian -->
                            {{ day.timestamp.toLocaleDateString('fa-FA', {weekday: 'long'}) }}
                        </p>
                        <!-- inorder to get the name of month and its day in persian -->
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
            <v-btn
                class="ml-15 mt-8"
                color="primary"
                elevation="2"
                @click="$router.push({name:'StudentSchedule'})"
            >ثبت تغییرات
            </v-btn>
        </v-container>
    </div>
</template>

<script>

export default {
    name: "TeacherSchedule",

    data() {
        return {
            clicks: 0 // to count number of clicked on hour div
        }
    },
    methods: {
        /**
         * Since I could not find a proper solution for handling single-click and double-click
         * on a same div, I handle it by setting a timer for a brief moment for every time that
         * div is clicked if not clicked again on that brief moment its count as single click if
         * clicked again the timer get clear.
         * if only click once it call a method inorder to toggle reservable property on hour array.
         *
         * if click twice it call a method inorder to toggle reserved property on hour array.
         *
         * @param hour the object of hours arrays that got clicked
         */
        determineSingleClickOrDbClick(hour) {
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
        /**
         * This method call in determineSingleClickOrDbClick method.
         *
         * @param hour the object of hours arrays that got clicked
         */
        addToReservable(hour) {
            hour.reserved = false
            hour.reservable = !hour.reservable
        },
        /**
         * This method call in determineSingleClickOrDbClick method.
         *
         * @param hour the object of hours arrays that got clicked
         */
        addToReserved(hour) {
            hour.reservable = false
            hour.reserved = !hour.reserved
        },
        /**
         * This method create the string for the tooltip.
         *
         * @param timestamp the base timestamp to show
         * @returns {string} the string that shown on tooltip
         */
        getHourToolTip(timestamp) {
            // get timestamp thirty minutes after base timestamp
            const thirtyMinAfter = new Date(timestamp.getTime() + 30 * 60000)
            // changing date to persian
            const hoveredDate = timestamp.toLocaleDateString('fa-FA',
                {month: 'long', day: 'numeric', weekday: 'long'})
            // the getTimeFromDate method called inorder to convert date to minute and hour and sanitized it
            return `${hoveredDate} ${this.getTimeFromDate(timestamp)} - ${this.getTimeFromDate(thirtyMinAfter)}`

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
    },
    mounted() {
        // inorder to fill the week state dispatch createDayOfWeek action
        // 7 time for every day in a week
        for (let i = 0; i < 7; i++) {
            this.$store.dispatch('createDayOfWeek', i)
        }
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