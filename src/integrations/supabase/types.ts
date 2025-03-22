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
      STBY_Respondents_ANSWERS: {
        Row: {
          Answer: string | null
          Language: string | null
          Question: string | null
          "Response ID": number
          row_id: number
          Status: string | null
        }
        Insert: {
          Answer?: string | null
          Language?: string | null
          Question?: string | null
          "Response ID": number
          row_id?: number
          Status?: string | null
        }
        Update: {
          Answer?: string | null
          Language?: string | null
          Question?: string | null
          "Response ID"?: number
          row_id?: number
          Status?: string | null
        }
        Relationships: []
      }
      STBY_Respondents_NO: {
        Row: {
          Language: string | null
          "Response ID": number
          Status: string | null
        }
        Insert: {
          Language?: string | null
          "Response ID": number
          Status?: string | null
        }
        Update: {
          Language?: string | null
          "Response ID"?: number
          Status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      answer_distribution: {
        Row: {
          Answer: string | null
          percentage: number | null
          Question: string | null
          response_count: number | null
        }
        Relationships: []
      }
      language_response_summary: {
        Row: {
          Language: string | null
          respondent_count: number | null
          total_answers: number | null
          unique_questions: number | null
        }
        Relationships: []
      }
      question_response_summary: {
        Row: {
          all_answers: string[] | null
          most_common_answer: string | null
          Question: string | null
          total_responses: number | null
          unique_answers: number | null
          unique_respondents: number | null
        }
        Relationships: []
      }
      respondent_completion: {
        Row: {
          Language: string | null
          questions_answered: number | null
          "Response ID": number | null
          Status: string | null
          unique_questions_answered: number | null
        }
        Relationships: []
      }
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
