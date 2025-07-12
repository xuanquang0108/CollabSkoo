import { supabase } from './supabaseClient';

export interface DocumentType {
  id: number;
  name: string;
}

export async function getDocumentTypes(): Promise<DocumentType[]> {
  const { data, error } = await supabase
    .from('document_types')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Lỗi Supabase:', error.message);
    return [];
  }

  return data as DocumentType[];
}
