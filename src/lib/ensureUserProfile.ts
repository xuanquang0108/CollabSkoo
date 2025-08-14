import { SupabaseClient } from '@supabase/supabase-js'

export async function ensureUserProfile(supabase:any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

    if (!existing) {
        await supabase.from("users").insert({
            id: user.id,
            email: user.email,
            created_at: new Date()
        });
    }
}

