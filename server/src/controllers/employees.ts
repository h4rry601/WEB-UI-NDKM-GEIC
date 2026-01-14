import 'dotenv/config';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import type { Employee as EmployeeModel } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

type BatchEmployee = {
  employeeId: string;
  fullName: string;
  imageFront?: string;
};

export const batchImport = async (req: Request, res: Response) => {
  try {
    const { employees } = req.body as { employees?: BatchEmployee[] };

    if (!Array.isArray(employees)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Body phải chứa mảng "employees"' 
      });
    }

    const results: EmployeeModel[] = [];
    const uploadsDir = path.resolve('uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    for (const emp of employees) {
      const { employeeId, fullName, imageFront } = emp;

      // Lưu base64 image nếu có
      let imagePath = null;
      if (imageFront && imageFront.startsWith('data:image/')) {
        const base64Data = imageFront.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `${employeeId}_${Date.now()}.jpg`;
        const filepath = path.join(uploadsDir, filename);
        
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
