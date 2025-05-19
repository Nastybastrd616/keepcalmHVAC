<template>
  <div class="daily-hvac-joke">
    <div class="joke-meta">
      <span class="joke-date">{{ todayFormatted }}</span>
      <span class="joke-time">{{ nowFormatted }}</span>
    </div>
    <div class="joke-box">
      <p>{{ todayJoke.text }}</p>
      <small v-if="todayJoke.type === 'insight'">🔎 HVAC Insight</small>
      <small v-else>😂 HVAC Joke</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const jokes = [
  { text: "Why did the air conditioner join the band? Because it had the coolest fans!", type: 'joke' },
  { text: "Change your HVAC filter every 1-3 months for best efficiency.", type: 'insight' },
  { text: "What do you call a HVAC tech who likes to party? A cool operator!", type: 'joke' },
  { text: "A programmable thermostat can save you up to 10% a year on heating and cooling.", type: 'insight' },
  { text: "Why was the HVAC tech always calm? He knew how to vent!", type: 'joke' },
  { text: "Keep outdoor units clear of debris for better airflow.", type: 'insight' },
  { text: "Why did the furnace break up with the AC? They just weren’t a good match!", type: 'joke' },
  { text: "Annual maintenance extends the life of your HVAC system.", type: 'insight' },
  { text: "What’s an HVAC tech’s favorite game? Duct, duct, goose!", type: 'joke' },
  { text: "Sealing your ducts can improve system efficiency by up to 20%.", type: 'insight' },
]

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

const todayJoke = computed(() => {
  const day = getDayOfYear(new Date())
  return jokes[day % jokes.length]
})

const now = ref(new Date())

const todayFormatted = computed(() =>
  now.value.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)
const nowFormatted = computed(() =>
  now.value.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
)

onMounted(() => {
  setInterval(() => {
    now.value = new Date()
  }, 1000)
})
</script>

<style scoped>
.daily-hvac-joke {
  background: rgba(255,255,255,0.85);
  border: 2px solid #ff9100;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  margin: 0;
  max-width: 100%;
  box-shadow: 0 2px 8px rgba(255,145,0,0.10);
  text-align: left;
  font-size: 1rem;
  color: #222;
  display: inline-block;
  vertical-align: middle;
  min-width: 0;
}
.joke-meta {
  display: flex;
  gap: 1.2rem;
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 0.2rem;
  align-items: center;
}
.joke-date {
  font-weight: 600;
  color: #ff9100;
}
.joke-time {
  font-family: monospace;
  color: #4267b2;
}
.joke-box {
  margin-bottom: 0;
  color: #222;
}
.daily-hvac-joke h3 {
  display: none;
}
</style>
