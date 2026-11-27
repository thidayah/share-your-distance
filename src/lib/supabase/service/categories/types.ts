// src/lib/supabase/services/categories/types.ts
export interface CategoryCreate {
  name: string;
  description: string;
  price: number;
  distance: string;
  image_url?: string;
  recommended?: boolean;
  is_active?: boolean;
  max_participants?: number | null;
  display_order?: number;
}

export type CategoryUpdate = Partial<CategoryCreate>;