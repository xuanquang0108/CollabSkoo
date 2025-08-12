'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/lib/supabaseClient";

export type OptionType = {
    id: string | number;
    name: string;
};

function useCategories() {
    const [categories, setCategories] = useState<OptionType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            const { data, error } = await supabase
                .from('categories') // 👈 table name in Supabase
                .select('id, name');

            if (!error && data) setCategories(data);
            setLoading(false);
        }
        fetchCategories();
    }, []);

    return { categories, loading };
}

function useDocumentTypes() {
    const [types, setTypes] = useState<OptionType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTypes() {
            const { data, error } = await supabase
                .from('document_types') // 👈 table name in Supabase
                .select('id, name');

            if (!error && data) setTypes(data);
            setLoading(false);
        }
        fetchTypes();
    }, []);

    return { types, loading };
}

export default function UploadDocument() {
    const { categories } = useCategories();
    const { types } = useDocumentTypes();

    const [file, setFile] = useState<File | null>(null);
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
        const allowed = [
            'pdf', 'doc', 'docx',
            'xls', 'xlsx',
            'ppt', 'pptx', 'jpg',
            'jpeg', 'png',
            'odt', 'ods', 'odp'
        ];
        const maxSize = 6;

        const ext = f.name.split('.').pop()?.toLowerCase();

        if (!allowed.includes(ext!)) {
            toast.error('Loại tệp không hỗ trợ', {
                description: "Vui lòng chọn tệp đúng định dạng cho phép."
            });
            e.target.value = '';
            return;
        }

    if (f.size > maxSize * 1024 * 1024) {
        toast.error("Tệp quá lớn", {
            description: `Dung lượng tối đa là ${maxSize}MB.`
        });
        e.target.value = '';
        return;
    }
    setFile(f);
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
            <section className="justify-center items-center w-full max-w-5xl mx-auto rounded-lg">
                <h2 className="uppercase font-bold text-center text-4xl p-6 text-primary">ĐÓNG GÓP TÀI LIỆU</h2>

                <form className="space-y-5 p-5" onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>

                    {/* Title */}
                    <div>
                        <label className="block text-md font-medium text-black">Tên tài liệu:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border-2 border-gray-300 rounded-md py-2 px-1 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-md font-medium text-black">Ngành học:</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border-2 border-gray-300 rounded-md py-2 px-1 focus:ring-primary focus:border-primary"
                        >
                            <option value="">-- Chọn ngành --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Document type */}
                    <div>
                        <label className="block text-md font-medium text-black">Phân loại tài liệu:</label>
                        <select
                            name="document_type"
                            value={formData.document_type}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border-2 border-gray-300 rounded-md py-2 px-1 focus:ring-primary focus:border-primary"
                        >
                            <option value="">-- Chọn loại tài liệu --</option>
                            {types.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Lecturer */}
                    <div>
                        <label className="block text-md font-medium text-black">Giảng viên (nếu có):</label>
                        <input
                            type="text"
                            name="lecturer"
                            value={formData.lecturer}
                            onChange={handleChange}
                            className="mt-1 block w-full border-2 border-gray-300 rounded-md py-1 px-1 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    {/* Publish year */}
                    <div>
                        <label className="block text-md font-medium text-black">Năm xuất bản (nếu có):</label>
                        <input
                            type="number"
                            name="publish_year"
                            value={formData.publish_year}
                            onChange={handleChange}
                            className="mt-1 block w-full border-2 border-gray-300 rounded-lg py-2 px-1 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    {/* File upload */}
                    <div
                        className="flex flex-col justify-center items-center border-2 border-dashed border-primary
                                    p-4 text-center rounded-md min-h-[200px] space-y-4 hover:bg-primary/5 active:bg-primary/5 transition-all"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const f = e.dataTransfer.files[0];
                            if (f) handleFileChange({ target: { files: e.dataTransfer.files } } as any);
                        }}
                    >
                        <p className="text-gray-600">Kéo và thả file vào đây<br />hoặc bấm để chọn</p>
                        <input className="hidden" id="fileInput" type="file" onChange={handleFileChange} />
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
                        className="w-full bg-primary text-white p-2 rounded-lg hover:bg-blue-600 font-semibold uppercase"
                    >
                        Gửi Tài Liệu
                    </button>
                </form>
            </section>
        </div>
    );
}
