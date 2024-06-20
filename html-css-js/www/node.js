const express = require('express');
const app = express();
const fs = require('fs');

const storageFile = 'storage.json';

// Load existing storage data from file
let storage = {};
try {
  const storedData = fs.readFileSync(storageFile, 'utf8');
  storage = JSON.parse(storedData);
} catch (error) {
  console.error('Error loading storage data:', error);
}

// API endpoint for login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (storage[username] && storage[username] === password) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// API endpoint for register
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  storage[username] = password;
  fs.writeFileSync(storageFile, JSON.stringify(storage));
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});