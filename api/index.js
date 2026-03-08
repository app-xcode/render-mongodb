const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/sensor', async (req, res) => {
  // Logika simpan data
  res.json({ message: "Berhasil" });
});

module.exports = app; // PENTING: Jangan pakai app.listen()
