const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// 1. [GET] Cek Status API
app.get('/api', async (req, res) => {
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await db.collection("sensor_data").deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: "Deleted" });
}
  try {
    await client.connect();
    const db = client.db("iot_db");
    const collection = db.collection("sensor_data");

    // Ambil 20 data terbaru berdasarkan waktu (createdAt)
    const data = await collection.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    res.status(200).json(data);
  } catch (error) {
    console.error("Error GET:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. [POST] Menerima Data dari ESP32/Alat
// Akses: https://render-mongodb.vercel.app/api/sensor
app.post('/api', async (req, res) => {
  try {
    await client.connect();
    const db = client.db("iot_db");
    const collection = db.collection("sensor_data");

    const newDoc = {
      turbidity: Number(req.body.turbidity),
      ph: Number(req.body.ph),
      temperature: Number(req.body.temp), // Gunakan 'temp' sesuai log kamu
      createdAt: new Date()
    };

    console.log("Data yang akan disimpan:", req.body);
    const result = await collection.insertOne(newDoc);
    res.status(201).json({ 
      message: "Data tersimpan!", 
      id: result.insertedId 
    });
  } catch (error) {
    console.error("Error POST:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;











