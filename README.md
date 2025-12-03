# Hệ Thống Giám Sát Nhận Diện Khuôn Mặt (NDKM)

Ứng dụng web quản lý nhân viên và nhận diện khuôn mặt được xây dựng bằng
React + TypeScript + Vite.

## 📋 Mục lục

- (#-cài-đặt-và-chạy)
- (#-cấu-trúc-project)
- (#-yêu-cầu-backend-api)
- (#-data-models)
- (#-authentication)
- (#-api-endpoints)
- (#cấu-hình-và-biến-môi-trường)
- (#-lưu-ý-kỹ-thuật)

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

Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đã
được sử dụng).

### Build Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Cấu trúc Project

```
web-NDKM/
├── src/
│   ├── components/          # React components
│   │   ├── BulkUploadForm.tsx       # Form upload hàng loạt từ Excel + ZIP
│   │   ├── BulkUploadForm.css
│   │   ├── ConfirmDialog.tsx        # Dialog xác nhận xóa nhân viên
│   │   ├── ConfirmDialog.css
│   │   ├── DashboardIcon.tsx        # Icon Dashboard
│   │   ├── EmployeeForm.tsx         # Form thêm/sửa nhân viên đơn lẻ
│   │   ├── EmployeeForm.css
│   │   ├── EmployeeTables.tsx       # Bảng hiển thị danh sách nhân viên
│   │   ├── EmployeeTables.css
│   │   ├── LogoutIcon.tsx           # Icon đăng xuất
│   │   ├── PersonnelIcon.tsx        # Icon Nhân sự
│   │   ├── ReportsIcon.tsx          # Icon Báo cáo
│   │   ├── SettingsIcon.tsx         # Icon Cài đặt
│   │   ├── Sidebar.tsx              # Sidebar navigation với menu
│   │   ├── Sidebar.css
│   │   ├── TimekeepingIcon.tsx      # Icon Chấm công
│   │   ├── UploadIcon.tsx           # Icon Tải lên
│   │   └── UserIcon.tsx             # Icon người dùng
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx            # Trang chính - Quản lý nhân viên
│   │   ├── Dashboard.css
│   │   ├── Login.tsx                # Trang đăng nhập
│   │   ├── Login.css
│   │   ├── Settings.tsx             # Trang cấu hình hệ thống
│   │   └── Settings.css
│   ├── contexts/            # React Context
│   │   └── AuthContext.tsx          # Authentication context
│   ├── types/               # TypeScript type definitions
│   │   └── global.d.ts
│   ├── config/              # Configuration (sẵn sàng cho API config)
│   ├── assets/              # Static assets
│   │   ├── fonts/
│   │   ├── icons/
│   │   ├── images/
│   │   └── styles/
│   ├── App.tsx              # Root component với routing
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   └── vite-env.d.ts        # Vite environment types
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### Giao diện Layout

Ứng dụng sử dụng layout **Sidebar + Main Content**:

- **Sidebar**: Cố định bên trái (mở rộng khi hover), chứa:
  - Logo và tiêu đề "FaceID Admin"
  - Menu navigation:
    - Dashboard (chưa implement)
    - Nhân sự (Employee Management) - `/dashboard`
    - Chấm công (chưa implement)
    - Báo cáo (chưa implement)
    - Tải lên dữ liệu (chưa implement)
    - Cài đặt (Settings) - `/settings`
  - User profile (Admin, <admin@company.com>)
  - Nút đăng xuất

- **Main Content**: Bên phải sidebar, tùy theo trang:
  - **Trang Nhân sự**: Form quản lý nhân viên (trái) + Bảng danh sách (phải)
  - **Trang Settings**: Cấu hình đường dẫn lưu trữ dữ liệu

### Tính năng chính

#### 1. Quản lý Nhân viên (Dashboard)

- **Thêm nhân viên đơn lẻ**: Nhấn nút "Thêm nhân viên mới" để mở modal, nhập thông tin và upload 5 ảnh khuôn mặt (nhìn thẳng, trái, phải, lên, xuống)
- **Import hàng loạt**: Upload file ZIP chứa Excel + ảnh để thêm nhiều nhân viên cùng lúc (trong modal)
- **Sửa/Xóa**: Chỉnh sửa hoặc xóa nhân viên đã có
- **Xóa nhiều**: Chọn nhiều nhân viên để xóa cùng lúc
- **Tìm kiếm**: Lọc danh sách theo tên, account, phòng ban

#### 2. Settings

- **Cấu hình đường dẫn lưu trữ**: Chọn thư mục lưu dữ liệu nhân viên
- **Quản lý storage**: Xem và cập nhật cài đặt lưu trữ

### Tính năng Upload ZIP (Import hàng loạt)

Component `BulkUploadForm` hỗ trợ upload file ZIP để import nhiều nhân viên cùng lúc. File ZIP cần có cấu trúc sau:

```
employee_data.zip
├── data.xlsx                # File Excel chứa thông tin nhân viên
└── images/                  # Thư mục chứa ảnh (có thể có thư mục con)
    ├── NV001/               # Thư mục theo mã nhân viên (tuỳ chọn)
    │   ├── front.jpg
    │   ├── left.jpg
    │   ├── right.jpg
    │   ├── up.jpg
    │   └── down.jpg
    └── NV002_front.jpg      # Hoặc đặt trực tiếp với tên chứa mã NV
        ...
```

**Cấu trúc file Excel (.xlsx):**

File Excel cần có các cột (hệ thống tự động nhận diện nhiều tên cột khác nhau):

| Mã nhân sự | Họ và tên | Giới tính | Email công ty | Phòng ban | Chức vụ | Số phòng làm việc |
|------------|-----------|-----------|---------------|-----------|---------|-------------------|
| NV001 | Nguyễn Văn A | Nam | nguyenvana@company.com | IT | Developer | P301 |
| NV002 | Trần Thị B | Nữ | tranthib@company.com | HR | Manager | P302 |

**Các tên cột được hỗ trợ (không phân biệt hoa thường, dấu):**
- Mã nhân sự: `manhansu`, `mns`, `manv`, `employeeid`, `id`, `maso`, `code`
- Họ và tên: `hoten`, `hovaten`, `fullname`, `ten`, `name`
- Giới tính: `gioitinh`, `gender`, `sex`
- Email: `email`, `account`, `taikhoan`, `emailcongty`
- Phòng ban: `phong`, `department`, `phongban`
- Chức vụ: `chucvu`, `chucdanh`, `position`, `bophan`
- Phòng làm việc: `sophonglamviec`, `phonglamviec`, `workplace`, `room`

**Quy tắc đặt tên ảnh:**

- Tên file ảnh hoặc thư mục phải chứa mã nhân viên (employeeId) hoặc tên nhân viên
- Phải có từ khóa góc chụp: `front`, `left`, `right`, `up`, `down` (hoặc tiếng Việt: `thang`, `trai`, `phai`, `tren`, `duoi`)
- Ví dụ: 
  - `NV001/front.jpg`
  - `nguyenvana_front.jpg`
  - `NV001_trai.png`

**Tính năng thông minh:**

- Tự động phát hiện dòng tiêu đề trong Excel (không cần phải ở dòng đầu tiên)
- Mapping thông minh các tên cột (hỗ trợ nhiều biến thể)
- Validation và báo lỗi chi tiết cho từng nhân viên
- Hiển thị thống kê và preview trước khi lưu
- Chỉ import những nhân viên hợp lệ

**Lưu ý:**

- Mỗi nhân viên cần ít nhất ảnh nhìn thẳng (front)
- Hỗ trợ định dạng: JPG, JPEG, PNG, WEBP
- File Excel phải có đủ các cột bắt buộc: Mã nhân sự, Họ tên, Giới tính, Email

## 🔌 Yêu cầu Backend API

Frontend hiện tại đang sử dụng **mock data trong state**. Để tích hợp với Backend, cần thực hiện các bước sau:

### 1. Tạo file cấu hình API

Tạo file `src/config/api.ts` để cấu hình base URL và các API endpoints:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  
  // Employees
  EMPLOYEES: '/employees',
  EMPLOYEE_BY_ID: (id: string) => `/employees/${id}`,
  CONFIRM_EMPLOYEE: (id: string) => `/employees/${id}/confirm`,
  
  // Configuration
  WORKPLACES: '/config/workplaces',
  SERVERS: '/config/servers',
  CAMERAS: '/config/cameras',
  
  // Upload (optional)
  UPLOAD_IMAGE: '/upload/image'
}
```

### 2. Tạo API service layer

Tạo thư mục `src/services/` và các file sau:

#### `src/services/apiClient.ts` - HTTP Client với interceptors

```typescript
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor: Thêm token vào header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: Xử lý lỗi 401 (unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

#### `src/services/authService.ts` - Authentication

```typescript
import apiClient from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export interface LoginRequest {
  username: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  success: boolean
  token?: string
  user?: {
    username: string
    email?: string
  }
  message?: string
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, data)
    return response.data
  },
  
  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.LOGOUT)
  }
}
```

#### `src/services/employeeService.ts` - Employee CRUD

```typescript
import apiClient from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { Employee } from '../pages/Dashboard'

export interface CreateEmployeeRequest extends Omit<Employee, 'id'> {
  server?: string
  camera?: string
}

export interface EmployeeListResponse {
  success: boolean
  data: Employee[]
  total?: number
  page?: number
  limit?: number
}

export const employeeService = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    department?: string
    status?: 'pending' | 'confirmed'
  }): Promise<EmployeeListResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES, { params })
    return response.data
  },
  
  getById: async (id: string): Promise<{ success: boolean; data: Employee }> => {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYEE_BY_ID(id))
    return response.data
  },
  
  create: async (data: CreateEmployeeRequest): Promise<{ success: boolean; data: Employee }> => {
    const response = await apiClient.post(API_ENDPOINTS.EMPLOYEES, data)
    return response.data
  },
  
  update: async (id: string, data: CreateEmployeeRequest): Promise<{ success: boolean; data: Employee }> => {
    const response = await apiClient.put(API_ENDPOINTS.EMPLOYEE_BY_ID(id), data)
    return response.data
  },
  
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(API_ENDPOINTS.EMPLOYEE_BY_ID(id))
    return response.data
  },
  
  confirm: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(API_ENDPOINTS.CONFIRM_EMPLOYEE(id))
    return response.data
  }
}
```

#### `src/services/configService.ts` - Configuration Data

```typescript
import apiClient from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export interface Workplace {
  id: string
  name: string
}

