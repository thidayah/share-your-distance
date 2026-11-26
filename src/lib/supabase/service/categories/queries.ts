// src/lib/supabase/service/categories/queries.ts
import { supabase } from "../../client";

export const categoryQueries = {
  getActive: () =>
    supabase
      .from('syd_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order'),
};