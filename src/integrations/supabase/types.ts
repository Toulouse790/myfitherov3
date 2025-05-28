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
      activity_logs: {
        Row: {
          activity_date: string | null
          activity_type: string | null
          created_at: string | null
          duration_minutes: number | null
          log_id: number
          notes: string | null
          user_id: string | null
        }
        Insert: {
          activity_date?: string | null
          activity_type?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          log_id?: number
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          activity_date?: string | null
          activity_type?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          log_id?: number
          notes?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_agents: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          personality_traits: Json | null
          prompt_version: number | null
          slug: string
          specialties: string[] | null
          status: string | null
          system_prompt: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          personality_traits?: Json | null
          prompt_version?: number | null
          slug: string
          specialties?: string[] | null
          status?: string | null
          system_prompt: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          personality_traits?: Json | null
          prompt_version?: number | null
          slug?: string
          specialties?: string[] | null
          status?: string | null
          system_prompt?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      ai_agents_prompt_history: {
        Row: {
          agent_id: string | null
          created_at: string | null
          id: string
          system_prompt: string | null
          version: number | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          system_prompt?: string | null
          version?: number | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          system_prompt?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_agents_prompt_history_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_analytics: {
        Row: {
          agent_id: string | null
          conversation_id: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          response_relevance: number | null
          session_duration_seconds: number | null
          user_id: string | null
          user_satisfaction: number | null
        }
        Insert: {
          agent_id?: string | null
          conversation_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          response_relevance?: number | null
          session_duration_seconds?: number | null
          user_id?: string | null
          user_satisfaction?: number | null
        }
        Update: {
          agent_id?: string | null
          conversation_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          response_relevance?: number | null
          session_duration_seconds?: number | null
          user_id?: string | null
          user_satisfaction?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_analytics_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analytics_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          agent_id: string | null
          context: Json | null
          created_at: string | null
          ended_at: string | null
          id: string
          last_message_at: string | null
          started_at: string | null
          status: string | null
          summary: string | null
          title: string | null
          total_messages: number | null
          user_id: string | null
          user_satisfaction: number | null
        }
        Insert: {
          agent_id?: string | null
          context?: Json | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          last_message_at?: string | null
          started_at?: string | null
          status?: string | null
          summary?: string | null
          title?: string | null
          total_messages?: number | null
          user_id?: string | null
          user_satisfaction?: number | null
        }
        Update: {
          agent_id?: string | null
          context?: Json | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          last_message_at?: string | null
          started_at?: string | null
          status?: string | null
          summary?: string | null
          title?: string | null
          total_messages?: number | null
          user_id?: string | null
          user_satisfaction?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          response_time_ms: number | null
          role: string
          tokens_used: number | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          role: string
          tokens_used?: number | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          role?: string
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_recommendations: {
        Row: {
          agent_id: string | null
          category: string
          completed_at: string | null
          conversation_id: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          estimated_duration: number | null
          id: string
          instructions: string | null
          metadata: Json | null
          priority: number | null
          status: string | null
          title: string
          user_feedback: string | null
          user_id: string | null
          user_rating: number | null
          valid_until: string | null
        }
        Insert: {
          agent_id?: string | null
          category: string
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          id?: string
          instructions?: string | null
          metadata?: Json | null
          priority?: number | null
          status?: string | null
          title: string
          user_feedback?: string | null
          user_id?: string | null
          user_rating?: number | null
          valid_until?: string | null
        }
        Update: {
          agent_id?: string | null
          category?: string
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          id?: string
          instructions?: string | null
          metadata?: Json | null
          priority?: number | null
          status?: string | null
          title?: string
          user_feedback?: string | null
          user_id?: string | null
          user_rating?: number | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ai_training_data: {
        Row: {
          action_type: string
          context: Json | null
          created_at: string
          feedback: string | null
          id: string
          model_name: string | null
          response_time_ms: number | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          context?: Json | null
          created_at?: string
          feedback?: string | null
          id?: string
          model_name?: string | null
          response_time_ms?: number | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          context?: Json | null
          created_at?: string
          feedback?: string | null
          id?: string
          model_name?: string | null
          response_time_ms?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_training_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      daily_tracking: {
        Row: {
          body_fat_percentage: number | null
          calories_consumed: number | null
          created_at: string | null
          date: string
          energy_level: number | null
          id: string
          mood_level: number | null
          muscle_mass_kg: number | null
          notes: string | null
          sleep_hours: number | null
          sleep_quality: number | null
          steps_count: number | null
          stress_level: number | null
          user_id: string | null
          water_intake_liters: number | null
          weight_kg: number | null
          workouts_completed: number | null
        }
        Insert: {
          body_fat_percentage?: number | null
          calories_consumed?: number | null
          created_at?: string | null
          date: string
          energy_level?: number | null
          id?: string
          mood_level?: number | null
          muscle_mass_kg?: number | null
          notes?: string | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          steps_count?: number | null
          stress_level?: number | null
          user_id?: string | null
          water_intake_liters?: number | null
          weight_kg?: number | null
          workouts_completed?: number | null
        }
        Update: {
          body_fat_percentage?: number | null
          calories_consumed?: number | null
          created_at?: string | null
          date?: string
          energy_level?: number | null
          id?: string
          mood_level?: number | null
          muscle_mass_kg?: number | null
          notes?: string | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          steps_count?: number | null
          stress_level?: number | null
          user_id?: string | null
          water_intake_liters?: number | null
          weight_kg?: number | null
          workouts_completed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      health_conditions: {
        Row: {
          condition_id: number
          condition_name: string | null
          condition_type: string | null
          diagnosis_date: string | null
          notes: string | null
          user_id: string | null
        }
        Insert: {
          condition_id?: number
          condition_name?: string | null
          condition_type?: string | null
          diagnosis_date?: string | null
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          condition_id?: number
          condition_name?: string | null
          condition_type?: string | null
          diagnosis_date?: string | null
          notes?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      hydration_entries: {
        Row: {
          amount_ml: number
          created_at: string
          drink_type: string
          id: string
          recorded_at: string
          user_id: string
        }
        Insert: {
          amount_ml: number
          created_at?: string
          drink_type: string
          id?: string
          recorded_at?: string
          user_id: string
        }
        Update: {
          amount_ml?: number
          created_at?: string
          drink_type?: string
          id?: string
          recorded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hydration_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      hydration_goals: {
        Row: {
          created_at: string
          daily_target_ml: number
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_target_ml?: number
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_target_ml?: number
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hydration_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      lovable_requetes: {
        Row: {
          created_at: string | null
          id: string
          message: string
          reponse_ia: string | null
          statut: string
          type_demande: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          reponse_ia?: string | null
          statut?: string
          type_demande: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          reponse_ia?: string | null
          statut?: string
          type_demande?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          horodatage: string | null
          id: string
          message: string | null
          thread_id: string | null
          type_demande: string | null
          user_id: string | null
        }
        Insert: {
          horodatage?: string | null
          id?: string
          message?: string | null
          thread_id?: string | null
          type_demande?: string | null
          user_id?: string | null
        }
        Update: {
          horodatage?: string | null
          id?: string
          message?: string | null
          thread_id?: string | null
          type_demande?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      recommendations: {
        Row: {
          confidence_level: number | null
          content: string
          created_at: string | null
          generated_by: string
          recommendation_id: number
          thread_id: string
          type: string
          user_id: string | null
        }
        Insert: {
          confidence_level?: number | null
          content: string
          created_at?: string | null
          generated_by: string
          recommendation_id?: number
          thread_id: string
          type: string
          user_id?: string | null
        }
        Update: {
          confidence_level?: number | null
          content?: string
          created_at?: string | null
          generated_by?: string
          recommendation_id?: number
          thread_id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      synthese_finale: {
        Row: {
          created_at: string | null
          horodatage: string | null
          id: string
          synthese: string
          thread_id: string | null
          type_demande: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          horodatage?: string | null
          id?: string
          synthese: string
          thread_id?: string | null
          type_demande: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          horodatage?: string | null
          id?: string
          synthese?: string
          thread_id?: string | null
          type_demande?: string
          user_id?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          comments: string | null
          feedback_date: string | null
          feedback_id: number
          rating: number | null
          recommendation_id: number | null
          user_id: string | null
        }
        Insert: {
          comments?: string | null
          feedback_date?: string | null
          feedback_id?: number
          rating?: number | null
          recommendation_id?: number | null
          user_id?: string | null
        }
        Update: {
          comments?: string | null
          feedback_date?: string | null
          feedback_id?: number
          rating?: number | null
          recommendation_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "recommendations"
            referencedColumns: ["recommendation_id"]
          },
        ]
      }
      user_goals: {
        Row: {
          category: string
          created_at: string | null
          current_value: number | null
          description: string | null
          id: string
          motivation_level: number | null
          priority: number | null
          progress_percentage: number | null
          status: string | null
          target_date: string | null
          target_unit: string | null
          target_value: number | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          motivation_level?: number | null
          priority?: number | null
          progress_percentage?: number | null
          status?: string | null
          target_date?: string | null
          target_unit?: string | null
          target_value?: number | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          motivation_level?: number | null
          priority?: number | null
          progress_percentage?: number | null
          status?: string | null
          target_date?: string | null
          target_unit?: string | null
          target_value?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_health_info: {
        Row: {
          allergies: string[] | null
          blood_type: string | null
          created_at: string | null
          doctor_clearance: boolean | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          id: string
          injuries: string[] | null
          medical_conditions: string[] | null
          medications: string[] | null
          notes: string | null
          physical_limitations: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          allergies?: string[] | null
          blood_type?: string | null
          created_at?: string | null
          doctor_clearance?: boolean | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          injuries?: string[] | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          notes?: string | null
          physical_limitations?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          allergies?: string[] | null
          blood_type?: string | null
          created_at?: string | null
          doctor_clearance?: boolean | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          injuries?: string[] | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          notes?: string | null
          physical_limitations?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_health_info_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_hydration_profile: {
        Row: {
          alcohol_units_per_week: number | null
          bottle_type_preferred: string | null
          climate_environment: string | null
          coffee_cups_per_day: number | null
          created_at: string | null
          daily_water_intake_liters: number | null
          dehydration_symptoms: string[] | null
          energy_drinks_frequency: string | null
          flavor_preferences: string[] | null
          hydration_goals_liters: number | null
          hydration_reminders_preferred: boolean | null
          id: string
          preferred_beverages: string[] | null
          soda_frequency: string | null
          tea_cups_per_day: number | null
          updated_at: string | null
          urine_color_awareness: string | null
          user_id: string | null
          work_environment: string | null
          workout_hydration_strategy: string | null
        }
        Insert: {
          alcohol_units_per_week?: number | null
          bottle_type_preferred?: string | null
          climate_environment?: string | null
          coffee_cups_per_day?: number | null
          created_at?: string | null
          daily_water_intake_liters?: number | null
          dehydration_symptoms?: string[] | null
          energy_drinks_frequency?: string | null
          flavor_preferences?: string[] | null
          hydration_goals_liters?: number | null
          hydration_reminders_preferred?: boolean | null
          id?: string
          preferred_beverages?: string[] | null
          soda_frequency?: string | null
          tea_cups_per_day?: number | null
          updated_at?: string | null
          urine_color_awareness?: string | null
          user_id?: string | null
          work_environment?: string | null
          workout_hydration_strategy?: string | null
        }
        Update: {
          alcohol_units_per_week?: number | null
          bottle_type_preferred?: string | null
          climate_environment?: string | null
          coffee_cups_per_day?: number | null
          created_at?: string | null
          daily_water_intake_liters?: number | null
          dehydration_symptoms?: string[] | null
          energy_drinks_frequency?: string | null
          flavor_preferences?: string[] | null
          hydration_goals_liters?: number | null
          hydration_reminders_preferred?: boolean | null
          id?: string
          preferred_beverages?: string[] | null
          soda_frequency?: string | null
          tea_cups_per_day?: number | null
          updated_at?: string | null
          urine_color_awareness?: string | null
          user_id?: string | null
          work_environment?: string | null
          workout_hydration_strategy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_hydration_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_nutrition_profile: {
        Row: {
          budget_level: string | null
          cooking_skill_level: string | null
          created_at: string | null
          current_diet_pattern: string | null
          dietary_preferences: string | null
          digestive_issues: string[] | null
          disliked_foods: string[] | null
          eating_schedule: Json | null
          favorite_foods: string[] | null
          food_allergies: string[] | null
          food_intolerances: string[] | null
          hydration_current_liters: number | null
          id: string
          meal_prep_frequency: string | null
          meals_per_day: number | null
          snacking_habits: string | null
          supplement_usage: string[] | null
          target_weight_kg: number | null
          time_available_cooking: number | null
          updated_at: string | null
          user_id: string | null
          weight_goal: string | null
        }
        Insert: {
          budget_level?: string | null
          cooking_skill_level?: string | null
          created_at?: string | null
          current_diet_pattern?: string | null
          dietary_preferences?: string | null
          digestive_issues?: string[] | null
          disliked_foods?: string[] | null
          eating_schedule?: Json | null
          favorite_foods?: string[] | null
          food_allergies?: string[] | null
          food_intolerances?: string[] | null
          hydration_current_liters?: number | null
          id?: string
          meal_prep_frequency?: string | null
          meals_per_day?: number | null
          snacking_habits?: string | null
          supplement_usage?: string[] | null
          target_weight_kg?: number | null
          time_available_cooking?: number | null
          updated_at?: string | null
          user_id?: string | null
          weight_goal?: string | null
        }
        Update: {
          budget_level?: string | null
          cooking_skill_level?: string | null
          created_at?: string | null
          current_diet_pattern?: string | null
          dietary_preferences?: string | null
          digestive_issues?: string[] | null
          disliked_foods?: string[] | null
          eating_schedule?: Json | null
          favorite_foods?: string[] | null
          food_allergies?: string[] | null
          food_intolerances?: string[] | null
          hydration_current_liters?: number | null
          id?: string
          meal_prep_frequency?: string | null
          meals_per_day?: number | null
          snacking_habits?: string | null
          supplement_usage?: string[] | null
          target_weight_kg?: number | null
          time_available_cooking?: number | null
          updated_at?: string | null
          user_id?: string | null
          weight_goal?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_nutrition_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          age: number | null
          country: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          gender: string | null
          height_cm: number | null
          language: string | null
          last_name: string | null
          onboarding_completed: boolean | null
          privacy_accepted: boolean | null
          terms_accepted: boolean | null
          timezone: string | null
          updated_at: string | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          age?: number | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          height_cm?: number | null
          language?: string | null
          last_name?: string | null
          onboarding_completed?: boolean | null
          privacy_accepted?: boolean | null
          terms_accepted?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          age?: number | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          height_cm?: number | null
          language?: string | null
          last_name?: string | null
          onboarding_completed?: boolean | null
          privacy_accepted?: boolean | null
          terms_accepted?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      user_sleep_profile: {
        Row: {
          alcohol_consumption: string | null
          average_sleep_hours: number | null
          bedroom_setup: string | null
          caffeine_cutoff_time: string | null
          created_at: string | null
          id: string
          night_awakenings: number | null
          pre_sleep_routine: string[] | null
          screen_time_before_bed: number | null
          sleep_aids_used: string[] | null
          sleep_disorders: string[] | null
          sleep_environment: Json | null
          sleep_quality_rating: number | null
          sleep_tracking_devices: string[] | null
          stress_level_evening: number | null
          time_to_fall_asleep: number | null
          typical_bedtime: string | null
          typical_wake_time: string | null
          updated_at: string | null
          user_id: string | null
          weekend_bedtime: string | null
          weekend_wake_time: string | null
        }
        Insert: {
          alcohol_consumption?: string | null
          average_sleep_hours?: number | null
          bedroom_setup?: string | null
          caffeine_cutoff_time?: string | null
          created_at?: string | null
          id?: string
          night_awakenings?: number | null
          pre_sleep_routine?: string[] | null
          screen_time_before_bed?: number | null
          sleep_aids_used?: string[] | null
          sleep_disorders?: string[] | null
          sleep_environment?: Json | null
          sleep_quality_rating?: number | null
          sleep_tracking_devices?: string[] | null
          stress_level_evening?: number | null
          time_to_fall_asleep?: number | null
          typical_bedtime?: string | null
          typical_wake_time?: string | null
          updated_at?: string | null
          user_id?: string | null
          weekend_bedtime?: string | null
          weekend_wake_time?: string | null
        }
        Update: {
          alcohol_consumption?: string | null
          average_sleep_hours?: number | null
          bedroom_setup?: string | null
          caffeine_cutoff_time?: string | null
          created_at?: string | null
          id?: string
          night_awakenings?: number | null
          pre_sleep_routine?: string[] | null
          screen_time_before_bed?: number | null
          sleep_aids_used?: string[] | null
          sleep_disorders?: string[] | null
          sleep_environment?: Json | null
          sleep_quality_rating?: number | null
          sleep_tracking_devices?: string[] | null
          stress_level_evening?: number | null
          time_to_fall_asleep?: number | null
          typical_bedtime?: string | null
          typical_wake_time?: string | null
          updated_at?: string | null
          user_id?: string | null
          weekend_bedtime?: string | null
          weekend_wake_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sleep_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_sport_profile: {
        Row: {
          available_equipment: string[] | null
          created_at: string | null
          current_workout_routine: string | null
          disliked_activities: string[] | null
          experience_level: string | null
          fitness_goals_specific: string[] | null
          fitness_level_self_assessment: number | null
          gym_access: boolean | null
          home_gym: boolean | null
          id: string
          outdoor_preference: boolean | null
          past_injuries: Json | null
          preferred_activities: string[] | null
          preferred_workout_duration: number | null
          preferred_workout_time: string | null
          sports_practiced: string[] | null
          updated_at: string | null
          user_id: string | null
          workout_frequency_per_week: number | null
        }
        Insert: {
          available_equipment?: string[] | null
          created_at?: string | null
          current_workout_routine?: string | null
          disliked_activities?: string[] | null
          experience_level?: string | null
          fitness_goals_specific?: string[] | null
          fitness_level_self_assessment?: number | null
          gym_access?: boolean | null
          home_gym?: boolean | null
          id?: string
          outdoor_preference?: boolean | null
          past_injuries?: Json | null
          preferred_activities?: string[] | null
          preferred_workout_duration?: number | null
          preferred_workout_time?: string | null
          sports_practiced?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          workout_frequency_per_week?: number | null
        }
        Update: {
          available_equipment?: string[] | null
          created_at?: string | null
          current_workout_routine?: string | null
          disliked_activities?: string[] | null
          experience_level?: string | null
          fitness_goals_specific?: string[] | null
          fitness_level_self_assessment?: number | null
          gym_access?: boolean | null
          home_gym?: boolean | null
          id?: string
          outdoor_preference?: boolean | null
          past_injuries?: Json | null
          preferred_activities?: string[] | null
          preferred_workout_duration?: number | null
          preferred_workout_time?: string | null
          sports_practiced?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          workout_frequency_per_week?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sport_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          age: number | null
          birthdate: string | null
          calculated_at: string | null
          created_at: string | null
          email: string | null
          equipment_gym: boolean | null
          equipment_home: boolean | null
          experience_level: string | null
          first_name: string | null
          frequency: string | null
          gender: string | null
          goal: string | null
          height_cm: number | null
          last_name: string | null
          notifications: boolean | null
          platform: string | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          age?: number | null
          birthdate?: string | null
          calculated_at?: string | null
          created_at?: string | null
          email?: string | null
          equipment_gym?: boolean | null
          equipment_home?: boolean | null
          experience_level?: string | null
          first_name?: string | null
          frequency?: string | null
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          last_name?: string | null
          notifications?: boolean | null
          platform?: string | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          age?: number | null
          birthdate?: string | null
          calculated_at?: string | null
          created_at?: string | null
          email?: string | null
          equipment_gym?: boolean | null
          equipment_home?: boolean | null
          experience_level?: string | null
          first_name?: string | null
          frequency?: string | null
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          last_name?: string | null
          notifications?: boolean | null
          platform?: string | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_context_for_agent: {
        Args: { p_user_id: string; p_agent_slug: string }
        Returns: Json
      }
      increment_total_messages: {
        Args: { conversation_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
