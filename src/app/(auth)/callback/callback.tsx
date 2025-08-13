'use client'

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams?.get("code");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleAuth = async () => {
            if (!code) {
                toast.error("Không tìm thấy mã xác thực.");
                router.replace("/login");
                return;
            }

            const { data, error } = await supabase.auth.exchangeCodeForSession(code);

            if (error || !data.session) {
                toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
                router.replace("/login");
            } else {
                toast.success("Đăng nhập thành công!");
                router.replace("/");
            }
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
