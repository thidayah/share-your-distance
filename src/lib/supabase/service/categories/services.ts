// src/lib/supabase/services/categories/service.ts
import { supabase } from "../../client";
import { categoryQueries } from './queries';
import { CategoryCreate, CategoryUpdate } from './types';

export const categoryService = {
  // READ operations
  async getAll() {
    const { data, error } = await categoryQueries.getAll();
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await categoryQueries.getById(id);
    if (error) throw error;
    return data;
  },

  // async getById(id: string) {
  //   try {
  //     const { data, error } = await categoryQueries.getById(id);

  //     if (error) {
  //       // Return null instead of throwing untuk "not found" errors
  //       if (error.code === 'PGRST116') { // No rows returned
  //         return null;
  //       }
  //       // Throw untuk other errors (connection, auth, etc)
  //       throw error;
  //     }
      
  //     return data;
  //   } catch (error) {
  //     console.error('Error in categoryService.getById:', error);
  //     // Return null untuk semua error cases di level service
  //     return null;
  //   }
  // },

  // CREATE operation
  async create(category: CategoryCreate, features: string[]) {
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (categoryError) throw categoryError;

    // Insert features
    const featureInserts = features.map((feature, index) => ({
      category_id: categoryData.id,
      feature,
      display_order: index + 1,
    }));

    const { error: featuresError } = await supabase
      .from('category_features')
      .insert(featureInserts);

    if (featuresError) throw featuresError;

    return this.getById(categoryData.id);
  },

  // UPDATE operation
  async update(id: string, updates: Partial<CategoryUpdate>) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // DELETE operation
  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};