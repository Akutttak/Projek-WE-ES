# Projek-WE-ES

## PredictHQ API

Tambahkan key berikut ke file .env di root project:

PREDICTHQ_API_KEY=your_api_key_here

Contoh pemanggilan:

GET /api/events/search?country=US&limit=10

buat nge run pake npx nodemon back_end/index.js
jangan lupa npm i btw
aku kasih gitignore soale
jadi nod montol gk ke save

# buat pake redis

1. instal dulu di laptop masing masing namanya memurai, sesuaiin port nanti di installer harus port 6379
2. 'npm install bullmq ioredis' di terminal
3. udh tinggal jalanin aja kek biasa

# buat run seeder

node back_end/seeders/userSeeder.js

# buat Midtrans

Tambahkan ke file .env di root project:

MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_IS_PRODUCTION=false
