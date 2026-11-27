// src/lib/supabase/services/categories/service.ts
import { supabaseServer } from "../../server-client";
import { categoryQueries } from './queries';
import { CategoryCreate, CategoryUpdate } from './types';

export const categoryService = {
  // READ operations
  async getAll() {
    const { data, error } = await supabaseServer
      .from('syd_categories')
      .select('*')
      .order('display_order');
    if (error) throw error;
    return data;
  },

  async getActive() {
    const { data, error } = await categoryQueries.getActive();
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabaseServer
      .from('syd_categories')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // CREATE operation
  async create(category: CategoryCreate, features: string[]) {
    const { data: categoryData, error: categoryError } = await supabaseServer
      .from('syd_categories')
      .insert({
        ...category,
        max_participants: category.max_participants || null,
        features,
      })
      .select()
      .single();

    if (categoryError) throw categoryError;

    return this.getById(categoryData.id);
  },

  // UPDATE operation with features
  async update(id: string, updates: Partial<CategoryUpdate>, features: string[]) {
    const updateData = {
      ...updates,
      ...(updates.max_participants !== undefined
        ? { max_participants: updates.max_participants || null }
        : {}),
      features,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabaseServer
      .from('syd_categories')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    return this.getById(id);
  },

  // DELETE operation
  async delete(id: string) {
    const { error } = await supabaseServer
      .from('syd_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};