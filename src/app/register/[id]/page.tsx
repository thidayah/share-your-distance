'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Template from '@/components/layout/Template';
import Loading from '@/components/ui/Loading';
import CompletePayment from '@/components/CompletePayment';
import { supabase } from '@/lib/supabase/client';
import { TypesCategory } from '@/types/database';

type FormStep = 'personal' | 'emergency' | 'summary' | 'payment';

export default function RegistrationPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const [isLoading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<TypesCategory | null>(null);
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [isAgreed, setAgreed] = useState(false);
  const [isSummaryExpanded, setSummaryExpanded] = useState(false);

  // Modals state
  const [isTermsOpen, setTermsOpen] = useState(false);
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);

  const [formData, setFormData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      instagram: '',
      strava: '',
    },
    emergency: {
      contactName: '',
      contactPhone: '',
      contactRelationship: '',
      medicalConditions: '',
    },
  });

  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select(`
            *,
            category_features (
              feature,
              display_order
            )
          `)
          .eq('id', categoryId)
          .single();

        if (error) {
          console.error('Error fetching category:', error);
        } else {
          setCategory(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    })();
  }, [categoryId]);

  const updatePersonal = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const updateEmergency = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      emergency: { ...prev.emergency, [field]: value },
    }));
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const [y, m, d] = birthDate.split('-').map(Number);
    // Event date: 19 December 2026
    let age = 2026 - y;
    if (12 < m || (12 === m && 19 < d)) age--;
    return age;
  };

  const formattedBirthDate = useMemo(() => {
    if (!formData.personal.dateOfBirth) return '—';
    try {
      const [y, m, d] = formData.personal.dateOfBirth.split('-').map(Number);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(y, m - 1, d));
    } catch {
      return formData.personal.dateOfBirth;
    }
  }, [formData.personal.dateOfBirth]);

  const validatePersonal = () => {
    const { fullName, email, phone, dateOfBirth, gender } = formData.personal;
    if (!fullName.trim()) {
      toast.warning('Nama lengkap wajib diisi!');
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.warning('Email valid wajib diisi!');
      return false;
    }
    if (!phone.trim()) {
      toast.warning('Nomor WhatsApp wajib diisi!');
      return false;
    }
    if (!dateOfBirth) {
      toast.warning('Tanggal lahir wajib diisi!');
      return false;
    }
    const age = calculateAge(dateOfBirth);
    if (age < 17) {
      toast.warning('Peserta harus berusia minimal 17 tahun pada tanggal acara!');
      return false;
    }
    if (!gender) {
      toast.warning('Silakan pilih gender!');
      return false;
    }
    return true;
  };

  const validateEmergency = () => {
    const { contactName, contactPhone, contactRelationship } = formData.emergency;
    if (!contactName.trim()) {
      toast.warning('Nama kontak darurat wajib diisi!');
      return false;
    }
    if (!contactPhone.trim()) {
      toast.warning('Nomor telepon darurat wajib diisi!');
      return false;
    }
    if (!contactRelationship) {
      toast.warning('Silakan pilih hubungan kontak darurat!');
      return false;
    }
    return true;
  };

  const goToStep = (step: FormStep) => {
    window.scrollTo({ top: 100, behavior: 'smooth' });
    setCurrentStep(step);
  };

  const handleNextPersonal = () => {
    if (validatePersonal()) {
      goToStep('emergency');
    }
  };

  const handleNextEmergency = () => {
    if (validateEmergency()) {
      goToStep('summary');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) {
      toast.warning('Silakan setujui Syarat & Ketentuan dan Kebijakan Privasi terlebih dahulu!');
      return;
    }

    setIsSubmitting(true);
    try {
      const registrationData = {
        category_id: category?.id,
        full_name: formData.personal.fullName.trim(),
        email: formData.personal.email.trim().toLowerCase(),
        phone: formData.personal.phone.trim(),
        date_of_birth: formData.personal.dateOfBirth,
        gender: formData.personal.gender,
        instagram: formData.personal.instagram.trim(),
        emergency_contact_name: formData.emergency.contactName.trim(),
        emergency_contact_phone: formData.emergency.contactPhone.trim(),
        emergency_contact_relationship: formData.emergency.contactRelationship,
        medical_conditions: formData.emergency.medicalConditions.trim() || 'Tidak ada',
        total_amount: category?.price || 50000,
      };

      const response = await fetch('/api/registrations-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Gagal menyimpan pendaftaran');
      }

      toast.success('Pendaftaran berhasil disimpan!');
      setOrderData(result.data);
      goToStep('payment');
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat memproses pendaftaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepIndex = ['personal', 'emergency', 'summary', 'payment'].indexOf(currentStep);

  return (
    <Template>
      {isLoading && <Loading />}

      {!isLoading && !category && (
        <div className="text-center py-40">
          <h1 className="text-3xl font-black text-[var(--ink)] mb-4">Kategori Tidak Ditemukan</h1>
          <p className="text-[var(--muted)]">Kategori lomba yang Anda cari tidak tersedia atau sudah ditutup.</p>
        </div>
      )}

      {!isLoading && category && (
        <main className="pb-24">
          {/* Header Banner */}
          <section className="bg-[var(--ink)] pb-12 text-white">
            <div className="wrap pt-28 md:pt-32">
              <p className="eyebrow mb-4 text-[var(--sky)]">Pendaftaran peserta</p>
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-[-.055em] md:text-6xl">
                Ambil giliranmu. Kami carikan timnya.
              </h1>

              {/* Wizard Steps Indicator */}
              <ol id="wizard-progress" className="mt-8 grid max-w-3xl grid-cols-3 gap-2 text-xs font-bold sm:gap-4">
                <li
                  className={`wizard-step flex items-center gap-2 ${stepIndex === 0 ? 'active' : stepIndex > 0 ? 'complete' : ''}`}
                >
                  <span className="step-dot grid h-8 w-8 shrink-0 place-items-center rounded-full">
                    {stepIndex > 0 ? '✓' : '1'}
                  </span>
                  <span>Informasi pribadi</span>
                </li>
                <li
                  className={`wizard-step flex items-center gap-2 ${stepIndex === 1 ? 'active' : stepIndex > 1 ? 'complete' : ''}`}
                >
                  <span className="step-dot grid h-8 w-8 shrink-0 place-items-center rounded-full">
                    {stepIndex > 1 ? '✓' : '2'}
                  </span>
                  <span>Darurat</span>
                </li>
                <li
                  className={`wizard-step flex items-center gap-2 ${stepIndex >= 2 ? 'active' : ''}`}
                >
                  <span className="step-dot grid h-8 w-8 shrink-0 place-items-center rounded-full">
                    {stepIndex > 2 ? '✓' : '3'}
                  </span>
                  <span>Ringkasan</span>
                </li>
              </ol>
            </div>
          </section>

          {/* Form & Summary Container */}
          <section className="-mt-5">
            <div className="wrap grid items-start gap-6 lg:grid-cols-[1.35fr_.65fr]">
              {/* Form Content / Complete Payment */}
              {currentStep === 'payment' ? (
                <div className="panel p-5 sm:p-8 shadow-xl shadow-slate-900/5">
                  <CompletePayment data={orderData} />
                </div>
              ) : (
                <form id="registration-form" className="panel p-5 shadow-xl shadow-slate-900/5 sm:p-8" onSubmit={handleSubmit}>
                  {/* STEP 1: Personal Info */}
                  {currentStep === 'personal' && (
                    <div className="wizard-panel step-enter">
                      <div className="mb-7">
                        <p className="eyebrow mb-2 text-[var(--blue)]">Langkah 1 dari 3</p>
                        <h2 className="text-2xl font-black tracking-tight text-[var(--ink)]">Informasi pribadi</h2>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="field sm:col-span-2">
                          <label htmlFor="full-name">Nama lengkap *</label>
                          <input
                            id="full-name"
                            name="full-name"
                            value={formData.personal.fullName}
                            onChange={(e) => updatePersonal('fullName', e.target.value)}
                            placeholder="Nama sesuai identitas"
                            required
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="email">Email *</label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.personal.email}
                            onChange={(e) => updatePersonal('email', e.target.value)}
                            placeholder="nama@email.com"
                            required
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="phone">Nomor WhatsApp *</label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.personal.phone}
                            onChange={(e) => updatePersonal('phone', e.target.value)}
                            placeholder="08xx xxxx xxxx"
                            required
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="birth-date">Tanggal lahir * (Min. 17 tahun)</label>
                          <input
                            id="birth-date"
                            name="birth-date"
                            type="date"
                            value={formData.personal.dateOfBirth}
                            onChange={(e) => updatePersonal('dateOfBirth', e.target.value)}
                            required
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="gender">Gender *</label>
                          <select
                            id="gender"
                            name="gender"
                            value={formData.personal.gender}
                            onChange={(e) => updatePersonal('gender', e.target.value)}
                            required
                          >
                            <option value="">Pilih gender</option>
                            <option value="male">Laki-laki</option>
                            <option value="female">Perempuan</option>
                          </select>
                        </div>

                        <div className="field">
                          <label htmlFor="instagram">Instagram</label>
                          <input
                            id="instagram"
                            name="instagram"
                            value={formData.personal.instagram}
                            onChange={(e) => updatePersonal('instagram', e.target.value)}
                            placeholder="@username"
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="strava">Profil Strava (tidak privat)</label>
                          <input
                            id="strava"
                            name="strava"
                            type="url"
                            value={formData.personal.strava}
                            onChange={(e) => updatePersonal('strava', e.target.value)}
                            placeholder="https://www.strava.com/athletes/..."
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button
                          type="button"
                          onClick={handleNextPersonal}
                          className="btn lime !px-6 font-extrabold cursor-pointer"
                        >
                          <span>Lanjutkan</span>
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Emergency Contact */}
                  {currentStep === 'emergency' && (
                    <div className="wizard-panel step-enter">
                      <div className="mb-7">
                        <p className="eyebrow mb-2 text-[var(--blue)]">Langkah 2 dari 3</p>
                        <h2 className="text-2xl font-black tracking-tight text-[var(--ink)]">Kontak darurat</h2>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="field sm:col-span-2">
                          <label htmlFor="emergency-name">Nama kontak darurat *</label>
                          <input
                            id="emergency-name"
                            name="emergency-name"
                            value={formData.emergency.contactName}
                            onChange={(e) => updateEmergency('contactName', e.target.value)}
                            placeholder="Nama kontak darurat"
                            required
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="emergency-phone">Nomor telepon *</label>
                          <input
                            id="emergency-phone"
                            name="emergency-phone"
                            type="tel"
                            value={formData.emergency.contactPhone}
                            onChange={(e) => updateEmergency('contactPhone', e.target.value)}
                            placeholder="08xx xxxx xxxx"
                            required
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="relationship">Hubungan *</label>
                          <select
                            id="relationship"
                            name="relationship"
                            value={formData.emergency.contactRelationship}
                            onChange={(e) => updateEmergency('contactRelationship', e.target.value)}
                            required
                          >
                            <option value="">Pilih hubungan</option>
                            <option value="parent">Orang tua / wali</option>
                            <option value="partner">Pasangan</option>
                            <option value="sibling">Saudara kandung</option>
                            <option value="relative">Keluarga</option>
                            <option value="friend">Teman</option>
                            <option value="other">Lainnya</option>
                          </select>
                        </div>

                        <div className="field sm:col-span-2">
                          <label htmlFor="medical">Kondisi medis yang perlu diketahui</label>
                          <textarea
                            id="medical"
                            name="medical"
                            rows={4}
                            value={formData.emergency.medicalConditions}
                            onChange={(e) => updateEmergency('medicalConditions', e.target.value)}
                            placeholder="Alergi, riwayat penyakit, atau obat rutin (bila ada)"
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => goToStep('personal')}
                          className="btn border border-[var(--line)] bg-white cursor-pointer"
                        >
                          ← Kembali
                        </button>
                        <button
                          type="button"
                          onClick={handleNextEmergency}
                          className="btn lime !px-6 font-extrabold cursor-pointer"
                        >
                          <span>Lanjutkan</span>
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Summary */}
                  {currentStep === 'summary' && (
                    <div className="wizard-panel step-enter">
                      <div className="mb-7">
                        <p className="eyebrow mb-2 text-[var(--blue)]">Langkah 3 dari 3</p>
                        <h2 className="text-2xl font-black tracking-tight text-[var(--ink)]">Ringkasan pendaftaran</h2>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                          Periksa kembali semua data sebelum melanjutkan ke pembayaran.
                        </p>
                      </div>

                      <dl className="divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] px-4">
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">Nama lengkap</dt>
                          <dd className="break-words text-sm font-semibold text-[var(--ink)]">{formData.personal.fullName || '—'}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">Email</dt>
                          <dd className="break-words text-sm font-semibold text-[var(--ink)]">{formData.personal.email || '—'}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">Nomor WhatsApp</dt>
                          <dd className="break-words text-sm font-semibold text-[var(--ink)]">{formData.personal.phone || '—'}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">Tanggal lahir</dt>
                          <dd className="text-sm font-semibold text-[var(--ink)]">{formattedBirthDate}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">Gender</dt>
                          <dd className="text-sm font-semibold text-[var(--ink)]">
                            {formData.personal.gender === 'male' ? 'Laki-laki' : formData.personal.gender === 'female' ? 'Perempuan' : '—'}
                          </dd>
                        </div>
                        {formData.personal.instagram && (
                          <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                            <dt className="text-xs font-bold text-[var(--muted)]">Instagram</dt>
                            <dd className="break-words text-sm font-semibold text-[var(--ink)]">{formData.personal.instagram}</dd>
                          </div>
                        )}
                        {formData.personal.strava && (
                          <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                            <dt className="text-xs font-bold text-[var(--muted)]">Profil Strava</dt>
                            <dd className="break-words text-sm font-semibold text-[var(--ink)]">{formData.personal.strava}</dd>
                          </div>
                        )}
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">Nama kontak darurat</dt>
                          <dd className="break-words text-sm font-semibold text-[var(--ink)]">{formData.emergency.contactName || '—'}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">Nomor telepon darurat</dt>
                          <dd className="break-words text-sm font-semibold text-[var(--ink)]">{formData.emergency.contactPhone || '—'}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">Hubungan</dt>
                          <dd className="text-sm font-semibold text-[var(--ink)]">{formData.emergency.contactRelationship || '—'}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">Kondisi medis</dt>
                          <dd className="whitespace-pre-wrap break-words text-sm font-semibold text-[var(--ink)]">
                            {formData.emergency.medicalConditions || 'Tidak ada'}
                          </dd>
                        </div>
                      </dl>

                      {/* Agreement Checkbox */}
                      <div className="mt-6 rounded-2xl bg-[var(--paper)] p-5">
                        <h3 className="font-extrabold text-[var(--ink)]">Persetujuan pendaftaran</h3>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                          Baca ringkasan ketentuan acara dan penggunaan data sebelum menyelesaikan pendaftaran.
                        </p>
                        <label htmlFor="terms-consent" className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--ink)]">
                          <input
                            id="terms-consent"
                            type="checkbox"
                            checked={isAgreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-1 h-4 w-4 shrink-0 accent-[var(--blue)] cursor-pointer"
                          />
                          <span>Saya menyetujui Syarat & Ketentuan dan telah membaca Kebijakan Privasi.</span>
                        </label>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 pl-7 text-sm font-bold text-[var(--blue)]">
                          <button
                            type="button"
                            onClick={() => setTermsOpen(true)}
                            className="underline underline-offset-4 cursor-pointer hover:text-[var(--ink)]"
                          >
                            Baca Syarat & Ketentuan
                          </button>
                          <button
                            type="button"
                            onClick={() => setPrivacyOpen(true)}
                            className="underline underline-offset-4 cursor-pointer hover:text-[var(--ink)]"
                          >
                            Baca Kebijakan Privasi
                          </button>
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => goToStep('emergency')}
                          className="btn border border-[var(--line)] bg-white cursor-pointer"
                        >
                          ← Kembali
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn lime !px-6 font-extrabold cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitting ? 'Memproses...' : 'Register & Pay'}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}

              {/* Sticky Summary Card */}
              <aside id="registration-summary" className="registration-summary space-y-4 lg:sticky lg:top-24">
                <div className="panel overflow-hidden">
                  <div className="summary-desktop-heading bg-[var(--blue)] p-5 text-white">
                    <p className="eyebrow text-white/70">Ringkasan pendaftaran</p>
                    <h2 className="mt-2 text-xl font-black">{category.name}</h2>
                  </div>

                  {/* Mobile Drawer Trigger */}
                  <button
                    id="summary-toggle"
                    className="summary-mobile-toggle"
                    type="button"
                    aria-expanded={isSummaryExpanded}
                    onClick={() => setSummaryExpanded(!isSummaryExpanded)}
                  >
                    <span className="summary-mobile-title">
                      <span className="eyebrow text-white/70">Ringkasan pendaftaran</span>
                      <strong>{category.name}</strong>
                    </span>
                    <strong className="summary-mobile-price">
                      Rp{category.price.toLocaleString('id-ID')}
                    </strong>
                    <svg
                      className={`summary-chevron ${isSummaryExpanded ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {/* Summary Details */}
                  <div
                    id="summary-details"
                    className={`registration-summary-details space-y-4 p-5 ${isSummaryExpanded ? 'block' : 'hidden lg:block'}`}
                  >
                    <div className="flex items-start">
                      <div>
                        <p className="text-sm font-bold text-[var(--ink)]">Sabtu, 19 Desember 2026</p>
                        <p className="mt-1 text-xs text-[var(--muted)]">Departmen Sports Lab, Bandung</p>
                      </div>
                    </div>

                    <div className="border-t border-[var(--line)] pt-4">
                      <p className="eyebrow mb-3 text-[var(--muted)]">Termasuk dalam pendaftaran</p>
                      <ul className="space-y-2 text-sm text-[var(--ink)]">
                        {category.category_features && category.category_features.length > 0 ? (
                          category.category_features.map((item, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-[var(--blue)]">✓</span>
                              {item.feature}
                            </li>
                          ))
                        ) : (
                          <>
                            <li className="flex gap-2"><span className="text-[var(--blue)]">✓</span>BIB Number</li>
                            <li className="flex gap-2"><span className="text-[var(--blue)]">✓</span>Refreshment</li>
                            <li className="flex gap-2"><span className="text-[var(--blue)]">✓</span>Medical</li>
                            <li className="flex gap-2"><span className="text-[var(--blue)]">✓</span>Doorprize</li>
                            <li className="flex gap-2"><span className="text-[var(--blue)]">✓</span>Digital Certificate</li>
                          </>
                        )}
                      </ul>
                    </div>

                    <div className="summary-price flex items-end justify-between border-t border-[var(--line)] pt-4">
                      <span className="text-sm font-semibold text-[var(--ink)]">Biaya per orang</span>
                      <strong className="text-2xl font-black text-[var(--ink)]">
                        Rp{category.price.toLocaleString('id-ID')}
                      </strong>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {/* Terms Modal Dialog */}
          {isTermsOpen && (
            <div className="policy-modal-backdrop" onClick={() => setTermsOpen(false)}>
              <div className="policy-modal" onClick={(e) => e.stopPropagation()}>
                <div className="flex max-h-[82vh] flex-col">
                  <header className="flex items-start justify-between gap-4 border-b border-[var(--line)] p-5 sm:p-7">
                    <div>
                      <p className="eyebrow mb-2 text-[var(--blue)]">Share Your Distance Vol 4.0</p>
                      <h2 className="text-2xl font-black text-[var(--ink)]">Syarat & Ketentuan</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTermsOpen(false)}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--line)] text-xl cursor-pointer hover:bg-neutral-100"
                    >
                      ×
                    </button>
                  </header>
                  <div className="overflow-y-auto p-5 text-sm leading-relaxed sm:p-7 text-[var(--ink)]">
                    <p className="mb-5 text-[var(--muted)]">
                      Dengan mendaftar, Anda menyetujui ketentuan berikut untuk mengikuti acara Share Your Distance.
                    </p>
                    <ol className="list-decimal space-y-5 pl-5">
                      <li>
                        <strong>Informasi pendaftaran</strong>
                        <p className="mt-1 text-[var(--muted)]">
                          Berikan informasi pendaftaran yang akurat dan terkini. Peserta individu akan ditempatkan ke dalam tim oleh panitia.
                        </p>
                      </li>
                      <li>
                        <strong>Usia, kesehatan, dan keselamatan</strong>
                        <p className="mt-1 text-[var(--muted)]">
                          Peserta harus berusia minimal 17 tahun pada tanggal acara. Pastikan kondisi kesehatan memungkinkan Anda mengikuti kegiatan, dan patuhi aturan lomba serta arahan keselamatan panitia.
                        </p>
                      </li>
                      <li>
                        <strong>Biaya dan perubahan acara</strong>
                        <p className="mt-1 text-[var(--muted)]">
                          Biaya pendaftaran tidak dapat dikembalikan atau dialihkan, termasuk karena cedera, sakit, atau keadaan darurat pribadi. Jika keadaan tak terduga mengharuskan perubahan tanggal, lokasi, atau format acara, panitia akan menyampaikan informasinya kepada peserta.
                        </p>
                      </li>
                    </ol>
                  </div>
                  <footer className="border-t border-[var(--line)] p-5 text-right sm:px-7">
                    <button
                      type="button"
                      onClick={() => setTermsOpen(false)}
                      className="btn lime !min-h-11 !px-5 !py-2 cursor-pointer font-extrabold"
                    >
                      Tutup
                    </button>
                  </footer>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Modal Dialog */}
          {isPrivacyOpen && (
            <div className="policy-modal-backdrop" onClick={() => setPrivacyOpen(false)}>
              <div className="policy-modal" onClick={(e) => e.stopPropagation()}>
                <div className="flex max-h-[82vh] flex-col">
                  <header className="flex items-start justify-between gap-4 border-b border-[var(--line)] p-5 sm:p-7">
                    <div>
                      <p className="eyebrow mb-2 text-[var(--blue)]">Share Your Distance Vol 4.0</p>
                      <h2 className="text-2xl font-black text-[var(--ink)]">Kebijakan Privasi</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPrivacyOpen(false)}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--line)] text-xl cursor-pointer hover:bg-neutral-100"
                    >
                      ×
                    </button>
                  </header>
                  <div className="overflow-y-auto p-5 text-sm leading-relaxed sm:p-7 text-[var(--ink)]">
                    <p className="mb-5 text-[var(--muted)]">
                      Informasi yang Anda berikan digunakan untuk mengelola pendaftaran dan mendukung keselamatan peserta selama acara.
                    </p>
                    <ol className="list-decimal space-y-5 pl-5">
                      <li>
                        <strong>Informasi yang dikumpulkan</strong>
                        <p className="mt-1 text-[var(--muted)]">
                          Formulir meminta nama, email, nomor telepon, tanggal lahir, gender, kontak darurat dan hubungannya dengan Anda, serta informasi kondisi medis. Profil Instagram dan Strava bersifat opsional.
                        </p>
                      </li>
                      <li>
                        <strong>Penggunaan dan pembagian informasi</strong>
                        <p className="mt-1 text-[var(--muted)]">
                          Informasi digunakan untuk memproses pendaftaran, menyampaikan informasi acara, dan membantu keselamatan atau layanan medis darurat. Informasi yang diperlukan dapat dibagikan kepada tim operasional acara, penyedia layanan acara, atau petugas medis untuk keperluan tersebut.
                        </p>
                      </li>
                      <li>
                        <strong>Penyimpanan dan hak Anda</strong>
                        <p className="mt-1 text-[var(--muted)]">
                          Informasi disimpan selama diperlukan untuk mengelola acara dan memenuhi kewajiban administrasi atau hukum. Anda dapat meminta akses, koreksi, atau penghapusan informasi dengan menghubungi penyelenggara melalui kanal kontak resmi yang tercantum di situs.
                        </p>
                      </li>
                    </ol>
                  </div>
                  <footer className="border-t border-[var(--line)] p-5 text-right sm:px-7">
                    <button
                      type="button"
                      onClick={() => setPrivacyOpen(false)}
                      className="btn lime !min-h-11 !px-5 !py-2 cursor-pointer font-extrabold"
                    >
                      Tutup
                    </button>
                  </footer>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </Template>
  );
}
