import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Tắt xử lý body-parse mặc định để upload file
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const file = req.body.file;

    try {
      const filePath = path.join(process.cwd(), 'public/uploads', file.originalname);

      // Save file vào server (giả sử chỉ lưu đơn giản vào thư mục)
      await fs.writeFile(filePath, file.buffer);
      return res.status(200).json({ fileUrl: `/uploads/${file.originalname}` });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi khi lưu tệp' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};