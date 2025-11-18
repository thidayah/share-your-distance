import { supabase } from "../../client";
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