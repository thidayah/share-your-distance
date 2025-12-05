import { supabaseServer } from "../../server-client";
import { contactMessagesQueries } from './queries';
import { ContactMessagesCreate, ContactMessagesUpdate } from './types';

export const contactMessagesService = {
  // READ operations
  async getAll() {
    const { data, error } = await contactMessagesQueries.getAll();
    if (error) throw error;
    return data;
  },

  async getAllPagination(filters: {page?: number, limit?: number } = {}) {
      const { page = 1, limit = 10 } = filters;
  
      // Query untuk count
      let countQuery = supabaseServer
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });
  
      // Query untuk data dengan join
      let dataQuery = supabaseServer
        .from('contact_messages')
        .select(`*`)
        .order('created_at', { ascending: false });
  
      // Get count
      const { count, error: countError } = await countQuery;
      if (countError) throw countError;
  
      // Apply pagination untuk data query
      const from = (page - 1) * limit;
      const to = from + limit - 1;
  
      const { data, error: dataError } = await dataQuery.range(from, to);
      if (dataError) throw dataError;
  
      return {
        items: data as ContactMessagesCreate[],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    },

  async getById(id: string) {
    const { data, error } = await contactMessagesQueries.getById(id);
    if (error) throw error;
    return data;
  },

  // CREATE operation
  async create(data: ContactMessagesCreate) {
    const { data: resData, error: resError } = await supabaseServer
      .from('contact_messages')
      .insert(data)
      .select()
      .single();

    if (resError) throw resError;

    // return this.getById(resData.id);
    return resData;
  },

  // UPDATE operation
  async update(id: string, updates: Partial<ContactMessagesUpdate>) {
    const { data, error } = await supabaseServer
      .from('contact_messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // DELETE operation
  async delete(id: string) {
    const { error } = await supabaseServer
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};