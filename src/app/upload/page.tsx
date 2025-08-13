'use client';

import { useEffect, useState, useRef } from 'react';
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
            const { data, error } = await supabase.from('categories').select('id, name');
            if (!error && data) setCategories(data as OptionType[]);
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
            const { data, error } = await supabase.from('document_types').select('id, name');
            if (!error && data) setTypes(data as OptionType[]);
            setLoading(false);
        }
        fetchTypes();
    }, []);

    return { types, loading };
}

function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B','KB','MB','GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

    // upload progress & state
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadStatus, setUploadStatus] = useState<'Chờ tải lên'|'Đang tải'|'Hoàn tất'|'Lỗi'>('Chờ tải lên');
    const [uploadedMeta, setUploadedMeta] = useState<{name: string; size: number} | null>(null);
    const xhrRef = useRef<XMLHttpRequest | null>(null);

    const allowed = [
        'pdf','doc','docx','xls','xlsx','ppt','pptx','jpg','jpeg','png','odt','ods','odp'
    ];
    const maxSizeMB = 6;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateFile = (f: File) => {
        const ext = f.name.split('.').pop()?.toLowerCase() || '';
        if (!allowed.includes(ext)) {
            toast.error('Loại tệp không hỗ trợ', { description: "Vui lòng chọn tệp đúng định dạng cho phép." });
            return false;
        }
        if (f.size > maxSizeMB * 1024 * 1024) {
            toast.error('Tệp quá lớn', { description: `Dung lượng tối đa là ${maxSizeMB}MB.` });
            return false;
        }
        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (!validateFile(f)) {
            e.target.value = '';
            return;
        }
        setFile(f);
        setUploadedMeta(null);
        setUploadProgress(0);
        setUploadStatus('Chờ tải lên');
    };

    // handle drag & drop
    const onDropFiles = (files: FileList | null) => {
        const f = files?.[0];
        if (!f) return;
        if (!validateFile(f)) return;
        setFile(f);
        setUploadedMeta(null);
        setUploadProgress(0);
        setUploadStatus('Chờ tải lên');
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Vui lòng chọn tệp.');
            return;
        }

        setUploadStatus('Đang tải');
        setUploadProgress(0);

        const form = new FormData();
        Object.entries(formData).forEach(([k, v]) => form.append(k, v));
        form.append('file', file);

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        xhr.open('POST', '/api/upload', true);

        xhr.upload.onprogress = (e: ProgressEvent<EventTarget>) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                setUploadProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                setUploadProgress(100);
                setUploadStatus('Hoàn tất');
                setUploadedMeta({ name: file.name, size: file.size });
                toast.success('Tải lên thành công!');
                // reset form if you want immediately:
                setFile(null);
                setFormData({
                    title: '',
                    category: '',
                    document_type: '',
                    lecturer: '',
                    publish_year: '',
                });
            } else {
                setUploadStatus('Lỗi');
                toast.error('Tải lên thất bại.', { description: xhr.responseText || undefined });
            }
        };

        xhr.onerror = () => {
            setUploadStatus('Lỗi');
            toast.error('Lỗi khi tải lên.');
        };

        xhr.send(form);
    };

    const cancelUpload = () => {
        if (xhrRef.current) {
            xhrRef.current.abort();
            setUploadStatus('Chờ tải lên');
            setUploadProgress(0);
            toast('Đã hủy tải lên.');
        }
    };

    return (
        <div className="flex justify-center p-5">
            <section className="w-full max-w-6xl mx-auto rounded-lg">
                <h2 className="uppercase font-bold text-center text-3xl md:text-4xl p-6 text-primary">ĐÓNG GÓP TÀI LIỆU</h2>

                {/* grid: 1 col mobile, 2 cols md+ */}
                <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5"
                    onSubmit={(e) => { e.preventDefault(); handleUpload(); }}
                >
                    {/* LEFT: upload area */}
                    <div
                        className="flex flex-col justify-center items-stretch border-2 border-dashed border-primary
                       p-4 rounded-md min-h-[240px] bg-white hover:bg-primary/5 transition-all"
                        onDragOver={(e) => { e.preventDefault(); }}
                        onDrop={(e) => {
                            e.preventDefault();
                            onDropFiles(e.dataTransfer.files);
                        }}
                    >
                        <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
                            <div className="mb-3">
                                {/* cloud icon */}
                                <svg className="w-12 h-12 mx-auto text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 18a4 4 0 010-8 5.5 5.5 0 0110 2.5A4.5 4.5 0 0119.5 18H7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p className="text-gray-600">Kéo & thả file vào đây<br/>hoặc bấm nút để chọn</p>

                            <input id="fileInput" className="hidden" type="file" onChange={handleFileChange} />
                            <label htmlFor="fileInput" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600">
                                Chọn file
                            </label>

                            <div className="text-gray-500 text-sm mt-3">
                                Chấp nhận: PDF, Word, Excel, PowerPoint, JPG/PNG • Tối đa {maxSizeMB}MB
                            </div>

                            {file && (
                                <div className="mt-4 w-full text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 flex items-center justify-center rounded-md bg-primary text-white text-sm font-medium">
                                            {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm truncate">{file.name}</div>
                                            <div className="text-xs text-gray-500">{formatBytes(file.size)}</div>
                                        </div>
                                        <div>
                                            {uploadStatus === 'Đang tải' ? (
                                                <button type="button" onClick={cancelUpload} className="text-sm text-red-500 underline">Hủy</button>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: info inputs */}
                    <div className="flex flex-col gap-4">
                        {/* Title */}
                        <div>
                            <label className="block text-md font-medium text-black">Tên tài liệu:</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-1 border-gray-300 rounded-md py-2 px-2 focus:ring-primary focus:border-primary"
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
                                className="mt-1 block w-full border-1 border-gray-300 rounded-md py-2 px-2 focus:ring-primary focus:border-primary"
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
                                className="mt-1 block w-full border-1 border-gray-300 rounded-md py-2 px-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">-- Chọn loại tài liệu --</option>
                                {types.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-md font-medium text-black">Giảng viên (nếu có):</label>
                            <input
                                type="text"
                                name="lecturer"
                                value={formData.lecturer}
                                onChange={handleChange}
                                className="mt-1 block w-full border-1 border-gray-300 rounded-md py-2 px-2 focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-md font-medium text-black">Năm xuất bản (nếu có):</label>
                            <input
                                type="number"
                                name="publish_year"
                                value={formData.publish_year}
                                onChange={handleChange}
                                className="mt-1 block w-full border-1 border-gray-300 rounded-md py-2 px-2 focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div className="mt-auto">
                            <button
                                type="submit"
                                className="w-full bg-primary text-white p-3 rounded-lg hover:bg-blue-600 font-semibold uppercase"
                                disabled={uploadStatus === 'Đang tải'}
                            >
                                {uploadStatus === 'Đang tải' ? 'Đang tải lên...' : 'Đóng góp Tài Liệu'}
                            </button>
                        </div>
                    </div>

                    {/* BELOW: progress area spanning full width */}
                    <div className="md:col-span-2 mt-2 space-y-3">
                        <div className="bg-white p-3 rounded-md border">
                            <div className="flex items-center justify-between">
                                <div className="font-medium">Trạng thái tải lên</div>
                            </div>

                            <div className="mt-3">
                                {/* progress bar */}


                                {/* file list card */}
                                <div className="mt-3 space-y-2">
                                    {uploadedMeta ? (
                                        <div className="flex items-center gap-3 p-2 border rounded">
                                            <div className="w-10 h-10 flex items-center justify-center rounded text-sm bg-primary text-white p-2">
                                                {uploadedMeta.name.split('.').pop()?.toUpperCase() || 'FILE'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium break-word text-sm md:text-md">{uploadedMeta.name}</div>
                                                <div className="text-xs text-gray-500">{formatBytes(uploadedMeta.size)}</div>
                                            </div>
                                            <div className="text-sm text-green-600 font-medium">Hoàn tất</div>
                                        </div>
                                    ) : file ? (
                                        <div className="flex items-center gap-3 p-2 border rounded">
                                            <div className="w-10 h-10 flex items-center justify-center rounded text-sm bg-primary text-white p-2">
                                                {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium truncate">{file.name}</div>
                                                <div className="text-xs text-gray-500">{formatBytes(file.size)}</div>
                                                <div className="text-xs text-gray-500 mt-1">Tiến độ: {uploadProgress}%</div>
                                            </div>
                                            <div className="text-sm">
                                                {uploadStatus === 'Đang tải' && <span className="text-primary font-medium">Đang tải</span>}
                                                {uploadStatus === 'Chờ tải lên' && <span className="text-gray-500">Sẵn sàng</span>}
                                                {uploadStatus === 'Lỗi' && <span className="text-red-600">Lỗi</span>}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">Chưa có tệp nào được chọn.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
}
