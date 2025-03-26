export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      age_groups: {
        Row: {
          age_group: string
          age_id: number
        }
        Insert: {
          age_group: string
          age_id?: number
        }
        Update: {
          age_group?: string
          age_id?: number
        }
        Relationships: []
      }
      "Awareness_Attitude_2019-2024": {
        Row: {
          awareness_level: number | null
          brand: string | null
          brand_attitude: number | null
          brand_id: number | null
          country: string | null
          industry: string | null
          industry_id: number | null
          row_id: number
          year: number | null
        }
        Insert: {
          awareness_level?: number | null
          brand?: string | null
          brand_attitude?: number | null
          brand_id?: number | null
          country?: string | null
          industry?: string | null
          industry_id?: number | null
          row_id: number
          year?: number | null
        }
        Update: {
          awareness_level?: number | null
          brand?: string | null
          brand_attitude?: number | null
          brand_id?: number | null
          country?: string | null
          industry?: string | null
          industry_id?: number | null
          row_id?: number
          year?: number | null
        }
        Relationships: []
      }
      General_brand_attitude: {
        Row: {
          brand: string | null
          brand_attitude: number | null
          brand_id: number | null
          country: string | null
          industry: string | null
          industry_id: number | null
          row_id: number
          year: number | null
        }
        Insert: {
          brand?: string | null
          brand_attitude?: number | null
          brand_id?: number | null
          country?: string | null
          industry?: string | null
          industry_id?: number | null
          row_id: number
          year?: number | null
        }
        Update: {
          brand?: string | null
          brand_attitude?: number | null
          brand_id?: number | null
          country?: string | null
          industry?: string | null
          industry_id?: number | null
          row_id?: number
          year?: number | null
        }
        Relationships: []
      }
      General_brand_awareness: {
        Row: {
          Awareness_level: number | null
          Brand: string | null
          Brand_id: number | null
          Country: string | null
          Industry: string | null
          Industry_id: number | null
          Row_id: number
          Year: number | null
        }
        Insert: {
          Awareness_level?: number | null
          Brand?: string | null
          Brand_id?: number | null
          Country?: string | null
          Industry?: string | null
          Industry_id?: number | null
          Row_id?: number
          Year?: number | null
        }
        Update: {
          Awareness_level?: number | null
          Brand?: string | null
          Brand_id?: number | null
          Country?: string | null
          Industry?: string | null
          Industry_id?: number | null
          Row_id?: number
          Year?: number | null
        }
        Relationships: []
      }
      materiality_areas__age_sbi: {
        Row: {
          age_id: number
          country: string
          materiality_area: string
          percentage: number
          row_id: number
          year: number
        }
        Insert: {
          age_id: number
          country: string
          materiality_area: string
          percentage: number
          row_id?: number
          year: number
        }
        Update: {
          age_id?: number
          country?: string
          materiality_area?: string
          percentage?: number
          row_id?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "materiality_areas_sbi_age_id_fkey"
            columns: ["age_id"]
            isOneToOne: false
            referencedRelation: "age_groups"
            referencedColumns: ["age_id"]
          },
        ]
      }
      materiality_areas_general_sbi: {
        Row: {
          country: string
          materiality_area: string
          percentage: number
          row_id: number
          year: number
        }
        Insert: {
          country: string
          materiality_area: string
          percentage: number
          row_id?: number
          year: number
        }
        Update: {
          country?: string
          materiality_area?: string
          percentage?: number
          row_id?: number
          year?: number
        }
        Relationships: []
      }
      "Merged Brand Awareness Attitude 2019-2024": {
        Row: {
          brand: string | null
          brand_attitude: number | null
          brand_awareness: number | null
          brand_id: number | null
          country: string | null
          industry: string | null
          industry_id: number | null
          row_id: number
          year: number | null
        }
        Insert: {
          brand?: string | null
          brand_attitude?: number | null
          brand_awareness?: number | null
          brand_id?: number | null
          country?: string | null
          industry?: string | null
          industry_id?: number | null
          row_id: number
          year?: number | null
        }
        Update: {
          brand?: string | null
          brand_attitude?: number | null
          brand_awareness?: number | null
          brand_id?: number | null
          country?: string | null
          industry?: string | null
          industry_id?: number | null
          row_id?: number
          year?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      "SBI Average Scores": {
        Row: {
          country: string | null
          "row id": number
          score: number | null
          year: number | null
        }
        Insert: {
          country?: string | null
          "row id": number
          score?: number | null
          year?: number | null
        }
        Update: {
          country?: string | null
          "row id"?: number
          score?: number | null
          year?: number | null
        }
        Relationships: []
      }
      "SBI Ranking Scores 2011-2025": {
        Row: {
          Brand: string | null
          Country: string | null
          industry: string | null
          "Row ID": number
          Score: number | null
          Year: number | null
        }
        Insert: {
          Brand?: string | null
          Country?: string | null
          industry?: string | null
          "Row ID": number
          Score?: number | null
          Year?: number | null
        }
        Update: {
          Brand?: string | null
          Country?: string | null
          industry?: string | null
          "Row ID"?: number
          Score?: number | null
          Year?: number | null
        }
        Relationships: []
      }
      SBI_Discussion_Topics_Geography: {
        Row: {
          country: string | null
          discussion_topic: string | null
          geography: string | null
          percentage: number | null
          row_id: number
          year: number
        }
        Insert: {
          country?: string | null
          discussion_topic?: string | null
          geography?: string | null
          percentage?: number | null
          row_id?: number
          year: number
        }
        Update: {
          country?: string | null
          discussion_topic?: string | null
          geography?: string | null
          percentage?: number | null
          row_id?: number
          year?: number
        }
        Relationships: []
      }
      swe_brand_areas_rated: {
        Row: {
          area: string | null
          area_code: number | null
          brand: string | null
          rating_type: string | null
          respondent_id: number | null
        }
        Insert: {
          area?: string | null
          area_code?: number | null
          brand?: string | null
          rating_type?: string | null
          respondent_id?: number | null
        }
        Update: {
          area?: string | null
          area_code?: number | null
          brand?: string | null
          rating_type?: string | null
          respondent_id?: number | null
        }
        Relationships: []
      }
      swe_brand_perceptions: {
        Row: {
          brand: string | null
          perception: string | null
          perception_type: string | null
          respondent_id: number
        }
        Insert: {
          brand?: string | null
          perception?: string | null
          perception_type?: string | null
          respondent_id: number
        }
        Update: {
          brand?: string | null
          perception?: string | null
          perception_type?: string | null
          respondent_id?: number
        }
        Relationships: []
      }
      swe_company_priorities: {
        Row: {
          priority_area: string | null
          respondent_id: number | null
        }
        Insert: {
          priority_area?: string | null
          respondent_id?: number | null
        }
        Update: {
          priority_area?: string | null
          respondent_id?: number | null
        }
        Relationships: []
      }
      swe_concept_familiarity: {
        Row: {
          concept: string | null
          familiarity: string | null
          respondent_id: number | null
        }
        Insert: {
          concept?: string | null
          familiarity?: string | null
          respondent_id?: number | null
        }
        Update: {
          concept?: string | null
          familiarity?: string | null
          respondent_id?: number | null
        }
        Relationships: []
      }
      swe_customer_status_fixed: {
        Row: {
          question: string | null
          respondent_id: number | null
          response: string | null
          response_code: number | null
        }
        Insert: {
          question?: string | null
          respondent_id?: number | null
          response?: string | null
          response_code?: number | null
        }
        Update: {
          question?: string | null
          respondent_id?: number | null
          response?: string | null
          response_code?: number | null
        }
        Relationships: []
      }
      swe_discussion_topics: {
        Row: {
          respondent_id: number | null
          topic: string | null
        }
        Insert: {
          respondent_id?: number | null
          topic?: string | null
        }
        Update: {
          respondent_id?: number | null
          topic?: string | null
        }
        Relationships: []
      }
      swe_hotel_expectations: {
        Row: {
          item: string | null
          respondent_id: number | null
          response_type: string | null
        }
        Insert: {
          item?: string | null
          respondent_id?: number | null
          response_type?: string | null
        }
        Update: {
          item?: string | null
          respondent_id?: number | null
          response_type?: string | null
        }
        Relationships: []
      }
      swe_industry_impact: {
        Row: {
          impact_rating: string | null
          industry: string | null
          respondent_id: number | null
        }
        Insert: {
          impact_rating?: string | null
          industry?: string | null
          respondent_id?: number | null
        }
        Update: {
          impact_rating?: string | null
          industry?: string | null
          respondent_id?: number | null
        }
        Relationships: []
      }
      swe_interests: {
        Row: {
          interest: string | null
          respondent_id: number | null
        }
        Insert: {
          interest?: string | null
          respondent_id?: number | null
        }
        Update: {
          interest?: string | null
          respondent_id?: number | null
        }
        Relationships: []
      }
      swe_respondents: {
        Row: {
          age: number | null
          children_in_household: string | null
          country: string | null
          country_live_in: string | null
          education_level: string | null
          frequency_discussion_sustainability: string | null
          gender: string | null
          occupation: string | null
          residence_type: string | null
          respondent_id: number | null
          sustainability_impact_on_purchase: string | null
        }
        Insert: {
          age?: number | null
          children_in_household?: string | null
          country?: string | null
          country_live_in?: string | null
          education_level?: string | null
          frequency_discussion_sustainability?: string | null
          gender?: string | null
          occupation?: string | null
          residence_type?: string | null
          respondent_id?: number | null
          sustainability_impact_on_purchase?: string | null
        }
        Update: {
          age?: number | null
          children_in_household?: string | null
          country?: string | null
          country_live_in?: string | null
          education_level?: string | null
          frequency_discussion_sustainability?: string | null
          gender?: string | null
          occupation?: string | null
          residence_type?: string | null
          respondent_id?: number | null
          sustainability_impact_on_purchase?: string | null
        }
        Relationships: []
      }
      swe_text_responses: {
        Row: {
          question: string | null
          respondent_id: number | null
          response: string | null
        }
        Insert: {
          question?: string | null
          respondent_id?: number | null
          response?: string | null
        }
        Update: {
          question?: string | null
          respondent_id?: number | null
          response?: string | null
        }
        Relationships: []
      }
      swe_travel_reasons: {
        Row: {
          main_reason: string | null
          main_reason_code: number | null
          respondent_id: number
        }
        Insert: {
          main_reason?: string | null
          main_reason_code?: number | null
          respondent_id: number
        }
        Update: {
          main_reason?: string | null
          main_reason_code?: number | null
          respondent_id?: number
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
