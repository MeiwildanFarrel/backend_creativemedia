# Pakai Node.js versi 20 yang ringan
FROM node:20-alpine

# Set folder kerja di dalam container
WORKDIR /app

# Copy dulu package.json, lalu install dependensi
COPY package*.json ./
RUN npm install --omit=dev

# Copy semua kode sumber
COPY . .

# Buat folder uploads agar tidak error
RUN mkdir -p uploads

# Port yang dipakai aplikasi
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["node", "src/app.js"]