export interface Server {
  id: string
  name: string
  ip?: string
}

export interface Camera {
  id: string
  name: string
  location?: string
}

export const configService = {
  getWorkplaces: async (): Promise<{ success: boolean; data: Workplace[] }> => {
    const response = await apiClient.get(API_ENDPOINTS.WORKPLACES)
    return response.data
  },
  
  getServers: async (): Promise<{ success: boolean; data: Server[] }> => {
    const response = await apiClient.get(API_ENDPOINTS.SERVERS)
    return response.data
  },
  
  getCameras: async (): Promise<{ success: boolean; data: Camera[] }> => {
    const response = await apiClient.get(API_ENDPOINTS.CAMERAS)
    return response.data
  }
}
```

### 3. Cập nhật components để sử dụng API

#### Cập nhật `src/contexts/AuthContext.tsx`

Thay thế mock login bằng `authService.login()` và lưu token vào localStorage.

#### Cập nhật `src/pages/Dashboard.tsx`

- Thay `useState` cho employees bằng API calls:
  - `useEffect` để load danh sách khi component mount
  - `employeeService.getAll({ status: 'pending' })` cho collectionResults
  - `employeeService.getAll({ status: 'confirmed' })` cho employees
- Cập nhật các handler:
  - `handleAdd`: Gọi `employeeService.create()`
  - `handleUpdate`: Gọi `employeeService.update()`
  - `handleDelete`: Gọi `employeeService.delete()`
  - Thêm handler `handleConfirm`: Gọi `employeeService.confirm()`

#### Cập nhật `src/components/EmployeeForm.tsx`

- Load dropdown options từ API:
  - `configService.getWorkplaces()` cho workplace dropdown
  - `configService.getServers()` cho server dropdown
  - `configService.getCameras()` cho camera dropdown

## 📊 Data Models

### Employee

```typescript
interface Employee {
  id: string                    // ID duy nhất của nhân viên (tự động tạo bởi Frontend/Backend)
  
