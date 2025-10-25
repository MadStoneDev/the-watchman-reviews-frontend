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
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      episode_comments: {
        Row: {
          content: string
          created_at: string | null
          episode_id: string
          id: string
          parent_comment_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          episode_id: string
          id?: string
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          episode_id?: string
          id?: string
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "episode_comments_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "episode_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "episode_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes: {
        Row: {
          air_date: string | null
          created_at: string | null
          episode_number: number
          id: string
          last_fetched: string | null
          overview: string | null
          poster_path: string | null
          release_year: string | null
          runtime: number | null
          season_id: string
          series_id: string
          title: string
          tmdb_id: number | null
          vote_average: number | null
        }
        Insert: {
          air_date?: string | null
          created_at?: string | null
          episode_number: number
          id?: string
          last_fetched?: string | null
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          runtime?: number | null
          season_id: string
          series_id: string
          title: string
          tmdb_id?: number | null
          vote_average?: number | null
        }
        Update: {
          air_date?: string | null
          created_at?: string | null
          episode_number?: number
          id?: string
          last_fetched?: string | null
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          runtime?: number | null
          season_id?: string
          series_id?: string
          title?: string
          tmdb_id?: number | null
          vote_average?: number | null
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
      genres: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          last_fetched: string | null
          media_type: string
          name: string
          tmdb_id: number
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          last_fetched?: string | null
          media_type: string
          name: string
          tmdb_id: number
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          last_fetched?: string | null
          media_type?: string
          name?: string
          tmdb_id?: number
        }
        Relationships: []
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
      movie_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          movie_id: string
          parent_comment_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          movie_id: string
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          movie_id?: string
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_comments_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movie_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "movie_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      movie_genres: {
        Row: {
          created_at: string | null
          genre_id: string
          id: string
          movie_id: string
        }
        Insert: {
          created_at?: string | null
          genre_id: string
          id?: string
          movie_id: string
        }
        Update: {
          created_at?: string | null
          genre_id?: string
          id?: string
          movie_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movie_genres_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      movies: {
        Row: {
          backdrop_path: string | null
          created_at: string | null
          id: string
          last_fetched: string | null
          overview: string | null
          popularity: number | null
          poster_path: string | null
          release_year: string | null
          runtime: number | null
          title: string
          tmdb_id: number
          tmdb_popularity: string | null
        }
        Insert: {
          backdrop_path?: string | null
          created_at?: string | null
          id?: string
          last_fetched?: string | null
          overview?: string | null
          popularity?: number | null
          poster_path?: string | null
          release_year?: string | null
          runtime?: number | null
          title: string
          tmdb_id: number
          tmdb_popularity?: string | null
        }
        Update: {
          backdrop_path?: string | null
          created_at?: string | null
          id?: string
          last_fetched?: string | null
          overview?: string | null
          popularity?: number | null
          poster_path?: string | null
          release_year?: string | null
          runtime?: number | null
          title?: string
          tmdb_id?: number
          tmdb_popularity?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string
          id: string
          last_username_change: string | null
          profile_visibility: string | null
          role: number | null
          settings: Json | null
          username: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          id?: string
          last_username_change?: string | null
          profile_visibility?: string | null
          role?: number | null
          settings?: Json | null
          username?: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          id?: string
          last_username_change?: string | null
          profile_visibility?: string | null
          role?: number | null
          settings?: Json | null
          username?: string
        }
        Relationships: []
      }
      reel_deck: {
        Row: {
          added_at: string | null
          id: string
          last_watched_at: string | null
          media_id: string
          media_type: string
          status: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          last_watched_at?: string | null
          media_id: string
          media_type: string
          status?: string | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          id?: string
          last_watched_at?: string | null
          media_id?: string
          media_type?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      season_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_comment_id: string | null
          season_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          season_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          season_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "season_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "season_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_comments_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          air_date: string | null
          created_at: string | null
          episode_count: number | null
          id: string
          last_fetched: string | null
          overview: string | null
          poster_path: string | null
          release_year: string | null
          season_number: number
          series_id: string
          title: string | null
        }
        Insert: {
          air_date?: string | null
          created_at?: string | null
          episode_count?: number | null
          id?: string
          last_fetched?: string | null
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          season_number: number
          series_id: string
          title?: string | null
        }
        Update: {
          air_date?: string | null
          created_at?: string | null
          episode_count?: number | null
          id?: string
          last_fetched?: string | null
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
          first_air_date: string | null
          id: string
          last_air_date: string | null
          last_fetched: string | null
          overview: string | null
          poster_path: string | null
          release_year: string | null
          status: string | null
          title: string
          tmdb_id: number
        }
        Insert: {
          backdrop_path?: string | null
          created_at?: string | null
          first_air_date?: string | null
          id?: string
          last_air_date?: string | null
          last_fetched?: string | null
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          status?: string | null
          title: string
          tmdb_id: number
        }
        Update: {
          backdrop_path?: string | null
          created_at?: string | null
          first_air_date?: string | null
          id?: string
          last_air_date?: string | null
          last_fetched?: string | null
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          status?: string | null
          title?: string
          tmdb_id?: number
        }
        Relationships: []
      }
      series_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_comment_id: string | null
          series_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          series_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          series_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "series_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "series_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "series_comments_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      series_genres: {
        Row: {
          created_at: string | null
          genre_id: string
          id: string
          series_id: string
        }
        Insert: {
          created_at?: string | null
          genre_id: string
          id?: string
          series_id: string
        }
        Update: {
          created_at?: string | null
          genre_id?: string
          id?: string
          series_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "series_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "series_genres_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
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
      populate_media_positions: { Args: never; Returns: undefined }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
