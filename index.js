const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// 1. Koneksi ke MongoDB (Ganti dengan link dari langkah 1)
const mongoURI = process.env.MONGO_URI; 
mongoose.connect(mongoURI)
    .then(() => console.log("Database Terhubung!"))
    .catch(err => console.error("Gagal konek:", err));

// 2. Schema Data Sensor
const sensorSchema = new mongoose.Schema({
    turbidity: Number,
    ph: Number,
    temperature: Number,
    timestamp: { type: Date, default: Date.now }
});
const Sensor = mongoose.model('Sensor', sensorSchema);

// 3. Endpoint POST (Untuk kirim data dari alat/sensor)
app.post('/api/sensor', async (req, res) => {
    try {
        const newData = new Sensor(req.body);
        await newData.save();
        res.status(201).send({ message: "Data tersimpan!", data: newData });
    } catch (error) {
        res.status(500).send(error);
    }
});

// 4. Endpoint GET (Untuk melihat data di browser/aplikasi)
app.get('/api/sensor', async (req, res) => {
    const data = await Sensor.find().sort({ timestamp: -1 }).limit(20);
    res.send(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server nyala di port ${PORT}`));