  // 5 ảnh khuôn mặt theo các góc độ khác nhau (required)
  imageFront: string            // Base64 hoặc URL - Ảnh nhìn thẳng
  imageLeft: string             // Base64 hoặc URL - Ảnh nhìn trái 20°
  imageRight: string            // Base64 hoặc URL - Ảnh nhìn phải 20°
  imageUp: string               // Base64 hoặc URL - Ảnh nhìn lên 20°
  imageDown: string             // Base64 hoặc URL - Ảnh nhìn xuống 20°
  
  // Thông tin cá nhân
  fullName: string              // Họ và tên (required)
  gender: string                // Giới tính: "Nam" | "Nữ" (required)
  account: string               // Tên đăng nhập/account (required, unique)
  employeeId: string            // Mã nhân viên (optional)
  department: string            // Phòng ban (optional)
  position: string              // Chức vụ (optional)
  workplace: string             // Phòng làm việc (optional)
  
  // Metadata (optional, do Backend tự động tạo)
  createdAt?: string            // Ngày tạo (ISO 8601 format)
  updatedAt?: string            // Ngày cập nhật (ISO 8601 format)
}
```

**Lưu ý quan trọng:**

- Hệ thống yêu cầu **5 ảnh khuôn mặt** theo các góc độ khác nhau để tăng độ chính xác nhận diện
- Các ảnh có thể là Base64 string hoặc URL (tùy cách Backend xử lý)
- Frontend hiện tại sử dụng Base64 để lưu ảnh trong state

### Request để tạo/cập nhật nhân viên

Khi gửi request tạo mới, không cần gửi `id`:

```typescript
interface CreateEmployeeRequest {
  // 5 ảnh khuôn mặt (required)
  imageFront: string
  imageLeft: string
  imageRight: string
  imageUp: string
  imageDown: string
  
