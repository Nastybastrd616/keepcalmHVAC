const path = require('path');
const fs = require('fs');

const HISTORY_PATH = path.join(__dirname, '../data/chatbot_history.json');

function getChatbotHistory() {
  const raw = fs.readFileSync(HISTORY_PATH, 'utf-8');
  return JSON.parse(raw);
}

function addChatbotMessage(message) {
  const history = getChatbotHistory();
  history.push({ ...message, timestamp: new Date().toISOString() });
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2), 'utf-8');
  return history;
}

module.exports = {
  getChatbotHistory,
  addChatbotMessage
};
