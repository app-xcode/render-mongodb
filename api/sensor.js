export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("iot_db");
    const collection = db.collection("sensor_data");

    if (req.method === 'POST') {
      // LOGIKA SIMPAN DATA
      const result = await collection.insertOne({
        ...req.body,
        createdAt: new Date()
      });
      return res.status(201).json({ message: "Data tersimpan!", id: result.insertedId });

    } else if (req.method === 'GET') {
      // LOGIKA AMBIL DATA (Agar tidak muncul error di browser)
      const data = await collection.find({}).sort({ createdAt: -1 }).limit(10).toArray();
      return res.status(200).json(data);

    } else {
      return res.status(405).json({ message: "Metode tidak didukung" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
