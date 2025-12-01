// src/lib/supabase/services/categories/service.ts
import { supabase } from "../../client";
import { supabaseServer } from "../../server-client";
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

  // UPDATE operation with features
  async update(id: string, updates: Partial<CategoryUpdate>, features: string[]) {
    const { data, error } = await supabaseServer
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    // Delete existing features
    await supabaseServer
      .from('category_features')
      .delete()
      .eq('category_id', id);

    // Insert new features
    const featureInserts = features.map((feature, index) => ({
      category_id: id,
      feature,
      display_order: index + 1,
    }));

    const { error: featuresError } = await supabaseServer
      .from('category_features')
      .insert(featureInserts);

    if (featuresError) throw featuresError;

    return this.getById(id);
    // return data;
  },

  // DELETE operation
  async delete(id: string) {
    const { error } = await supabaseServer
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};