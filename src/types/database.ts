// src/types/database.ts
export interface TypesCategory {
  id: string;
  name: string;
  description: string;
  price: number;
  distance: string;
  image_url?: string | null;
  recommended: boolean | null;
  max_participants: number | null;
  current_participants: number | null;
  is_active: boolean | null;
  features: string[];
  display_order: number | null;
  created_at: string | null;
  updated_at: string | null;
}

// export interface RaceCategory {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   distance: string;
//   image_url?: string;
//   features: string[];
//   recommended: boolean;
//   requirements?: {
//     minAge?: number;
//     maxAge?: number;
//     healthWarning?: string;
//   };
// }