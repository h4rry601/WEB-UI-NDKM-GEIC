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