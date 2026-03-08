const { MongoClient, ServerApiVersion } = require('mongodb');

// Inisialisasi Client di luar handler agar koneksi bisa digunakan ulang (Re-use)
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export default async function handler(req, res) {
  // --- HEADER CORS (Agar bisa di-test dari mana saja) ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Hubungkan ke database
    await client.connect();
    const db = client.db("iot_db"); // Nama Database
    const collection = db.collection("sensor_data"); // Nama Koleksi/Tabel

    // --- LOGIKA POST (Kirim Data dari Sensor/Alat) ---
    if (req.method === 'POST') {
      const { turbidity, ph, temperature } = req.body;
      
      // Log ini akan muncul di tab "Logs" -> "Runtime" di Vercel
      console.log("Data Diterima:", req.body);

      const result = await collection.insertOne({
        turbidity: Number(turbidity),
        ph: Number(ph),
        temperature: Number(temperature),
        createdAt: new Date()
      });

      return res.status(201).json({ 
        message: "Data Berhasil Disimpan!", 
        id: result.insertedId 
      });
    } 

    // --- LOGIKA GET (Ambil Data untuk Ditampilkan) ---
    else if (req.method === 'GET') {
      const data = await collection.find({}).sort({ createdAt: -1 }).limit(20).toArray();
      return res.status(200).json(data);
    } 

    else {
      return res.status(405).json({ message: "Metode tidak diizinkan" });
    }

  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Gagal koneksi ke database: " + error.message });
  }
}
