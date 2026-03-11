const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors'); // 1. Import library-nya
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = process.env.MONGO_URI;

// Pastikan client tidak dibuat di luar jika URI belum ada
let client;

app.all('/api', async (req, res) => {
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
            const { last } = req.query;
            const draw = parseInt(req.query.draw);
            const start = parseInt(req.query.start);
            const length = parseInt(req.query.length);
            const total = await collection.countDocuments();
            if(draw){
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
            }else{
                const data = await collection.find({}).sort({ createdAt: -1 }).toArray();
            }

            // Jika jumlah data sama, kirim status 200 tapi dengan body kosong/penanda
            if (data.length === Number(last)) {
                // Kita kirim status 200 agar header CORS tetap ikut terkirim dengan aman
                return res.status(200).json({ status: "no_change", data: [] });
            } else {
                return res.status(200).json({ status: "success", data: data });
            }
        }

        // 2. MENYIMPAN DATA (POST)
        if (req.method === 'POST') {
            console.log("Data Masuk:", req.body);
            const newDoc = {
                turbidity: Number(req.body.turbidity) || 0,
                ph: Number(req.body.ph) || 0,
                temperature: Number(req.body.temp || req.body.temperature) || 0,
                createdAt: new Date()
            };
            const result = await collection.insertOne(newDoc);
            return res.status(201).json(result);
        }

        // 3. MENGHAPUS DATA (DELETE)
        // 3. MENGHAPUS DATA (DELETE)
        if (req.method === 'DELETE') {
            const { id } = req.query;

            if (id) {
                // Hapus satu data berdasarkan ID
                const result = await collection.deleteOne({ _id: new ObjectId(id) });
                return res.status(200).json({ message: "Data berhasil dihapus" });
            } else {
                // Hapus SEMUA data jika ID tidak disertakan
                const result = await collection.deleteMany({});
                return res.status(200).json({
                    message: `Semua data (${result.deletedCount}) berhasil dibersihkan`
                });
            }
        }

        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;



