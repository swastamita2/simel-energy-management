# Room API Testing Checklist

Tujuan: validasi bahwa fitur Room (admin) memenuhi kebutuhan integrasi API, error handling, autentikasi token, timeout, retry, dan logging.

## 1. Persiapan Environment

1. Set mode backend (bukan mock):
   - `VITE_ENABLE_MOCK_DATA=false`
   - `VITE_API_BASE_URL=/api`
   - `VITE_API_PROXY_TARGET=http://localhost:<PORT_BACKEND_ANDA>`
2. Jalankan aplikasi frontend.
3. Pastikan backend API aktif.
4. Login sebagai admin.

Kriteria lulus:
- Aplikasi bisa login dan masuk ke halaman admin.
- DevTools tidak menunjukkan error konfigurasi base URL.

## 2. Verifikasi Komunikasi Frontend <-> Backend REST

Langkah:
1. Buka halaman Rooms Management.
2. Buka tab Network di browser DevTools.
3. Refresh halaman Rooms Management.

Expected:
- Ada request `GET /monitoring/rooms`.
- Response format JSON valid.
- UI tabel Room terisi data dari response.

## 3. Verifikasi Method CRUD (GET, POST, PUT, DELETE)

### 3.1 GET Rooms
Langkah:
1. Masuk halaman Rooms Management.

Expected:
- Network menampilkan `GET /monitoring/rooms`.
- Status 200.
- Body JSON sesuai kontrak room.

### 3.2 POST Create Room
Langkah:
1. Klik Add Room.
2. Isi nama + building.
3. Submit.

Expected:
- Network menampilkan `POST /monitoring/rooms`.
- Status 200/201.
- UI menampilkan toast sukses.
- Row room baru muncul di tabel.

### 3.3 PUT Update Room
Langkah:
1. Klik edit salah satu room.
2. Ubah nama/building.
3. Submit.

Expected:
- Network menampilkan `PUT /monitoring/rooms/:id`.
- Status 200.
- Toast sukses muncul.
- Data row berubah sesuai input.

### 3.4 DELETE Room
Langkah:
1. Klik delete pada room.
2. Konfirmasi delete.

Expected:
- Network menampilkan `DELETE /monitoring/rooms/:id`.
- Status 200/204.
- Toast sukses muncul.
- Row room hilang dari tabel.

## 4. Verifikasi Response Handling (Success & Error)

### 4.1 Success Handling
Langkah:
1. Lakukan create/edit/delete dengan data valid.

Expected:
- Setiap aksi sukses menampilkan toast sukses.
- UI state sinkron dengan data terbaru.

### 4.2 Error Handling (4xx/5xx)
Langkah:
1. Paksa backend kirim 400 (misalnya kirim payload invalid).
2. Paksa backend kirim 500 (misalnya matikan dependensi DB sementara / endpoint test error).

Expected:
- UI menampilkan toast error.
- Tidak crash halaman.
- Data tabel tidak rusak.

## 5. Verifikasi JSON Data Standard

Langkah:
1. Inspect request header dan response body untuk GET/POST/PUT/DELETE room.

Expected:
- Header request memuat `Content-Type: application/json` untuk request dengan body.
- Body request/response berupa JSON object/array valid.

## 6. Verifikasi Token-based Auth (JWT/Bearer)

Langkah:
1. Login admin.
2. Jalankan aksi room (GET/POST/PUT/DELETE).
3. Inspect request headers.

Expected:
- Header `Authorization: Bearer <token>` terkirim.
- Jika token dihapus dari localStorage lalu request ulang, sistem menangani 401 dengan benar (redirect/login flow).

## 7. Verifikasi Timeout dan Network Error

### 7.1 Timeout
Langkah:
1. Set `VITE_API_TIMEOUT` kecil (contoh 1000ms).
2. Simulasikan endpoint lambat (>1 detik).
3. Jalankan aksi room.

Expected:
- Request gagal dengan pesan timeout/network.
- UI menampilkan toast error dan tetap responsif.

### 7.2 Network Error
Langkah:
1. Matikan backend sementara.
2. Reload halaman room / lakukan create.

Expected:
- UI menampilkan pesan network error.
- Tidak terjadi blank screen/crash.

## 8. Verifikasi Retry Otomatis

Langkah:
1. Simulasikan kegagalan jaringan/5xx sementara (misalnya backend gagal di request pertama lalu sukses di request berikutnya).
2. Jalankan GET/POST room.
3. Cek console log.

Expected:
- Terlihat log retry (`retry 1/2`, dst).
- Request otomatis dicoba ulang.
- Jika akhirnya sukses, UI menampilkan hasil sukses.
- Jika tetap gagal setelah retry max, UI menampilkan error final.

## 9. Verifikasi Logging Komunikasi API

Langkah:
1. Jalankan aplikasi di mode development.
2. Lakukan aksi room (GET/POST/PUT/DELETE).
3. Cek browser console.

Expected:
- Log request: method + URL + requestId.
- Log response: status + durasi.
- Log retry jika terjadi retry.
- Log error untuk 4xx/5xx/network error.

## 10. Ringkasan Status Uji

Gunakan format ini untuk laporan:

- REST Communication: PASS/FAIL
- GET/POST/PUT/DELETE: PASS/FAIL
- Success/Error Handling: PASS/FAIL
- JSON Standard: PASS/FAIL
- Token-based Auth: PASS/FAIL
- Timeout & 4xx/5xx Handling: PASS/FAIL
- Auto Retry: PASS/FAIL
- API Logging: PASS/FAIL

Catatan:
- Jika ada FAIL, lampirkan endpoint, payload, status code, dan screenshot Network/Console.
- Setelah semua PASS, lanjut ke tahap 1 (commit/push perubahan) sesuai rencana.
