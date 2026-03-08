const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("iot_db");
    const collection = db.collection("sensor_data");

    if (req.method === 'POST') {
      await collection.insertOne(req.body);
      res.status(201).json({ message: "Data tersimpan!" });
    } else {
      const data = await collection.find({}).limit(10).toArray();
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
