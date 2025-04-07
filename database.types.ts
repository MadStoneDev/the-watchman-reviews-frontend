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
      collections: {
        Row: {
          created_at: string
          id: string
          is_public: boolean
          owner: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_public: boolean
          owner?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_public?: boolean
          owner?: string | null
          title?: string | null
        }
        Relationships: []
      }
      episodes: {
        Row: {
          created_at: string | null
          episode_number: number
          id: string
          overview: string | null
          poster_path: string | null
          release_year: string | null
          season_id: string
          series_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          episode_number: number
          id?: string
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          season_id: string
          series_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          episode_number?: number
          id?: string
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          season_id?: string
          series_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "episodes_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "episodes_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      media_collection: {
        Row: {
          collection_id: string | null
          id: number
          media_id: string | null
          media_type: string | null
          poster_path: string | null
          release_year: string | null
          title: string | null
        }
        Insert: {
          collection_id?: string | null
          id?: number
          media_id?: string | null
          media_type?: string | null
          poster_path?: string | null
          release_year?: string | null
          title?: string | null
        }
        Update: {
          collection_id?: string | null
          id?: number
          media_id?: string | null
          media_type?: string | null
          poster_path?: string | null
          release_year?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_collection_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      media_watches: {
        Row: {
          collection_id: string
          id: string
          media_id: string
          media_type: string
          user_id: string
          watched_at: string | null
        }
        Insert: {
          collection_id: string
          id?: string
          media_id: string
          media_type: string
          user_id: string
          watched_at?: string | null
        }
        Update: {
          collection_id?: string
          id?: string
          media_id?: string
          media_type?: string
          user_id?: string
          watched_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_watches_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      medias_collections: {
        Row: {
          collection_id: string
          created_at: string | null
          id: string
          media_id: string
          media_type: string
          position: number | null
        }
        Insert: {
          collection_id: string
          created_at?: string | null
          id?: string
          media_id: string
          media_type: string
          position?: number | null
        }
        Update: {
          collection_id?: string
          created_at?: string | null
          id?: string
          media_id?: string
          media_type?: string
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medias_collections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      movies: {
        Row: {
          backdrop_path: string | null
          created_at: string | null
          id: string
          overview: string | null
          poster_path: string | null
          release_year: string | null
          title: string
          tmdb_id: number
        }
        Insert: {
          backdrop_path?: string | null
          created_at?: string | null
          id?: string
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          title: string
          tmdb_id: number
        }
        Update: {
          backdrop_path?: string | null
          created_at?: string | null
          id?: string
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          title?: string
          tmdb_id?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          last_username_change: string | null
          settings: Json | null
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_username_change?: string | null
          settings?: Json | null
          username?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_username_change?: string | null
          settings?: Json | null
          username?: string
        }
        Relationships: []
      }
      seasons: {
        Row: {
          created_at: string | null
          id: string
          overview: string | null
          poster_path: string | null
          release_year: string | null
          season_number: number
          series_id: string
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          season_number: number
          series_id: string
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          season_number?: number
          series_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seasons_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      series: {
        Row: {
          backdrop_path: string | null
          created_at: string | null
          id: string
          overview: string | null
          poster_path: string | null
          release_year: string | null
          title: string
          tmdb_id: number
        }
        Insert: {
          backdrop_path?: string | null
          created_at?: string | null
          id?: string
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          title: string
          tmdb_id: number
        }
        Update: {
          backdrop_path?: string | null
          created_at?: string | null
          id?: string
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          title?: string
          tmdb_id?: number
        }
        Relationships: []
      }
      shared_collection: {
        Row: {
          access_level: number | null
          collection_id: string | null
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          access_level?: number | null
          collection_id?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          access_level?: number | null
          collection_id?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_collection_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      populate_media_positions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