  // Thông tin cá nhân
  fullName: string
  gender: string
  account: string
  employeeId?: string
  department?: string
  position?: string
  workplace?: string
  
  // Metadata hệ thống (optional)
  server?: string              // ID server (nếu cần)
  camera?: string              // ID camera (nếu cần)
}
```

### Authentication

```typescript
interface LoginRequest {
  username: string
  password: string
  remember?: boolean           // Ghi nhớ đăng nhập
}

interface LoginResponse {
  success: boolean
  message?: string             // Thông báo lỗi nếu success = false
  token?: string               // JWT token hoặc session token
  user?: {
    username: string
    // các thông tin user khác nếu cần
  }
}
```

## 🔐 Authentication

### Yêu cầu Authentication Flow

1. **Login**: Gửi username/password để nhận token
2. **Token Storage**: Lưu token vào localStorage hoặc httpOnly cookie
3. **Protected Routes**: Tất cả API calls (trừ login) cần gửi token trong header
4. **Token Refresh**: Xử lý refresh token khi token hết hạn
5. **Logout**: Xóa token và session

### Headers

Tất cả API requests (trừ login) cần gửi token trong header:

`Authorization: Bearer {token}`

hoặc

`Authorization: {token}`

### Account Lockout

Frontend đã implement logic khóa tài khoản sau 5 lần đăng nhập sai trong 5
phút. Backend cần đồng bộ logic này hoặc xử lý ở server side.

## 🌐 API Endpoints

### Base URL

[http://localhost:8000/api]

(Có thể thay đổi qua biến môi trường `VITE_API_BASE_URL`)

### 1. Authentication

#### POST `/auth/login`

Đăng nhập vào hệ thống.

**Request:**

```json
{
  "username": "admin",
  "password": "Gtel@123",
  "remember": true
}
```

**Response Success (200):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin"
  }
}
```

**Response Error (401):**

```json
{
  "success": false,
  "message": "Sai tài khoản/mật khẩu. Còn 4 lần thử trước khi bị khóa."
}
```

**Response Error - Account Locked (423):**

```json
{
  "success": false,
  "message": "Sai quá 5 lần. Tài khoản bị khóa trong 5 phút."
}
```

#### POST `/auth/logout`

Đăng xuất khỏi hệ thống.

