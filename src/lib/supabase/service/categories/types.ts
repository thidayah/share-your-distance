// src/lib/supabase/services/categories/types.ts
export interface CategoryCreate {
  name: string;
  description: string;
  price: number;
  distance: string;
  image_url?: string;
  recommended?: boolean;
  min_age?: number;
  max_age?: number;
  health_warning?: string;
}

export interface CategoryUpdate extends Partial<CategoryCreate> {
  id: string;
}