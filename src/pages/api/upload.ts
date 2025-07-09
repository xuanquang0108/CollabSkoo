import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';

export const config = {
  api: { bodyParser: false },
};

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), 'public/uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
  }),
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => result instanceof Error ? reject(result) : resolve(result));
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await runMiddleware(req, res, upload.single('file'));
    const file = (req as any).file;
    if (!file) return res.status(400).json({ error: 'Không có file nào được tải lên.' });
    return res.status(200).json({ fileUrl: `/uploads/${file.filename}` });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
