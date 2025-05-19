<template>
  <div class="chatbot-modal" v-if="visible">
    <div class="chatbot-header">
      <span>HVAC Chatbot Assistant</span>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>
    <div class="chatbot-body">
      <div v-for="(msg, i) in messages" :key="i" :class="['chat-msg', msg.from]">
        <span>{{ msg.text }}</span>
      </div>
    </div>
    <form class="chatbot-input" @submit.prevent="send">
      <input v-model="input" type="text" placeholder="Ask me anything..." autocomplete="off" />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['close'])

const input = ref('')
const messages = ref([
  { from: 'bot', text: 'Hi! How can I help you today? (e.g. scheduling, services, contact, etc.)' }
])

async function send() {
  if (!input.value.trim()) return
  messages.value.push({ from: 'user', text: input.value })
  const userMsg = input.value
  input.value = ''
  // Call backend chatbot API
  try {
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg })
    })
    const data = await res.json()
    messages.value.push({ from: 'bot', text: data.message || data.result || 'Sorry, I did not understand that.' })
  } catch (e) {
    messages.value.push({ from: 'bot', text: 'Sorry, there was a problem connecting to the assistant.' })
  }
  await nextTick()
  scrollToBottom()
}

function scrollToBottom() {
  setTimeout(() => {
    const el = document.querySelector('.chatbot-body')
    if (el) el.scrollTop = el.scrollHeight
  }, 100)
}
</script>

<style scoped>
.chatbot-modal {
  position: fixed;
  right: 2vw;
  bottom: 70px;
  width: 340px;
  max-width: 95vw;
  background: rgba(255,255,255,0.85);
  border: 2px solid #4267b2;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(66,103,178,0.18);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  animation: chatbot-pop 0.2s;
}
@keyframes chatbot-pop {
  from { transform: translateY(40px) scale(0.95); opacity: 0; }
  to { transform: none; opacity: 1; }
}
.chatbot-header {
  background: #4267b2;
  color: #fff;
  padding: 0.7rem 1rem;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}
.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.3rem;
  cursor: pointer;
}
.chatbot-body {
  padding: 1rem;
  height: 220px;
  overflow-y: auto;
  background: #f7f9fa;
  font-size: 1rem;
}
.chat-msg {
  margin-bottom: 0.7rem;
  display: flex;
}
.chat-msg.bot span {
  background: #e3eafc;
  color: #4267b2;
  border-radius: 8px 8px 8px 2px;
  padding: 0.5rem 0.8rem;
  align-self: flex-start;
}
.chat-msg.user span {
  background: #ff9100;
  color: #fff;
  border-radius: 8px 8px 2px 8px;
  padding: 0.5rem 0.8rem;
  align-self: flex-end;
  margin-left: auto;
}
.chatbot-input {
  display: flex;
  border-top: 1px solid #eee;
  padding: 0.5rem 0.7rem;
  background: #fff;
  border-radius: 0 0 10px 10px;
}
.chatbot-input input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  background: #f7f9fa;
  margin-right: 0.5rem;
}
.chatbot-input button {
  background: #4267b2;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1.1rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}
.chatbot-input button:hover {
  background: #314a86;
}
</style>
