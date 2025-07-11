'use client';

import { useState } from 'react';
import '@/styles/upload.css';

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
      setMessage('Vui lòng chọn tệp.');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: data });
    const json = await res.json();

    if (res.ok) {
      setMessage('Tải lên thành công!');
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
      setMessage(json.error || 'Tải lên thất bại.');
    }
  };

  return (
    <div className="upload-wrapper">
      <section className="upload-section">
        <h2>Đóng Góp Tài Liệu</h2>

        {message && (
          <ul className="flash-messages">
            <li>{message}</li>
          </ul>
        )}

        <form className="upload-form" onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
          <label>Tên tài liệu:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />

          <label>Ngành học:</label>
          <select name="category" onChange={handleChange}>
            <option value="">Chọn ngành</option>
            <option value="1">Công nghệ thông tin</option>
            <option value="2">Kinh tế</option>
          </select>

          <label>Phân loại tài liệu:</label>
          <select name="document_type" value={formData.document_type} onChange={handleChange} required>
            <option value="">Chọn loại</option>
            <option value="1">Giáo trình</option>
            <option value="2">Bài giảng</option>
            <option value="3">Ôn thi</option>
          </select>

          <label>Giảng viên (nếu có):</label>
          <input type="text" name="lecturer" value={formData.lecturer} onChange={handleChange} />

          <label>Năm xuất bản (nếu có):</label>
          <input type="number" name="publish_year" value={formData.publish_year} onChange={handleChange} />

          <section className="upload-box">
            <p>Kéo và thả file vào đây<br />hoặc bấm để chọn</p>
            <input className="input_upload" id="fileInput" type="file" onChange={handleFileChange} />
            <label htmlFor="fileInput" className="upload-label">Chọn file</label>
            <div className="upload-hint">Chấp nhận: PDF, Word, Excel, PowerPoint, ảnh JPG/PNG</div>
            {file && <div className="file-preview">Đã chọn: <strong>{file.name}</strong></div>}
          </section>

          <button type="submit" className="submit-btn">Gửi Tài Liệu</button>
        </form>
      </section>
    </div>
  );
}
