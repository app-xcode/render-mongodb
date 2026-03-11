const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // 1. Import library-nya
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = process.env.MONGO_URI;

// Pastikan client tidak dibuat di luar jika URI belum ada
let client;

app.all('/get', async (req, res) => {
    try {
        // Cek apakah URI ada
        if (!uri) {
            throw new Error("MONGO_URI is not defined in Environment Variables");
        }

        if (!client) {
            client = new MongoClient(uri);
        }

        await client.connect();
        const db = client.db("iot_db");
        const collection = db.collection("sensor_data");

        // ... sisa kode GET, POST, DELETE kamu ...

        // 1. MENGAMBIL DATA (GET)
        // Di dalam route GET
        if (req.method === 'GET') {
            const draw = parseInt(req.query.draw);
            const start = parseInt(req.query.start);
            const length = parseInt(req.query.length);
            const total = await collection.countDocuments();
            const data = await collection.find()
                .sort({ createdAt: -1 })
                .skip(start)
                .limit(length)
                .lean();
            res.json({
                draw: draw,
                recordsTotal: total,
                recordsFiltered: total,
                data: data
            });
        }

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;



