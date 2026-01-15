# Tài liệu Tích hợp Hệ thống: Web-NDKM

## 1. Công nghệ sử dụng

| Thành phần | Công nghệ | Chi tiết |
| :--- | :--- | :--- |
| **Frontend** | ReactJS | Framework UI (Vite bundler) |
| | TypeScript | Ngôn ngữ lập trình |
| | Tailwind/CSS | Styling (dựa trên các file .css module) |
| **Backend** | Node.js | Runtime environment |
| | Express.js | Web server framework |
| | Prisma | ORM để làm việc với database |
| **Database** | SQLite | Cơ sở dữ liệu quan hệ (file `server/dev.db`) |

---

## 2. Cấu trúc Thư mục

```
web-NDKM/
├── src/                    # Source code Frontend
│   ├── components/         # Các component React tái sử dụng
│   ├── pages/              # Các trang chính (Dashboard, Employees, Reports...)
│   ├── services/           # Gọi API (Axios)
│   ├── config/             # Cấu hình hệ thống (API URL)
│   └── assets/             # Tài nguyên tĩnh (ảnh, icon)
├── server/                 # Source code Backend
│   ├── src/
│   │   ├── controllers/    # Xử lý logic nghiệp vụ
│   │   ├── routes/         # Định nghĩa API endpoints
│   │   └── index.ts        # Entry point của server
│   ├── prisma/             # Cấu hình Database & Schema
│   └── uploads/            # Thư mục chứa ảnh upload (được tạo tự động)
├── TAI LIEU DU AN/         # Tài liệu dự án
└── package.json            # Dependencies cho Frontend
```

---

## 3. Yêu cầu Hệ thống (Prerequisites)

*   **Node.js**: Phiên bản 18.x trở lên.
*   **npm**: Trình quản lý gói đi kèm Node.js.
*   **Hệ điều hành**: Windows/Linux/MacOS.

---

## 4. Hướng dẫn Cài đặt & Chạy Dự án

Do dự án tách biệt Frontend và Backend, cần khởi chạy cả hai service này song song.

### Bước 1: Cấu hình Backend

Backend chạy trên cổng **3001** mặc định và sử dụng SQLite.

1.  Mở terminal và di chuyển vào thư mục server:
    ```bash
    cd server
    ```
2.  Cài đặt dependencies:
    ```bash
    npm install
    ```
3.  Khởi tạo Database (Prisma):
    ```bash
    npx prisma migrate dev --name init
    ```
    *Lệnh này sẽ tạo file `dev.db` trong thư mục `server/prisma`.*
4.  Chạy server (Development mode):
    ```bash
    npm run dev
    ```
    *Server sẽ chạy tại: `http://localhost:3001`*

### Bước 2: Cấu hình Frontend

Frontend mặc định chạy trên cổng **5173** (Vite).

1.  Mở một terminal **mới** (giữ terminal Backend đang chạy) và quay lại thư mục gốc dự án:
    ```bash
    cd ..
    # Hoặc cd đường/dẫn/tới/web-NDKM
    ```
2.  Cài đặt dependencies:
    ```bash
    npm install
    ```
3.  **LƯU Ý QUAN TRỌNG VỀ CẤU HÌNH API**:
    Mặc định source code đang trỏ tới `http://localhost:8000/api`, nhưng Backend thực tế chạy ở cổng **3001** và không có prefix `/api`.
    
    Bạn cần tạo file `.env` tại thư mục gốc (ngang hàng với `package.json` của Frontend) với nội dung sau để ghi đè cấu hình mặc định:

    ```env
    VITE_API_BASE_URL=http://localhost:3001
    ```

4.  Chạy Frontend:
    ```bash
    npm run dev
    ```
    *Truy cập Web tại: `http://localhost:5173`*

---

## 5. Tài liệu API & Tích hợp

### Base URL
Nếu chạy local theo hướng dẫn trên, Base URL là: `http://localhost:3001`

### Các Endpoints chính

#### Authentication (Nếu có)
*   Hệ thống hiện tại có cấu trúc API mở, cần kiểm tra `AuthContext` để biết cơ chế xác thực cụ thể.

#### Nhân viên (Employees)
*   `GET /employees`: Lấy danh sách nhân viên.
*   `GET /employees/:id`: Lấy chi tiết nhân viên.
*   `POST /employees`: Tạo mới nhân viên.
*   `POST /employees/batch`: Import danh sách nhân viên (Excel/CSV).

#### Upload
*   `POST /upload/image`: Upload ảnh nhân viên hoặc ảnh sự kiện.
    *   Lưu ý: Backend phục vụ file tĩnh tại route `/uploads`. Ví dụ: `http://localhost:3001/uploads/ten-anh.jpg`.

#### Báo cáo & Cảnh báo (Reports)
*   `GET /reports/attendance`: Lấy dữ liệu chấm công.
*   `POST /reports/strangers`: Gửi cảnh báo người lạ (Dùng cho module AI/Camera gọi vào).

---

## 6. Mô hình Dữ liệu (Database Schema)

Cơ sở dữ liệu gồm 3 bảng chính (xem chi tiết tại `server/prisma/schema.prisma`):

1.  **Employee**: Lưu thông tin nhân viên (ID, Tên, Ảnh).
2.  **Attendance**: Lưu lịch sử chấm công (TimeIn, TimeOut, Date).
3.  **StrangerWarning**: Lưu cảnh báo an ninh (Thời gian, Ảnh chụp, Vị trí camera).

---

## 7. Build & Deployment (Production)

Để đưa hệ thống lên môi trường production:

### Backend
1.  Build TypeScript sang JavaScript:
    ```bash
    cd server
    npm run build
    ```
2.  Chạy server từ thư mục `dist`:
    ```bash
    npm start
    ```
    *Lưu ý: Cần thiết lập biến môi trường `PORT` nếu muốn đổi cổng chạy.*

### Frontend
1.  Build React app:
    ```bash
    npm run build
    ```
    Kết quả build sẽ nằm trong thư mục `dist` tại root.
2.  Serve thư mục `dist` này bằng Nginx, Apache hoặc serve tĩnh bằng Node.js.

---

## 8. Các vấn đề cần lưu ý (Troubleshooting)

1.  **Lỗi CORS**: Backend đã cấu hình `cors()` cho phép truy cập cross-origin. Nếu gặp lỗi, kiểm tra lại cấu hình này trong `server/src/index.ts`.
2.  **Lỗi kết nối Database**: Đảm bảo file `server/prisma/dev.db` tồn tại và tiến trình Node.js có quyền đọc/ghi file này.
3.  **Upload ảnh**: Thư mục `server/uploads` cần được tạo (hệ thống sẽ tự động tạo nếu chưa có) và có quyền ghi.
4.  **Cấu hình Port**: Luôn kiểm tra file `.env` ở Frontend để đảm bảo `VITE_API_BASE_URL` khớp với địa chỉ và cổng của Backend đang chạy.
