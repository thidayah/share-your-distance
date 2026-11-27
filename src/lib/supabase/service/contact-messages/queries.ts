import { supabaseServer } from "../../server-client";

export const contactMessagesQueries = {
  getAll: () =>
    supabaseServer
      .from('syd_contact_messages')
      .select(`*`)
      .order('created_at'),

  getById: (id: string) =>
    supabaseServer
      .from('syd_contact_messages')
      .select(`*`)
      .eq('id', id)
      .single(),

};