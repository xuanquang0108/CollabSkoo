// src/lib/categories.ts
import { query } from './db';

export interface Category {
  id: string;
  name: string;
}

export async function getCategories() {
  try {
    // Thực hiện truy vấn SQL
    const categories = await query(
      'SELECT id, name FROM categories',
      []
    ) as Category[];

    return categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
}