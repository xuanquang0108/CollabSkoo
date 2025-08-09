'use client';

import { useState } from 'react';
import  { toast } from 'sonner';

export default function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    document_type: '',
    lecturer: '',
    publish_year: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'csv', 'odt', 'ods', 'odp'];
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(ext!)) {
      setMessage('Loại tệp không hỗ trợ.');
      return;
    }
    setFile(f);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Vui lòng chọn tệp.');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: data });
    const json = await res.json();

    if (res.ok) {
      toast.success('Tải lên thành công!');
      setFile(null);
      setFormData({
        title: '',
        category: '',
        document_type: '',
        lecturer: '',
        publish_year: '',
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error(json.error || 'Tải lên thất bại.');
    }
  };

  return (
    <div className="flex justify-center p-5">
      <section className="max-w-12xl p-5 rounded-lg">
        <h2 className="uppercase font-bold text-center text-2xl p-6">ĐÓNG GÓP TÀI LIỆU</h2>

        <form className="space-y-5 p-5" onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
          <div>
            <label className="block text-md font-medium text-black">Tên tài liệu:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-2 border-gray-300 rounded-md py-1"
            />
          </div>

          <div>
            <label className="block text-md font-medium text-black">Ngành học:</label>
            <select
              name="category"
              onChange={handleChange}
              className="mt-1 block w-full border-2 border-gray-300 rounded-md py-1"
            >
              <option value="">Chọn ngành</option>
              <option value="1">Công nghệ thông tin</option>
              <option value="2">Kinh tế</option>
            </select>
          </div>

          <div>
            <label className="block text-md font-medium text-black">Phân loại tài liệu:</label>
            <select
              name="document_type"
              value={formData.document_type}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-2 border-gray-300 rounded-md py-1"
            >
              <option value="">Chọn loại</option>
              <option value="1">Giáo trình</option>
              <option value="2">Bài giảng</option>
              <option value="3">Ôn thi</option>
            </select>
          </div>

          <div>
            <label className="block text-md font-medium text-black">Giảng viên (nếu có):</label>
            <input
              type="text"
              name="lecturer"
              value={formData.lecturer}
              onChange={handleChange}
              className="mt-1 block w-full border-2 border-gray-300 rounded-md py-1"
            />
          </div>

          <div>
            <label className="block text-md font-medium text-black">Năm xuất bản (nếu có):</label>
            <input
              type="number"
              name="publish_year"
              value={formData.publish_year}
              onChange={handleChange}
              className="mt-1 block w-full border-2 border-gray-300 rounded-lg py-1"
            />
          </div>

          <div
            className="flex flex-col justify-center items-center border-2 border-dashed border-primary
            p-4 text-center rounded-md min-h-[200px] transition-colors
            space-y-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) handleFileChange({ target: { files: e.dataTransfer.files } } as any);
            }}
          >
            <p className="text-gray-600">Kéo và thả file vào đây<br />hoặc bấm để chọn</p>
            <input
              className="hidden"
              id="fileInput"
              type="file"
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileInput"
              className="inline-block bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600"
            >
              Chọn file
            </label>
            <div className="text-gray-600 text-sm mt-2">Chấp nhận: PDF, Word, Excel, PowerPoint, ảnh JPG/PNG</div>
            {file && <div className="text-primary mt-2">Đã chọn: <strong>{file.name}</strong></div>}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded-lg hover:bg-blue-600 cursor-pointer font-semibold
            uppercase transition-colors"
          >
            Gửi Tài Liệu
          </button>
        </form>
      </section>
    </div>
  );
}