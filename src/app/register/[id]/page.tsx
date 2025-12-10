'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from "react-toastify";

import PersonalInfoForm from '@/components/PersonalInfoForm';
import EmergencyContactForm from '@/components/EmergencyContactForm';
import RegistrationSummary from '@/components/RegistrationSummary';
import Button from '@/components/ui/Button';
import Template from "@/components/layout/Template";
import Loading from "@/components/ui/Loading";
import { categoryService } from "@/lib/supabase/service/categories/services";
import { TypesCategory } from "@/types/database";
import { supabase } from "@/lib/supabase/client";
import CompletePayment from "@/components/CompletePayment";

type FormStep = 'personal' | 'emergency' | 'summary' | 'payment';

export default function RegistrationPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const [isLoading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [category, setCategory] = useState<TypesCategory>()
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [isAgreed, setAgreed] = useState(false)
  const [formData, setFormData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      instagram: ''
    },
    emergency: {
      contactName: '',
      contactPhone: '',
      contactRelationship: '',
      medicalConditions: '',
      allergies: '',
    },
  });
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    (async () => {
      try {
        // const data = await categoryService.getById(categoryId);
        const { data } = await supabase
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
        setCategory(data)
        setTimeout(() => {
          setLoading(false)
        }, 500);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, []);

  const updateFormData = (section: keyof typeof formData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const validateFormPersonal = () => {
    const messages = [];
    if (!formData.personal.fullName) messages.push('Full Name required!')
    if (!formData.personal.email) messages.push('Email required!')
    else if (!/\S+@\S+\.\S+/.test(formData.personal.email)) messages.push("Email is invalid!");
    if (!formData.personal.phone) messages.push('Phone Number required!')
    if (!formData.personal.dateOfBirth) messages.push('Date of Birth required!')
    if (!formData.personal.gender) messages.push('Gender required!')
    return messages;
  };

  const validateFormEmergency = () => {
    const messages = [];
    if (!formData.emergency.contactName) messages.push('Contact Name required!')
    if (!formData.emergency.contactPhone) messages.push('Phone Number required!')
    if (!formData.emergency.contactRelationship) messages.push('Relationship required!')
    return messages;
  };

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const steps: FormStep[] = ['personal', 'emergency', 'summary', 'payment'];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex === 0) {
      const msgs = validateFormPersonal();
      if (msgs.length > 0) {
        return msgs.forEach((msg) => toast.warning(msg));
      }
    } else if (currentIndex === 1) {
      const msgs = validateFormEmergency();
      if (msgs.length > 0) {
        return msgs.forEach((msg) => toast.warning(msg));
      }
    } else if (currentIndex === 2) {

    }

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const steps: FormStep[] = ['personal', 'emergency', 'summary', 'payment'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    if (currentStep === 'summary') {
      if (!isAgreed) {
        toast.warning('Please check I understand and agree to these terms!');
        return;
      }

      setIsSubmitting(true);

      try {
        // 1. Prepare registration data
        const registrationData = {
          category_id: category?.id,
          // Personal Information
          full_name: formData.personal.fullName,
          email: formData.personal.email,
          phone: formData.personal.phone,
          date_of_birth: formData.personal.dateOfBirth,
          gender: formData.personal.gender,
          instagram: formData.personal.instagram,
          // Emergency Contact & Medical
          emergency_contact_name: formData.emergency.contactName,
          emergency_contact_phone: formData.emergency.contactPhone,
          emergency_contact_relationship: formData.emergency.contactRelationship,
          medical_conditions: formData.emergency.medicalConditions,
          // Payment
          total_amount: category?.price,
        };

        // console.log('Submitting registration:', registrationData);

        // 2. Send to API route
        const response = await fetch('/api/registrations-v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData),
        });

        const result = await response.json();

        // console.log('Registration created:', result);

        if (!response.ok) {
          throw new Error(result.message || 'Failed to submit registration');
        }

        // 3. Show success message
        toast.success('Registration submitted successfully!');

        // 4. Redirect to payment page
        setTimeout(() => {
          setOrderData(result.data)
          nextStep();
        }, 500);
      } catch (error) {
        // console.error('Registration submission error:', error);

        // Show error message
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to submit registration. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Continue to next step for non-summary steps
      nextStep();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <PersonalInfoForm
            data={formData.personal}
            onChange={(data) => updateFormData('personal', data)}
            category={category}
          />
        );
      case 'emergency':
        return (
          <EmergencyContactForm
            data={formData.emergency}
            onChange={(data) => updateFormData('emergency', data)}
          />
        );
      case 'summary':
        return (
          <RegistrationSummary
            data={formData}
            category={category}
            isCheck={isAgreed}
            onCheck={() => setAgreed(!isAgreed)}
            onSubmit={handleSubmit}
          />
        );
      case 'payment':
        return (
          <CompletePayment data={orderData} />
        );
    }
  };

  return (
    <Template>
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-950 py-6 md:py-12">
        {!isLoading && !category ? (
          <div className="text-center text-white min-h-screen flex justify-center items-center flex-col">
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <p>The race category you're looking for doesn't exist.</p>
          </div>
        ) : null}
        {isLoading && <Loading />}

        {!isLoading && category && (
          <div className="container mx-auto px-6 max-w-4xl py-20">

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-xl md:text-4xl font-bold text-white mb-2">
                Register for {category.name}
              </h1>
              <p className="text-xs md:text-base text-zinc-400">{category.description}</p>
              <div className="text-primary-400 text-2xl font-semibold mt-2">
                IDR {category.price.toLocaleString()}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {['Personal Info', 'Emergency', 'Summary', 'Payment'].map((step, index) => {
                  const stepKey = ['personal', 'emergency', 'summary', 'payment'][index];
                  const isActive = currentStep === stepKey;
                  const isCompleted = ['personal', 'emergency', 'summary', 'payment'].indexOf(currentStep) > index;

                  return (
                    <div key={step} className="text-center flex-1">
                      <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-sm font-semibold ${isActive ? 'bg-zinc-500 text-white' :
                        isCompleted ? 'bg-green-500 text-white' : 'bg-neutral-700 text-neutral-400'
                        }`}>
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      <div className={`text-xs mt-2 ${isActive ? 'text-primary-400' : 'text-neutral-500'
                        }`}>
                        {step}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-2">
                <div
                  className="bg-zinc-100 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(['personal', 'emergency', 'summary', 'payment'].indexOf(currentStep) + 1) * 25}%`
                  }}
                />
              </div>
            </div>

            {/* Form Content */}
            <div className="border border-zinc-100 p-4 md:p-8">
              {renderStep()}

              {/* Navigation Buttons */}
              {currentStep !== 'payment' && (
                <div className="flex justify-between mt-8 pt-6 border-t border-neutral-700">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 'personal'}
                  >
                    Previous
                  </Button>

                  {currentStep === 'summary' ? (
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      isLoading={isSubmitting}
                      className=" text-zinc-900 border-white"
                    >
                      Registration & Pay
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={nextStep}
                      className=" text-zinc-900 border-white"
                    >
                      Continue
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Template>
  );


}