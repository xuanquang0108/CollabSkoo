'use client'

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { ensureUserProfile } from "@/lib/ensureUserProfile";

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams?.get("code");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleAuth = async () => {
            let session = null;

            // Trường hợp OAuth / PKCE
            if (code) {
                const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) {
                    toast.error("Đăng nhập thất bại.");
                    router.replace("/login");
                    return;
                }
                session = data.session;
            } else {
                // Trường hợp xác nhận email (magic link / confirm email)
                const { data, error } = await supabase.auth.getSession();
                if (error || !data.session) {
                    toast.error("Liên kết đã hết hạn hoặc không hợp lệ.");
                    router.replace("/login");
                    return;
                }
                session = data.session;
            }

            // ✅ Chờ session sẵn sàng
            await new Promise(r => setTimeout(r, 200));

            // ✅ Tạo user profile
            await ensureUserProfile(supabase);

            toast.success("Đăng nhập thành công!");
            router.replace("/");
            setLoading(false);
        };

        handleAuth();
    }, [code, router]);

    return (
        <p className="text-center mt-8">
            {loading ? "Đang xác thực, vui lòng chờ..." : ""}
        </p>
    );
}
