const path = require('path');
const fs = require('fs');

const METADATA_PATH = path.join(__dirname, '../data/system_metadata.json');

function getSystemMetadata() {
  const raw = fs.readFileSync(METADATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function updateSystemMetadata(newData) {
  fs.writeFileSync(METADATA_PATH, JSON.stringify(newData, null, 2), 'utf-8');
  return getSystemMetadata();
}

module.exports = {
  getSystemMetadata,
  updateSystemMetadata
};
