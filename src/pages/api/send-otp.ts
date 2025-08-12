import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
);

// Public client to send recovery email
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Phương thức không được hỗ trợ" });
    }

    const { email } = req.body as { email?: string };
    if (!email) {
        return res.status(400).json({ error: "Vui lòng nhập email" });
    }

    const normalized = email.trim().toLowerCase();

    try {
        // 1. Check if user exists
        const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        if (error) {
            return res.status(500).json({ error: "Không thể kiểm tra email" });
        }

        const user = data.users.find((u) => u.email?.toLowerCase() === normalized);
        if (!user) {
            return res.status(404).json({ error: "Email này chưa được đăng ký" });
        }

        // 2. Trigger Supabase's built-in recovery email
        const { error: sendErr } = await supabase.auth.resetPasswordForEmail(normalized, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        });

        if (sendErr) {
            return res.status(500).json({ error: "Không thể gửi mã OTP" });
        }

        return res.status(200).json({
            success: true,
            message: "Mã OTP đã được gửi đến email của bạn",
        });
    } catch {
        return res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại sau" });
    }
}
