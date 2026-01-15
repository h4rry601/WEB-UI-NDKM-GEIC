# Hướng Dẫn Xây Dựng Backend Từng Bước

## Bước 1: Tạo Cấu Trúc Thư Mục

Trong thư mục gốc `c:\Projects\GEIC_Projects\web-NDKM`, tạo thư mục `server`:

```bash
cd c:\Projects\GEIC_Projects\web-NDKM
mkdir server
cd server
```

## Bước 2: Khởi Tạo Dự Án Node.js

Chạy lệnh sau để tạo `package.json`:

```bash
npm init -y
```

## Bước 3: Cài Đặt Dependencies

### 3.1. Dependencies Chính
```bash
npm install express cors prisma @prisma/client multer dotenv
```

**Giải thích:**
- `express`: Framework web server
- `cors`: Xử lý Cross-Origin Resource Sharing (cho phép Frontend gọi API)
- `prisma` + `@prisma/client`: ORM để làm việc với database
- `multer`: Xử lý upload file
- `dotenv`: Quản lý biến môi trường

### 3.2. DevDependencies (TypeScript)
```bash
npm install --save-dev typescript @types/node @types/express @types/cors @types/multer ts-node nodemon
```

**Giải thích:**
- `typescript`: Compiler TypeScript
- `@types/*`: Type definitions cho các thư viện
- `ts-node`: Chạy TypeScript trực tiếp
- `nodemon`: Auto-restart server khi code thay đổi

## Bước 4: Cấu Hình TypeScript

Tạo file `tsconfig.json` trong thư mục `server`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Bước 5: Cấu Hình Prisma

### 5.1. Khởi tạo Prisma
```bash
npx prisma init --datasource-provider sqlite
```

Lệnh này sẽ tạo:
- Thư mục `prisma/` với file `schema.prisma`
- File `.env` để cấu hình database

### 5.2. Cập Nhật Schema

Mở file `prisma/schema.prisma` và thay thế nội dung bằng:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Employee {
  id         String       @id
  name       String
  image      String?
  createdAt  DateTime     @default(now())
  attendance Attendance[]

  @@map("employees")
}

model Attendance {
  id         Int       @id @default(autoincrement())
  employeeId String
  employee   Employee  @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  timeIn     String?
  timeOut    String?
  date       String
  status     String

  @@map("attendance")
}

model StrangerWarning {
  id             String   @id @default(uuid())
  time           String
  imageUrl       String
  cameraLocation String
  createdAt      DateTime @default(now())

  @@map("stranger_warnings")
}
```

### 5.3. Kiểm tra file `.env`

File `.env` đã được tạo tự động. Đảm bảo nội dung như sau:

```env
DATABASE_URL="file:./dev.db"
```

### 5.4. Tạo Database
```bash
npx prisma migrate dev --name init
```

Lệnh này sẽ:
- Tạo file database SQLite (`dev.db`)
- Tạo thư mục `migrations/` với migration đầu tiên
- Generate Prisma Client

## Bước 6: Tạo Cấu Trúc Source Code

Tạo các thư mục sau trong `server/`:

```bash
mkdir src
mkdir src\controllers
mkdir src\routes
mkdir src\services
mkdir uploads
```

## Bước 7: Tạo File Entry Point

### 7.1. File `src/index.ts`

```typescript
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Import routes
import reportsRouter from './routes/reports';
import employeesRouter from './routes/employees';
import uploadRouter from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Cho phép body lớn (batch import)
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/reports', reportsRouter);
app.use('/employees', employeesRouter);
app.use('/upload', uploadRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
```

## Bước 8: Tạo Routes

### 8.1. File `src/routes/reports.ts`

```typescript
import { Router } from 'express';
import { getAttendance, getStrangers } from '../controllers/reports';

const router = Router();

router.get('/attendance', getAttendance);
router.get('/strangers', getStrangers);

export default router;
```

### 8.2. File `src/routes/employees.ts`

```typescript
import { Router } from 'express';
import { batchImport } from '../controllers/employees';

const router = Router();

router.post('/batch', batchImport);

export default router;
```

### 8.3. File `src/routes/upload.ts`

```typescript
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadImage } from '../controllers/upload';

const router = Router();

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post('/image', upload.single('image'), uploadImage);

export default router;
```

## Bước 9: Tạo Controllers

### 9.1. File `src/controllers/reports.ts`

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Query param "date" (YYYY-MM-DD) is required' 
      });
    }

    const records = await prisma.attendance.findMany({
      where: { date },
      include: { employee: true }
    });

    const data = records.map(record => ({
      employeeId: record.employeeId,
      employeeName: record.employee.name,
      timeIn: record.timeIn || null,
      timeOut: record.timeOut || null,
      date: record.date,
      status: record.status
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getStrangers = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Query param "date" (YYYY-MM-DD) is required' 
      });
    }

    const warnings = await prisma.strangerWarning.findMany({
      where: {
        time: {
          startsWith: date // SQLite string comparison
        }
      }
    });

    const data = warnings.map(w => ({
      id: w.id,
      time: w.time,
      imageUrl: w.imageUrl,
      cameraLocation: w.cameraLocation
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching strangers:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
```

