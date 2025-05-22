import { useState } from 'react';

export default function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Upload tài liệu
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Vui lòng chọn một tệp tài liệu để upload.');
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Tải tệp lên thành công: ${data.fileUrl}`);
      } else {
        setMessage(`Lỗi khi upload: ${data.error}`);
      }
    } catch (error) {
      setMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold mb-4">Tải lên Tài liệu</h1>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="border p-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        disabled={isUploading}
      >
        {isUploading ? 'Đang tải lên...' : 'Tải lên'}
      </button>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}