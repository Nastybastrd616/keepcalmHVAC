<template>
  <div class="advanced-calendar">
    <div class="calendar-header">
      <div class="month-selector">
        <button @click="previousMonth" class="nav-btn">&lt;</button>
        <h3>{{ monthYear }}</h3>
        <button @click="nextMonth" class="nav-btn">&gt;</button>
      </div>
      <div class="view-selector">
        <button 
          @click="currentView = 'month'" 
          :class="{ active: currentView === 'month' }"
        >
          Month
        </button>
        <button 
          @click="currentView = 'week'" 
          :class="{ active: currentView === 'week' }"
        >
          Week
        </button>
        <button 
          @click="currentView = 'day'" 
          :class="{ active: currentView === 'day' }"
        >
          Day
        </button>
      </div>
    </div>
    
    <!-- Month View -->
    <div v-if="currentView === 'month'" class="month-view">
      <div class="weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
      </div>
      <div class="days-grid">
        <div 
          v-for="(day, index) in daysInMonth" 
          :key="index"
          class="day"
          :class="{ 
            'other-month': day.otherMonth, 
            'today': isToday(day.date),
            'selected': isSelected(day.date),
            'unavailable': !isAvailable(day.date),
            'has-events': hasEvents(day.date)
          }"
          @click="selectDate(day.date)"
        >
          <div class="day-number">{{ day.dayNumber }}</div>
          <div v-if="hasEvents(day.date)" class="event-indicator"></div>
        </div>
      </div>
    </div>
    
    <!-- Week View -->
    <div v-if="currentView === 'week'" class="week-view">
      <div class="time-slots">
        <div class="weekday-header">
          <div class="time-label"></div>
          <div 
            v-for="day in currentWeek" 
            :key="day.date"
            class="week-day"
            :class="{ 'today': isToday(day.date) }"
          >
            <div class="day-name">{{ day.name }}</div>
            <div class="date">{{ day.dayNumber }}</div>
          </div>
        </div>
        <div 
          v-for="time in timeSlots"
          :key="time.value"
          class="time-row"
        >
          <div class="time-label">{{ time.label }}</div>
          <div 
            v-for="day in currentWeek"
            :key="day.date"
            class="time-cell"
            :class="{ 
              'available': isTimeSlotAvailable(day.date, time.value),
              'selected': isTimeSlotSelected(day.date, time.value)
            }"
            @click="selectTimeSlot(day.date, time.value)"
          >
            <div 
              v-for="event in getEventsForTimeSlot(day.date, time.value)"
              :key="event.id"
              class="event-block"
              :style="{ backgroundColor: event.color }"
            >
              {{ event.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Day View -->
    <div v-if="currentView === 'day'" class="day-view">
      <div class="day-header">
        <h4>{{ selectedDayLabel }}</h4>
      </div>
      <div class="day-slots">
        <div 
          v-for="time in timeSlots"
          :key="time.value"
          class="day-slot"
          :class="{ 
            'available': isTimeSlotAvailable(selectedDate, time.value),
            'selected': isTimeSlotSelected(selectedDate, time.value)
          }"
          @click="selectTimeSlot(selectedDate, time.value)"
        >
          <div class="time-label">{{ time.label }}</div>
          <div class="slot-content">
            <div 
              v-for="event in getEventsForTimeSlot(selectedDate, time.value)"
              :key="event.id"
              class="event-block full-width"
              :style="{ backgroundColor: event.color }"
            >
              {{ event.title }}
            </div>
            <div v-if="isTimeSlotAvailable(selectedDate, time.value) && !hasEventsAtTime(selectedDate, time.value)" class="availability">
              Available
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Selected Time Slot -->
    <div v-if="selectedSlot" class="selected-slot">
      <p>Selected: {{ formatSelectedSlot }}</p>
      <button @click="confirmSelection" class="confirm-btn">Confirm</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  },
  unavailableDates: {
    type: Array,
    default: () => []
  },
  isAdminMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['slot-selected']);

