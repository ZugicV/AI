const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Path to exported web build from Expo
const mobileBuild = path.join(__dirname, 'mobile/ProfaZaOsnovce/dist');
app.use(express.static(mobileBuild));
app.get('/', (req, res) => {
  res.sendFile(path.join(mobileBuild, 'index.html'));
});

// Admin panel
const adminPath = path.join(__dirname, 'admin');
app.use('/admin', express.static(adminPath));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(adminPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
