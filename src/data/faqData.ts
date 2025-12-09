export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export const faqData: FAQItem[] = [
  // Registration & Payment
  {
    id: 1,
    question: "What's included in the registration fee?",
    answer: "Your registration includes: Race bib number, event T-shirt, finisher medal, timing chip (for timed categories), hydration support during the race, medical support, and digital certificate.",
    category: "Registration & Payment"
  },
  {
    id: 2,
    question: "What is the refund policy?",
    answer: "All registration fees are non-refundable and non-transferable. This policy applies to all circumstances including injury, illness, or personal emergencies. We recommend considering race insurance if available.",
    category: "Registration & Payment"
  },
  {
    id: 3,
    question: "Can I change my race category after registering?",
    answer: "Category changes are allowed until 2 weeks before the event, subject to availability and price differences. Contact us at hello@shareyourdistance.online for category change requests.",
    category: "Registration & Payment"
  },

  // Event Day Information
  {
    id: 4,
    question: "Where and when is race pack collection?",
    answer: "Race pack collection will be at Arei Flagship Store on December 20, 2025 (1 day before the event) from 10:00 AM to 6:00 PM. Please bring your registration confirmation and ID for verification.",
    category: "Event Day Information"
  },
  {
    id: 5,
    question: "What should I bring on race day?",
    answer: "Essential items: Race bib (pinned to front), comfortable running attire, proper running shoes, hydration, and your ID. Recommended: Sunscreen, hat, change of clothes, and personal medications.",
    category: "Event Day Information"
  },
  {
    id: 6,
    question: "What happens if it rains on event day?",
    answer: "The event will proceed rain or shine unless there are dangerous weather conditions (lightning, heavy storm). Please check our website and social media for updates on the morning of the event.",
    category: "Event Day Information"
  },

  // Race Categories & Rules
  {
    id: 7,
    question: "What are the age requirements for each category?",
    answer: "Speed Race 500M: 12+ years, Estafet 200M: 15+ years, Looping Challenge: 16+ years. Participants under 18 require parental consent during registration.",
    category: "Race Categories & Rules"
  },
  {
    id: 8,
    question: "Are there timing chips for all categories?",
    answer: "Yes, all categories will have timing chips. Speed Race 500M and Looping Challenge will have individual timing. Estafet 200M will have team timing with baton tracking.",
    category: "Race Categories & Rules"
  },
  {
    id: 9,
    question: "Can I run with headphones or music?",
    answer: "For safety reasons, we recommend keeping one ear open to hear announcements and other participants. Bone conduction headphones are preferred over noise-canceling earbuds.",
    category: "Race Categories & Rules"
  },

  // Health & Safety
  {
    id: 10,
    question: "What medical support is available during the event?",
    answer: "We have medical teams stationed throughout the course, ambulance services, and first aid stations at the start/finish area. Please disclose any medical conditions during registration.",
    category: "Health & Safety"
  },
  {
    id: 11,
    question: "Is there a bag drop facility?",
    answer: "Yes, secure bag drop facilities will be available near the start line. We recommend not leaving valuables and using the clear plastic bags provided for easy identification.",
    category: "Health & Safety"
  },

  // Results & Certificates
  {
    id: 12,
    question: "When will race results be available?",
    answer: "Preliminary results will be available on our website within 2 hours after each category finishes. Final official results will be published within 24 hours.",
    category: "Results & Certificates"
  },
  {
    id: 13,
    question: "How do I get my digital certificate?",
    answer: "Digital certificates will be emailed to all finishers within 3 days after the event. You can also download them from your registration dashboard on our website.",
    category: "Results & Certificates"
  }
];

export const faqCategories = [
  "All Questions",
  "Registration & Payment",
  "Event Day Information",
  "Race Categories & Rules",
  "Health & Safety",
  "Results & Certificates"
];