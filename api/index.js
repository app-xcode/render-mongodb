const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// 1. Rute untuk mengetes apakah API jalan (Mencegah "Cannot GET /api/")
app.get('/api', (req, res) => {
  res.json({ message: "API Backend IoT Berhasil Diakses!" });
});

// 2. Rute untuk mengambil data sensor (GET /api/sensor)
app.get('/api/sensor', async (req, res) => {
  try {
    await client.connect();
    const db = client.db("iot_db");
    const data = await db.collection("sensor_data").find().sort({createdAt: -1}).limit(10).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Rute untuk simpan data sensor (POST /api/sensor)
app.post('/api/sensor', async (req, res) => {
  try {
    await client.connect();
    const db = client.db("iot_db");
    const result = await db.collection("sensor_data").insertOne({
      ...req.body,
      createdAt: new Date()
    });
    res.status(201).json({ message: "Data tersimpan!", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PENTING: Jangan pakai app.listen() di Vercel!
module.exports = app;
