'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { faqData, faqCategories, FAQItem } from '@/data/faqData';
import Template from "@/components/layout/Template";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All Questions');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = activeCategory === 'All Questions' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Template>
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-950 py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-zinc-400 text-md md:text-lg max-w-2xl mx-auto">
              Find quick answers to common questions about Share Your Distance event.
              {/* Can't find what you're looking for? <Link href="/contact" className="text-primary-400 hover:text-primary-300 underline">Contact us</Link>. */}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Icon
                icon="mdi:magnify"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5"
              />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-600 pl-12 pr-4 py-4 text-white placeholder-zinc-400 focus:border-zinc-100 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {faqCategories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeCategory === category
                    ? 'bg-zinc-600 text-white shadow-lg'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <Icon icon="mdi:help-circle" className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No questions found</h3>
                <p className="text-zinc-400">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              filteredFAQs.map((item) => (
                <FAQItemComponent
                  key={item.id}
                  item={item}
                  isOpen={openItems.includes(item.id)}
                  onToggle={() => toggleItem(item.id)}
                />
              ))
            )}
          </div>

          {/* Contact CTA */}
          <div className="mt-8 text-center">
            <div className="p-8 max-w-2xl mx-auto">
              <Icon icon="mdi:chat-question" className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
              <p className="text-zinc-300 mb-6">
                Our support team is here to help you get the answers you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="mailto:hello@shareyourdistance.id"
                  // className="bg-zinc-700 text-white px-6 py-3 rounded-full hover:bg-zinc-600 transition-colors font-semibold inline-flex items-center justify-center"
                  className="bg-zinc-500 text-white px-8 py-3 rounded-full hover:bg-zinc-600 transition-colors font-semibold inline-flex items-center justify-center"
                >
                  <Icon icon="mdi:email" className="w-5 h-5 mr-2" />
                  Email Us
                </Link>
                <Link
                  href="/contact"
                  // className="border-2 border-zinc-100 text-zinc-100 px-6 py-3 rounded-full hover:bg-zinc-700 hover:border-zinc-700 hover:text-zinc-100 transition-colors font-semibold inline-flex items-center justify-center"
                  className="border-2 border-zinc-500 text-zinc-500 px-8 py-3 rounded-full hover:bg-zinc-500 hover:text-white transition-colors font-semibold inline-flex items-center justify-center"
                >
                  <Icon icon="mdi:message-text" className="w-5 h-5 mr-2" />
                  Contact Form
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Template>
  );
}

// FAQ Item Component
function FAQItemComponent({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-zinc-700 overflow-hidden hover:border-zinc-600 transition-colors">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-stone-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Icon icon="mdi:help-circle" className="w-4 h-4 text-stone-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">{item.question}</h3>
            <span className="text-stone-400 text-sm bg-stone-500/10 px-2 py-1 rounded-full">
              {item.category}
            </span>
          </div>
        </div>
        <Icon
          icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
          className="w-6 h-6 text-zinc-400 flex-shrink-0 ml-4"
        />
      </button>

      {isOpen && (
        <div className="px-6 pb-4">
          <div className="pl-12 border-l-2 border-stone-500/30">
            <p className="text-zinc-300 leading-relaxed">{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}