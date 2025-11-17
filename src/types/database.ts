// src/types/database.ts
export interface TypesCategory {
  id: string;
  name: string;
  description: string;
  price: number;
  distance: string;
  image_url?: string;
  recommended: boolean;
  max_participants?: number;
  current_participants: number;
  min_age?: number;
  max_age?: number;
  health_warning?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  category_features?: TypesCategoryFeature[];
}

export interface TypesCategoryFeature {
  id: string;
  category_id: string;
  feature: string;
  display_order: number;
  created_at: string;
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