export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12";
  };
  public: {
    Tables: {
      medias_collections: {
        Row: {
          id: string;
          collection_id: string;
          media_id: string;
          media_type: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          collection_id: string;
          media_id: string;
          media_type: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          collection_id?: string;
          media_id?: string;
          media_type?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      collections: {
        Row: {
          created_at: string;
          title: string | null;
          owner: string | null;
          is_public: boolean;
          id: string;
        };
        Insert: {
          created_at?: string;
          title?: string | null;
          owner?: string | null;
          is_public: boolean;
          id?: string;
        };
        Update: {
          created_at?: string;
          title?: string | null;
          owner?: string | null;
          is_public?: boolean;
          id?: string;
        };
        Relationships: [];
      };
      episode_comments: {
        Row: {
          id: string;
          episode_id: string;
          user_id: string;
          parent_comment_id: string | null;
          content: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          episode_id: string;
          user_id: string;
          parent_comment_id?: string | null;
          content: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          episode_id?: string;
          user_id?: string;
          parent_comment_id?: string | null;
          content?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      episode_watches: {
        Row: {
          id: string;
          user_id: string;
          episode_id: string;
          series_id: string;
          watched_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          episode_id: string;
          series_id: string;
          watched_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          episode_id?: string;
          series_id?: string;
          watched_at?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      episodes: {
        Row: {
          id: string;
          series_id: string;
          season_id: string;
          episode_number: number;
          title: string;
          overview: string | null;
          poster_path: string | null;
          release_year: string | null;
          created_at: string | null;
          air_date: string | null;
          runtime: number | null;
          vote_average: number | null;
          last_fetched: string | null;
          tmdb_id: number | null;
          season_number: number | null;
        };
        Insert: {
          id?: string;
          series_id: string;
          season_id: string;
          episode_number: number;
          title: string;
          overview?: string | null;
          poster_path?: string | null;
          release_year?: string | null;
          created_at?: string | null;
          air_date?: string | null;
          runtime?: number | null;
          vote_average?: number | null;
          last_fetched?: string | null;
          tmdb_id?: number | null;
          season_number?: number | null;
        };
        Update: {
          id?: string;
          series_id?: string;
          season_id?: string;
          episode_number?: number;
          title?: string;
          overview?: string | null;
          poster_path?: string | null;
          release_year?: string | null;
          created_at?: string | null;
          air_date?: string | null;
          runtime?: number | null;
          vote_average?: number | null;
          last_fetched?: string | null;
          tmdb_id?: number | null;
          season_number?: number | null;
        };
        Relationships: [];
      };
      genres: {
        Row: {
          id: string;
          tmdb_id: number;
          name: string;
          media_type: string;
          icon: string | null;
          last_fetched: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tmdb_id: number;
          name: string;
          media_type: string;
          icon?: string | null;
          last_fetched?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tmdb_id?: number;
          name?: string;
          media_type?: string;
          icon?: string | null;
          last_fetched?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      media_collection: {
        Row: {
          id: number;
          collection_id: string | null;
          media_id: string | null;
          media_type: string | null;
          title: string | null;
          poster_path: string | null;
          release_year: string | null;
        };
        Insert: {
          id: number;
          collection_id?: string | null;
          media_id?: string | null;
          media_type?: string | null;
          title?: string | null;
          poster_path?: string | null;
          release_year?: string | null;
        };
        Update: {
          id?: number;
          collection_id?: string | null;
          media_id?: string | null;
          media_type?: string | null;
          title?: string | null;
          poster_path?: string | null;
          release_year?: string | null;
        };
        Relationships: [];
      };
      media_watches: {
        Row: {
          id: string;
          collection_id: string;
          media_id: string;
          media_type: string;
          user_id: string;
          watched_at: string | null;
        };
        Insert: {
          id?: string;
          collection_id: string;
          media_id: string;
          media_type: string;
          user_id: string;
          watched_at?: string | null;
        };
        Update: {
          id?: string;
          collection_id?: string;
          media_id?: string;
          media_type?: string;
          user_id?: string;
          watched_at?: string | null;
        };
        Relationships: [];
      };
      movie_comments: {
        Row: {
          id: string;
          movie_id: string;
          user_id: string;
          parent_comment_id: string | null;
          content: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          movie_id: string;
          user_id: string;
          parent_comment_id?: string | null;
          content: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          movie_id?: string;
          user_id?: string;
          parent_comment_id?: string | null;
          content?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      movie_genres: {
        Row: {
          id: string;
          movie_id: string;
          genre_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          movie_id: string;
          genre_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          movie_id?: string;
          genre_id?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      movies: {
        Row: {
          id: string;
          title: string;
          overview: string | null;
          poster_path: string | null;
          tmdb_id: number;
          release_year: string | null;
          created_at: string | null;
          backdrop_path: string | null;
          tmdb_popularity: string | null;
          popularity: number | null;
          last_fetched: string | null;
          runtime: number | null;
          vote_average: number | null;
        };
        Insert: {
          id?: string;
          title: string;
          overview?: string | null;
          poster_path?: string | null;
          tmdb_id: number;
          release_year?: string | null;
          created_at?: string | null;
          backdrop_path?: string | null;
          tmdb_popularity?: string | null;
          popularity?: number | null;
          last_fetched?: string | null;
          runtime?: number | null;
          vote_average?: number | null;
        };
        Update: {
          id?: string;
          title?: string;
          overview?: string | null;
          poster_path?: string | null;
          tmdb_id?: number;
          release_year?: string | null;
          created_at?: string | null;
          backdrop_path?: string | null;
          tmdb_popularity?: string | null;
          popularity?: number | null;
          last_fetched?: string | null;
          runtime?: number | null;
          vote_average?: number | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          username: string;
          settings: Json | null;
          last_username_change: string | null;
          role: number | null;
          avatar_path: string | null;
          profile_visibility: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          username?: string;
          settings?: Json | null;
          last_username_change?: string | null;
          role?: number | null;
          avatar_path?: string | null;
          profile_visibility?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          username?: string;
          settings?: Json | null;
          last_username_change?: string | null;
          role?: number | null;
          avatar_path?: string | null;
          profile_visibility?: string | null;
        };
        Relationships: [];
      };
      reel_deck: {
        Row: {
          id: string;
          user_id: string;
          media_id: string;
          media_type: string;
          added_at: string | null;
          status: string | null;
          last_watched_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          media_id: string;
          media_type: string;
          added_at?: string | null;
          status?: string | null;
          last_watched_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          media_id?: string;
          media_type?: string;
          added_at?: string | null;
          status?: string | null;
          last_watched_at?: string | null;
        };
        Relationships: [];
      };
      season_comments: {
        Row: {
          id: string;
          season_id: string;
          user_id: string;
          parent_comment_id: string | null;
          content: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          season_id: string;
          user_id: string;
          parent_comment_id?: string | null;
          content: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          season_id?: string;
          user_id?: string;
          parent_comment_id?: string | null;
          content?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      seasons: {
        Row: {
          id: string;
          series_id: string;
          season_number: number;
          title: string | null;
          overview: string | null;
          poster_path: string | null;
          release_year: string | null;
          created_at: string | null;
          air_date: string | null;
          episode_count: number | null;
          last_fetched: string | null;
          tmdb_id: number | null;
        };
        Insert: {
          id?: string;
          series_id: string;
          season_number: number;
          title?: string | null;
          overview?: string | null;
          poster_path?: string | null;
          release_year?: string | null;
          created_at?: string | null;
          air_date?: string | null;
          episode_count?: number | null;
          last_fetched?: string | null;
          tmdb_id?: number | null;
        };
        Update: {
          id?: string;
          series_id?: string;
          season_number?: number;
          title?: string | null;
          overview?: string | null;
          poster_path?: string | null;
          release_year?: string | null;
          created_at?: string | null;
          air_date?: string | null;
          episode_count?: number | null;
          last_fetched?: string | null;
          tmdb_id?: number | null;
        };
        Relationships: [];
      };
      series: {
        Row: {
          id: string;
          title: string;
          overview: string | null;
          poster_path: string | null;
          tmdb_id: number;
          release_year: string | null;
          created_at: string | null;
          backdrop_path: string | null;
          last_fetched: string | null;
          status: string | null;
          first_air_date: string | null;
          last_air_date: string | null;
          vote_average: number | null;
        };
        Insert: {
          id?: string;
          title: string;
          overview?: string | null;
          poster_path?: string | null;
          tmdb_id: number;
          release_year?: string | null;
          created_at?: string | null;
          backdrop_path?: string | null;
          last_fetched?: string | null;
          status?: string | null;
          first_air_date?: string | null;
          last_air_date?: string | null;
          vote_average?: number | null;
        };
        Update: {
          id?: string;
          title?: string;
          overview?: string | null;
          poster_path?: string | null;
          tmdb_id?: number;
          release_year?: string | null;
          created_at?: string | null;
          backdrop_path?: string | null;
          last_fetched?: string | null;
          status?: string | null;
          first_air_date?: string | null;
          last_air_date?: string | null;
          vote_average?: number | null;
        };
        Relationships: [];
      };
      series_comments: {
        Row: {
          id: string;
          series_id: string;
          user_id: string;
          parent_comment_id: string | null;
          content: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          series_id: string;
          user_id: string;
          parent_comment_id?: string | null;
          content: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          series_id?: string;
          user_id?: string;
          parent_comment_id?: string | null;
          content?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      series_genres: {
        Row: {
          id: string;
          series_id: string;
          genre_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          series_id: string;
          genre_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          series_id?: string;
          genre_id?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      shared_collection: {
        Row: {
          id: number;
          created_at: string;
          collection_id: string | null;
          user_id: string | null;
          access_level: number | null;
        };
        Insert: {
          id: number;
          created_at?: string;
          collection_id?: string | null;
          user_id?: string | null;
          access_level?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          collection_id?: string | null;
          user_id?: string | null;
          access_level?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