**Headers:**

```text
Authorization: Bearer {token}
```

**Response Success (200):**

```json
{
  "success": true
}
```

---

### 2. Employees (CRUD)

#### GET `/employees`

Lấy danh sách tất cả nhân viên.

**Headers:**

```text
Authorization: Bearer {token}
```

**Query Parameters (optional):**

- `page`: số trang (default: 1)
- `limit`: số lượng mỗi trang (default: 50)
- `search`: tìm kiếm theo tên/account
- `department`: lọc theo phòng ban

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "imageFront": "data:image/jpeg;base64,...",
      "imageLeft": "data:image/jpeg;base64,...",
      "imageRight": "data:image/jpeg;base64,...",
      "imageUp": "data:image/jpeg;base64,...",
      "imageDown": "data:image/jpeg;base64,...",
      "fullName": "Nguyễn Văn A",
      "gender": "Nam",
      "account": "nguyenvana",
      "employeeId": "NV001",
      "department": "IT",
      "position": "Developer",
      "workplace": "P301"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 50
}
```

#### GET `/employees/:id`

Lấy thông tin chi tiết một nhân viên.

**Headers:**

```text
Authorization: Bearer {token}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "imageFront": "data:image/jpeg;base64,...",
    "imageLeft": "data:image/jpeg;base64,...",
    "imageRight": "data:image/jpeg;base64,...",
    "imageUp": "data:image/jpeg;base64,...",
    "imageDown": "data:image/jpeg;base64,...",
    "fullName": "Nguyễn Văn A",
    "gender": "Nam",
    "account": "nguyenvana",
    "employeeId": "NV001",
    "department": "IT",
    "position": "Developer",
    "workplace": "P301"
  }
}
```

#### POST `/employees`

Tạo nhân viên mới.

**Headers:**

```text
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**

```json
{
  "imageFront": "data:image/jpeg;base64,...",
  "imageLeft": "data:image/jpeg;base64,...",
  "imageRight": "data:image/jpeg;base64,...",
  "imageUp": "data:image/jpeg;base64,...",
  "imageDown": "data:image/jpeg;base64,...",
  "fullName": "Nguyễn Văn A",
  "gender": "Nam",
  "account": "nguyenvana",
  "employeeId": "NV001",
  "department": "IT",
  "position": "Developer",
  "workplace": "P301",
  "server": "server1",
  "camera": "camera1"
}
```

**Response Success (201):**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "imageFront": "data:image/jpeg;base64,...",
    "imageLeft": "data:image/jpeg;base64,...",
    "imageRight": "data:image/jpeg;base64,...",
    "imageUp": "data:image/jpeg;base64,...",
    "imageDown": "data:image/jpeg;base64,...",
    "fullName": "Nguyễn Văn A",
    "gender": "Nam",
    "account": "nguyenvana",
    "employeeId": "NV001",
    "department": "IT",
    "position": "Developer",
    "workplace": "P301"
  }
}
```

**Response Error (400) - Validation:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "fullName": "Họ và tên là bắt buộc",
    "gender": "Giới tính là bắt buộc",
    "account": "Account đã tồn tại"
  }
}
```

#### PUT `/employees/:id`

Cập nhật thông tin nhân viên.

**Headers:**

