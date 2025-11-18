export interface RaceCategory {
  id: string;
  name: string;
  description: string;
  price: number;
  distance: string;
  features: string[],
  category_features?: {
    features: string,
    display_order: number
  };
  recommended: Boolean;
  requirements?: {
    minAge?: number;
    maxAge?: number;
    healthWarning?: string;
  };
}

export const raceCategories: RaceCategory[] = [
  {
    id: 'speed-race-500m',
    name: 'Speed Race 500M',
    description: 'A quick and intense sprint for speed enthusiasts',
    price: 75000,
    distance: '500 meters',
    features: [
      'Race Bib Number',
      'Finisher Medal', 
      'Event T-shirt',
      'Timing Chip',
      'Hydration Support'
    ],
    recommended: false,
    requirements: {
      minAge: 12,
      // healthWarning: 'This race involves high intensity running. Please consult your doctor if you have heart conditions.'
    }
  },
  {
    id: 'estafet-200m', 
    name: 'Estafet 200M',
    description: 'Team-based relay race. Gather your squad and experience the thrill of teamwork.',
    price: 200000,
    distance: '200 meters per person',
    features: [
      'Team Registration (4 persons)',
      'Team Bib Numbers',
      'Finisher Medals for All',
      'Team T-shirts',
      'Team Photo Session'
    ],
    recommended: true,
    requirements: {
      minAge: 15,
      maxAge: 65
    }
  },
  {
    id: 'looping-challenge',
    name: 'Looping Challenge', 
    description: 'Endurance test with multiple loops',
    price: 125000,
    distance: '5KM looping course',
    features: [
      'Race Bib Number',
      'Finisher Medal',
      'Performance T-shirt', 
      'Digital Certificate',
      'Nutrition Support'
    ],
    recommended: false,
    requirements: {
      minAge: 16,
      healthWarning: 'Endurance race requiring good physical condition. Training recommended.'
    }
  }
];

// src/data/raceCategories.ts - Update untuk fetch dari Supabase
// import { getAllCategories } from '@/lib/supabase/categories';

// export async function getRaceCategories() {
//   try {
//     return await getAllCategories();
//   } catch (error) {
//     console.error('Failed to fetch categories from Supabase, using fallback data');
//     // Fallback data jika Supabase down
//     return [
//       {
//         id: '1',
//         name: 'Speed Race 500M',
//         description: 'A quick and intense sprint for speed enthusiasts',
//         price: 75000,
//         distance: '500 meters',
//         features: [
//           'Race Bib Number',
//           'Finisher Medal', 
//           'Event T-shirt',
//           'Timing Chip',
//           'Hydration Support'
//         ],
//         recommended: false,
//       },
//     ];
//   }
// }