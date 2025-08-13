import type { SupabaseClient } from "@supabase/supabase-js";

export async function ensureUserProfile(supabase: SupabaseClient) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return;

    // Check if already exists
    const { data: existing } = await supabase
        .from("users")
        .select("auth_id")
        .eq("auth_id", user.id)
        .maybeSingle();

    if (!existing) {
        const { error: insertError } = await supabase.from("users").insert([{
            auth_id: user.id,
            username: user.user_metadata?.username || user.email.split("@")[0],
            documents: 0,
            rank: "Newbie",
            points: 0,
        }]);

        if (insertError) {
            console.error("Insert user profile error:", insertError);
        }
    }
}
