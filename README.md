# Hệ Thống Giám Sát Nhận Diện Khuôn Mặt (NDKM)

Ứng dụng web quản lý nhân viên và nhận diện khuôn mặt được xây dựng bằng
React + TypeScript + Vite.

## 📋 Mục lục

- [# Cài đặt và Chạy](#-cài-đặt-và-chạy)
- [# Cấu trúc Project](#-cấu-trúc-project)
- [# Data Models](#-data-models)
- [# Authentication](#-authentication)
- [# API Endpoints](#-api-endpoints)
- [# Cấu hình và biến môi trường](#cấu-hình-và-biến-môi-trường)

## 🚀 Cài đặt và Chạy

### Yêu cầu

- Node.js >= 16.0.0
- npm >= 8.0.0 hoặc yarn >= 1.22.0

### Cài đặt

```bash
npm install
```

### Chạy Development Server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`.

## 📁 Cấu trúc Project

```
web-NDKM/
├── src/
│   ├── components/          # React components
│   │   ├── BulkUploadForm.tsx       # Form upload hàng loạt từ Excel + ZIP
│   │   ├── EmployeeForm.tsx         # Form thêm/sửa nhân viên đơn lẻ
│   │   ├── EmployeeTables.tsx       # Bảng hiển thị danh sách nhân viên
│   │   ├── Sidebar.tsx              # Sidebar navigation với menu
│   │   └── ... (các icon và component nhỏ khác)
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx            # Trang chính - Quản lý nhân viên
│   │   ├── Login.tsx                # Trang đăng nhập
│   │   ├── Reports.tsx              # Trang Báo cáo (Điểm danh & Người lạ)
│   │   └── Settings.tsx             # Trang cấu hình hệ thống
│   ├── services/            # API Services
│   │   ├── apiClient.ts             # Axios instance & interceptors
│   │   ├── authService.ts           # Authentication logic
│   │   ├── employeeService.ts       # Employee CRUD logic
│   │   └── reportService.ts         # Reporting logic
│   ├── config/              # Configuration
│   │   └── api.ts                   # API Endpoints constants
│   ├── contexts/            # React Context
│   │   └── AuthContext.tsx          # Authentication context
│   ├── types/               # TypeScript type definitions
│   └── App.tsx              # Root component với routing
```

### Giao diện Layout

Ứng dụng sử dụng layout **Sidebar + Main Content**:

- **Sidebar**:
  - Dashboard (Quản lý nhân viên) - `/dashboard`
  - Báo cáo (Điểm danh & Người lạ) - `/reports`
  - Cài đặt (Settings) - `/settings`
  - Nút đăng xuất

- **Các trang chính**:
  1.  **Dashboard**: Quản lý nhân viên, thêm mới (đơn lẻ/hàng loạt), sửa, xóa.
  2.  **Reports**: Xem báo cáo điểm danh và danh sách người lạ theo ngày.
  3.  **Settings**: Cấu hình hệ thống.

## 🔌 Tích hợp Backend API

Hệ thống đã chuyển từ Mock Data sang sử dụng API Services thực tế.

### 1. Cấu hình
File: `src/config/api.ts`
Base URL mặc định: `http://localhost:8000/api` (có thể override bằng biến môi trường `VITE_API_BASE_URL`).

### 2. Các Service chính
- `authService`: Đăng nhập, đăng xuất.
- `employeeService`:
    - CRUD nhân viên (Get All, Get By ID, Create, Update, Delete).
    - Upload ảnh.
    - Import hàng loạt (Batch).
- `reportService`:
    - Lấy danh sách điểm danh (`getAttendance`).
    - Lấy danh sách người lạ (`getStrangers`).

## 🌐 API Endpoints Specification

Dưới đây là đặc tả các Endpoint mà Frontend đang sử dụng.

### 1. Authentication

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| POST | `/auth/login` | Đăng nhập (trả về token) |
| POST | `/auth/logout` | Đăng xuất |

### 2. Employees (Quản lý nhân viên)

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| GET | `/employees` | Lấy danh sách nhân viên (hỗ trợ phân trang) |
| GET | `/employees/:id` | Lấy chi tiết nhân viên |
| POST | `/employees` | Tạo mới nhân viên |
| PUT | `/employees/:id` | Cập nhật nhân viên |
| DELETE | `/employees/:id` | Xóa nhân viên |
| POST | `/employees/batch` | Import danh sách nhân viên (JSON Array) |
| POST | `/upload/image` | Upload ảnh (Multipart/form-data) |

### 3. Reports (Báo cáo & Thống kê)

| Method | Endpoint | Params | Mô tả |
| :--- | :--- | :--- | :--- |
| GET | `/reports/strangers` | `date=YYYY-MM-DD` | Lấy danh sách người lạ trong ngày |
| GET | `/reports/attendance` | `date=YYYY-MM-DD` | Lấy danh sách điểm danh nhân viên |

## 📊 Data Models (JSON Structure)

### Employee Object
```typescript
{
  "id": "string",
  "fullName": "string",
  "gender": "Nam" | "Nữ",
  "account": "string", // Unique
  "employeeId": "string",
  "department": "string",
  "position": "string",
  "workplace": "string",
  "imageFront": "string (URL/Base64)",
  "imageLeft": "string",
  "imageRight": "string",
  "imageUp": "string",
  "imageDown": "string"
}
```

### Report: Stranger
```typescript
{
  "id": "string",
  "time": "HH:mm:ss",
  "imageUrl": "string (URL)",
  "cameraLocation": "string"
}
```

### Report: Attendance
```typescript
{
  "employeeId": "string",
  "employeeName": "string",
  "timeIn": "HH:mm:ss",
  "timeOut": "HH:mm:ss",
  "date": "YYYY-MM-DD",
  "status": "present" | "late" | "absent"
}
```

## 🔐 Authentication Flow

1.  **Login**: User nhập user/pass -> API trả về JWT Token.
2.  **Storage**: Token được lưu trong `localStorage`.
3.  **Request**: Mọi request (trừ login) đều kèm header `Authorization: Bearer <token>`.
4.  **Expired**: Nếu API trả về 401 Unauthorized -> Tự động logout và chuyển về trang login.