```text
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**

```json
{
  "imageFront": "data:image/jpeg;base64,...",
  "imageLeft": "data:image/jpeg;base64,...",
  "imageRight": "data:image/jpeg;base64,...",
  "imageUp": "data:image/jpeg;base64,...",
  "imageDown": "data:image/jpeg;base64,...",
  "fullName": "Nguyễn Văn B",
  "gender": "Nam",
  "account": "nguyenvana",
  "employeeId": "NV001",
  "department": "IT",
  "position": "Senior Developer",
  "workplace": "P301"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "imageFront": "data:image/jpeg;base64,...",
    "imageLeft": "data:image/jpeg;base64,...",
    "imageRight": "data:image/jpeg;base64,...",
    "imageUp": "data:image/jpeg;base64,...",
    "imageDown": "data:image/jpeg;base64,...",
    "fullName": "Nguyễn Văn B",
    "gender": "Nam",
    "account": "nguyenvana",
    "employeeId": "NV001",
    "department": "IT",
    "position": "Senior Developer",
    "workplace": "P301"
  }
}
```

#### DELETE `/employees/:id`

Xóa nhân viên.

**Headers:**

```text
Authorization: Bearer {token}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Đã xóa nhân viên thành công"
}
```

**Response Error (404):**

```json
{
  "success": false,
  "message": "Không tìm thấy nhân viên"
}
```

---

### 3. Configuration Data (Dropdown Options)

#### GET `/config/workplaces`

Lấy danh sách phòng làm việc.

**Headers:**

```text
Authorization: Bearer {token}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    { "id": "P301", "name": "Phòng 301" },
    { "id": "P302", "name": "Phòng 302" },
    { "id": "P303", "name": "Phòng 303" }
  ]
}
```

#### GET `/config/servers`

Lấy danh sách server.

**Headers:**

```text
Authorization: Bearer {token}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    { "id": "server1", "name": "Server 1", "ip": "192.168.1.100" },
    { "id": "server2", "name": "Server 2", "ip": "192.168.1.101" }
  ]
}
```

#### GET `/config/cameras`

Lấy danh sách camera.

**Headers:**

```text
Authorization: Bearer {token}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    { "id": "camera1", "name": "Camera 1", "location": "Cổng chính" },
    { "id": "camera2", "name": "Camera 2", "location": "Cổng phụ" }
  ]
}
```

#### GET `/config/departments` (Optional)

Lấy danh sách phòng ban. Endpoint này là optional, có thể sử dụng nếu muốn dropdown phòng ban được populate từ API thay vì text input.

**Headers:**

```text
Authorization: Bearer {token}
```

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    { "id": "IT", "name": "Công nghệ thông tin" },
    { "id": "HR", "name": "Nhân sự" },
    { "id": "Finance", "name": "Tài chính" },
    { "id": "Marketing", "name": "Marketing" }
  ]
}
```

---

### 5. Image Upload (Optional)

Nếu Backend muốn xử lý upload ảnh riêng thay vì nhận base64:

#### POST `/upload/image`

Upload ảnh chân dung.

**Headers:**

Authorization: Bearer {token}
Content-Type: multipart/form-data

**Request:**

FormData:

- file: {image file}

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "url": "https://your-domain.com/uploads/employee_123.jpg",
    "filename": "employee_123.jpg"
  }
}
```

Sau đó Frontend sẽ sử dụng `url` này thay vì base64 string.

---

## ⚙️ Cấu hình và Biến Môi trường

Tạo file `.env` trong root directory:

```env
# Base URL của Backend API
VITE_API_BASE_URL=http://localhost:8000/api

# Timeout cho API requests (milliseconds)
VITE_API_TIMEOUT=30000
```

Sau đó sử dụng trong code:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
```

**Lưu ý:** Tất cả biến môi trường phải có prefix `VITE_` để Vite có thể expose ra client-side.

---

## 🔧 Lưu ý Kỹ thuật

### CORS

Backend cần cấu hình CORS để cho phép Frontend gọi API:

```javascript
// Example (Express.js)
const allowedOrigins = [
  'http://localhost:5173',  // Vite dev server
  'http://localhost:3000',  // Alternative dev port
  'https://your-production-domain.com'  // Production domain
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

**Lưu ý:** Trong production, chỉ cho phép origin của Frontend production domain.

### Error Handling

Tất cả API responses nên follow format:

**Success:**

```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... }  // Optional: validation errors
}
```

**HTTP Status Codes:**

- `200`: Success
- `201`: Created
- `400`: Bad Request (Validation errors)
- `401`: Unauthorized (Invalid/missing token)
- `403`: Forbidden (No permission)
- `404`: Not Found
- `423`: Locked (Account locked)
- `500`: Internal Server Error

### Image Handling

Frontend hiện tại convert ảnh thành base64 string. Backend có 2 lựa chọn:

#### Option 1: Nhận Base64 (Đơn giản hơn)

Frontend sẽ gửi base64 string trong request body:

```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

Backend cần:

