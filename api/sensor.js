const { MongoClient, ServerApiVersion } = require('mongodb');

// Gunakan Environment Variable agar aman
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export default async function handler(req, res) {
  try {
    // Koneksi ke Database
    await client.connect();
    const database = client.db("iot_db"); // Nama database kamu
    const sensors = database.collection("sensor_data"); // Nama tabel/koleksi

    if (req.method === 'POST') {
      // Ambil data dari sensor (turbidity, ph, temperature)
      const { turbidity, ph, temperature } = req.body;
      
      const doc = {
        turbidity: Number(turbidity),
        ph: Number(ph),
        temperature: Number(temperature),
        createdAt: new Date()
      };

      const result = await sensors.insertOne(doc);
      return res.status(201).json({ message: "Data tersimpan!", id: result.insertedId });

    } else if (req.method === 'GET') {
      // Ambil 20 data terbaru
      const data = await sensors.find().sort({ createdAt: -1 }).limit(20).toArray();
      return res.status(200).json(data);

    } else {
      return res.status(405).json({ message: "Hanya dukung POST dan GET" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } 
  // Catatan: Di Serverless Vercel, jangan panggil client.close() di sini 
  // agar koneksi bisa dipakai ulang (re-use) oleh request berikutnya.
}
