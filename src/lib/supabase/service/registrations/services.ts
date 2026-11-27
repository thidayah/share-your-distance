import { supabaseServer } from '@/lib/supabase/server-client';
import {
  Registration,
  RegistrationCreateInput,
  RegistrationFilters,
  PaymentStatus,
} from './types';

const TABLE = 'syd_registrations';
const CATEGORY_FIELDS = 'id, name, description, price, distance, max_participants, current_participants';

function applyFilters(query: any, filters: RegistrationFilters) {
  const { search, payment_status, category_id, start_date, end_date } = filters;

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,registration_number.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }
  if (payment_status) query = query.eq('payment_status', payment_status);
  if (category_id) query = query.eq('category_id', category_id);
  if (start_date) query = query.gte('created_at', start_date);
  if (end_date) query = query.lte('created_at', end_date);

  return query;
}

export const registrationService = {
  async getAll(filters: RegistrationFilters = {}) {
    const { page = 1, limit = 10 } = filters;
    const from = (page - 1) * limit;

    let countQuery = supabaseServer.from(TABLE).select('*', { count: 'exact', head: true });
    countQuery = applyFilters(countQuery, filters);

    let dataQuery = supabaseServer
      .from(TABLE)
      .select(`*, category:syd_categories(${CATEGORY_FIELDS})`)
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);
    dataQuery = applyFilters(dataQuery, filters);

    const [{ count, error: countError }, { data, error }] = await Promise.all([countQuery, dataQuery]);
    if (countError) throw countError;
    if (error) throw error;

    return { data: data as Registration[], total: count ?? 0, page, limit };
  },

  async getAllV2(filters: RegistrationFilters = {}) {
    return this.getAll(filters);
  },

  async getById(id: string) {
    const { data, error } = await supabaseServer
      .from(TABLE)
      .select(`*, category:syd_categories(${CATEGORY_FIELDS})`)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Registration;
  },

  async getByExternalOrderId(orderId: string) {
    const { data, error } = await supabaseServer
      .from(TABLE)
      .select(`*, category:syd_categories(${CATEGORY_FIELDS})`)
      .eq('external_order_id', orderId)
      .maybeSingle();
    if (error) throw error;
    return data as Registration | null;
  },

  async create(input: RegistrationCreateInput) {
    const { data, error } = await supabaseServer
      .from(TABLE)
      .insert(input)
      .select(`id, registration_number, full_name, email, phone, total_amount, payment_status, category_id, category:syd_categories(${CATEGORY_FIELDS})`)
      .single();
    if (error) throw error;
    return data;
  },

  async attachOrder(id: string, externalOrderId: string) {
    const { error } = await supabaseServer
      .from(TABLE)
      .update({ external_order_id: externalOrderId })
      .eq('id', id);
    if (error) throw error;
  },

  async isRegistrationNumberTaken(registrationNumber: string) {
    const { count, error } = await supabaseServer
      .from(TABLE)
      .select('id', { count: 'exact', head: true })
      .eq('registration_number', registrationNumber);
    if (error) throw error;
    return (count ?? 0) > 0;
  },

  async updatePaymentStatus(id: string, status: PaymentStatus, paymentDate?: string) {
    const updateData: Record<string, unknown> = { payment_status: status };
    if (status === 'paid' && paymentDate) updateData.payment_date = paymentDate;

    const { data, error } = await supabaseServer
      .from(TABLE)
      .update(updateData)
      .eq('id', id)
      .select(`*, category:syd_categories(${CATEGORY_FIELDS})`)
      .single();
    if (error) throw error;
    return data as Registration;
  },

  async updatePaymentStatusV2(id: string, status: PaymentStatus, paymentDate?: string) {
    return this.updatePaymentStatus(id, status, paymentDate);
  },

  async getStatistics() {
    const { data, error } = await supabaseServer.from(TABLE).select('payment_status, category_id');
    if (error) throw error;

    const rows = data ?? [];
    return {
      total: rows.length,
      pending: rows.filter((r) => r.payment_status === 'pending').length,
      paid: rows.filter((r) => r.payment_status === 'paid').length,
      byCategory: rows.reduce<Record<string, number>>((acc, row) => {
        if (!row.category_id) return acc;
        acc[row.category_id] = (acc[row.category_id] ?? 0) + 1;
        return acc;
      }, {}),
    };
  },

  async getStatisticsV2() {
    return this.getStatistics();
  },

  async syncCategoryPaidCount(categoryId: string) {
    const [{ count, error: countError }, { data: category, error: categoryError }] = await Promise.all([
      supabaseServer
        .from(TABLE)
        .select('id', { count: 'exact', head: true })
        .eq('category_id', categoryId)
        .eq('payment_status', 'paid'),
      supabaseServer
        .from('syd_categories')
        .select('max_participants')
        .eq('id', categoryId)
        .single(),
    ]);

    if (countError) throw countError;
    if (categoryError) throw categoryError;
    const paidCount = count ?? 0;
    if (category.max_participants !== null && paidCount > category.max_participants) {
      throw new Error('Paid registrations exceed the category capacity');
    }

    const { error } = await supabaseServer
      .from('syd_categories')
      .update({ current_participants: paidCount })
      .eq('id', categoryId);
    if (error) throw error;
  },
};