### 9.2. File `src/controllers/employees.ts`

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const batchImport = async (req: Request, res: Response) => {
  try {
    const { employees } = req.body;

    if (!Array.isArray(employees)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Body phải chứa mảng "employees"' 
      });
    }

    const results = [];

    for (const emp of employees) {
      const { employeeId, fullName, imageFront } = emp;

      // Lưu base64 image nếu có
      let imagePath = null;
      if (imageFront && imageFront.startsWith('data:image/')) {
        const base64Data = imageFront.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `${employeeId}_${Date.now()}.jpg`;
        const filepath = path.join('uploads', filename);
        
        fs.writeFileSync(filepath, buffer);
        imagePath = `http://localhost:${process.env.PORT || 3001}/uploads/${filename}`;
      }

      // Upsert employee
      const employee = await prisma.employee.upsert({
        where: { id: employeeId },
        update: {
          name: fullName,
          ...(imagePath && { image: imagePath })
        },
        create: {
          id: employeeId,
          name: fullName,
          image: imagePath
        }
      });

      results.push(employee);
    }

    res.json({ 
      success: true, 
      message: `Đã import ${results.length} nhân viên`,
      data: results 
    });
  } catch (error) {
    console.error('Error batch import:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
```

### 9.3. File `src/controllers/upload.ts`

```typescript
import { Request, Response } from 'express';

export const uploadImage = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    const imageUrl = `http://localhost:${process.env.PORT || 3001}/uploads/${req.file.filename}`;

    res.json({ 
      success: true, 
      imageUrl 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
```

## Bước 10: Cập Nhật package.json Scripts

Mở file `server/package.json` và thêm scripts:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## Bước 11: Chạy Backend

```bash
npm run dev
```

Server sẽ khởi động tại `http://localhost:3001`

## Bước 12: Test API

### 12.1. Test Health Check
Mở trình duyệt: `http://localhost:3001`

Kết quả mong đợi:
```json
{ "message": "Backend API is running!" }
```

### 12.2. Test Upload Image (dùng Postman hoặc curl)

**Postman:**
- Method: `POST`
- URL: `http://localhost:3001/upload/image`
- Body: `form-data`
  - Key: `image` (type: File)
  - Value: Chọn một file ảnh

**Curl:**
```bash
curl -X POST http://localhost:3001/upload/image -F "image=@C:\path\to\image.jpg"
```

### 12.3. Test Batch Import

**Postman:**
- Method: `POST`
- URL: `http://localhost:3001/employees/batch`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "employees": [
    {
      "employeeId": "NV001",
      "fullName": "Nguyễn Văn A",
      "imageFront": "data:image/jpeg;base64,/9j/4AAQ..."
    }
  ]
}
```

### 12.4. Test Get Attendance

```
GET http://localhost:3001/reports/attendance?date=2023-10-27
```

### 12.5. Test Get Strangers

```
GET http://localhost:3001/reports/strangers?date=2023-10-27
```

## Bước 13: Tạo Dữ Liệu Mẫu (Tùy Chọn)

Tạo file `server/seed.ts` để insert dữ liệu test:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Tạo employee mẫu
  await prisma.employee.create({
    data: {
      id: 'NV001',
      name: 'Nguyễn Văn A',
      image: null
    }
  });

  // Tạo attendance mẫu
  await prisma.attendance.create({
    data: {
      employeeId: 'NV001',
      timeIn: '07:55:00',
      timeOut: '17:30:00',
      date: '2023-10-27',
      status: 'present'
    }
  });

  // Tạo stranger warning mẫu
  await prisma.strangerWarning.create({
    data: {
      time: '2023-10-27 10:15:30',
      imageUrl: 'http://localhost:3001/uploads/sample.jpg',
      cameraLocation: 'Cổng chính - Cam 01'
    }
  });

  console.log('✅ Seed data created!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Chạy:
```bash
npx ts-node seed.ts
```

## Bước 14: Kết Nối Frontend

Trong frontend, cập nhật file config API để trỏ đến backend:

```typescript
// src/config/api.ts (tạo mới nếu chưa có)
export const API_BASE_URL = 'http://localhost:3001';
```

Sử dụng trong component:
```typescript
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Example: Get attendance
const response = await axios.get(`${API_BASE_URL}/reports/attendance?date=2023-10-27`);
```

## Lưu Ý Quan Trọng

> [!WARNING]
> **CORS**: Nếu Frontend chạy trên port khác (vd: 5173), CORS đã được enable trong code.

> [!TIP]
> **Database GUI**: Cài đặt Prisma Studio để xem database:
> ```bash
> npx prisma studio
> ```
> Mở tại `http://localhost:5555`

> [!IMPORTANT]
> **Production**: Khi deploy:
> - Chuyển SQLite sang PostgreSQL
> - Cập nhật `imageUrl` return full domain thay vì `localhost`
> - Thêm authentication/authorization
> - Rate limiting
> - Input validation

## Checklist Hoàn Thành

- [ ] Tạo thư mục `server/`
- [ ] Chạy `npm init -y`
- [ ] Cài đặt dependencies
- [ ] Cấu hình TypeScript (`tsconfig.json`)
- [ ] Khởi tạo Prisma và tạo schema
- [ ] Chạy migration (`npx prisma migrate dev`)
- [ ] Tạo cấu trúc thư mục src
- [ ] Tạo file `src/index.ts`
- [ ] Tạo routes (reports, employees, upload)
- [ ] Tạo controllers (reports, employees, upload)
- [ ] Cập nhật `package.json` scripts
- [ ] Chạy `npm run dev`
- [ ] Test các API endpoint
- [ ] (Tùy chọn) Seed dữ liệu mẫu

---

**Hoàn thành! Backend đã sẵn sàng để Frontend tích hợp.**