1. Parse base64 string (loại bỏ prefix `data:image/jpeg;base64,`)
2. Decode base64 thành binary
3. Lưu vào file system hoặc cloud storage (AWS S3, Google Cloud Storage, etc.)
4. Trả về URL ảnh trong response

**Example (Node.js/Express):**

```javascript
const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '')
const buffer = Buffer.from(base64Data, 'base64')
const filename = `employee_${Date.now()}.jpg`
// Save to storage...
const imageUrl = `https://your-domain.com/uploads/${filename}`
```

#### Option 2: Nhận File Upload (Hiệu quả hơn)

Tạo endpoint riêng `POST /upload/image` nhận `multipart/form-data`:

**Request:**

- Content-Type: `multipart/form-data`
- Body: FormData với field `file`

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://your-domain.com/uploads/employee_123.jpg",
    "filename": "employee_123.jpg"
  }
}
```

Frontend sẽ:

1. Upload ảnh trước → nhận URL
2. Gửi URL trong request tạo/cập nhật nhân viên

**Lưu ý:**

- Giới hạn kích thước file: < 5MB
- Chỉ chấp nhận định dạng: JPG, PNG
- Validate file type và size ở Backend

### Pagination

Nếu có nhiều nhân viên, Backend nên implement pagination:

**Request:**

```http
GET /employees?page=1&limit=50
```

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

### Token Expiration & Refresh

Backend nên implement:

1. **Token Expiration**:
   - Access token có thời hạn ngắn (ví dụ: 1-24 giờ)
   - Trả về expiration time trong login response:

   ```json
   {
     "success": true,
     "token": "...",
     "expiresIn": 3600,  // seconds
     "refreshToken": "..."  // optional
   }
   ```

2. **Refresh Token Mechanism** (Optional nhưng khuyến nghị):
   - Tạo endpoint `POST /auth/refresh` để refresh access token
   - Refresh token có thời hạn dài hơn (ví dụ: 7-30 ngày)
   - Frontend sẽ tự động refresh token khi gần hết hạn

3. **401 Unauthorized Handling**:
   - Khi token hết hạn hoặc invalid, Backend trả về `401`
   - Frontend sẽ tự động redirect về `/login`
   - Response format:

   ```json
   {
     "success": false,
     "message": "Token đã hết hạn hoặc không hợp lệ"
   }
   ```

### Account Lockout Implementation

Backend cần đồng bộ logic khóa tài khoản:

- Sau 5 lần đăng nhập sai
- Khóa trong 5 phút
- Reset sau khi đăng nhập thành công

---

## 📝 Checklist Tích hợp Backend

### Phase 1: Setup & Authentication

- [ ] Cấu hình CORS cho Frontend origin (`http://localhost:5173` cho dev, production URL cho prod)
- [ ] Implement Authentication endpoints:
  - [ ] `POST /auth/login` - Đăng nhập
  - [ ] `POST /auth/logout` - Đăng xuất
  - [ ] (Optional) `GET /auth/me` - Lấy thông tin user hiện tại
- [ ] Implement token-based authentication (JWT hoặc session token)
- [ ] Implement account lockout logic (5 lần sai trong 5 phút)

### Phase 2: Employee Management

- [ ] Thêm field `status` vào Employee model (`"pending"` | `"confirmed"`)
- [ ] Implement Employee CRUD endpoints:
  - [ ] `GET /employees` - Lấy danh sách (hỗ trợ query `status`, `page`, `limit`, `search`, `department`)
  - [ ] `GET /employees/:id` - Lấy chi tiết nhân viên
  - [ ] `POST /employees` - Tạo nhân viên mới
  - [ ] `PUT /employees/:id` - Cập nhật nhân viên
  - [ ] `DELETE /employees/:id` - Xóa nhân viên
  - [ ] `POST /employees/:id/confirm` - Xác nhận nhân viên (chuyển status từ "pending" sang "confirmed")
- [ ] Validation:
  - [ ] `fullName`, `gender`, `account` là required
  - [ ] `account` phải unique
  - [ ] `gender` chỉ nhận giá trị "Nam" hoặc "Nữ"

### Phase 3: Configuration Data

