export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string
          password_hash: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name: string
          password_hash: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          password_hash?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          current_participants: number
          date: string
          description: string | null
          distance: string
          elevation: string | null
          id: string
          image_url: string | null
          location: string
          max_participants: number
          price: number
          registration_open: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_participants?: number
          date: string
          description?: string | null
          distance: string
          elevation?: string | null
          id?: string
          image_url?: string | null
          location: string
          max_participants?: number
          price?: number
          registration_open?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_participants?: number
          date?: string
          description?: string | null
          distance?: string
          elevation?: string | null
          id?: string
          image_url?: string | null
          location?: string
          max_participants?: number
          price?: number
          registration_open?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      participants: {
        Row: {
          birth_date: string
          created_at: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          event_id: string
          full_name: string
          gender: string | null
          id: string
          medical_notes: string | null
          payment_amount: number
          payment_date: string | null
          payment_status: string | null
          phone_number: string
          registration_date: string | null
          unique_code: string
          updated_at: string | null
        }
        Insert: {
          birth_date: string
          created_at?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          event_id: string
          full_name: string
          gender?: string | null
          id?: string
          medical_notes?: string | null
          payment_amount: number
          payment_date?: string | null
          payment_status?: string | null
          phone_number: string
          registration_date?: string | null
          unique_code: string
          updated_at?: string | null
        }
        Update: {
          birth_date?: string
          created_at?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          event_id?: string
          full_name?: string
          gender?: string | null
          id?: string
          medical_notes?: string | null
          payment_amount?: number
          payment_date?: string | null
          payment_status?: string | null
          phone_number?: string
          registration_date?: string | null
          unique_code?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      ra_routes: {
        Row: {
          category: string | null
          city: string | null
          created_at: string | null
          distance_km: number | null
          geojson: Json
          gpx_file_url: string | null
          id: string
          name: string
          slug: string
          source_url: string | null
          start_lat: number | null
          start_lng: number | null
          status: string | null
          thumbnail_url: string | null
        }
        Insert: {
          category?: string | null
          city?: string | null
          created_at?: string | null
          distance_km?: number | null
          geojson: Json
          gpx_file_url?: string | null
          id?: string
          name: string
          slug: string
          source_url?: string | null
          start_lat?: number | null
          start_lng?: number | null
          status?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          category?: string | null
          city?: string | null
          created_at?: string | null
          distance_km?: number | null
          geojson?: Json
          gpx_file_url?: string | null
          id?: string
          name?: string
          slug?: string
          source_url?: string | null
          start_lat?: number | null
          start_lng?: number | null
          status?: string | null
          thumbnail_url?: string | null
        }
        Relationships: []
      }
      ra_submissions: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          name: string
          status: string | null
          strava_url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          status?: string | null
          strava_url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          status?: string | null
          strava_url?: string
        }
        Relationships: []
      }
      ritw_transactions_history: {
        Row: {
          created_at: string | null
          gross_amount: number
          id: string
          participant_id: string
          payment_type: string
          raw_response: Json | null
          transaction_id: string
          transaction_status: string | null
          transaction_time: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          gross_amount: number
          id?: string
          participant_id: string
          payment_type: string
          raw_response?: Json | null
          transaction_id: string
          transaction_status?: string | null
          transaction_time?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          gross_amount?: number
          id?: string
          participant_id?: string
          payment_type?: string
          raw_response?: Json | null
          transaction_id?: string
          transaction_status?: string | null
          transaction_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ritw_transactions_history_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      ss_events: {
        Row: {
          created_at: string | null
          current_participants: number | null
          date: string
          descriptions: string | null
          external_url: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string
          location_url: string | null
          max_participants: number
          name: string
          slug: string
          time: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_participants?: number | null
          date: string
          descriptions?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location: string
          location_url?: string | null
          max_participants: number
          name: string
          slug: string
          time: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_participants?: number | null
          date?: string
          descriptions?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string
          location_url?: string | null
          max_participants?: number
          name?: string
          slug?: string
          time?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ss_members: {
        Row: {
          created_at: string | null
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          full_name: string
          gender: string | null
          id: string
          ig_username: string | null
          is_active: boolean | null
          medical_notes: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          full_name: string
          gender?: string | null
          id?: string
          ig_username?: string | null
          is_active?: boolean | null
          medical_notes?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          full_name?: string
          gender?: string | null
          id?: string
          ig_username?: string | null
          is_active?: boolean | null
          medical_notes?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ss_registrations: {
        Row: {
          code: string
          created_at: string | null
          event_id: string
          id: string
          is_attendance: boolean | null
          member_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          event_id: string
          id?: string
          is_attendance?: boolean | null
          member_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          event_id?: string
          id?: string
          is_attendance?: boolean | null
          member_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ss_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "ss_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ss_registrations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "ss_members"
            referencedColumns: ["id"]
          },
        ]
      }
      ss_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string
          password: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name: string
          password: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          password?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      syd_categories: {
        Row: {
          created_at: string | null
          current_participants: number | null
          description: string
          display_order: number | null
          distance: string
          features: string[]
          id: string
          image_url: string | null
          is_active: boolean | null
          max_participants: number | null
          name: string
          price: number
          recommended: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_participants?: number | null
          description: string
          display_order?: number | null
          distance: string
          features?: string[]
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_participants?: number | null
          name: string
          price: number
          recommended?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_participants?: number | null
          description?: string
          display_order?: number | null
          distance?: string
          features?: string[]
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_participants?: number | null
          name?: string
          price?: number
          recommended?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      syd_contact_messages: {
        Row: {
          category: string | null
          created_at: string | null
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      syd_registrations: {
        Row: {
          category_id: string
          consent_given_at: string | null
          created_at: string | null
          date_of_birth: string
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relationship: string
          external_order_id: string | null
          external_transaction_id: string | null
          full_name: string
          gender: string | null
          id: string
          id_number: string | null
          instagram: string | null
          ip_address: unknown
          medical_conditions: string | null
          nationality: string | null
          payment_date: string | null
          payment_method: string | null
          payment_status: string | null
          phone: string
          registration_number: string
          strava_url: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          category_id: string
          consent_given_at?: string | null
          created_at?: string | null
          date_of_birth: string
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relationship: string
          external_order_id?: string | null
          external_transaction_id?: string | null
          full_name: string
          gender?: string | null
          id?: string
          id_number?: string | null
          instagram?: string | null
          ip_address?: unknown
          medical_conditions?: string | null
          nationality?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          phone: string
          registration_number: string
          strava_url: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          consent_given_at?: string | null
          created_at?: string | null
          date_of_birth?: string
          email?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          emergency_contact_relationship?: string
          external_order_id?: string | null
          external_transaction_id?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          id_number?: string | null
          instagram?: string | null
          ip_address?: unknown
          medical_conditions?: string | null
          nationality?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          phone?: string
          registration_number?: string
          strava_url?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "syd_registrations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "syd_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      syd_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          external_order_id: string
          external_transaction_id: string | null
          fraud_status: string | null
          gateway_response: Json | null
          id: string
          payment_type: string | null
          registration_id: string
          signature_verified: boolean | null
          status: string | null
          status_code: string | null
          time: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          external_order_id: string
          external_transaction_id?: string | null
          fraud_status?: string | null
          gateway_response?: Json | null
          id?: string
          payment_type?: string | null
          registration_id: string
          signature_verified?: boolean | null
          status?: string | null
          status_code?: string | null
          time?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          external_order_id?: string
          external_transaction_id?: string | null
          fraud_status?: string | null
          gateway_response?: Json | null
          id?: string
          payment_type?: string | null
          registration_id?: string
          signature_verified?: boolean | null
          status?: string | null
          status_code?: string | null
          time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "syd_transactions_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "syd_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
