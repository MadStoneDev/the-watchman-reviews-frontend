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
    PostgrestVersion: "12.2.12"
  }
  public: {
    Tables: {
      achievement_definitions: {
        Row: {
          id: string
          name: string
          description: string
          icon: string | null
          category: string
          tier: string | null
          threshold: number | null
          created_at: string | null
        }
        Insert: {
          id: string
          name: string
          description: string
          icon?: string | null
          category: string
          tier?: string | null
          threshold?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string | null
          category?: string
          tier?: string | null
          threshold?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      activity_feed: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          data: Json
          series_id: string | null
          episode_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          data?: Json
          series_id?: string | null
          episode_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          data?: Json
          series_id?: string | null
          episode_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      medias_collections: {
        Row: {
          id: string
          collection_id: string
          media_id: string
          media_type: string
          created_at: string | null
        }
        Insert: {
          id?: string
          collection_id: string
          media_id: string
          media_type: string
          created_at?: string | null
        }
        Update: {
          id?: string
          collection_id?: string
          media_id?: string
          media_type?: string
          created_at?: string | null
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string
          title: string | null
          owner: string | null
          is_public: boolean
          id: string
        }
        Insert: {
          created_at?: string
          title?: string | null
          owner?: string | null
          is_public: boolean
          id?: string
        }
        Update: {
          created_at?: string
          title?: string | null
          owner?: string | null
          is_public?: boolean
          id?: string
        }
        Relationships: []
      }
      comment_reactions: {
        Row: {
          id: string
          comment_id: string
          user_id: string
          reaction_type: string
          created_at: string | null
        }
        Insert: {
          id?: string
          comment_id: string
          user_id: string
          reaction_type: string
          created_at?: string | null
        }
        Update: {
          id?: string
          comment_id?: string
          user_id?: string
          reaction_type?: string
          created_at?: string | null
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          last_read_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          last_read_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          last_read_at?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          last_message_at: string | null
          last_message_preview: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          last_message_at?: string | null
          last_message_preview?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          last_message_at?: string | null
          last_message_preview?: string | null
        }
        Relationships: []
      }
      episode_comments: {
        Row: {
          id: string
          episode_id: string
          user_id: string
          parent_comment_id: string | null
          content: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          episode_id: string
          user_id: string
          parent_comment_id?: string | null
          content: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          episode_id?: string
          user_id?: string
          parent_comment_id?: string | null
          content?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      episode_watches: {
        Row: {
          id: string
          user_id: string
          episode_id: string
          series_id: string
          watched_at: string | null
          created_at: string | null
          cycle_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          episode_id: string
          series_id: string
          watched_at?: string | null
          created_at?: string | null
          cycle_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          episode_id?: string
          series_id?: string
          watched_at?: string | null
          created_at?: string | null
          cycle_id?: string | null
        }
        Relationships: []
      }
      episodes: {
        Row: {
          id: string
          series_id: string
          season_id: string
          episode_number: number
          title: string
          overview: string | null
          poster_path: string | null
          release_year: string | null
          created_at: string | null
          air_date: string | null
          runtime: number | null
          vote_average: number | null
          last_fetched: string | null
          tmdb_id: number | null
          season_number: number | null
        }
        Insert: {
          id?: string
          series_id: string
          season_id: string
          episode_number: number
          title: string
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          created_at?: string | null
          air_date?: string | null
          runtime?: number | null
          vote_average?: number | null
          last_fetched?: string | null
          tmdb_id?: number | null
          season_number?: number | null
        }
        Update: {
          id?: string
          series_id?: string
          season_id?: string
          episode_number?: number
          title?: string
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          created_at?: string | null
          air_date?: string | null
          runtime?: number | null
          vote_average?: number | null
          last_fetched?: string | null
          tmdb_id?: number | null
          season_number?: number | null
        }
        Relationships: []
      }
      genres: {
        Row: {
          id: string
          tmdb_id: number
          name: string
          media_type: string
          icon: string | null
          last_fetched: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          tmdb_id: number
          name: string
          media_type: string
          icon?: string | null
          last_fetched?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          tmdb_id?: number
          name?: string
          media_type?: string
          icon?: string | null
          last_fetched?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          username: string
          settings: Json | null
          last_username_change: string | null
          role: number | null
          avatar_path: string | null
          profile_visibility: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          username?: string
          settings?: Json | null
          last_username_change?: string | null
          role?: number | null
          avatar_path?: string | null
          profile_visibility?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string
          settings?: Json | null
          last_username_change?: string | null
          role?: number | null
          avatar_path?: string | null
          profile_visibility?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string | null
          progress: number | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string | null
          progress?: number | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string | null
          progress?: number | null
          metadata?: Json | null
        }
        Relationships: []
      }
      movie_comments: {
        Row: {
          id: string
          movie_id: string
          user_id: string
          parent_comment_id: string | null
          content: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          movie_id: string
          user_id: string
          parent_comment_id?: string | null
          content: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          movie_id?: string
          user_id?: string
          parent_comment_id?: string | null
          content?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      season_comments: {
        Row: {
          id: string
          season_id: string
          user_id: string
          parent_comment_id: string | null
          content: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          season_id: string
          user_id: string
          parent_comment_id?: string | null
          content: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          season_id?: string
          user_id?: string
          parent_comment_id?: string | null
          content?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      series_comments: {
        Row: {
          id: string
          series_id: string
          user_id: string
          parent_comment_id: string | null
          content: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          series_id: string
          user_id: string
          parent_comment_id?: string | null
          content: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          series_id?: string
          user_id?: string
          parent_comment_id?: string | null
          content?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      media_collection: {
        Row: {
          id: number
          collection_id: string | null
          media_id: string | null
          media_type: string | null
          title: string | null
          poster_path: string | null
          release_year: string | null
        }
        Insert: {
          id: number
          collection_id?: string | null
          media_id?: string | null
          media_type?: string | null
          title?: string | null
          poster_path?: string | null
          release_year?: string | null
        }
        Update: {
          id?: number
          collection_id?: string | null
          media_id?: string | null
          media_type?: string | null
          title?: string | null
          poster_path?: string | null
          release_year?: string | null
        }
        Relationships: []
      }
      media_watches: {
        Row: {
          id: string
          collection_id: string
          media_id: string
          media_type: string
          user_id: string
          watched_at: string | null
        }
        Insert: {
          id?: string
          collection_id: string
          media_id: string
          media_type: string
          user_id: string
          watched_at?: string | null
        }
        Update: {
          id?: string
          collection_id?: string
          media_id?: string
          media_type?: string
          user_id?: string
          watched_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          created_at: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          created_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          created_at?: string | null
        }
        Relationships: []
      }
      movie_genres: {
        Row: {
          id: string
          movie_id: string
          genre_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          movie_id: string
          genre_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          movie_id?: string
          genre_id?: string
          created_at?: string | null
        }
        Relationships: []
      }
      movies: {
        Row: {
          id: string
          title: string
          overview: string | null
          poster_path: string | null
          tmdb_id: number
          release_year: string | null
          created_at: string | null
          backdrop_path: string | null
          tmdb_popularity: string | null
          popularity: number | null
          last_fetched: string | null
          runtime: number | null
          vote_average: number | null
        }
        Insert: {
          id?: string
          title: string
          overview?: string | null
          poster_path?: string | null
          tmdb_id: number
          release_year?: string | null
          created_at?: string | null
          backdrop_path?: string | null
          tmdb_popularity?: string | null
          popularity?: number | null
          last_fetched?: string | null
          runtime?: number | null
          vote_average?: number | null
        }
        Update: {
          id?: string
          title?: string
          overview?: string | null
          poster_path?: string | null
          tmdb_id?: number
          release_year?: string | null
          created_at?: string | null
          backdrop_path?: string | null
          tmdb_popularity?: string | null
          popularity?: number | null
          last_fetched?: string | null
          runtime?: number | null
          vote_average?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string | null
          data: Json | null
          read: boolean | null
          created_at: string | null
          actor_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message?: string | null
          data?: Json | null
          read?: boolean | null
          created_at?: string | null
          actor_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string | null
          data?: Json | null
          read?: boolean | null
          created_at?: string | null
          actor_id?: string | null
        }
        Relationships: []
      }
      recommendation_requests: {
        Row: {
          id: string
          user_id: string
          requested_at: string | null
          status: string | null
          error_message: string | null
          processing_time_ms: number | null
        }
        Insert: {
          id?: string
          user_id: string
          requested_at?: string | null
          status?: string | null
          error_message?: string | null
          processing_time_ms?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          requested_at?: string | null
          status?: string | null
          error_message?: string | null
          processing_time_ms?: number | null
        }
        Relationships: []
      }
      reel_deck: {
        Row: {
          id: string
          user_id: string
          media_id: string
          media_type: string
          added_at: string | null
          status: string | null
          last_watched_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          media_id: string
          media_type: string
          added_at?: string | null
          status?: string | null
          last_watched_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          media_id?: string
          media_type?: string
          added_at?: string | null
          status?: string | null
          last_watched_at?: string | null
        }
        Relationships: []
      }
      seasons: {
        Row: {
          id: string
          series_id: string
          season_number: number
          title: string | null
          overview: string | null
          poster_path: string | null
          release_year: string | null
          created_at: string | null
          air_date: string | null
          episode_count: number | null
          last_fetched: string | null
          tmdb_id: number | null
        }
        Insert: {
          id?: string
          series_id: string
          season_number: number
          title?: string | null
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          created_at?: string | null
          air_date?: string | null
          episode_count?: number | null
          last_fetched?: string | null
          tmdb_id?: number | null
        }
        Update: {
          id?: string
          series_id?: string
          season_number?: number
          title?: string | null
          overview?: string | null
          poster_path?: string | null
          release_year?: string | null
          created_at?: string | null
          air_date?: string | null
          episode_count?: number | null
          last_fetched?: string | null
          tmdb_id?: number | null
        }
        Relationships: []
      }
      sent_emails: {
        Row: {
          id: string
          subject: string
          greeting: string | null
          message: string
          sign_off: string | null
          founder_name: string | null
          cta_text: string | null
          cta_url: string | null
          changelog: Json | null
          recipient_type: string
          recipient_count: number
          sent_by: string | null
          sent_at: string | null
        }
        Insert: {
          id?: string
          subject: string
          greeting?: string | null
          message: string
          sign_off?: string | null
          founder_name?: string | null
          cta_text?: string | null
          cta_url?: string | null
          changelog?: Json | null
          recipient_type: string
          recipient_count: number
          sent_by?: string | null
          sent_at?: string | null
        }
        Update: {
          id?: string
          subject?: string
          greeting?: string | null
          message?: string
          sign_off?: string | null
          founder_name?: string | null
          cta_text?: string | null
          cta_url?: string | null
          changelog?: Json | null
          recipient_type?: string
          recipient_count?: number
          sent_by?: string | null
          sent_at?: string | null
        }
        Relationships: []
      }
      series: {
        Row: {
          id: string
          title: string
          overview: string | null
          poster_path: string | null
          tmdb_id: number
          release_year: string | null
          created_at: string | null
          backdrop_path: string | null
          last_fetched: string | null
          status: string | null
          first_air_date: string | null
          last_air_date: string | null
          vote_average: number | null
        }
        Insert: {
          id?: string
          title: string
          overview?: string | null
          poster_path?: string | null
          tmdb_id: number
          release_year?: string | null
          created_at?: string | null
          backdrop_path?: string | null
          last_fetched?: string | null
          status?: string | null
          first_air_date?: string | null
          last_air_date?: string | null
          vote_average?: number | null
        }
        Update: {
          id?: string
          title?: string
          overview?: string | null
          poster_path?: string | null
          tmdb_id?: number
          release_year?: string | null
          created_at?: string | null
          backdrop_path?: string | null
          last_fetched?: string | null
          status?: string | null
          first_air_date?: string | null
          last_air_date?: string | null
          vote_average?: number | null
        }
        Relationships: []
      }
      series_genres: {
        Row: {
          id: string
          series_id: string
          genre_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          series_id: string
          genre_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          series_id?: string
          genre_id?: string
          created_at?: string | null
        }
        Relationships: []
      }
      shared_collection: {
        Row: {
          id: number
          created_at: string
          collection_id: string | null
          user_id: string | null
          access_level: number | null
        }
        Insert: {
          id: number
          created_at?: string
          collection_id?: string | null
          user_id?: string | null
          access_level?: number | null
        }
        Update: {
          id?: number
          created_at?: string
          collection_id?: string | null
          user_id?: string | null
          access_level?: number | null
        }
        Relationships: []
      }
      user_blocks: {
        Row: {
          id: string
          blocker_id: string
          blocked_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          blocker_id: string
          blocked_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          blocker_id?: string
          blocked_id?: string
          created_at?: string | null
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string | null
        }
        Relationships: []
      }
      user_media_feedback: {
        Row: {
          id: string
          user_id: string
          tmdb_id: number
          media_type: string
          created_at: string | null
          updated_at: string | null
          is_seen: boolean | null
          reaction: string | null
          media_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          tmdb_id: number
          media_type: string
          created_at?: string | null
          updated_at?: string | null
          is_seen?: boolean | null
          reaction?: string | null
          media_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          tmdb_id?: number
          media_type?: string
          created_at?: string | null
          updated_at?: string | null
          is_seen?: boolean | null
          reaction?: string | null
          media_id?: string | null
        }
        Relationships: []
      }
      user_recommendations: {
        Row: {
          id: string
          user_id: string
          request_id: string | null
          tmdb_id: number
          media_type: string
          title: string
          poster_path: string | null
          release_year: number | null
          rating: number | null
          genres: string | null
          reason: string | null
          confidence_score: number | null
          created_at: string | null
          dismissed: boolean | null
          dismissed_at: string | null
          watched: boolean | null
          watched_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          request_id?: string | null
          tmdb_id: number
          media_type: string
          title: string
          poster_path?: string | null
          release_year?: number | null
          rating?: number | null
          genres?: string | null
          reason?: string | null
          confidence_score?: number | null
          created_at?: string | null
          dismissed?: boolean | null
          dismissed_at?: string | null
          watched?: boolean | null
          watched_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          request_id?: string | null
          tmdb_id?: number
          media_type?: string
          title?: string
          poster_path?: string | null
          release_year?: number | null
          rating?: number | null
          genres?: string | null
          reason?: string | null
          confidence_score?: number | null
          created_at?: string | null
          dismissed?: boolean | null
          dismissed_at?: string | null
          watched?: boolean | null
          watched_at?: string | null
        }
        Relationships: []
      }
      user_viewing_preferences: {
        Row: {
          user_id: string
          favorite_genres: Json | null
          preferred_decades: Json | null
          avg_rating_given: number | null
          preferred_runtime_min: number | null
          preferred_runtime_max: number | null
          binge_tendency: number | null
          completion_rate: number | null
          diversity_score: number | null
          top_rated_titles: Json | null
          recently_completed: Json | null
          last_analyzed_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          user_id: string
          favorite_genres?: Json | null
          preferred_decades?: Json | null
          avg_rating_given?: number | null
          preferred_runtime_min?: number | null
          preferred_runtime_max?: number | null
          binge_tendency?: number | null
          completion_rate?: number | null
          diversity_score?: number | null
          top_rated_titles?: Json | null
          recently_completed?: Json | null
          last_analyzed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          user_id?: string
          favorite_genres?: Json | null
          preferred_decades?: Json | null
          avg_rating_given?: number | null
          preferred_runtime_min?: number | null
          preferred_runtime_max?: number | null
          binge_tendency?: number | null
          completion_rate?: number | null
          diversity_score?: number | null
          top_rated_titles?: Json | null
          recently_completed?: Json | null
          last_analyzed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      watch_cycles: {
        Row: {
          id: string
          user_id: string
          series_id: string
          cycle_number: number
          started_at: string | null
          completed_at: string | null
          status: string | null
          episodes_watched: number | null
          total_episodes: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          series_id: string
          cycle_number?: number
          started_at?: string | null
          completed_at?: string | null
          status?: string | null
          episodes_watched?: number | null
          total_episodes?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          series_id?: string
          cycle_number?: number
          started_at?: string | null
          completed_at?: string | null
          status?: string | null
          episodes_watched?: number | null
          total_episodes?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      collection_summaries: {
        Row: {
          collection_id: string | null
          item_count: number | null
          first_media_id: string | null
          first_media_type: string | null
        }
        Insert: {
          [_ in never]: never
        }
        Update: {
          [_ in never]: never
        }
        Relationships: []
      }
      leaderboard_achievements: {
        Row: {
          user_id: string | null
          username: string | null
          avatar_path: string | null
          total_points: number | null
          achievements_count: number | null
        }
        Insert: {
          [_ in never]: never
        }
        Update: {
          [_ in never]: never
        }
        Relationships: []
      }
      leaderboard_comments: {
        Row: {
          user_id: string | null
          username: string | null
          avatar_path: string | null
          total_comments: number | null
          weekly_comments: number | null
          monthly_comments: number | null
        }
        Insert: {
          [_ in never]: never
        }
        Update: {
          [_ in never]: never
        }
        Relationships: []
      }
      leaderboard_episodes: {
        Row: {
          user_id: string | null
          username: string | null
          avatar_path: string | null
          total_episodes: number | null
          weekly_episodes: number | null
          monthly_episodes: number | null
        }
        Insert: {
          [_ in never]: never
        }
        Update: {
          [_ in never]: never
        }
        Relationships: []
      }
      leaderboard_shows: {
        Row: {
          user_id: string | null
          username: string | null
          avatar_path: string | null
          total_shows: number | null
        }
        Insert: {
          [_ in never]: never
        }
        Update: {
          [_ in never]: never
        }
        Relationships: []
      }
      user_daily_episode_counts: {
        Row: {
          user_id: string | null
          watch_date: string | null
          episode_count: number | null
        }
        Insert: {
          [_ in never]: never
        }
        Update: {
          [_ in never]: never
        }
        Relationships: []
      }
      user_series_stats: {
        Row: {
          user_id: string | null
          series_id: string | null
          total_episodes: number | null
          aired_episodes_count: number | null
          watched_episodes: number | null
          watched_aired_episodes: number | null
          latest_aired_episode_date: string | null
          next_upcoming_episode_date: string | null
          has_upcoming_episodes: number | null
        }
        Insert: {
          [_ in never]: never
        }
        Update: {
          [_ in never]: never
        }
        Relationships: []
      }
      user_watch_streaks: {
        Row: {
          user_id: string | null
          streak_start: string | null
          streak_end: string | null
          streak_length: string | null
        }
        Insert: {
          [_ in never]: never
        }
        Update: {
          [_ in never]: never
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
