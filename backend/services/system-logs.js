const path = require('path');
const fs = require('fs');

const LOGS_PATH = path.join(__dirname, '../data/system_logs.json');

function getSystemLogs() {
  const raw = fs.readFileSync(LOGS_PATH, 'utf-8');
  return JSON.parse(raw);
}

function addSystemLog(entry) {
  const logs = getSystemLogs();
  logs.push({ ...entry, timestamp: new Date().toISOString() });
  fs.writeFileSync(LOGS_PATH, JSON.stringify(logs, null, 2), 'utf-8');
  return logs;
}

module.exports = {
  getSystemLogs,
  addSystemLog
};
