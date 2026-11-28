'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Template from '@/components/layout/Template';
import Loading from '@/components/ui/Loading';
import CompletePayment from '@/components/CompletePayment';
import { supabase } from '@/lib/supabase/client';
import { TypesCategory } from '@/types/database';
import { useLanguage } from '@/lib/i18n';
import { isValidStravaUrl } from '@/lib/strava';
import { normalizeIndonesianPhone } from '@/lib/phone';

type FormStep = 'personal' | 'emergency' | 'summary' | 'payment';

interface OrderData {
  registration_number: string;
  full_name: string;
  email: string;
  phone: string;
  total_amount: number;
  redirect_url: string;
  category: { name: string };
}

type PersonalField = 'fullName' | 'email' | 'phone' | 'dateOfBirth' | 'gender' | 'instagram' | 'strava';
type EmergencyField = 'contactName' | 'contactPhone' | 'contactRelationship' | 'medicalConditions';
type FieldErrorKey = PersonalField | EmergencyField | 'consent';
type FieldErrors = Partial<Record<FieldErrorKey, string>>;

function InlineFieldError({ id, message }: { id: string; message?: string }) {
  const [isHiding, setIsHiding] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!message) return;
    const hideTimeout = window.setTimeout(() => setIsHiding(true), 10000);
    const dismissTimeout = window.setTimeout(() => setIsDismissed(true), 10300);
    return () => {
      window.clearTimeout(hideTimeout);
      window.clearTimeout(dismissTimeout);
    };
  }, [message]);

  if (!message || isDismissed) return null;
  return (
    <p id={id} className={`field-error${isHiding ? ' is-hiding' : ''}`} role="alert">
      {message}
    </p>
  );
}

const personalFields: PersonalField[] = [
  'fullName',
  'email',
  'phone',
  'dateOfBirth',
  'gender',
  'instagram',
  'strava',
];
const emergencyFields: EmergencyField[] = [
  'contactName',
  'contactPhone',
  'contactRelationship',
  'medicalConditions',
];