const currentDate = ref(new Date());
const currentView = ref('month');
const selectedDate = ref(null);
const selectedSlot = ref(null);

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Example events - in a real app, these would come from props or an API
const calendarEvents = ref([
  {
    id: 1,
    title: 'Maintenance Visit',
    date: new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 15),
    time: '09:00',
    duration: 2, // hours
    color: '#4CAF50'
  },
  {
    id: 2,
    title: 'Installation',
    date: new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 22),
    time: '13:00',
    duration: 4,
    color: '#FFC107'
  },
  {
    id: 3,
    title: 'Repair',
    date: new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), currentDate.value.getDate() + 2),
    time: '10:00',
    duration: 1,
    color: '#F44336'
  }
]);

const timeSlots = [
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' }
];

// Computed properties
const monthYear = computed(() => {
  return `${monthNames[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`;
});

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  
  const daysArray = [];
  
  // Add days from previous month to fill the first week
  const firstDayOfWeek = firstDay.getDay();
  const prevMonth = new Date(year, month, 0);
  const prevMonthDays = prevMonth.getDate();
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    daysArray.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      dayNumber: prevMonthDays - i,
      otherMonth: true
    });
  }
  
  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    daysArray.push({
      date: new Date(year, month, i),
      dayNumber: i,
      otherMonth: false
    });
  }
  
  // Add days from next month to fill the last week
  const lastDayOfWeek = lastDay.getDay();
  const daysToAdd = 6 - lastDayOfWeek;
  
  for (let i = 1; i <= daysToAdd; i++) {
    daysArray.push({
      date: new Date(year, month + 1, i),
      dayNumber: i,
      otherMonth: true
    });
  }
  
  return daysArray;
});

const currentWeek = computed(() => {
  const startDate = selectedDate.value || currentDate.value;
  const startOfWeek = new Date(startDate);
  const day = startOfWeek.getDay();
  
  // Adjust to get the start of the week (Sunday)
  startOfWeek.setDate(startOfWeek.getDate() - day);
  
  const weekDays = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    
    weekDays.push({
      date: date,
      name: weekdays[i],
      dayNumber: date.getDate()
    });
  }
  
  return weekDays;
});

