// src/lib/supabase/service/categories/queries.ts
import { supabase } from "../../client";

export const categoryQueries = {
  getAll: () =>
    supabase
      .from('categories')
      .select(`
        *,
        category_features (
          feature,
          display_order
        )
      `)
      .order('display_order'),

  getActive: () =>
    supabase
      .from('categories')
      .select(`
        *,
        category_features (
          feature,
          display_order
        )
      `)
      .eq('is_active', true)
      .order('display_order'),

  getById: (id: string) =>
    supabase
      .from('categories')
      .select(`
        *,
        category_features (
          feature,
          display_order
        )
      `)
      .eq('id', id)
      .single(),

};