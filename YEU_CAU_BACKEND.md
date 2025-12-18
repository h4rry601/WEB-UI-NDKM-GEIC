# Tài liệu Thống nhất API (Frontend -> Backend)

Để đảm bảo Frontend hoạt động chính xác khi tích hợp, cần có các cấu trúc dữ liệu và API Endpoint dưới đây:
## 1. Báo cáo & Thống kê (Chưa có trong tài liệu cũ)

### 1.1. Lấy danh sách điểm danh
**Endpoint:** `GET /reports/attendance`
**Query Params:** `?date=YYYY-MM-DD`

**Response mong muốn:**
```json
{
  "success": true,
  "data": [
    {
      "employeeId": "NV001",
      "employeeName": "Nguyễn Văn A",
      "timeIn": "07:55:00",
      "timeOut": "17:30:00",
      "date": "2023-10-27",
      "status": "present" // hoặc "late", "absent"
    },
    // ...
  ]
}
```

### 1.2. Lấy danh sách cảnh báo người lạ
**Endpoint:** `GET /reports/strangers`
**Query Params:** `?date=YYYY-MM-DD`

**Response mong muốn:**
```json
{
  "success": true,
  "data": [
    {
      "id": "stranger_123",
      "time": "10:15:30",
      "imageUrl": "https://domain.com/uploads/stranger_123.jpg",
      "cameraLocation": "Cổng chính - Cam 01"
    }
  ]
}
```

## 2. Quản lý Nhân viên (Làm rõ thêm)

### 2.1. Import danh sách nhân viên (Batch Import)
Hiện tại Frontend đang xử lý file Excel và ảnh ở phía client, sau đó gửi danh sách JSON lên server.
**Endpoint:** `POST /employees/batch`

**Request Body:**
```json
{
  "employees": [
    {
      "fullName": "...",
      "employeeId": "...",
      "imageFront": "data:image/...",
      // ... các trường khác
    }
  ]
}
```
*Câu hỏi: Backend có hỗ trợ nhận JSON mảng lớn không, hay yêu cầu upload file ZIP để Backend tự giải nén và xử lý?*

### 2.2. Upload ảnh (Nếu không dùng Base64)
**Endpoint:** `POST /upload/image`
**Content-Type:** `multipart/form-data`
**Key:** `image`

## 3. Quy ước chung
- **Date Format:** YYYY-MM-DD
- **Time Format:** HH:mm:ss
- **Image URL:** Backend trả về Full URL (có domain) hay Relative path? (Frontend đang mong đợi Full URL).