const selectedDayLabel = computed(() => {
  if (!selectedDate.value) return '';
  
  const date = selectedDate.value;
  return `${weekdays[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
});

const formatSelectedSlot = computed(() => {
  if (!selectedSlot.value) return '';
  
  const { date, time } = selectedSlot.value;
  const dateString = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  const timeString = timeSlots.find(slot => slot.value === time)?.label || time;
  
  return `${dateString} at ${timeString}`;
});

// Methods
function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
}

function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear();
}

function isSelected(date) {
  if (!selectedDate.value) return false;
  
  return date.getDate() === selectedDate.value.getDate() && 
         date.getMonth() === selectedDate.value.getMonth() && 
         date.getFullYear() === selectedDate.value.getFullYear();
}

function isAvailable(date) {
  // In admin mode, all dates are available for blocking/unblocking
  if (props.isAdminMode) return true;
  
  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return false;
  
  // Check if date is in unavailable list
  return !props.unavailableDates.some(unavailable => 
    unavailable.getDate() === date.getDate() && 
    unavailable.getMonth() === date.getMonth() && 
    unavailable.getFullYear() === date.getFullYear()
  );
}

function hasEvents(date) {
  return calendarEvents.value.some(event => 
    event.date.getDate() === date.getDate() && 
    event.date.getMonth() === date.getMonth() && 
    event.date.getFullYear() === date.getFullYear()
  );
}

function selectDate(date) {
  if (!isAvailable(date) && !props.isAdminMode) return;
  
  selectedDate.value = date;
  
  if (currentView.value === 'month') {
    currentView.value = 'day';
  }
}

function isTimeSlotAvailable(date, time) {
  if (!date) return false;
  if (!isAvailable(date)) return false;
  
  // Check if the slot has any events
  return !calendarEvents.value.some(event => 
    event.date.getDate() === date.getDate() && 
    event.date.getMonth() === date.getMonth() && 
    event.date.getFullYear() === date.getFullYear() && 
    event.time === time
  );
}

function isTimeSlotSelected(date, time) {
  if (!selectedSlot.value) return false;
  
  const { date: selectedDate, time: selectedTime } = selectedSlot.value;
  
  return selectedTime === time && 
         selectedDate.getDate() === date.getDate() && 
         selectedDate.getMonth() === date.getMonth() && 
         selectedDate.getFullYear() === date.getFullYear();
}

function getEventsForTimeSlot(date, time) {
  if (!date) return [];
  
  return calendarEvents.value.filter(event => 
    event.date.getDate() === date.getDate() && 
    event.date.getMonth() === date.getMonth() && 
    event.date.getFullYear() === date.getFullYear() && 
    event.time === time
  );
}

function hasEventsAtTime(date, time) {
  return getEventsForTimeSlot(date, time).length > 0;
}

function selectTimeSlot(date, time) {
  if (!isTimeSlotAvailable(date, time) && !props.isAdminMode) return;
  
  selectedSlot.value = { date, time };
}

function confirmSelection() {
  if (selectedSlot.value) {
    emit('slot-selected', selectedSlot.value);
    
    // In a real app, this would likely add the event to the calendar
    // instead of just logging
    if (props.isAdminMode) {
      console.log('Admin is blocking/unblocking time slot:', selectedSlot.value);
    } else {
      console.log('User selected time slot:', selectedSlot.value);
      
      // Add a new event
      const newEvent = {
        id: calendarEvents.value.length + 1,
        title: 'New Appointment',
        date: new Date(selectedSlot.value.date),
        time: selectedSlot.value.time,
        duration: 1,
        color: '#2196F3'
      };
      
      calendarEvents.value.push(newEvent);
    }
    
    selectedSlot.value = null;
  }
}

onMounted(() => {
  selectedDate.value = new Date(currentDate.value);
});
</script>

<style scoped>
.advanced-calendar {
  background: #333333;
  color: rgba(255, 255, 255, 0.87);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  padding: 1.5rem;
  user-select: none;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.87);
}

.view-selector button {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
}

.view-selector button.active {
  border-bottom-color: #3b5998;
  font-weight: 500;
}

/* Month View */
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.day {
  aspect-ratio: 1/1;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.day:hover {
  background: #444444;
}

.day.other-month {
  color: #666666;
}

.day.today {
  background: #4267b2;
  font-weight: bold;
}

.day.selected {
  background: #3b5998;
  color: white;
}

.day.unavailable {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
  cursor: not-allowed;
  text-decoration: line-through;
}

.day-number {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.event-indicator {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #F44336;
}

/* Week View */
.time-slots {
  display: flex;
  flex-direction: column;
}

.weekday-header {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  text-align: center;
  font-weight: 500;
  margin-bottom: 1rem;
}

.week-day {
  padding: 0.5rem;
}

.week-day.today {
  background: #4267b2;
  border-radius: 4px;
  color: white;
}

.time-row {
  display: grid;  grid-template-columns: 80px repeat(7, 1fr);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.time-label {
  padding: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.time-cell {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  min-height: 40px;
  position: relative;
}

.time-cell.available {
  cursor: pointer;
}

.time-cell.available:hover {
  background: #444444;
}

.time-cell.selected,
.day-slot.selected {
  background: rgba(59, 89, 152, 0.1);
}

.event-block {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: white;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

/* Day View */
.day-header {
  margin-bottom: 1rem;
  text-align: center;
}

.day-slots {
  display: flex;
  flex-direction: column;
}

.day-slot {
  display: flex;
  border-top: 1px solid #eee;
  padding: 0.5rem 0;
}

.day-slot .time-label {
  width: 80px;
}

.slot-content {
  flex: 1;
}

.slot-content .event-block.full-width {
  width: 100%;
}

.availability {
  color: #4CAF50;
  font-size: 0.9rem;
}

/* Selected Time Slot */
.selected-slot {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.confirm-btn {
  background: #3b5998;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>