export default function RegistrationPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const { lang, t } = useLanguage();

  const [isLoading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<TypesCategory | null>(null);
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [isAgreed, setAgreed] = useState(false);
  const [isSummaryExpanded, setSummaryExpanded] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [validationRevision, setValidationRevision] = useState(0);
  const [personalValidationAttempted, setPersonalValidationAttempted] = useState(false);
  const [emergencyValidationAttempted, setEmergencyValidationAttempted] = useState(false);

  // Modals state
  const [isTermsOpen, setTermsOpen] = useState(false);
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);
  const [closingPolicyModal, setClosingPolicyModal] = useState<'terms' | 'privacy' | null>(null);

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

  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
        .from('syd_categories')
        .select('*')
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

  const replaceFieldErrors = (fields: FieldErrorKey[], errors: FieldErrors) => {
    setFieldErrors((previous) => {
      const next = { ...previous };
      fields.forEach((field) => delete next[field]);
      return { ...next, ...errors };
    });
  };

  const updatePersonal = (field: PersonalField, value: string) => {
    const updatedPersonal = { ...formData.personal, [field]: value };
    setFormData((prev) => ({
      ...prev,
      personal: updatedPersonal,
    }));
    if (personalValidationAttempted) {
      replaceFieldErrors(personalFields, getPersonalErrors(updatedPersonal));
    }
  };

  const updateEmergency = (field: EmergencyField, value: string) => {
    const updatedEmergency = { ...formData.emergency, [field]: value };
    setFormData((prev) => ({
      ...prev,
      emergency: updatedEmergency,
    }));
    if (emergencyValidationAttempted) {
      replaceFieldErrors(emergencyFields, getEmergencyErrors(updatedEmergency));
    }
  };

  const openPolicyModal = (modal: 'terms' | 'privacy') => {
    setClosingPolicyModal(null);
    if (modal === 'terms') setTermsOpen(true);
    else setPrivacyOpen(true);
  };

  const closePolicyModal = (modal: 'terms' | 'privacy') => {
    if (closingPolicyModal !== modal) setClosingPolicyModal(modal);
  };

  useEffect(() => {
    if (!closingPolicyModal) return;

    const closeTimeout = window.setTimeout(() => {
      if (closingPolicyModal === 'terms') setTermsOpen(false);
      else setPrivacyOpen(false);
      setClosingPolicyModal(null);
    }, 200);

    return () => window.clearTimeout(closeTimeout);
  }, [closingPolicyModal]);

  useEffect(() => {
    const openModal = isTermsOpen ? 'terms' : isPrivacyOpen ? 'privacy' : null;
    if (!openModal || closingPolicyModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setClosingPolicyModal(openModal);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTermsOpen, isPrivacyOpen, closingPolicyModal]);

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
      return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(y, m - 1, d));
    } catch {
      return formData.personal.dateOfBirth;
    }
  }, [formData.personal.dateOfBirth, lang]);

  const getPersonalErrors = (personal: typeof formData.personal): FieldErrors => {
    const errors: FieldErrors = {};
    const { fullName, email, phone, dateOfBirth, gender, strava } = personal;

    if (!fullName.trim()) {
      errors.fullName = t('Nama lengkap wajib diisi.', 'Full name is required.');
    }
    if (!email.trim()) {
      errors.email = t('Email wajib diisi.', 'Email is required.');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = t('Masukkan alamat email yang valid.', 'Enter a valid email address.');
    }
    if (!phone.trim()) {
      errors.phone = t('Nomor WhatsApp wajib diisi.', 'WhatsApp number is required.');
    } else if (!normalizeIndonesianPhone(phone)) {
      errors.phone = t(
        'Gunakan nomor Indonesia dengan awalan 0 atau 62.',
        'Use an Indonesian number starting with 0 or 62.',
      );
    }
    if (!dateOfBirth) {
      errors.dateOfBirth = t('Tanggal lahir wajib diisi.', 'Date of birth is required.');
    } else if (calculateAge(dateOfBirth) < 17) {
      errors.dateOfBirth = t(
        'Peserta harus berusia minimal 17 tahun pada tanggal acara.',
        'Participants must be at least 17 years old on the event date.',
      );
    }
    if (!gender) {
      errors.gender = t('Silakan pilih gender.', 'Please select a gender.');
    }
    if (!strava.trim()) {
      errors.strava = t('URL profil Strava wajib diisi.', 'Strava profile URL is required.');
    } else if (!isValidStravaUrl(strava)) {
      errors.strava = t('Masukkan URL profil atlet Strava yang valid.', 'Enter a valid Strava athlete profile URL.');
    }

    return errors;
  };

  const getEmergencyErrors = (emergency: typeof formData.emergency): FieldErrors => {
    const errors: FieldErrors = {};
    if (!emergency.contactName.trim()) {
      errors.contactName = t('Nama kontak darurat wajib diisi.', 'Emergency contact name is required.');
    }
    if (!emergency.contactPhone.trim()) {
      errors.contactPhone = t('Nomor telepon darurat wajib diisi.', 'Emergency phone number is required.');
    } else if (!normalizeIndonesianPhone(emergency.contactPhone)) {
      errors.contactPhone = t(
        'Gunakan nomor Indonesia dengan awalan 0 atau 62.',
        'Use an Indonesian number starting with 0 or 62.',
      );
    }
    if (!emergency.contactRelationship) {
      errors.contactRelationship = t('Silakan pilih hubungan kontak darurat.', 'Select the emergency contact relationship.');
    }

    return errors;
  };

  const validatePersonal = () => {
    setValidationRevision((revision) => revision + 1);
    setPersonalValidationAttempted(true);
    const errors = getPersonalErrors(formData.personal);
    replaceFieldErrors(personalFields, errors);
    return Object.keys(errors).length === 0;
  };

  const validateEmergency = () => {
    setValidationRevision((revision) => revision + 1);
    setEmergencyValidationAttempted(true);
    const errors = getEmergencyErrors(formData.emergency);
    replaceFieldErrors(emergencyFields, errors);
    return Object.keys(errors).length === 0;
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
      setValidationRevision((revision) => revision + 1);
      setFieldErrors((previous) => ({
        ...previous,
        consent: t(
          'Persetujuan wajib diberikan sebelum melanjutkan.',
          'You must agree before continuing.',
        ),
      }));
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
        strava_url: formData.personal.strava.trim(),
        emergency_contact_name: formData.emergency.contactName.trim(),
        emergency_contact_phone: formData.emergency.contactPhone.trim(),
        emergency_contact_relationship: formData.emergency.contactRelationship,
        medical_conditions: formData.emergency.medicalConditions.trim() || 'Tidak ada',
        consent_given: true,
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

      if (typeof result.data?.redirect_url !== 'string') {
        throw new Error(t('Tautan pembayaran tidak tersedia.', 'Payment checkout URL is unavailable.'));
      }

      toast.success(t('Pendaftaran berhasil. Mengarahkan ke pembayaran...', 'Registration saved. Redirecting to payment...'));
      setOrderData(result.data);
      goToStep('payment');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('Terjadi kesalahan saat memproses pendaftaran.', 'An error occurred while processing your registration.');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepIndex = ['personal', 'emergency', 'summary', 'payment'].indexOf(currentStep);
  const relationshipLabels: Record<string, string> = {
    parent: t('Orang tua / wali', 'Parent / guardian'),
    partner: t('Pasangan', 'Spouse / partner'),
    sibling: t('Saudara kandung', 'Sibling'),
    relative: t('Keluarga', 'Relative'),
    friend: t('Teman', 'Friend'),
    other: t('Lainnya', 'Other'),
  };

  return (
    <Template>
      {isLoading && <Loading />}

      {!isLoading && !category && (
        <div className="text-center py-40">
          <h1 className="text-3xl font-black text-[var(--ink)] mb-4">{t('Kategori Tidak Ditemukan', 'Category Not Found')}</h1>
          <p className="text-[var(--muted)]">{t('Kategori lomba yang Anda cari tidak tersedia atau sudah ditutup.', 'The race category you are looking for is unavailable or has been closed.')}</p>
        </div>
      )}

      {!isLoading && category && (
        <main className="pb-24">
          {/* Header Banner */}
          <section className="bg-[var(--ink)] pb-12 text-white">
            <div className="wrap pt-28 md:pt-32">
              <p className="eyebrow mb-4 text-[var(--sky)]">{t('Pendaftaran peserta', 'Participant registration')}</p>
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-[-.055em] md:text-6xl">
                {t('Ambil giliranmu. Kami carikan timnya.', 'Take your turn. We’ll find your team.')}
              </h1>

              {/* Wizard Steps Indicator */}
              <ol id="wizard-progress" className="mt-8 grid max-w-3xl grid-cols-3 gap-2 text-xs font-bold sm:gap-4">
                <li
                  className={`wizard-step flex items-center gap-2 ${stepIndex === 0 ? 'active' : stepIndex > 0 ? 'complete' : ''}`}
                >
                  <span className="step-dot grid h-8 w-8 shrink-0 place-items-center rounded-full">
                    {stepIndex > 0 ? '✓' : '1'}
                  </span>
                  <span>{t('Informasi pribadi', 'Personal information')}</span>
                </li>
                <li
                  className={`wizard-step flex items-center gap-2 ${stepIndex === 1 ? 'active' : stepIndex > 1 ? 'complete' : ''}`}
                >
                  <span className="step-dot grid h-8 w-8 shrink-0 place-items-center rounded-full">
                    {stepIndex > 1 ? '✓' : '2'}
                  </span>
                  <span>{t('Darurat', 'Emergency')}</span>
                </li>
                <li
                  className={`wizard-step flex items-center gap-2 ${stepIndex >= 2 ? 'active' : ''}`}
                >
                  <span className="step-dot grid h-8 w-8 shrink-0 place-items-center rounded-full">
                    {stepIndex > 2 ? '✓' : '3'}
                  </span>
                  <span>{t('Ringkasan', 'Summary')}</span>
                </li>
              </ol>
            </div>
          </section>

          {/* Form & Summary Container */}
          <section className="-mt-5">
            <div className="wrap grid items-start gap-6 lg:grid-cols-[1.35fr_.65fr]">
              {/* Form Content / Complete Payment */}
              {currentStep === 'payment' && orderData ? (
                <div className="panel p-5 sm:p-8 shadow-xl shadow-slate-900/5">
                  <CompletePayment data={orderData} />
                </div>
              ) : (
                <form id="registration-form" className="panel p-5 shadow-xl shadow-slate-900/5 sm:p-8" onSubmit={handleSubmit}>
                  {/* STEP 1: Personal Info */}
                  {currentStep === 'personal' && (
                    <div className="wizard-panel step-enter">
                      <div className="mb-7">
                        <p className="eyebrow mb-2 text-[var(--blue)]">{t('Langkah 1 dari 3', 'Step 1 of 3')}</p>
                        <h2 className="text-2xl font-black tracking-tight text-[var(--ink)]">{t('Informasi pribadi', 'Personal information')}</h2>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="field sm:col-span-2">
                          <label htmlFor="full-name">{t('Nama lengkap', 'Full name')} *</label>
                          <input
                            id="full-name"
                            name="full-name"
                            value={formData.personal.fullName}
                            onChange={(e) => updatePersonal('fullName', e.target.value)}
                            placeholder={t('Nama sesuai identitas', 'Name as shown on your ID')}
                            aria-invalid={Boolean(fieldErrors.fullName)}
                            aria-describedby={fieldErrors.fullName ? 'full-name-error' : undefined}
                            required
                          />
                          <InlineFieldError key={validationRevision} id="full-name-error" message={fieldErrors.fullName} />
                        </div>

                        <div className="field">
                          <label htmlFor="email">{t('Email', 'Email')} *</label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.personal.email}
                            onChange={(e) => updatePersonal('email', e.target.value)}
                            placeholder="nama@email.com"
                            aria-invalid={Boolean(fieldErrors.email)}
                            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                            required
                          />
                          <InlineFieldError key={validationRevision} id="email-error" message={fieldErrors.email} />
                        </div>

                        <div className="field">
                          <label htmlFor="phone">{t('Nomor WhatsApp', 'WhatsApp number')} *</label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.personal.phone}
                            onChange={(e) => updatePersonal('phone', e.target.value)}
                            onBlur={(e) => {
                              const normalized = normalizeIndonesianPhone(e.currentTarget.value);
                              if (normalized) updatePersonal('phone', normalized);
                            }}
                            placeholder="08xx xxxx xxxx"
                            aria-invalid={Boolean(fieldErrors.phone)}
                            aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                            required
                          />
                          <InlineFieldError key={validationRevision} id="phone-error" message={fieldErrors.phone} />
                        </div>

                        <div className="field">
                          <label htmlFor="birth-date">{t('Tanggal lahir', 'Date of birth')} * ({t('Min. 17 tahun', 'Min. 17 years')})</label>
                          <input
                            id="birth-date"
                            name="birth-date"
                            type="date"
                            value={formData.personal.dateOfBirth}
                            onChange={(e) => updatePersonal('dateOfBirth', e.target.value)}
                            aria-invalid={Boolean(fieldErrors.dateOfBirth)}
                            aria-describedby={fieldErrors.dateOfBirth ? 'birth-date-error' : undefined}
                            required
                          />
                          <InlineFieldError key={validationRevision} id="birth-date-error" message={fieldErrors.dateOfBirth} />
                        </div>

                        <div className="field">
                          <label htmlFor="gender">{t('Gender', 'Gender')} *</label>
                          <select
                            id="gender"
                            name="gender"
                            value={formData.personal.gender}
                            onChange={(e) => updatePersonal('gender', e.target.value)}
                            aria-invalid={Boolean(fieldErrors.gender)}
                            aria-describedby={fieldErrors.gender ? 'gender-error' : undefined}
                            required
                          >
                            <option value="">{t('Pilih gender', 'Select gender')}</option>
                            <option value="male">{t('Laki-laki', 'Male')}</option>
                            <option value="female">{t('Perempuan', 'Female')}</option>
                          </select>
                          <InlineFieldError key={validationRevision} id="gender-error" message={fieldErrors.gender} />
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
                          <label htmlFor="strava">{t('Profil Strava', 'Strava profile')} * <span className="strava-privacy-note">{t('(tidak privat)', '(not private)')}</span></label>
                          <input
                            id="strava"
                            name="strava"
                            type="url"
                            required
                            value={formData.personal.strava}
                            onChange={(e) => updatePersonal('strava', e.target.value)}
                            placeholder="https://www.strava.com/athletes/..."
                            aria-invalid={Boolean(fieldErrors.strava)}
                            aria-describedby={fieldErrors.strava ? 'strava-error' : undefined}
                          />
                          <InlineFieldError key={validationRevision} id="strava-error" message={fieldErrors.strava} />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button
                          type="button"
                          onClick={handleNextPersonal}
                          className="btn lime !px-6 font-extrabold cursor-pointer"
                        >
                          <span>{t('Lanjutkan', 'Continue')}</span>
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Emergency Contact */}
                  {currentStep === 'emergency' && (
                    <div className="wizard-panel step-enter">
                      <div className="mb-7">
                        <p className="eyebrow mb-2 text-[var(--blue)]">{t('Langkah 2 dari 3', 'Step 2 of 3')}</p>
                        <h2 className="text-2xl font-black tracking-tight text-[var(--ink)]">{t('Kontak darurat', 'Emergency contact')}</h2>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="field sm:col-span-2">
                          <label htmlFor="emergency-name">{t('Nama kontak darurat', 'Emergency contact name')} *</label>
                          <input
                            id="emergency-name"
                            name="emergency-name"
                            value={formData.emergency.contactName}
                            onChange={(e) => updateEmergency('contactName', e.target.value)}
                            placeholder={t('Nama kontak darurat', 'Emergency contact name')}
                            aria-invalid={Boolean(fieldErrors.contactName)}
                            aria-describedby={fieldErrors.contactName ? 'emergency-name-error' : undefined}
                            required
                          />
                          <InlineFieldError key={validationRevision} id="emergency-name-error" message={fieldErrors.contactName} />
                        </div>

                        <div className="field">
                          <label htmlFor="emergency-phone">{t('Nomor telepon', 'Phone number')} *</label>
                          <input
                            id="emergency-phone"
                            name="emergency-phone"
                            type="tel"
                            value={formData.emergency.contactPhone}
                            onChange={(e) => updateEmergency('contactPhone', e.target.value)}
                            onBlur={(e) => {
                              const normalized = normalizeIndonesianPhone(e.currentTarget.value);
                              if (normalized) updateEmergency('contactPhone', normalized);
                            }}
                            placeholder="08xx xxxx xxxx"
                            aria-invalid={Boolean(fieldErrors.contactPhone)}
                            aria-describedby={fieldErrors.contactPhone ? 'emergency-phone-error' : undefined}
                            required
                          />
                          <InlineFieldError key={validationRevision} id="emergency-phone-error" message={fieldErrors.contactPhone} />
                        </div>

                        <div className="field">
                          <label htmlFor="relationship">{t('Hubungan', 'Relationship')} *</label>
                          <select
                            id="relationship"
                            name="relationship"
                            value={formData.emergency.contactRelationship}
                            onChange={(e) => updateEmergency('contactRelationship', e.target.value)}
                            aria-invalid={Boolean(fieldErrors.contactRelationship)}
                            aria-describedby={fieldErrors.contactRelationship ? 'relationship-error' : undefined}
                            required
                          >
                            <option value="">{t('Pilih hubungan', 'Select relationship')}</option>
                            <option value="parent">{t('Orang tua / wali', 'Parent / guardian')}</option>
                            <option value="partner">{t('Pasangan', 'Spouse / partner')}</option>
                            <option value="sibling">{t('Saudara kandung', 'Sibling')}</option>
                            <option value="relative">{t('Keluarga', 'Relative')}</option>
                            <option value="friend">{t('Teman', 'Friend')}</option>
                            <option value="other">{t('Lainnya', 'Other')}</option>
                          </select>
                          <InlineFieldError key={validationRevision} id="relationship-error" message={fieldErrors.contactRelationship} />
                        </div>

                        <div className="field sm:col-span-2">
                          <label htmlFor="medical">{t('Kondisi medis yang perlu diketahui', 'Known medical conditions')}</label>
                          <textarea
                            id="medical"
                            name="medical"
                            rows={4}
                            value={formData.emergency.medicalConditions}
                            onChange={(e) => updateEmergency('medicalConditions', e.target.value)}
                            placeholder={t('Alergi, riwayat penyakit, atau obat rutin (bila ada)', 'Allergies, medical history, or regular medication (if any)')}
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => goToStep('personal')}
                          className="btn border border-[var(--line)] bg-white cursor-pointer"
                        >
                          {t('← Kembali', '← Back')}
                        </button>
                        <button
                          type="button"
                          onClick={handleNextEmergency}
                          className="btn lime !px-6 font-extrabold cursor-pointer"
                        >
                          <span>{t('Lanjutkan', 'Continue')}</span>
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Summary */}
                  {currentStep === 'summary' && (
                    <div className="wizard-panel step-enter">
                      <div className="mb-7">
                        <p className="eyebrow mb-2 text-[var(--blue)]">{t('Langkah 3 dari 3', 'Step 3 of 3')}</p>
                        <h2 className="text-2xl font-black tracking-tight text-[var(--ink)]">{t('Ringkasan pendaftaran', 'Registration summary')}</h2>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                          {t('Periksa kembali semua data sebelum melanjutkan ke pembayaran.', 'Review all details before continuing to payment.')}
                        </p>
                      </div>

                      <dl className="divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] px-4">
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">{t('Nama lengkap', 'Full name')}</dt>
                          <dd className="break-words text-sm font-semibold text-[var(--ink)]">{formData.personal.fullName || '—'}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">{t('Email', 'Email')}</dt>
                          <dd className="break-words text-sm font-semibold text-[var(--ink)]">{formData.personal.email || '—'}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">{t('Nomor WhatsApp', 'WhatsApp number')}</dt>
                          <dd className="break-words text-sm font-semibold text-[var(--ink)]">{formData.personal.phone || '—'}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">{t('Tanggal lahir', 'Date of birth')}</dt>
                          <dd className="text-sm font-semibold text-[var(--ink)]">{formattedBirthDate}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">{t('Gender', 'Gender')}</dt>
                          <dd className="text-sm font-semibold text-[var(--ink)]">
                            {formData.personal.gender === 'male' ? t('Laki-laki', 'Male') : formData.personal.gender === 'female' ? t('Perempuan', 'Female') : '—'}
                          </dd>
                        </div>
                        {formData.personal.instagram && (
                          <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                            <dt className="text-xs font-bold text-[var(--muted)]">Instagram</dt>
                            <dd className="break-words text-sm font-semibold text-[var(--ink)]">{formData.personal.instagram}</dd>
                          </div>
                        )}
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">{t('Profil Strava', 'Strava profile')}</dt>
                          <dd className="break-words text-sm font-semibold text-[var(--ink)]">{formData.personal.strava}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">{t('Nama kontak darurat', 'Emergency contact name')}</dt>
                          <dd className="break-words text-sm font-semibold text-[var(--ink)]">{formData.emergency.contactName || '—'}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">{t('Nomor kontak darurat', 'Emergency phone')}</dt>
                          <dd className="break-words text-sm font-semibold text-[var(--ink)]">{formData.emergency.contactPhone || '—'}</dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">{t('Hubungan', 'Relationship')}</dt>
                          <dd className="text-sm font-semibold text-[var(--ink)]">
                            {relationshipLabels[formData.emergency.contactRelationship] || '—'}
                          </dd>
                        </div>
                        <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr]">
                          <dt className="text-xs font-bold text-[var(--muted)]">{t('Kondisi medis', 'Known medical conditions')}</dt>
                          <dd className="whitespace-pre-wrap break-words text-sm font-semibold text-[var(--ink)]">
                            {formData.emergency.medicalConditions || t('Tidak ada', 'None')}
                          </dd>
                        </div>
                      </dl>

                      {/* Agreement Checkbox */}
                      <div className="mt-6 rounded-2xl bg-[var(--paper)] p-5">
                        <h3 className="font-extrabold text-[var(--ink)]">{t('Persetujuan pendaftaran', 'Registration agreements')}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                          {t('Baca ringkasan ketentuan acara dan penggunaan data sebelum menyelesaikan pendaftaran.', 'Review the event terms and how your information is used before completing registration.')}
                        </p>
                        <label htmlFor="terms-consent" className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--ink)]">
                          <input
                            id="terms-consent"
                            type="checkbox"
                            checked={isAgreed}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setAgreed(checked);
                              if (checked) {
                                setFieldErrors((previous) => {
                                  const next = { ...previous };
                                  delete next.consent;
                                  return next;
                                });
                              }
                            }}
                            aria-invalid={Boolean(fieldErrors.consent)}
                            aria-describedby={fieldErrors.consent ? 'consent-error' : undefined}
                            className="mt-1 h-4 w-4 shrink-0 accent-[var(--blue)] cursor-pointer"
                          />
                          <span>{t('Saya menyetujui Syarat & Ketentuan dan telah membaca Kebijakan Privasi.', 'I agree to the Terms & Conditions and have read the Privacy Policy.')}</span>
                        </label>
                        <div className="pl-7">
                          <InlineFieldError key={validationRevision} id="consent-error" message={fieldErrors.consent} />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 pl-7 text-sm font-bold text-[var(--blue)]">
                          <button
                            type="button"
                            onClick={() => openPolicyModal('terms')}
                            className="underline underline-offset-4 cursor-pointer hover:text-[var(--ink)]"
                          >
                            {t('Baca Syarat & Ketentuan', 'Read Terms & Conditions')}
                          </button>
                          <button
                            type="button"
                            onClick={() => openPolicyModal('privacy')}
                            className="underline underline-offset-4 cursor-pointer hover:text-[var(--ink)]"
                          >
                            {t('Baca Kebijakan Privasi', 'Read Privacy Policy')}
                          </button>
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => goToStep('emergency')}
                          className="btn border border-[var(--line)] bg-white cursor-pointer"
                        >
                          {t('← Kembali', '← Back')}
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn lime !px-6 font-extrabold cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitting ? t('Memproses...', 'Processing...') : 'Register & Pay'}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}

              {/* Sticky Summary Card */}
              <aside id="registration-summary" className="registration-summary space-y-4 lg:sticky lg:top-32">
                <div className="panel overflow-hidden">
                  <div className="summary-desktop-heading bg-[var(--blue)] p-5 text-white">
                    <p className="eyebrow text-white/70">{t('Ringkasan pendaftaran', 'Registration summary')}</p>
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
                      <span className="eyebrow text-white/70">{t('Ringkasan pendaftaran', 'Registration summary')}</span>
                      <strong>{category.name}</strong>
                    </span>
                    <strong className="summary-mobile-price">
                      Rp{category.price.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}
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
                        <p className="text-sm font-bold text-[var(--ink)]">{t('Sabtu, 19 Desember 2026', 'Saturday, 19 December 2026')}</p>
                        <p className="mt-1 text-xs text-[var(--muted)]">Departmen Sports Lab, Bandung</p>
                      </div>
                    </div>

                    <div className="border-t border-[var(--line)] pt-4">
                      <p className="eyebrow mb-3 text-[var(--muted)]">{t('Termasuk dalam pendaftaran', 'Included with your entry')}</p>
                      <ul className="space-y-2 text-sm text-[var(--ink)]">
                        {category.features && category.features.length > 0 ? (
                          category.features.map((feature, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-[var(--blue)]">✓</span>
                              {feature}
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
                      <span className="text-sm font-semibold text-[var(--ink)]">{t('Biaya per orang', 'Entry fee per person')}</span>
                      <strong className="text-2xl font-black text-[var(--ink)]">
                        Rp{category.price.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}
                      </strong>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {/* Terms Modal Dialog */}
          {isTermsOpen && (
            <div
              className={`policy-modal-backdrop${closingPolicyModal === 'terms' ? ' is-closing' : ''}`}
              onClick={() => closePolicyModal('terms')}
            >
              <div className="policy-modal" onClick={(e) => e.stopPropagation()}>
                <div className="flex max-h-[82vh] flex-col">
                  <header className="flex items-start justify-between gap-4 border-b border-[var(--line)] p-5 sm:p-7">
                    <div>
                      <p className="eyebrow mb-2 text-[var(--blue)]">Share Your Distance Vol 4.0</p>
                      <h2 className="text-2xl font-black text-[var(--ink)]">{t('Syarat & Ketentuan', 'Terms & Conditions')}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => closePolicyModal('terms')}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--line)] text-xl cursor-pointer hover:bg-neutral-100"
                    >
                      ×
                    </button>
                  </header>
                  <div className="overflow-y-auto p-5 text-sm leading-relaxed sm:p-7 text-[var(--ink)]">
                    <p className="mb-5 text-[var(--muted)]">
                      {t('Dengan mendaftar, Anda menyetujui ketentuan berikut untuk mengikuti acara Share Your Distance.', 'By registering, you agree to the following terms for participating in Share Your Distance.')}
                    </p>
                    <ol className="list-decimal space-y-5 pl-5">
                      <li>
                        <strong>{t('Informasi pendaftaran', 'Registration information')}</strong>
                        <p className="mt-1 text-[var(--muted)]">
                          {t('Berikan informasi pendaftaran yang akurat dan terkini. Peserta individu akan ditempatkan ke dalam tim oleh panitia.', 'Provide accurate and current registration information. Individual participants will be assigned to a team by the organizers.')}
                        </p>
                      </li>
                      <li>
                        <strong>{t('Usia, kesehatan, dan keselamatan', 'Age, health, and safety')}</strong>
                        <p className="mt-1 text-[var(--muted)]">
                          {t('Peserta harus berusia minimal 17 tahun pada tanggal acara. Pastikan kondisi kesehatan memungkinkan Anda mengikuti kegiatan, dan patuhi aturan lomba serta arahan keselamatan panitia.', 'Participants must be at least 17 years old on the event date. Make sure your health allows you to take part, and follow race rules and organizer safety instructions.')}
                        </p>
                      </li>
                      <li>
                        <strong>{t('Biaya dan perubahan acara', 'Fees and event changes')}</strong>
                        <p className="mt-1 text-[var(--muted)]">
                          {t('Biaya pendaftaran tidak dapat dikembalikan atau dialihkan, termasuk karena cedera, sakit, atau keadaan darurat pribadi. Jika keadaan tak terduga mengharuskan perubahan tanggal, lokasi, atau format acara, panitia akan menyampaikan informasinya kepada peserta.', 'Registration fees are non-refundable and non-transferable, including in cases of injury, illness, or personal emergencies. If unforeseen circumstances require a change to the event date, location, or format, the organizers will inform participants.')}
                        </p>
                      </li>
                    </ol>
                  </div>
                  <footer className="border-t border-[var(--line)] p-5 text-right sm:px-7">
                    <button
                      type="button"
                      onClick={() => closePolicyModal('terms')}
                      className="btn lime !min-h-11 !px-5 !py-2 cursor-pointer font-extrabold"
                    >
                      {t('Tutup', 'Close')}
                    </button>
                  </footer>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Modal Dialog */}
          {isPrivacyOpen && (
            <div
              className={`policy-modal-backdrop${closingPolicyModal === 'privacy' ? ' is-closing' : ''}`}
              onClick={() => closePolicyModal('privacy')}
            >
              <div className="policy-modal" onClick={(e) => e.stopPropagation()}>
                <div className="flex max-h-[82vh] flex-col">
                  <header className="flex items-start justify-between gap-4 border-b border-[var(--line)] p-5 sm:p-7">
                    <div>
                      <p className="eyebrow mb-2 text-[var(--blue)]">Share Your Distance Vol 4.0</p>
                      <h2 className="text-2xl font-black text-[var(--ink)]">{t('Kebijakan Privasi', 'Privacy Policy')}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => closePolicyModal('privacy')}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--line)] text-xl cursor-pointer hover:bg-neutral-100"
                    >
                      ×
                    </button>
                  </header>
                  <div className="overflow-y-auto p-5 text-sm leading-relaxed sm:p-7 text-[var(--ink)]">
                    <p className="mb-5 text-[var(--muted)]">
                      {t('Informasi yang Anda berikan digunakan untuk mengelola pendaftaran dan mendukung keselamatan peserta selama acara.', 'Information you provide is used to manage registration and support participant safety during the event.')}
                    </p>
                    <ol className="list-decimal space-y-5 pl-5">
                      <li>
                        <strong>{t('Informasi yang dikumpulkan', 'Information collected')}</strong>
                        <p className="mt-1 text-[var(--muted)]">
                          {t('Formulir meminta nama, email, nomor telepon, tanggal lahir, gender, kontak darurat dan hubungannya dengan Anda, serta informasi kondisi medis. Profil Instagram bersifat opsional, sedangkan URL profil Strava wajib diisi dan profilnya harus publik.', 'The form requests your name, email, phone number, date of birth, gender, emergency contact and their relationship to you, and medical information. Instagram is optional; a public Strava profile URL is required.')}
                        </p>
                      </li>
                      <li>
                        <strong>{t('Penggunaan dan pembagian informasi', 'Use and sharing')}</strong>
                        <p className="mt-1 text-[var(--muted)]">
                          {t('Informasi digunakan untuk memproses pendaftaran, menyampaikan informasi acara, dan membantu keselamatan atau layanan medis darurat. Informasi yang diperlukan dapat dibagikan kepada tim operasional acara, penyedia layanan acara, atau petugas medis untuk keperluan tersebut.', 'Information is used to process registration, send event updates, and support safety or emergency medical care. Necessary information may be shared with event operations, event service providers, or medical personnel for these purposes.')}
                        </p>
                      </li>
                      <li>
                        <strong>{t('Penyimpanan dan hak Anda', 'Retention and your rights')}</strong>
                        <p className="mt-1 text-[var(--muted)]">
                          {t('Informasi disimpan selama diperlukan untuk mengelola acara dan memenuhi kewajiban administrasi atau hukum. Anda dapat meminta akses, koreksi, atau penghapusan informasi dengan menghubungi penyelenggara melalui kanal kontak resmi yang tercantum di situs.', 'Information is retained as needed to manage the event and meet administrative or legal obligations. You may request access, correction, or deletion by contacting the organizers through the official contact channel listed on the site.')}
                        </p>
                      </li>
                    </ol>
                  </div>
                  <footer className="border-t border-[var(--line)] p-5 text-right sm:px-7">
                    <button
                      type="button"
                      onClick={() => closePolicyModal('privacy')}
                      className="btn lime !min-h-11 !px-5 !py-2 cursor-pointer font-extrabold"
                    >
                      {t('Tutup', 'Close')}
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
