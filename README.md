# 🌊 IoT Sensor Monitoring Dashboard

Dashboard real-time untuk memvisualisasikan data sensor (Turbidity, pH Air, dan Suhu) menggunakan **Node.js**, **MongoDB**, dan **Chart.js**.

🚀 **Live Demo:** [https://render-mongodb.vercel.app/](https://render-mongodb.vercel.app/)

## ✨ Fitur Utama
- **Real-time Data Fetching**: Sinkronisasi data otomatis antara MongoDB dan UI Dashboard.
- **Glassmorphism UI**: Tampilan kartu modern dengan efek transparansi dan blur.
- **Auto Dark Mode**: Tema dashboard yang otomatis menyesuaikan dengan pengaturan sistem (Light/Dark).
- **Multi-Axis Chart**: Visualisasi tiga parameter sensor berbeda dalam satu grafik yang presisi.
- **Responsive Gauge**: Indikator analog yang interaktif untuk pembacaan parameter secara cepat.

## 🛠️ Teknologi yang Digunakan
- **Frontend**: Tailwind CSS, Chart.js, Canvas-Gauges, jQuery.
- **Backend**: Node.js (Express.js).
- **Database**: MongoDB Atlas.
- **Deployment**: Vercel.

## 📈 Parameter yang Dipantau
| Parameter | Satuan | Deskripsi |
| :--- | :--- | :--- |
| **Turbidity** | NTU | Kekeruhan air |
| **pH Air** | pH | Tingkat keasaman air (Skala 0-14) |
| **Suhu** | °C | Temperatur air/lingkungan |

## ⚙️ Konfigurasi Lokal
1. Clone repositori:
   ```bash
   git clone [https://github.com/app-xcode/render-mongodb.git](https://github.com/app-xcode/render-mongodb.git)
