import 'dotenv/config';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import type { Attendance, Employee, StrangerWarning } from '@prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Query param "date" (YYYY-MM-DD) is required' 
      });
    }

    const records: (Attendance & { employee: Employee })[] = await prisma.attendance.findMany({
      where: { date },
      include: { employee: true }
    });

    const data = records.map((record) => ({
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

    const warnings: StrangerWarning[] = await prisma.strangerWarning.findMany({
      where: {
        time: {
          startsWith: date // SQLite string comparison
        }
      }
    });

    const data = warnings.map((w) => ({
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
