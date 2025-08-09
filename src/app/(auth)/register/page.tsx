"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showConfirmPage, setShowConfirmPage] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
            },
        });

        setLoading(false);

        if (error) {
            setMessage(error.message);
        } else {
            setShowConfirmPage(true);
        }
    };

    const handleResend = async () => {
        if (!email) return;
        const { error } = await supabase.auth.resend({
            type: "signup",
            email,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
            },
        });
        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Đã gửi lại email xác nhận!");
        }
    };

    if (showConfirmPage) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
                <h1 className="text-xl font-semibold mb-4">
                    Hãy kiểm tra email để xác nhận tài khoản
                </h1>
                <p className="mb-4">Chúng tôi đã gửi email xác nhận tới:</p>
                <p className="font-medium">{email}</p>
                {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
                <button
                    onClick={handleResend}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Gửi lại email xác nhận
                </button>
                <button
                    onClick={() => router.push("/login")}
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Quay lại đăng nhập
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <form
                onSubmit={handleRegister}
                className="w-full max-w-sm p-6 bg-white rounded shadow-md"
            >
                <h2 className="text-xl font-semibold mb-4">Đăng ký</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-4 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-full p-2 mb-4 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {message && <p className="text-sm text-red-500 mb-2">{message}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
            </form>
        </div>
    );
}
