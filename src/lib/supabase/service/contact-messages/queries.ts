import { supabase } from '@/lib/supabase/client';
import { supabaseServer } from "../../server-client";

export const contactMessagesQueries = {
  getAll: () =>
    supabaseServer
      .from('contact_messages')
      .select(`*`)
      .order('created_at'),

  getById: (id: string) =>
    supabase
      .from('contact_messages')
      .select(`*`)
      .eq('id', id)
      .single(),

};