- [ ] Implement Configuration endpoints:
  - [ ] `GET /config/workplaces` - Danh sách phòng làm việc
  - [ ] `GET /config/servers` - Danh sách server
  - [ ] `GET /config/cameras` - Danh sách camera
  - [ ] (Optional) `GET /config/departments` - Danh sách phòng ban

### Phase 4: Image Handling

- [ ] Quyết định phương án xử lý ảnh:
  - [ ] Option 1: Nhận base64 string trong request body
  - [ ] Option 2: Tạo endpoint upload riêng `POST /upload/image` (multipart/form-data)
- [ ] Nếu dùng base64: Parse và lưu vào storage (file system hoặc cloud storage)
- [ ] Trả về URL ảnh trong response (hoặc giữ nguyên base64 nếu cần)

### Phase 5: Error Handling & Response Format

- [ ] Đảm bảo tất cả responses follow format chuẩn:
  - [ ] Success: `{ "success": true, "data": {...} }`
  - [ ] Error: `{ "success": false, "message": "...", "errors": {...} }`
- [ ] Implement đúng HTTP status codes:
  - [ ] `200` - Success
  - [ ] `201` - Created
  - [ ] `400` - Bad Request (Validation errors)
  - [ ] `401` - Unauthorized (Invalid/missing token)
  - [ ] `403` - Forbidden (No permission)
  - [ ] `404` - Not Found
  - [ ] `423` - Locked (Account locked)
  - [ ] `500` - Internal Server Error

### Phase 6: Testing & Documentation

- [ ] Testing tất cả endpoints với Postman/Thunder Client
- [ ] Test các trường hợp edge cases:
  - [ ] Login sai nhiều lần (account lockout)
  - [ ] Token hết hạn
  - [ ] Validation errors
  - [ ] Duplicate account
- [ ] Cung cấp API documentation (Swagger/OpenAPI nếu có)
- [ ] Cung cấp Postman collection cho Frontend team

### Phase 7: Frontend Integration

- [ ] Frontend team sẽ cập nhật code để gọi API thay vì mock data
- [ ] Test end-to-end integration
- [ ] Fix bugs và optimize performance

---

## 📦 Dependencies

Frontend hiện tại đã cài đặt các dependencies sau:

### Production Dependencies

```json
{
  "axios": "^1.13.2",         // HTTP client để gọi API
  "jszip": "^3.10.1",         // Xử lý file ZIP upload
  "xlsx": "^0.18.5",          // Parse Excel files (.xlsx)
  "react": "^18.2.0",         // React framework
  "react-dom": "^18.2.0",     // React DOM
  "react-router-dom": "^6.20.0"  // Routing
}
```

### Dev Dependencies

```json
{
  "@types/papaparse": "^5.5.0",
  "@types/react": "^18.2.43",
  "@types/react-dom": "^18.2.17",
  "@vitejs/plugin-react": "^4.2.1",
  "typescript": "^5.2.2",
  "vite": "^5.0.8"
}
```

**Tính năng chính sử dụng các dependencies:**

- `axios`: Sẵn sàng cho việc tích hợp với Backend API
- `jszip` + `xlsx`: Hỗ trợ tính năng upload ZIP chứa ảnh + Excel để import hàng loạt nhân viên
- `react-router-dom`: Routing giữa các trang (Login, Dashboard, Settings)

## 🔄 Workflow Tích hợp

1. **Backend hoàn thành Phase 1-3** → Cung cấp API endpoints
2. **Frontend tạo service layer** → Implement các service files
3. **Frontend cập nhật components** → Thay mock data bằng API calls
4. **Testing integration** → Test end-to-end với Backend
5. **Fix bugs & optimize** → Hoàn thiện tích hợp

**Lưu ý quan trọng:**

- Tất cả API responses phải follow format chuẩn đã định nghĩa
- Backend cần thêm field `status` vào Employee model để phân biệt pending/confirmed
- CORS phải được cấu hình đúng để Frontend có thể gọi API
- Token authentication là bắt buộc cho tất cả endpoints (trừ login)

---

**Lưu ý:** README này sẽ được cập nhật khi có thay đổi về API hoặc requirements. Vui lòng kiểm tra phiên bản mới nhất trước khi bắt đầu tích hợp.
#   W E B - N H A N - D I E N - K H U O N - M A T  
 