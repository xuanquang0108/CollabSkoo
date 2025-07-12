import { supabase } from './supabaseClient'

export interface Category {
  id: string;
  name: string;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

    console.log('✅ Supabase data:', data?.length, 'mục');

  if (error) {
    console.error('Lỗi lấy categories từ Supabase:', error.message)
    return []
  }

  return data ?? [];
}