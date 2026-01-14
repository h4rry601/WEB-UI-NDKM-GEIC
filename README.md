# Hệ Thống Giám Sát Nhận Diện Khuôn Mặt (NDKM)

Ứng dụng web quản lý nhân viên và nhận diện khuôn mặt được xây dựng bằng React + TypeScript + Vite.

## 📋 Mục lục

- [Cài đặt và Chạy](#cài-đặt-và-chạy)
- [Cấu trúc Project](#cấu-trúc-project)
- [Tích hợp Backend API](#tích-hợp-backend-api)
- [API Endpoints Specification](#api-endpoints-specification)
- [Data Models (JSON Structure)](#data-models-json-structure)
- [Authentication Flow](#authentication-flow)

- Cài đặt và Chạy (#cài-đặt-và-chạy)
- Cấu trúc Project (#cấu-trúc-project)
- Tích hợp Backend API (#tích-hợp-backend-api)
- API Endpoints Specification (#api-endpoints-specification)
- Data Models (JSON Structure) (#data-models-json-structure)
- Authentication Flow (#authentication-flow)


## 🚀 Cài đặt và Chạy

Yêu cầu: Node.js >= 16, npm >= 8 hoặc yarn >= 1.22.

```bash
npm install
npm run dev
```

Ứng dụng chạy tại `http://localhost:5173`.

## 📁 Cấu trúc Project

web-NDKM/
├── src/
│   ├── components/
│   │   ├── BulkUploadForm.tsx
│   │   ├── EmployeeForm.tsx
│   │   ├── EmployeeTables.tsx
│   │   └── Sidebar.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── services/
│   │   ├── apiClient.ts
│   │   ├── authService.ts
│   │   ├── employeeService.ts
│   │   └── reportService.ts
│   ├── config/
│   │   └── api.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   └── App.tsx
└── index.html

## 🔌 Tích hợp Backend API

- Cấu hình base URL tại `src/config/api.ts` (mặc định `http://localhost:8000/api`, có thể override qua `VITE_API_BASE_URL`).
- `apiClient.ts` cấu hình Axios với interceptors: tự động đính kèm `Authorization: Bearer <token>` và chuyển hướng về `/login` khi nhận `401`.
- Service chính:
  - `authService`: đăng nhập, đăng xuất.
  - `employeeService`: CRUD nhân viên, upload ảnh, import hàng loạt.
  - `reportService`: lấy danh sách Điểm danh và Người lạ theo ngày.

## 🌐 API Endpoints Specification

Authentication

- `POST /auth/login`
- `POST /auth/logout`

Employees

- `GET /employees`
- `GET /employees/:id`
- `POST /employees`
- `PUT /employees/:id`
- `DELETE /employees/:id`
- `POST /employees/batch` (import JSON mảng nhân viên)
- `POST /upload/image` (multipart/form-data)

Reports

- `GET /reports/strangers?date=YYYY-MM-DD`
- `GET /reports/attendance?date=YYYY-MM-DD`

## 📊 Data Models (JSON Structure)

Employee

```json
{
  "id": "string",
  "fullName": "string",
  "gender": "Nam|Nữ",
  "account": "string",
  "employeeId": "string",
  "department": "string",
  "position": "string",
  "workplace": "string",
  "imageFront": "string",
  "imageLeft": "string",
  "imageRight": "string",
  "imageUp": "string",
  "imageDown": "string"
}
```

Report: Stranger

```json
{
  "id": "string",
  "time": "HH:mm:ss",
  "imageUrl": "string",
  "cameraLocation": "string"
}
```

Report: Attendance

```json
{
  "employeeId": "string",
  "employeeName": "string",
  "timeIn": "HH:mm:ss",
  "timeOut": "HH:mm:ss",
  "date": "YYYY-MM-DD",
  "status": "present|late|absent"
}
```

## 🔐 Authentication Flow

- Login nhận token JWT → lưu `localStorage`.
- Mọi request (trừ login) gửi header `Authorization: Bearer <token>`.
- Khi `401` → xoá token và chuyển hướng về `/login`.
