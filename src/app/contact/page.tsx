'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '@/components/ui/Button';
import Template from "@/components/layout/Template";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'General'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    //  // Simulate form submission
    // await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const { success, message } = await response.json();
      if (success) {
        toast.success(message)
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          category: 'General'
        });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  // const sendEmail = async () => {
  //   const res = await fetch("/api/send-email", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ to: 'muhamadt84@gmail.com', subject: 'Subject Test Dev', message: 'Lorem ipsum solor sit amet' }),
  //   });
  //   const result = await res.json();
  //   console.log({ result });
  // };

  const contactMethods = [
    {
      icon: 'mdi:email',
      title: 'Email Us',
      description: 'Send us an email anytime',
      details: 'hello@shareyourdistance.online',
      link: 'mailto:hello@shareyourdistance.online',
      color: 'text-zinc-400'
    },
    {
      icon: 'mdi:phone',
      title: 'Call Us',
      description: 'Mon-Fri from 9am to 5pm',
      details: '+62 123 4567 890',
      link: 'tel:+621234567890',
      color: 'text-zinc-400'
    },
    // {
    //   icon: 'mdi:map-marker',
    //   title: 'Visit Us',
    //   description: 'Our event venue',
    //   details: 'Gedung Sate, Bandung',
    //   link: 'https://maps.google.com/?q=Gedung+Sate,Bandung',
    //   color: 'text-orange-400'
    // },
    // {
    //   icon: 'mdi:clock',
    //   title: 'Response Time',
    //   description: 'We typically respond within',
    //   details: '24 hours',
    //   color: 'text-purple-400'
    // }
  ];

  const inquiryCategories = [
    { value: 'General', label: 'General Inquiry' },
    { value: 'Registration', label: 'Registration Help' },
    { value: 'Payment', label: 'Payment Issue' },
    { value: 'Partnership', label: 'Partnership' },
    { value: 'Media', label: 'Media Inquiry' },
    { value: 'Other', label: 'Other' }
  ];

  const socialMedia = [
    { icon: 'mdi:whatsapp', label: 'Instagram', url: '#' },
    { icon: 'mdi:instagram', label: 'Instagram', url: '#' },
    { icon: 'mdi:twitter', label: 'Twitter', url: '#' },
    // { icon: 'mdi:facebook', label: 'Facebook', url: '#' },
    // { icon: 'mdi:youtube', label: 'YouTube', url: '#' }
  ]

  const baseClasses = "w-full bg-zinc-800 border border-zinc-600 px-4 py-3 text-white focus:border-zinc-100 focus:outline-none transition-colors"

  return (
    <Template>
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-950 py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-zinc-400 text-md md:text-lg max-w-2xl mx-auto">
              Have questions about Share Your Distance? We're here to help!
              Get in touch with our team and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="border border-zinc-700 p-4 md:p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Icon icon="mdi:chat-processing" className="w-6 h-6 mr-3 text-primary-400" />
                  Get in Touch
                </h2>

                {/* Contact Methods */}
                <div className="space-y-6 mb-8">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0 ${method.color}`}>
                        <Icon icon={method.icon} className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{method.title}</h3>
                        {/* <p className="text-zinc-400 text-sm mb-1">{method.description}</p> */}
                        {method.link ? (
                          <a
                            href={method.link}
                            className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                          >
                            {method.details}
                          </a>
                        ) : (
                          <p className="text-primary-400 text-sm font-medium">{method.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {socialMedia.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-700 transition-all duration-300"
                        aria-label={social.label}
                      >
                        <Icon icon={social.icon} className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="border border-zinc-700 p-4 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Icon icon="mdi:email-send" className="w-6 h-6 mr-3 text-primary-400" />
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Message success */}
                  {/* <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-400 mr-2" />
                        <div>
                          <h4 className="text-green-300 font-semibold">Message Sent Successfully!</h4>
                          <p className="text-green-200 text-sm">
                            Thank you for contacting us. We've sent a confirmation to your email and will respond within 24 hours.
                          </p>
                        </div>
                      </div>
                    </div> */}

                  {/* Message failed */}
                  {/* <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-400 mr-2" />
                        <div>
                          <h4 className="text-red-300 font-semibold">Failed to Send Message</h4>
                          <p className="text-red-200 text-sm">
                            { errorMessage || 'Please try again later or contact us directly at hello@shareyourdistance.online'}
                          </p>
                        </div>
                      </div>
                    </div>*/}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={baseClasses}
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={baseClasses}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-white text-sm font-medium mb-2">
                        Inquiry Type *
                      </label>
                      <div className={baseClasses}>
                        <select
                          id="category"
                          name="category"
                          required
                          value={formData.category}
                          onChange={handleChange}
                          className=" focus:outline-none w-full"
                        >
                          {inquiryCategories.map(category => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-white text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className={baseClasses}
                        placeholder="Brief subject of your message"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-white text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className={baseClasses}
                      placeholder="Please describe your inquiry in detail..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full text-zinc-950"
                  >
                    {!isSubmitting && <Icon icon="mdi:send" className="w-5 h-5 mr-2" />}
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Template>
  );
}