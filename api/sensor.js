const mongoose = require('mongoose');

// Koneksi Database (di luar handler agar lebih cepat)
const mongoURI = process.env.MONGO_URI;
if (mongoose.connection.readyState === 0) {
    mongoose.connect(mongoURI);
}

const Sensor = mongoose.models.Sensor || mongoose.model('Sensor', new mongoose.Schema({
    turbidity: Number,
    ph: Number,
    temperature: Number,
    timestamp: { type: Date, default: Date.now }
}));

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const newData = new Sensor(req.body);
            await newData.save();
            return res.status(201).json({ message: "Data tersimpan!", data: newData });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'GET') {
        const data = await Sensor.find().sort({ timestamp: -1 }).limit(20);
        return res.status(200).json(data);
    } else {
        res.status(405).json({ message: "Method tidak diizinkan" });
    }
}
