const http = require('http');

http.get('http://localhost:9876/api/invoices', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.dir(json, { depth: null });
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      console.log(data);
    }
  });
}).on('error', err => {
  console.error('Request error:', err);
});
