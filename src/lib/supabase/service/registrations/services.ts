import { supabaseServer } from "@/lib/supabase/server-client";
import { Registration, RegistrationFilters } from "./types";

export const registrationService = {
  // Get all registrations with filters
  async getAll(filters: RegistrationFilters = {}) {
    const { search, payment_status, category_id, start_date, end_date, has_bib, page = 1, limit = 10 } = filters;

    // Query untuk count
    let countQuery = supabaseServer
      .from('registrations')
      .select('*', { count: 'exact', head: true });

    // Query untuk data dengan join
    let dataQuery = supabaseServer
      .from('registrations')
      .select(`
      *,
      category:categories(name, distance)
    `)
      .order('created_at', { ascending: false });

    // Fungsi helper untuk apply filters
    const applyFilters = (query: any) => {
      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,registration_number.ilike.%${search}%`);
      }
      if (payment_status) {
        query = query.eq('payment_status', payment_status);
      }
      if (category_id) {
        query = query.eq('category_id', category_id);
      }
      if (start_date) {
        query = query.gte('created_at', start_date);
      }
      if (end_date) {
        query = query.lte('created_at', end_date);
      }
      if (has_bib !== undefined) {
        if (has_bib) {
          query = query.not('bib_number', 'is', null);
        } else {
          query = query.is('bib_number', null);
        }
      }
      return query;
    };

    // Apply filters ke kedua query
    countQuery = applyFilters(countQuery);
    dataQuery = applyFilters(dataQuery);

    // Get count
    const { count, error: countError } = await countQuery;
    if (countError) throw countError;

    // Apply pagination untuk data query
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error: dataError } = await dataQuery.range(from, to);
    if (dataError) throw dataError;

    return {
      items: data as Registration[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  },

  async getAllV2(filters: RegistrationFilters = {}) {
    const { search, payment_status, category_id, start_date, end_date, page = 1, limit = 10 } = filters;

    // Query untuk count
    let countQuery = supabaseServer
      .from('registrations_v2')
      .select('*', { count: 'exact', head: true });

    // Query untuk data dengan join
    let dataQuery = supabaseServer
      .from('registrations_v2')
      .select(`
      *,
      category:categories(name, distance)
    `)
      .order('created_at', { ascending: false });

    // Fungsi helper untuk apply filters
    const applyFilters = (query: any) => {
      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,registration_number.ilike.%${search}%`);
      }
      if (payment_status) {
        query = query.eq('payment_status', payment_status);
      }
      if (category_id) {
        query = query.eq('category_id', category_id);
      }
      if (start_date) {
        query = query.gte('created_at', start_date);
      }
      if (end_date) {
        query = query.lte('created_at', end_date);
      }
      // if (has_bib !== undefined) {
      //   if (has_bib) {
      //     query = query.not('bib_number', 'is', null);
      //   } else {
      //     query = query.is('bib_number', null);
      //   }
      // }
      return query;
    };

    // Apply filters ke kedua query
    countQuery = applyFilters(countQuery);
    dataQuery = applyFilters(dataQuery);

    // Get count
    const { count, error: countError } = await countQuery;
    if (countError) throw countError;

    // Apply pagination untuk data query
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error: dataError } = await dataQuery.range(from, to);
    if (dataError) throw dataError;

    return {
      items: data as Registration[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  },

  // Get registration by ID
  // async getById(id: string) {
  //   const { data, error } = await supabaseServer
  //     .from('registrations')
  //     .select(`
  //       *,
  //       category:categories(name, distance, price)
  //     `)
  //     .eq('id', id)
  //     .single();

  //   if (error) throw error;
  //   return data as Registration;
  // },

  // Update payment status
  async updatePaymentStatus(id: string, status: Registration['payment_status'], paymentDate?: string) {
    const updateData: any = { payment_status: status };

    if (status === 'paid' && paymentDate) {
      updateData.payment_date = paymentDate;
    }

    const { data, error } = await supabaseServer
      .from('registrations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePaymentStatusV2(id: string, status: Registration['payment_status'], paymentDate?: string ) {
    const updateData: any = { payment_status: status };

    if (status === 'paid' && paymentDate) {
      updateData.payment_date = paymentDate
    }

    const { data, error } = await supabaseServer
      .from('registrations_v2')
      .update(updateData)
      .eq('id', id)
      // .select()
      .select(`*,category:categories(name, distance)`)
      .single();

    if (error) throw error;
    return data;
  },

  // Assign bib number
  // async assignBibNumber(id: string, bibNumber: string) {
  //   const { data, error } = await supabaseServer
  //     .from('registrations')
  //     .update({
  //       bib_number: bibNumber,
  //       bib_assigned_at: new Date().toISOString()
  //     })
  //     .eq('id', id)
  //     .select()
  //     .single();

  //   if (error) throw error;
  //   return data;
  // },

  // Get statistics
  async getStatistics() {
    const { data, error } = await supabaseServer
      .from('registrations')
      .select('payment_status, category_id');

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter(r => r.payment_status === 'pending').length,
      paid: data.filter(r => r.payment_status === 'paid').length,
      failed: data.filter(r => r.payment_status === 'failed').length,
      refunded: data.filter(r => r.payment_status === 'refunded').length,
      cancelled: data.filter(r => r.payment_status === 'cancelled').length,
    };

    return stats;
  },

  async getStatisticsV2() {
    const { data, error } = await supabaseServer
      .from('registrations_v2')
      .select('payment_status, category_id');

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter(r => r.payment_status === 'pending').length,
      paid: data.filter(r => r.payment_status === 'paid').length,
      // failed: data.filter(r => r.payment_status === 'failed').length,
      // refunded: data.filter(r => r.payment_status === 'refunded').length,
      cancelled: data.filter(r => r.payment_status === 'cancelled').length,
    };

    return stats;
  },

  // Export registrations
  // async exportRegistrations(filters: RegistrationFilters = {}) {
  //   const { search, payment_status, category_id, start_date, end_date } = filters;

  //   let query = supabaseServer
  //     .from('registrations')
  //     .select(`
  //       *,
  //       category:categories(name, distance)
  //     `)
  //     .order('created_at', { ascending: false });

  //   if (search) {
  //     query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  //   }

  //   if (payment_status) {
  //     query = query.eq('payment_status', payment_status);
  //   }

  //   if (category_id) {
  //     query = query.eq('category_id', category_id);
  //   }

  //   if (start_date) {
  //     query = query.gte('created_at', start_date);
  //   }

  //   if (end_date) {
  //     query = query.lte('created_at', end_date);
  //   }

  //   const { data, error } = await query;

  //   if (error) throw error;
  //   return data as Registration[];
  // }
};