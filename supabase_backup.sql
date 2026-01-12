--
-- PostgreSQL database dump
--

\restrict 2vqvDt4MDRdPD5Zv6Lk2be1dWSwhUctycHP3UzckS6AdXPgmvb2wzx0loi6veGl

-- Dumped from database version 15.8
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP EVENT TRIGGER IF EXISTS pgrst_drop_watch;
DROP EVENT TRIGGER IF EXISTS pgrst_ddl_watch;
DROP EVENT TRIGGER IF EXISTS issue_pg_net_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_graphql_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_cron_access;
DROP EVENT TRIGGER IF EXISTS issue_graphql_placeholder;
DROP PUBLICATION IF EXISTS supabase_realtime;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own watches" ON public.media_watches;
DROP POLICY IF EXISTS "Users can view their own reel deck" ON public.reel_deck;
DROP POLICY IF EXISTS "Users can view own episode watches" ON public.episode_watches;
DROP POLICY IF EXISTS "Users can view medias in collections they have access to" ON public.medias_collections;
DROP POLICY IF EXISTS "Users can update their own series comments" ON public.series_comments;
DROP POLICY IF EXISTS "Users can update their own season comments" ON public.season_comments;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own movie comments" ON public.movie_comments;
DROP POLICY IF EXISTS "Users can update their own episode comments" ON public.episode_comments;
DROP POLICY IF EXISTS "Users can update own episode watches" ON public.episode_watches;
DROP POLICY IF EXISTS "Users can update media positions in collections they have acces" ON public.medias_collections;
DROP POLICY IF EXISTS "Users can remove media from collections they have access to" ON public.medias_collections;
DROP POLICY IF EXISTS "Users can manage their own reel deck" ON public.reel_deck;
DROP POLICY IF EXISTS "Users can insert own episode watches" ON public.episode_watches;
DROP POLICY IF EXISTS "Users can delete their own watches" ON public.media_watches;
DROP POLICY IF EXISTS "Users can delete their own series comments" ON public.series_comments;
DROP POLICY IF EXISTS "Users can delete their own season comments" ON public.season_comments;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own movie comments" ON public.movie_comments;
DROP POLICY IF EXISTS "Users can delete their own episode comments" ON public.episode_comments;
DROP POLICY IF EXISTS "Users can delete own episode watches" ON public.episode_watches;
DROP POLICY IF EXISTS "Users can create their own watches" ON public.media_watches;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can add media to collections they have access to" ON public.medias_collections;
DROP POLICY IF EXISTS "Series genres are viewable by everyone" ON public.series_genres;
DROP POLICY IF EXISTS "Series are viewable by everyone" ON public.series;
DROP POLICY IF EXISTS "Seasons are viewable by everyone" ON public.seasons;
DROP POLICY IF EXISTS "Movies are viewable by everyone" ON public.movies;
DROP POLICY IF EXISTS "Movie genres are viewable by everyone" ON public.movie_genres;
DROP POLICY IF EXISTS "Genres are viewable by everyone" ON public.genres;
DROP POLICY IF EXISTS "Episodes are viewable by everyone" ON public.episodes;
DROP POLICY IF EXISTS "Collection owners can manage all watches" ON public.media_watches;
DROP POLICY IF EXISTS "Authenticated users can update shared_collection entries" ON public.shared_collection;
DROP POLICY IF EXISTS "Authenticated users can update series" ON public.series;
DROP POLICY IF EXISTS "Authenticated users can update seasons" ON public.seasons;
DROP POLICY IF EXISTS "Authenticated users can update movies" ON public.movies;
DROP POLICY IF EXISTS "Authenticated users can update media_collection entries" ON public.media_collection;
DROP POLICY IF EXISTS "Authenticated users can update episodes" ON public.episodes;
DROP POLICY IF EXISTS "Authenticated users can update collections" ON public.collections;
DROP POLICY IF EXISTS "Authenticated users can manage series genres" ON public.series_genres;
DROP POLICY IF EXISTS "Authenticated users can manage movie genres" ON public.movie_genres;
DROP POLICY IF EXISTS "Authenticated users can insert series" ON public.series;
DROP POLICY IF EXISTS "Authenticated users can insert seasons" ON public.seasons;
DROP POLICY IF EXISTS "Authenticated users can insert movies" ON public.movies;
DROP POLICY IF EXISTS "Authenticated users can insert episodes" ON public.episodes;
DROP POLICY IF EXISTS "Authenticated users can delete shared_collection entries" ON public.shared_collection;
DROP POLICY IF EXISTS "Authenticated users can delete series" ON public.series;
DROP POLICY IF EXISTS "Authenticated users can delete seasons" ON public.seasons;
DROP POLICY IF EXISTS "Authenticated users can delete movies" ON public.movies;
DROP POLICY IF EXISTS "Authenticated users can delete media_collection entries" ON public.media_collection;
DROP POLICY IF EXISTS "Authenticated users can delete episodes" ON public.episodes;
DROP POLICY IF EXISTS "Authenticated users can delete collections" ON public.collections;
DROP POLICY IF EXISTS "Authenticated users can create shared_collection entries" ON public.shared_collection;
DROP POLICY IF EXISTS "Authenticated users can create series comments" ON public.series_comments;
DROP POLICY IF EXISTS "Authenticated users can create season comments" ON public.season_comments;
DROP POLICY IF EXISTS "Authenticated users can create movie comments" ON public.movie_comments;
DROP POLICY IF EXISTS "Authenticated users can create media_collection entries" ON public.media_collection;
DROP POLICY IF EXISTS "Authenticated users can create episode comments" ON public.episode_comments;
DROP POLICY IF EXISTS "Authenticated users can create collections" ON public.collections;
DROP POLICY IF EXISTS "Anyone can view series comments" ON public.series_comments;
DROP POLICY IF EXISTS "Anyone can view season comments" ON public.season_comments;
DROP POLICY IF EXISTS "Anyone can view movie comments" ON public.movie_comments;
DROP POLICY IF EXISTS "Anyone can view episode comments" ON public.episode_comments;
DROP POLICY IF EXISTS "Anyone can view all shared_collection entries" ON public.shared_collection;
DROP POLICY IF EXISTS "Anyone can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view all media_collection entries" ON public.media_collection;
DROP POLICY IF EXISTS "Anyone can view all collections" ON public.collections;
DROP POLICY IF EXISTS "Anyone can read series genres" ON public.series_genres;
DROP POLICY IF EXISTS "Anyone can read movie genres" ON public.movie_genres;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_upload_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.prefixes DROP CONSTRAINT IF EXISTS "prefixes_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY public.shared_collection DROP CONSTRAINT IF EXISTS shared_collection_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.shared_collection DROP CONSTRAINT IF EXISTS shared_collection_collection_id_fkey;
ALTER TABLE IF EXISTS ONLY public.series_genres DROP CONSTRAINT IF EXISTS series_genres_series_id_fkey;
ALTER TABLE IF EXISTS ONLY public.series_genres DROP CONSTRAINT IF EXISTS series_genres_genre_id_fkey;
ALTER TABLE IF EXISTS ONLY public.series_comments DROP CONSTRAINT IF EXISTS series_comments_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.series_comments DROP CONSTRAINT IF EXISTS series_comments_series_id_fkey;
ALTER TABLE IF EXISTS ONLY public.series_comments DROP CONSTRAINT IF EXISTS series_comments_parent_comment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seasons DROP CONSTRAINT IF EXISTS seasons_series_id_fkey;
ALTER TABLE IF EXISTS ONLY public.season_comments DROP CONSTRAINT IF EXISTS season_comments_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.season_comments DROP CONSTRAINT IF EXISTS season_comments_season_id_fkey;
ALTER TABLE IF EXISTS ONLY public.season_comments DROP CONSTRAINT IF EXISTS season_comments_parent_comment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reel_deck DROP CONSTRAINT IF EXISTS reel_deck_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE IF EXISTS ONLY public.movie_genres DROP CONSTRAINT IF EXISTS movie_genres_movie_id_fkey;
ALTER TABLE IF EXISTS ONLY public.movie_genres DROP CONSTRAINT IF EXISTS movie_genres_genre_id_fkey;
ALTER TABLE IF EXISTS ONLY public.movie_comments DROP CONSTRAINT IF EXISTS movie_comments_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.movie_comments DROP CONSTRAINT IF EXISTS movie_comments_parent_comment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.movie_comments DROP CONSTRAINT IF EXISTS movie_comments_movie_id_fkey;
ALTER TABLE IF EXISTS ONLY public.medias_collections DROP CONSTRAINT IF EXISTS medias_collections_collection_id_fkey;
ALTER TABLE IF EXISTS ONLY public.media_watches DROP CONSTRAINT IF EXISTS media_watches_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.media_watches DROP CONSTRAINT IF EXISTS media_watches_collection_id_fkey;
ALTER TABLE IF EXISTS ONLY public.media_collection DROP CONSTRAINT IF EXISTS media_collection_collection_id_fkey;
ALTER TABLE IF EXISTS ONLY public.episodes DROP CONSTRAINT IF EXISTS episodes_series_id_fkey;
ALTER TABLE IF EXISTS ONLY public.episodes DROP CONSTRAINT IF EXISTS episodes_season_id_fkey;
ALTER TABLE IF EXISTS ONLY public.episode_watches DROP CONSTRAINT IF EXISTS episode_watches_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.episode_watches DROP CONSTRAINT IF EXISTS episode_watches_series_id_fkey;
ALTER TABLE IF EXISTS ONLY public.episode_watches DROP CONSTRAINT IF EXISTS episode_watches_episode_id_fkey;
ALTER TABLE IF EXISTS ONLY public.episode_comments DROP CONSTRAINT IF EXISTS episode_comments_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.episode_comments DROP CONSTRAINT IF EXISTS episode_comments_parent_comment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.episode_comments DROP CONSTRAINT IF EXISTS episode_comments_episode_id_fkey;
ALTER TABLE IF EXISTS ONLY public.collections DROP CONSTRAINT IF EXISTS collections_owner_fkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_oauth_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_flow_state_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_auth_factor_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_user_id_fkey;
DROP TRIGGER IF EXISTS update_objects_updated_at ON storage.objects;
DROP TRIGGER IF EXISTS prefixes_delete_hierarchy ON storage.prefixes;
DROP TRIGGER IF EXISTS prefixes_create_hierarchy ON storage.prefixes;
DROP TRIGGER IF EXISTS objects_update_create_prefix ON storage.objects;
DROP TRIGGER IF EXISTS objects_insert_create_prefix ON storage.objects;
DROP TRIGGER IF EXISTS objects_delete_delete_prefix ON storage.objects;
DROP TRIGGER IF EXISTS enforce_bucket_name_length_trigger ON storage.buckets;
DROP TRIGGER IF EXISTS tr_check_filters ON realtime.subscription;
DROP TRIGGER IF EXISTS set_media_position_trigger ON public.medias_collections;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP INDEX IF EXISTS storage.objects_bucket_id_level_idx;
DROP INDEX IF EXISTS storage.name_prefix_search;
DROP INDEX IF EXISTS storage.idx_prefixes_lower_name;
DROP INDEX IF EXISTS storage.idx_objects_lower_name;
DROP INDEX IF EXISTS storage.idx_objects_bucket_id_name;
DROP INDEX IF EXISTS storage.idx_name_bucket_level_unique;
DROP INDEX IF EXISTS storage.idx_multipart_uploads_list;
DROP INDEX IF EXISTS storage.bucketid_objname;
DROP INDEX IF EXISTS storage.bname;
DROP INDEX IF EXISTS realtime.subscription_subscription_id_entity_filters_key;
DROP INDEX IF EXISTS realtime.messages_inserted_at_topic_index;
DROP INDEX IF EXISTS realtime.ix_realtime_subscription_entity;
DROP INDEX IF EXISTS public.idx_series_tmdb_id;
DROP INDEX IF EXISTS public.idx_series_last_fetched;
DROP INDEX IF EXISTS public.idx_series_genres_series_id;
DROP INDEX IF EXISTS public.idx_series_genres_genre_id;
DROP INDEX IF EXISTS public.idx_series_comments_user_id;
DROP INDEX IF EXISTS public.idx_series_comments_series_id;
DROP INDEX IF EXISTS public.idx_series_comments_parent;
DROP INDEX IF EXISTS public.idx_seasons_tmdb_id;
DROP INDEX IF EXISTS public.idx_seasons_series_season;
DROP INDEX IF EXISTS public.idx_seasons_last_fetched;
DROP INDEX IF EXISTS public.idx_season_comments_user_id;
DROP INDEX IF EXISTS public.idx_season_comments_season_id;
DROP INDEX IF EXISTS public.idx_season_comments_parent;
DROP INDEX IF EXISTS public.idx_reel_deck_user_id;
DROP INDEX IF EXISTS public.idx_reel_deck_media;
DROP INDEX IF EXISTS public.idx_movies_tmdb_id;
DROP INDEX IF EXISTS public.idx_movies_last_fetched;
DROP INDEX IF EXISTS public.idx_movie_genres_movie_id;
DROP INDEX IF EXISTS public.idx_movie_genres_genre_id;
DROP INDEX IF EXISTS public.idx_movie_comments_user_id;
DROP INDEX IF EXISTS public.idx_movie_comments_parent;
DROP INDEX IF EXISTS public.idx_movie_comments_movie_id;
DROP INDEX IF EXISTS public.idx_medias_collections_position;
DROP INDEX IF EXISTS public.idx_medias_collections_media_id;
DROP INDEX IF EXISTS public.idx_medias_collections_collection_id;
DROP INDEX IF EXISTS public.idx_media_watches_media;
DROP INDEX IF EXISTS public.idx_media_watches_collection_user;
DROP INDEX IF EXISTS public.idx_genres_tmdb_id;
DROP INDEX IF EXISTS public.idx_genres_media_type;
DROP INDEX IF EXISTS public.idx_genres_last_fetched;
DROP INDEX IF EXISTS public.idx_episodes_tmdb_id;
DROP INDEX IF EXISTS public.idx_episodes_season_number;
DROP INDEX IF EXISTS public.idx_episodes_season_episode;
DROP INDEX IF EXISTS public.idx_episodes_last_fetched;
DROP INDEX IF EXISTS public.idx_episode_watches_user_series;
DROP INDEX IF EXISTS public.idx_episode_watches_user_id;
DROP INDEX IF EXISTS public.idx_episode_watches_series_id;
DROP INDEX IF EXISTS public.idx_episode_watches_episode_id;
DROP INDEX IF EXISTS public.idx_episode_comments_user_id;
DROP INDEX IF EXISTS public.idx_episode_comments_parent;
DROP INDEX IF EXISTS public.idx_episode_comments_episode_id;
DROP INDEX IF EXISTS auth.users_is_anonymous_idx;
DROP INDEX IF EXISTS auth.users_instance_id_idx;
DROP INDEX IF EXISTS auth.users_instance_id_email_idx;
DROP INDEX IF EXISTS auth.users_email_partial_key;
DROP INDEX IF EXISTS auth.user_id_created_at_idx;
DROP INDEX IF EXISTS auth.unique_phone_factor_per_user;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_pattern_idx;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_domain_idx;
DROP INDEX IF EXISTS auth.sessions_user_id_idx;
DROP INDEX IF EXISTS auth.sessions_oauth_client_id_idx;
DROP INDEX IF EXISTS auth.sessions_not_after_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_for_email_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_created_at_idx;
DROP INDEX IF EXISTS auth.saml_providers_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_updated_at_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_session_id_revoked_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_parent_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_user_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_idx;
DROP INDEX IF EXISTS auth.recovery_token_idx;
DROP INDEX IF EXISTS auth.reauthentication_token_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_user_id_token_type_key;
DROP INDEX IF EXISTS auth.one_time_tokens_token_hash_hash_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_relates_to_hash_idx;
DROP INDEX IF EXISTS auth.oauth_consents_user_order_idx;
DROP INDEX IF EXISTS auth.oauth_consents_active_user_client_idx;
DROP INDEX IF EXISTS auth.oauth_consents_active_client_idx;
DROP INDEX IF EXISTS auth.oauth_clients_deleted_at_idx;
DROP INDEX IF EXISTS auth.oauth_auth_pending_exp_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_id_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_friendly_name_unique;
DROP INDEX IF EXISTS auth.mfa_challenge_created_at_idx;
DROP INDEX IF EXISTS auth.idx_user_id_auth_method;
DROP INDEX IF EXISTS auth.idx_auth_code;
DROP INDEX IF EXISTS auth.identities_user_id_idx;
DROP INDEX IF EXISTS auth.identities_email_idx;
DROP INDEX IF EXISTS auth.flow_state_created_at_idx;
DROP INDEX IF EXISTS auth.factor_id_created_at_idx;
DROP INDEX IF EXISTS auth.email_change_token_new_idx;
DROP INDEX IF EXISTS auth.email_change_token_current_idx;
DROP INDEX IF EXISTS auth.confirmation_token_idx;
DROP INDEX IF EXISTS auth.audit_logs_instance_id_idx;
ALTER TABLE IF EXISTS ONLY supabase_migrations.seed_files DROP CONSTRAINT IF EXISTS seed_files_pkey;
ALTER TABLE IF EXISTS ONLY supabase_migrations.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_pkey;
ALTER TABLE IF EXISTS ONLY storage.prefixes DROP CONSTRAINT IF EXISTS prefixes_pkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS objects_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_name_key;
ALTER TABLE IF EXISTS ONLY storage.buckets DROP CONSTRAINT IF EXISTS buckets_pkey;
ALTER TABLE IF EXISTS ONLY storage.buckets_analytics DROP CONSTRAINT IF EXISTS buckets_analytics_pkey;
ALTER TABLE IF EXISTS ONLY realtime.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY realtime.subscription DROP CONSTRAINT IF EXISTS pk_subscription;
ALTER TABLE IF EXISTS ONLY realtime.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS ONLY public.series DROP CONSTRAINT IF EXISTS unique_series_tmdb_id;
ALTER TABLE IF EXISTS ONLY public.seasons DROP CONSTRAINT IF EXISTS unique_series_season;
ALTER TABLE IF EXISTS ONLY public.series_genres DROP CONSTRAINT IF EXISTS unique_series_genre;
ALTER TABLE IF EXISTS ONLY public.episodes DROP CONSTRAINT IF EXISTS unique_season_episode;
ALTER TABLE IF EXISTS ONLY public.movies DROP CONSTRAINT IF EXISTS unique_movie_tmdb_id;
ALTER TABLE IF EXISTS ONLY public.movie_genres DROP CONSTRAINT IF EXISTS unique_movie_genre;
ALTER TABLE IF EXISTS ONLY public.genres DROP CONSTRAINT IF EXISTS unique_genre_tmdb;
ALTER TABLE IF EXISTS ONLY public.shared_collection DROP CONSTRAINT IF EXISTS shared_collection_pkey;
ALTER TABLE IF EXISTS ONLY public.series DROP CONSTRAINT IF EXISTS series_pkey;
ALTER TABLE IF EXISTS ONLY public.series_genres DROP CONSTRAINT IF EXISTS series_genres_pkey;
ALTER TABLE IF EXISTS ONLY public.series_comments DROP CONSTRAINT IF EXISTS series_comments_pkey;
ALTER TABLE IF EXISTS ONLY public.seasons DROP CONSTRAINT IF EXISTS seasons_pkey;
ALTER TABLE IF EXISTS ONLY public.season_comments DROP CONSTRAINT IF EXISTS season_comments_pkey;
ALTER TABLE IF EXISTS ONLY public.reel_deck DROP CONSTRAINT IF EXISTS reel_deck_user_id_media_id_media_type_key;
ALTER TABLE IF EXISTS ONLY public.reel_deck DROP CONSTRAINT IF EXISTS reel_deck_pkey;
ALTER TABLE IF EXISTS ONLY public.profiles DROP CONSTRAINT IF EXISTS profiles_pkey;
ALTER TABLE IF EXISTS ONLY public.movies DROP CONSTRAINT IF EXISTS movies_pkey;
ALTER TABLE IF EXISTS ONLY public.movie_genres DROP CONSTRAINT IF EXISTS movie_genres_pkey;
ALTER TABLE IF EXISTS ONLY public.movie_comments DROP CONSTRAINT IF EXISTS movie_comments_pkey;
ALTER TABLE IF EXISTS ONLY public.medias_collections DROP CONSTRAINT IF EXISTS medias_collections_pkey;
ALTER TABLE IF EXISTS ONLY public.medias_collections DROP CONSTRAINT IF EXISTS medias_collections_collection_media_unique;
ALTER TABLE IF EXISTS ONLY public.media_watches DROP CONSTRAINT IF EXISTS media_watches_pkey;
ALTER TABLE IF EXISTS ONLY public.media_watches DROP CONSTRAINT IF EXISTS media_watches_collection_id_media_id_media_type_user_id_key;
ALTER TABLE IF EXISTS ONLY public.media_collection DROP CONSTRAINT IF EXISTS media_collection_pkey;
ALTER TABLE IF EXISTS ONLY public.genres DROP CONSTRAINT IF EXISTS genres_pkey;
ALTER TABLE IF EXISTS ONLY public.episodes DROP CONSTRAINT IF EXISTS episodes_series_season_episode_unique;
ALTER TABLE IF EXISTS ONLY public.episodes DROP CONSTRAINT IF EXISTS episodes_pkey;
ALTER TABLE IF EXISTS ONLY public.episode_watches DROP CONSTRAINT IF EXISTS episode_watches_user_id_episode_id_key;
ALTER TABLE IF EXISTS ONLY public.episode_watches DROP CONSTRAINT IF EXISTS episode_watches_pkey;
ALTER TABLE IF EXISTS ONLY public.episode_comments DROP CONSTRAINT IF EXISTS episode_comments_pkey;
ALTER TABLE IF EXISTS ONLY public.collections DROP CONSTRAINT IF EXISTS collections_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_phone_key;
ALTER TABLE IF EXISTS ONLY auth.sso_providers DROP CONSTRAINT IF EXISTS sso_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_pkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY auth.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_entity_id_key;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_token_unique;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_user_client_unique;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_clients DROP CONSTRAINT IF EXISTS oauth_clients_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_authorization_id_key;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_authorization_code_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_last_challenged_at_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_authentication_method_pkey;
ALTER TABLE IF EXISTS ONLY auth.instances DROP CONSTRAINT IF EXISTS instances_pkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_provider_id_provider_unique;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_pkey;
ALTER TABLE IF EXISTS ONLY auth.flow_state DROP CONSTRAINT IF EXISTS flow_state_pkey;
ALTER TABLE IF EXISTS ONLY auth.audit_log_entries DROP CONSTRAINT IF EXISTS audit_log_entries_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS amr_id_pk;
ALTER TABLE IF EXISTS auth.refresh_tokens ALTER COLUMN id DROP DEFAULT;
DROP VIEW IF EXISTS vault.decrypted_secrets;
DROP TABLE IF EXISTS supabase_migrations.seed_files;
DROP TABLE IF EXISTS supabase_migrations.schema_migrations;
DROP TABLE IF EXISTS storage.s3_multipart_uploads_parts;
DROP TABLE IF EXISTS storage.s3_multipart_uploads;
DROP TABLE IF EXISTS storage.prefixes;
DROP TABLE IF EXISTS storage.objects;
DROP TABLE IF EXISTS storage.migrations;
DROP TABLE IF EXISTS storage.buckets_analytics;
DROP TABLE IF EXISTS storage.buckets;
DROP TABLE IF EXISTS realtime.subscription;
DROP TABLE IF EXISTS realtime.schema_migrations;
DROP TABLE IF EXISTS realtime.messages;
DROP TABLE IF EXISTS public.shared_collection;
DROP TABLE IF EXISTS public.series_genres;
DROP TABLE IF EXISTS public.series_comments;
DROP TABLE IF EXISTS public.series;
DROP TABLE IF EXISTS public.seasons;
DROP TABLE IF EXISTS public.season_comments;
DROP TABLE IF EXISTS public.reel_deck;
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.movies;
DROP TABLE IF EXISTS public.movie_genres;
DROP TABLE IF EXISTS public.movie_comments;
DROP TABLE IF EXISTS public.medias_collections;
DROP TABLE IF EXISTS public.media_watches;
DROP TABLE IF EXISTS public.media_collection;
DROP TABLE IF EXISTS public.genres;
DROP TABLE IF EXISTS public.episodes;
DROP TABLE IF EXISTS public.episode_watches;
DROP TABLE IF EXISTS public.episode_comments;
DROP TABLE IF EXISTS public.collections;
DROP TABLE IF EXISTS auth.users;
DROP TABLE IF EXISTS auth.sso_providers;
DROP TABLE IF EXISTS auth.sso_domains;
DROP TABLE IF EXISTS auth.sessions;
DROP TABLE IF EXISTS auth.schema_migrations;
DROP TABLE IF EXISTS auth.saml_relay_states;
DROP TABLE IF EXISTS auth.saml_providers;
DROP SEQUENCE IF EXISTS auth.refresh_tokens_id_seq;
DROP TABLE IF EXISTS auth.refresh_tokens;
DROP TABLE IF EXISTS auth.one_time_tokens;
DROP TABLE IF EXISTS auth.oauth_consents;
DROP TABLE IF EXISTS auth.oauth_clients;
DROP TABLE IF EXISTS auth.oauth_authorizations;
DROP TABLE IF EXISTS auth.mfa_factors;
DROP TABLE IF EXISTS auth.mfa_challenges;
DROP TABLE IF EXISTS auth.mfa_amr_claims;
DROP TABLE IF EXISTS auth.instances;
DROP TABLE IF EXISTS auth.identities;
DROP TABLE IF EXISTS auth.flow_state;
DROP TABLE IF EXISTS auth.audit_log_entries;
DROP FUNCTION IF EXISTS vault.secrets_encrypt_secret_secret();
DROP FUNCTION IF EXISTS storage.update_updated_at_column();
DROP FUNCTION IF EXISTS storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text);
DROP FUNCTION IF EXISTS storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION IF EXISTS storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION IF EXISTS storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION IF EXISTS storage.prefixes_insert_trigger();
DROP FUNCTION IF EXISTS storage.prefixes_delete_cleanup();
DROP FUNCTION IF EXISTS storage.operation();
DROP FUNCTION IF EXISTS storage.objects_update_prefix_trigger();
DROP FUNCTION IF EXISTS storage.objects_update_level_trigger();
DROP FUNCTION IF EXISTS storage.objects_update_cleanup();
DROP FUNCTION IF EXISTS storage.objects_insert_prefix_trigger();
DROP FUNCTION IF EXISTS storage.objects_delete_cleanup();
DROP FUNCTION IF EXISTS storage.lock_top_prefixes(bucket_ids text[], names text[]);
DROP FUNCTION IF EXISTS storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text);
DROP FUNCTION IF EXISTS storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text);
DROP FUNCTION IF EXISTS storage.get_size_by_bucket();
DROP FUNCTION IF EXISTS storage.get_prefixes(name text);
DROP FUNCTION IF EXISTS storage.get_prefix(name text);
DROP FUNCTION IF EXISTS storage.get_level(name text);
DROP FUNCTION IF EXISTS storage.foldername(name text);
DROP FUNCTION IF EXISTS storage.filename(name text);
DROP FUNCTION IF EXISTS storage.extension(name text);
DROP FUNCTION IF EXISTS storage.enforce_bucket_name_length();
DROP FUNCTION IF EXISTS storage.delete_prefix_hierarchy_trigger();
DROP FUNCTION IF EXISTS storage.delete_prefix(_bucket_id text, _name text);
DROP FUNCTION IF EXISTS storage.delete_leaf_prefixes(bucket_ids text[], names text[]);
DROP FUNCTION IF EXISTS storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb);
DROP FUNCTION IF EXISTS storage.add_prefixes(_bucket_id text, _name text);
DROP FUNCTION IF EXISTS realtime.topic();
DROP FUNCTION IF EXISTS realtime.to_regrole(role_name text);
DROP FUNCTION IF EXISTS realtime.subscription_check_filters();
DROP FUNCTION IF EXISTS realtime.send(payload jsonb, event text, topic text, private boolean);
DROP FUNCTION IF EXISTS realtime.quote_wal2json(entity regclass);
DROP FUNCTION IF EXISTS realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer);
DROP FUNCTION IF EXISTS realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]);
DROP FUNCTION IF EXISTS realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text);
DROP FUNCTION IF EXISTS realtime."cast"(val text, type_ regtype);
DROP FUNCTION IF EXISTS realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]);
DROP FUNCTION IF EXISTS realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text);
DROP FUNCTION IF EXISTS realtime.apply_rls(wal jsonb, max_record_bytes integer);
DROP FUNCTION IF EXISTS public.set_default_position();
DROP FUNCTION IF EXISTS public.populate_media_positions();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.generate_create_table_statement(target_schema text, target_table text);
DROP FUNCTION IF EXISTS pgbouncer.get_auth(p_usename text);
DROP FUNCTION IF EXISTS extensions.set_graphql_placeholder();
DROP FUNCTION IF EXISTS extensions.pgrst_drop_watch();
DROP FUNCTION IF EXISTS extensions.pgrst_ddl_watch();
DROP FUNCTION IF EXISTS extensions.grant_pg_net_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_graphql_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_cron_access();
DROP FUNCTION IF EXISTS auth.uid();
DROP FUNCTION IF EXISTS auth.role();
DROP FUNCTION IF EXISTS auth.jwt();
DROP FUNCTION IF EXISTS auth.email();
DROP TYPE IF EXISTS storage.buckettype;
DROP TYPE IF EXISTS realtime.wal_rls;
DROP TYPE IF EXISTS realtime.wal_column;
DROP TYPE IF EXISTS realtime.user_defined_filter;
DROP TYPE IF EXISTS realtime.equality_op;
DROP TYPE IF EXISTS realtime.action;
DROP TYPE IF EXISTS auth.one_time_token_type;
DROP TYPE IF EXISTS auth.oauth_response_type;
DROP TYPE IF EXISTS auth.oauth_registration_type;
DROP TYPE IF EXISTS auth.oauth_client_type;
DROP TYPE IF EXISTS auth.oauth_authorization_status;
DROP TYPE IF EXISTS auth.factor_type;
DROP TYPE IF EXISTS auth.factor_status;
DROP TYPE IF EXISTS auth.code_challenge_method;
DROP TYPE IF EXISTS auth.aal_level;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS supabase_vault;
DROP EXTENSION IF EXISTS pgcrypto;
DROP EXTENSION IF EXISTS pg_stat_statements;
DROP EXTENSION IF EXISTS pg_graphql;
DROP SCHEMA IF EXISTS vault;
DROP SCHEMA IF EXISTS supabase_migrations;
DROP SCHEMA IF EXISTS storage;
DROP SCHEMA IF EXISTS realtime;
DROP EXTENSION IF EXISTS pgsodium;
DROP SCHEMA IF EXISTS pgsodium;
DROP SCHEMA IF EXISTS pgbouncer;
DROP SCHEMA IF EXISTS graphql_public;
DROP SCHEMA IF EXISTS graphql;
DROP SCHEMA IF EXISTS extensions;
DROP SCHEMA IF EXISTS auth;
--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- Name: pgsodium; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgsodium;


--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;


--
-- Name: EXTENSION pgsodium; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgsodium IS 'Pgsodium is a modern cryptography library for Postgres.';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_migrations;


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


--
-- Name: generate_create_table_statement(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_create_table_statement(target_schema text, target_table text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    table_ddl text;
    column_ddl text;
BEGIN
    -- Start CREATE TABLE
    table_ddl := 'CREATE TABLE ' || target_schema || '.' || target_table || ' (';
    
    -- Add columns
    SELECT string_agg(
        column_name || ' ' || data_type ||
        CASE 
            WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')'
            ELSE ''
        END ||
        CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
        CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default ELSE '' END,
        ', '
        ORDER BY ordinal_position
    ) INTO column_ddl
    FROM information_schema.columns
    WHERE table_schema = target_schema AND table_name = target_table;
    
    table_ddl := table_ddl || column_ddl || ');';
    
    RETURN table_ddl;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  random_username TEXT;
  adjectives TEXT[] := ARRAY[
    'epic', 'legendary', 'iconic', 'stellar', 'supreme', 
    'heroic', 'valiant', 'mighty', 'noble', 'fearless', 
    'daring', 'brilliant', 'majestic', 'invincible', 'unstoppable', 
    'victorious', 'triumphant', 'glorious', 'radiant', 'magnificent', 
    'eternal', 'relentless', 'immortal', 'cosmic', 'mystic', 
    'thunder', 'phantom', 'savage', 'rogue', 'rebel', 
    'shadow-sm', 'vengeance', 'justice', 'destiny', 'legacy', 
    'golden', 'silver', 'dark', 'bright', 'brave', 
    'fierce', 'iron', 'steel', 'blazing', 'storm', 
    'phoenix', 'titan', 'vigilant', 'royal', 'prime'
  ];
  nouns TEXT[] := ARRAY[
    'avenger', 'knight', 'jedi', 'rebel', 'warrior', 
    'ranger', 'guardian', 'hunter', 'voyager', 'raider', 
    'titan', 'gladiator', 'samurai', 'hero', 'wizard', 
    'sorcerer', 'cyborg', 'ninja', 'pirate', 'cowboy', 
    'pilot', 'commander', 'captain', 'director', 'producer', 
    'falcon', 'panther', 'dragon', 'eagle', 'wolf', 
    'scorpion', 'viper', 'cobra', 'lion', 'tiger', 
    'phoenix', 'venom', 'blade', 'shield', 'arrow', 
    'sword', 'spartan', 'trooper', 'maverick', 'outlaw', 
    'villain', 'paladin', 'watcher', 'defender', 'champion'
  ];
  random_number INTEGER;
  random_adjective TEXT;
  random_noun TEXT;
  username_exists BOOLEAN;
  max_attempts INTEGER := 10; -- Maximum number of attempts to generate a unique username
  current_attempt INTEGER := 0;
BEGIN
  -- Loop until we find a unique username or reach max attempts
  <<username_generation_loop>>
  WHILE current_attempt < max_attempts LOOP
    -- Increment attempt counter
    current_attempt := current_attempt + 1;
    
    -- Generate random username components
    random_adjective := adjectives[floor(random() * array_length(adjectives, 1)) + 1];
    random_noun := nouns[floor(random() * array_length(nouns, 1)) + 1];
    random_number := floor(random() * 8999) + 1001;
    
    -- Combine to form username with proper capitalization
    random_username := 
      upper(substring(random_adjective, 1, 1)) || 
      substring(random_adjective, 2) || 
      upper(substring(random_noun, 1, 1)) || 
      substring(random_noun, 2) || 
      random_number;
    
    -- Check if username already exists (case-insensitive check)
    SELECT EXISTS(
      SELECT 1 FROM public.profiles 
      WHERE LOWER(username) = LOWER(random_username)
    ) INTO username_exists;
    
    -- If username is unique, exit the loop
    IF NOT username_exists THEN
      EXIT username_generation_loop;
    END IF;
  END LOOP;
  
  -- If we couldn't generate a unique username after max attempts,
  -- add the user's UUID (or part of it) to ensure uniqueness
  IF username_exists THEN
    random_username := random_username || substring(NEW.id::text, 1, 6);
  END IF;
  
  -- Create new profile
  INSERT INTO public.profiles (id, created_at, username, settings)
  VALUES (
    NEW.id,
    NOW(),
    random_username,
    '{}'::jsonb
  );
  
  RETURN NEW;
END;
$$;


--
-- Name: populate_media_positions(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.populate_media_positions() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    collection RECORD;
    media_item RECORD;
    pos INTEGER;
BEGIN
    -- Loop through each collection
    FOR collection IN SELECT DISTINCT collection_id FROM medias_collections LOOP
        pos := 0;
        
        -- For each media item in this collection, ordered by created_at
        FOR media_item IN 
            SELECT id 
            FROM medias_collections 
            WHERE collection_id = collection.collection_id
            ORDER BY created_at ASC
        LOOP
            -- Update position
            UPDATE medias_collections 
            SET position = pos 
            WHERE id = media_item.id;
            
            pos := pos + 1;
        END LOOP;
    END LOOP;
END;
$$;


--
-- Name: set_default_position(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_default_position() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    max_pos INTEGER;
BEGIN
    -- Get the highest position for this collection
    SELECT COALESCE(MAX(position), -1) + 1 INTO max_pos 
    FROM medias_collections 
    WHERE collection_id = NEW.collection_id;
    
    -- Set new position
    NEW.position := max_pos;
    RETURN NEW;
END;
$$;


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_level_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


--
-- Name: secrets_encrypt_secret_secret(); Type: FUNCTION; Schema: vault; Owner: -
--

CREATE FUNCTION vault.secrets_encrypt_secret_secret() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
		BEGIN
		        new.secret = CASE WHEN new.secret IS NULL THEN NULL ELSE
			CASE WHEN new.key_id IS NULL THEN NULL ELSE pg_catalog.encode(
			  pgsodium.crypto_aead_det_encrypt(
				pg_catalog.convert_to(new.secret, 'utf8'),
				pg_catalog.convert_to((new.id::text || new.description::text || new.created_at::text || new.updated_at::text)::text, 'utf8'),
				new.key_id::uuid,
				new.nonce
			  ),
				'base64') END END;
		RETURN new;
		END;
		$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collections (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text,
    owner uuid DEFAULT gen_random_uuid(),
    is_public boolean NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: episode_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.episode_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    episode_id uuid NOT NULL,
    user_id uuid NOT NULL,
    parent_comment_id uuid,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: episode_watches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.episode_watches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    episode_id uuid NOT NULL,
    series_id uuid NOT NULL,
    watched_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE episode_watches; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.episode_watches IS 'Tracks which episodes users have watched for TV series progress tracking';


--
-- Name: COLUMN episode_watches.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.episode_watches.user_id IS 'The user who watched the episode';


--
-- Name: COLUMN episode_watches.episode_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.episode_watches.episode_id IS 'The episode that was watched';


--
-- Name: COLUMN episode_watches.series_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.episode_watches.series_id IS 'The series the episode belongs to (for easier querying)';


--
-- Name: COLUMN episode_watches.watched_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.episode_watches.watched_at IS 'When the user marked the episode as watched';


--
-- Name: episodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.episodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    series_id uuid NOT NULL,
    season_id uuid NOT NULL,
    episode_number integer NOT NULL,
    title text NOT NULL,
    overview text,
    poster_path text,
    release_year text,
    created_at timestamp with time zone DEFAULT now(),
    air_date date,
    runtime integer,
    vote_average numeric(3,1),
    last_fetched timestamp with time zone DEFAULT now(),
    tmdb_id integer,
    season_number integer
);


--
-- Name: COLUMN episodes.air_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.episodes.air_date IS 'Air date of the episode';


--
-- Name: COLUMN episodes.runtime; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.episodes.runtime IS 'Episode runtime in minutes';


--
-- Name: COLUMN episodes.vote_average; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.episodes.vote_average IS 'TMDB user rating (0-10)';


--
-- Name: COLUMN episodes.last_fetched; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.episodes.last_fetched IS 'Last time episode data was fetched from TMDB';


--
-- Name: COLUMN episodes.tmdb_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.episodes.tmdb_id IS 'TMDB episode ID for reference';


--
-- Name: COLUMN episodes.season_number; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.episodes.season_number IS 'Season number for quick lookups without joining seasons table';


--
-- Name: genres; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.genres (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tmdb_id integer NOT NULL,
    name text NOT NULL,
    media_type text NOT NULL,
    icon text,
    last_fetched timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT genres_media_type_check CHECK ((media_type = ANY (ARRAY['movie'::text, 'tv'::text])))
);


--
-- Name: TABLE genres; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.genres IS 'TMDB genres for movies and TV shows';


--
-- Name: COLUMN genres.icon; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.genres.icon IS 'Icon identifier for UI display';


--
-- Name: COLUMN genres.last_fetched; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.genres.last_fetched IS 'Last time genre list was refreshed from TMDB (refresh every 3-6 months)';


--
-- Name: media_collection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_collection (
    id bigint NOT NULL,
    collection_id uuid DEFAULT gen_random_uuid(),
    media_id text,
    media_type text,
    title text,
    poster_path text,
    release_year text
);


--
-- Name: media_collection_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.media_collection ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.media_collection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: media_watches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_watches (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    collection_id uuid NOT NULL,
    media_id text NOT NULL,
    media_type text NOT NULL,
    user_id uuid NOT NULL,
    watched_at timestamp with time zone DEFAULT now()
);


--
-- Name: medias_collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medias_collections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    collection_id uuid NOT NULL,
    media_id uuid NOT NULL,
    media_type text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    "position" integer,
    CONSTRAINT medias_collections_media_type_check CHECK ((media_type = ANY (ARRAY['movie'::text, 'tv'::text])))
);


--
-- Name: movie_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movie_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    movie_id uuid NOT NULL,
    user_id uuid NOT NULL,
    parent_comment_id uuid,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: movie_genres; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movie_genres (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    movie_id uuid NOT NULL,
    genre_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE movie_genres; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.movie_genres IS 'Junction table linking movies to genres';


--
-- Name: movies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    overview text,
    poster_path text,
    tmdb_id integer NOT NULL,
    release_year text,
    created_at timestamp with time zone DEFAULT now(),
    backdrop_path text,
    tmdb_popularity text,
    popularity integer,
    last_fetched timestamp with time zone DEFAULT now(),
    runtime integer
);


--
-- Name: COLUMN movies.last_fetched; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.movies.last_fetched IS 'Last time movie data was fetched from TMDB';


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    username text DEFAULT ''::text NOT NULL,
    settings jsonb,
    last_username_change timestamp with time zone,
    role smallint DEFAULT '0'::smallint,
    avatar_path text,
    profile_visibility text DEFAULT 'public'::text,
    CONSTRAINT profiles_profile_visibility_check CHECK ((profile_visibility = ANY (ARRAY['public'::text, 'private'::text])))
);


--
-- Name: reel_deck; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reel_deck (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    media_id uuid NOT NULL,
    media_type text NOT NULL,
    added_at timestamp with time zone DEFAULT now(),
    status text DEFAULT 'watching'::text,
    last_watched_at timestamp with time zone,
    CONSTRAINT reel_deck_media_type_check CHECK ((media_type = ANY (ARRAY['movie'::text, 'tv'::text]))),
    CONSTRAINT reel_deck_status_check CHECK ((status = ANY (ARRAY['watching'::text, 'completed'::text, 'paused'::text])))
);


--
-- Name: season_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.season_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    season_id uuid NOT NULL,
    user_id uuid NOT NULL,
    parent_comment_id uuid,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: seasons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seasons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    series_id uuid NOT NULL,
    season_number integer NOT NULL,
    title text,
    overview text,
    poster_path text,
    release_year text,
    created_at timestamp with time zone DEFAULT now(),
    air_date date,
    episode_count integer,
    last_fetched timestamp with time zone DEFAULT now(),
    tmdb_id integer
);


--
-- Name: COLUMN seasons.air_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.seasons.air_date IS 'Air date of the season premiere';


--
-- Name: COLUMN seasons.episode_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.seasons.episode_count IS 'Total number of episodes in this season';


--
-- Name: COLUMN seasons.last_fetched; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.seasons.last_fetched IS 'Last time season data was fetched from TMDB';


--
-- Name: COLUMN seasons.tmdb_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.seasons.tmdb_id IS 'The Movie Database (TMDB) ID for this season';


--
-- Name: series; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.series (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    overview text,
    poster_path text,
    tmdb_id integer NOT NULL,
    release_year text,
    created_at timestamp with time zone DEFAULT now(),
    backdrop_path text,
    last_fetched timestamp with time zone DEFAULT now(),
    status text,
    first_air_date date,
    last_air_date date,
    CONSTRAINT series_status_check CHECK ((status = ANY (ARRAY['Returning Series'::text, 'Ended'::text, 'Canceled'::text, 'In Production'::text, 'Planned'::text])))
);


--
-- Name: COLUMN series.last_fetched; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.series.last_fetched IS 'Last time series data was fetched from TMDB';


--
-- Name: COLUMN series.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.series.status IS 'Current status: Returning Series, Ended, Canceled, etc.';


--
-- Name: COLUMN series.first_air_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.series.first_air_date IS 'Date of first episode aired';


--
-- Name: COLUMN series.last_air_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.series.last_air_date IS 'Date of most recent episode aired';


--
-- Name: series_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.series_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    series_id uuid NOT NULL,
    user_id uuid NOT NULL,
    parent_comment_id uuid,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: series_genres; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.series_genres (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    series_id uuid NOT NULL,
    genre_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE series_genres; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.series_genres IS 'Junction table linking series to genres';


--
-- Name: shared_collection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shared_collection (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    collection_id uuid DEFAULT gen_random_uuid(),
    user_id uuid DEFAULT gen_random_uuid(),
    access_level smallint DEFAULT '0'::smallint
);


--
-- Name: shared_collection_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.shared_collection ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.shared_collection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


--
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


--
-- Name: decrypted_secrets; Type: VIEW; Schema: vault; Owner: -
--

CREATE VIEW vault.decrypted_secrets AS
 SELECT secrets.id,
    secrets.name,
    secrets.description,
    secrets.secret,
        CASE
            WHEN (secrets.secret IS NULL) THEN NULL::text
            ELSE
            CASE
                WHEN (secrets.key_id IS NULL) THEN NULL::text
                ELSE convert_from(pgsodium.crypto_aead_det_decrypt(decode(secrets.secret, 'base64'::text), convert_to(((((secrets.id)::text || secrets.description) || (secrets.created_at)::text) || (secrets.updated_at)::text), 'utf8'::name), secrets.key_id, secrets.nonce), 'utf8'::name)
            END
        END AS decrypted_secret,
    secrets.key_id,
    secrets.nonce,
    secrets.created_at,
    secrets.updated_at
   FROM vault.secrets;


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	3c01d349-2dae-4572-9053-019e9d8908e9	{"action":"user_signedup","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-03-29 07:19:07.424988+00	
00000000-0000-0000-0000-000000000000	1a399a26-a127-4205-a2e2-2f336c6bf81b	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-29 07:19:07.433654+00	
00000000-0000-0000-0000-000000000000	b38474a4-fcf8-4aff-bdd0-5d159eb9aa68	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-03-29 07:19:07.465949+00	
00000000-0000-0000-0000-000000000000	c5ce3924-0ff7-4df0-a963-3352b1b15a0a	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-03-29 07:39:06.330121+00	
00000000-0000-0000-0000-000000000000	7ad401d7-a31d-4395-bc8c-359098d7e299	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-03-29 11:42:20.188297+00	
00000000-0000-0000-0000-000000000000	30f6a65a-4051-4a41-a676-2fcbcedee5b5	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-03-29 11:52:50.539917+00	
00000000-0000-0000-0000-000000000000	c84997de-16a8-4475-a7e0-de1180a4611d	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-03-29 11:53:21.690478+00	
00000000-0000-0000-0000-000000000000	53c04b94-609e-4879-b417-31304c6d5c7c	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-03-29 11:55:44.346279+00	
00000000-0000-0000-0000-000000000000	9388e37c-d9c1-4efc-a07f-d62911f36949	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-03-29 11:56:24.408965+00	
00000000-0000-0000-0000-000000000000	fc759891-2425-4919-870c-208c84a1cc38	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-29 14:12:42.22541+00	
00000000-0000-0000-0000-000000000000	92d41c21-c6ec-49b3-878e-acf68eb98e7a	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-29 14:12:42.234813+00	
00000000-0000-0000-0000-000000000000	34e5821d-d325-4517-89db-386314462b8b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-29 14:20:35.018446+00	
00000000-0000-0000-0000-000000000000	28e978f3-43b3-4fdf-9c84-8100d2c8cb34	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-29 14:20:37.391833+00	
00000000-0000-0000-0000-000000000000	6f93f1f8-5a0b-471e-b796-dc02536f2f8a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-29 14:23:34.675677+00	
00000000-0000-0000-0000-000000000000	251d129b-8ba3-4537-b0fd-04554d92241c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-29 14:23:37.136297+00	
00000000-0000-0000-0000-000000000000	adacd1ab-4786-47e7-b7f9-f3b6aabe781a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-29 15:12:45.670799+00	
00000000-0000-0000-0000-000000000000	2f0e2778-e0aa-40b3-822b-66eafd14d333	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-29 15:12:50.747185+00	
00000000-0000-0000-0000-000000000000	a9712b1d-e9e9-4d18-8532-47db4d14210c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-29 15:12:53.714184+00	
00000000-0000-0000-0000-000000000000	e81044f6-f2ff-4e29-8828-b5f5689106f6	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-03-30 05:07:41.476319+00	
00000000-0000-0000-0000-000000000000	ae0a12f1-6f85-44f9-b58a-73e155e5e3c8	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-03-30 05:08:29.129847+00	
00000000-0000-0000-0000-000000000000	35667078-2c56-4cc7-b8b8-ff762ab087d8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 05:55:46.697546+00	
00000000-0000-0000-0000-000000000000	54a2dae2-0208-4544-8246-cccf83e724b8	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 05:55:46.700796+00	
00000000-0000-0000-0000-000000000000	b38d4147-fd0e-4b1c-871c-4e8f2cadba2d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 05:55:46.719128+00	
00000000-0000-0000-0000-000000000000	3cdfa837-7ff8-4727-9731-24eb1ba88f34	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 05:55:46.732163+00	
00000000-0000-0000-0000-000000000000	20d511f4-61f3-4f35-a130-f2a1bc32bd39	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 05:55:49.827932+00	
00000000-0000-0000-0000-000000000000	56278609-d291-4b9c-9029-6a9f8558b937	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-03-30 06:00:58.669378+00	
00000000-0000-0000-0000-000000000000	4cc1293a-cde6-4a64-81d0-9e3bea717a61	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-03-30 06:01:39.755259+00	
00000000-0000-0000-0000-000000000000	efd6632c-2283-4757-b5df-c8840d56c90e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 06:53:51.259876+00	
00000000-0000-0000-0000-000000000000	563b4b25-43ed-46dc-856b-d4dc9616c1a7	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 06:53:51.276217+00	
00000000-0000-0000-0000-000000000000	6c87bed5-0c65-44fe-9cd5-a038825ee67f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 07:51:52.260725+00	
00000000-0000-0000-0000-000000000000	4e94109d-1ec0-4ca4-b553-da5a2df30471	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 07:51:52.263037+00	
00000000-0000-0000-0000-000000000000	6e9b4ea0-59f8-4d3e-b22f-38afd3a85a0c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 08:49:53.175567+00	
00000000-0000-0000-0000-000000000000	649474c8-27a0-4966-b1d0-f5fcc796f6b9	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 08:49:53.177061+00	
00000000-0000-0000-0000-000000000000	b7999704-49bf-4f68-8a12-d7d01e756d9a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 09:47:54.241177+00	
00000000-0000-0000-0000-000000000000	88c05ba8-322e-4d58-9827-4f8bc253ed4f	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 09:47:54.24367+00	
00000000-0000-0000-0000-000000000000	3ecbee28-ed4e-4c6b-b199-504eb5a19e0a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 10:45:55.109147+00	
00000000-0000-0000-0000-000000000000	acf654be-c960-49e8-949c-5d55eae2c11c	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 10:45:55.110135+00	
00000000-0000-0000-0000-000000000000	37ba37b2-d18a-403e-9439-f99ae5b97a27	{"action":"user_signedup","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-03-30 11:15:08.431711+00	
00000000-0000-0000-0000-000000000000	4bb0c616-e227-4dd5-b630-bbe073f317ce	{"action":"login","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-30 11:15:08.436945+00	
00000000-0000-0000-0000-000000000000	b16231c6-f911-4a73-8543-b5df399c00df	{"action":"user_recovery_requested","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-03-30 11:15:08.461816+00	
00000000-0000-0000-0000-000000000000	9a6db5f6-7660-4eb0-92c9-727173b15add	{"action":"login","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-30 11:15:44.150597+00	
00000000-0000-0000-0000-000000000000	a6b606be-ccf6-4dc5-b6f2-18ab34f33003	{"action":"user_recovery_requested","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-03-30 11:27:53.082656+00	
00000000-0000-0000-0000-000000000000	d0bd3605-e32d-41a0-98ad-d1ac2ce20527	{"action":"login","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-30 11:29:30.826364+00	
00000000-0000-0000-0000-000000000000	2410a369-2db3-46e1-a4df-9f0b92b5e927	{"action":"user_recovery_requested","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-03-30 11:32:00.623148+00	
00000000-0000-0000-0000-000000000000	1015f556-4db6-47e8-bc43-266997911f7b	{"action":"login","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-30 11:33:33.966619+00	
00000000-0000-0000-0000-000000000000	f9f349ca-9831-45e2-a2ef-13e41b26d7af	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 11:44:08.896376+00	
00000000-0000-0000-0000-000000000000	ed1316f9-35aa-4d3a-a94e-9c6bf35884fe	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 11:44:08.898853+00	
00000000-0000-0000-0000-000000000000	af400ee2-a571-40ea-b220-54b054cbc2ba	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 13:00:04.82092+00	
00000000-0000-0000-0000-000000000000	cc3f06b3-dd05-401b-9ac4-4d84f5e63947	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 13:00:04.828524+00	
00000000-0000-0000-0000-000000000000	8626526c-58f6-41cc-9e2d-ab90e8870b94	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 13:00:04.86958+00	
00000000-0000-0000-0000-000000000000	b758a693-88b1-4d98-91ca-6ae3251778e8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-30 13:13:01.171307+00	
00000000-0000-0000-0000-000000000000	0918e1fc-8947-45d6-8716-2dcdccbafdfe	{"action":"logout","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-03-30 13:13:01.288435+00	
00000000-0000-0000-0000-000000000000	5ef40ebf-3986-48aa-835b-54eed1ea6a3d	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-03-30 13:15:44.877029+00	
00000000-0000-0000-0000-000000000000	80b47dea-8215-47e4-9ea0-8cfb66ae2738	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-03-30 13:16:32.489206+00	
00000000-0000-0000-0000-000000000000	b51baf54-1419-4809-ba03-fcca7f2b7bf4	{"action":"user_recovery_requested","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-03-30 13:19:55.245804+00	
00000000-0000-0000-0000-000000000000	9a196dc6-3d18-4add-b6d0-3a3968cf64cb	{"action":"login","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-30 13:20:42.193313+00	
00000000-0000-0000-0000-000000000000	01e8dd26-794e-48a2-b906-023aaa0c7a48	{"action":"logout","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-30 13:27:34.130865+00	
00000000-0000-0000-0000-000000000000	0d01907e-67be-4c46-a6b0-dbd9656946bf	{"action":"user_signedup","actor_id":"8d4988f6-3593-4a1d-b835-7d25b58314f0","actor_username":"rk.belton@gmail.co","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-03-30 13:27:46.692757+00	
00000000-0000-0000-0000-000000000000	4255dcf8-589d-4b2f-9e57-bc1c97a27209	{"action":"login","actor_id":"8d4988f6-3593-4a1d-b835-7d25b58314f0","actor_username":"rk.belton@gmail.co","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-30 13:27:46.696799+00	
00000000-0000-0000-0000-000000000000	4cf3d232-f7bc-44b3-9276-901386943304	{"action":"user_recovery_requested","actor_id":"8d4988f6-3593-4a1d-b835-7d25b58314f0","actor_username":"rk.belton@gmail.co","actor_via_sso":false,"log_type":"user"}	2025-03-30 13:27:46.709195+00	
00000000-0000-0000-0000-000000000000	d5f41e43-cd60-48cf-bbe0-da47cf91e8e6	{"action":"user_recovery_requested","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-03-30 13:28:09.997206+00	
00000000-0000-0000-0000-000000000000	e644bfc4-bd67-40de-a2ce-971bd998324f	{"action":"user_recovery_requested","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-03-30 13:35:40.229234+00	
00000000-0000-0000-0000-000000000000	17f8176f-ce44-4853-918b-29747b693544	{"action":"login","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-03-30 13:36:20.601857+00	
00000000-0000-0000-0000-000000000000	bcf3433f-27c6-49a8-908c-1257b41fec5e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 02:32:08.25035+00	
00000000-0000-0000-0000-000000000000	1d9faf1c-83fc-473a-8afb-571cbc0969c6	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 02:32:08.26936+00	
00000000-0000-0000-0000-000000000000	a9c23d7b-76d8-4999-9586-5bb9ff86753d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 02:32:08.323846+00	
00000000-0000-0000-0000-000000000000	b2f1c404-171d-4f09-9386-e60bf63e7e55	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 02:32:08.347537+00	
00000000-0000-0000-0000-000000000000	1e7e3bf0-c6a3-4cba-b314-f11aa7d844aa	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 02:32:11.216429+00	
00000000-0000-0000-0000-000000000000	aa921a0f-95d4-45ed-8695-e1dbc4106d5e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 03:30:12.490647+00	
00000000-0000-0000-0000-000000000000	01c4b8b4-58d5-42d4-9877-e83581640120	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 03:30:12.49266+00	
00000000-0000-0000-0000-000000000000	02fefbe4-4d8c-4511-8700-799db5fcf88a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 04:28:13.488445+00	
00000000-0000-0000-0000-000000000000	9686430a-99fb-468f-9d15-ea249ebac15d	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 04:28:13.490753+00	
00000000-0000-0000-0000-000000000000	8654eeaa-3971-4bc3-a471-291880818201	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 05:26:14.424749+00	
00000000-0000-0000-0000-000000000000	0a55dad8-508e-4c76-828c-ec9bb7ca5e6d	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 05:26:14.435522+00	
00000000-0000-0000-0000-000000000000	2154b531-84a4-4323-9a99-8359195732cc	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-03-31 06:35:40.425094+00	
00000000-0000-0000-0000-000000000000	85196e90-988b-4a8a-b56e-9bb9ee0d50c7	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-03-31 06:36:48.952184+00	
00000000-0000-0000-0000-000000000000	5b8fbe4e-5263-40df-996d-01ae862ebc69	{"action":"token_refreshed","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-31 11:03:03.699241+00	
00000000-0000-0000-0000-000000000000	72a7f0e8-75b8-4e9b-83e3-623e0de63f18	{"action":"token_revoked","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-31 11:03:03.710385+00	
00000000-0000-0000-0000-000000000000	23034bb3-7433-4eea-a95e-2f4776eb4cca	{"action":"token_refreshed","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-31 11:03:03.743588+00	
00000000-0000-0000-0000-000000000000	be77b626-d638-43e9-a71e-eccb8e73ccad	{"action":"token_refreshed","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-31 11:03:06.549593+00	
00000000-0000-0000-0000-000000000000	531bc548-d4bd-469e-82a6-ce24c3d66c16	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 23:47:23.921726+00	
00000000-0000-0000-0000-000000000000	8a7fdf6b-9d7e-4d2f-9849-7d0eea6e7554	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 23:47:23.939608+00	
00000000-0000-0000-0000-000000000000	dbc8a383-168d-403f-8394-81979aa841bb	{"action":"user_signedup","actor_id":"3e9e5cdc-8387-4fb3-b1c3-866d24551cfe","actor_username":"william@haddads.net.au","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-03-31 23:47:57.189765+00	
00000000-0000-0000-0000-000000000000	0bfb55f5-b47b-476c-99de-c86a378d9d9f	{"action":"login","actor_id":"3e9e5cdc-8387-4fb3-b1c3-866d24551cfe","actor_username":"william@haddads.net.au","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-31 23:47:57.196016+00	
00000000-0000-0000-0000-000000000000	22e3dcf5-47dd-4620-9906-437798664f82	{"action":"user_recovery_requested","actor_id":"3e9e5cdc-8387-4fb3-b1c3-866d24551cfe","actor_username":"william@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-03-31 23:47:57.217146+00	
00000000-0000-0000-0000-000000000000	94d23ff2-7f21-45c5-bd59-e91d9df4f796	{"action":"login","actor_id":"3e9e5cdc-8387-4fb3-b1c3-866d24551cfe","actor_username":"william@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-03-31 23:48:41.70352+00	
00000000-0000-0000-0000-000000000000	495925be-d51e-49da-bbd9-aba43718b547	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 23:49:06.83778+00	
00000000-0000-0000-0000-000000000000	aed5750d-9435-4698-81db-48d48bb300c6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 23:49:08.727559+00	
00000000-0000-0000-0000-000000000000	4ab875c2-d775-44c5-8d12-cf5b4a5f913a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 23:49:08.755183+00	
00000000-0000-0000-0000-000000000000	ac0bda5f-c8ae-4c18-96c9-d9d8b2a25f50	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 23:50:08.023221+00	
00000000-0000-0000-0000-000000000000	b3b4bbc8-f669-4cf2-a000-70c38f1f6255	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-03-31 23:50:10.913903+00	
00000000-0000-0000-0000-000000000000	2d985a79-b313-40f5-822b-e5efb053adc1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-01 05:27:12.504465+00	
00000000-0000-0000-0000-000000000000	f974d392-993f-490a-9193-845f15cbee4e	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-01 05:27:12.523936+00	
00000000-0000-0000-0000-000000000000	af59de73-805f-493d-893d-358dad740d59	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-01 06:50:25.544695+00	
00000000-0000-0000-0000-000000000000	0588063a-4ab4-42cc-9d90-0fbd84f45f5c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 06:26:15.285549+00	
00000000-0000-0000-0000-000000000000	e8abf01f-3a6b-49d4-b4bb-c1ef7946fe6f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 06:26:15.356201+00	
00000000-0000-0000-0000-000000000000	4e95842c-09e8-4f9f-95b6-291701775146	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 06:26:22.888995+00	
00000000-0000-0000-0000-000000000000	5b20bc13-d645-45b7-8554-381b3122e9d5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 13:18:23.062731+00	
00000000-0000-0000-0000-000000000000	f02f9a1d-f710-40fd-b7a9-c796f2da456d	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 13:18:23.077017+00	
00000000-0000-0000-0000-000000000000	b5aa69ab-3cac-43f4-a0cc-479e743e63a7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 13:18:23.104448+00	
00000000-0000-0000-0000-000000000000	7bbef982-86f8-4a0c-9cec-002014647505	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 13:18:23.142257+00	
00000000-0000-0000-0000-000000000000	b92af550-0e05-4fa8-9da7-23f5c117610b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 13:18:26.0831+00	
00000000-0000-0000-0000-000000000000	58f828a6-12eb-4c04-b09b-4e065b5eff74	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 14:16:52.739451+00	
00000000-0000-0000-0000-000000000000	45e8b9e3-2b4f-4690-9b6e-c4ebbc45625f	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 14:16:52.740521+00	
00000000-0000-0000-0000-000000000000	9e92f2d5-f3fd-45cf-9090-3194ffddb026	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 15:14:56.925075+00	
00000000-0000-0000-0000-000000000000	16827c31-ed87-4c53-b57c-338de7cf45e3	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 15:14:56.926053+00	
00000000-0000-0000-0000-000000000000	47bd09a2-ad10-4c0e-a068-77d8d79587ac	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 22:21:34.591818+00	
00000000-0000-0000-0000-000000000000	44fdba7a-8011-408a-b13b-abe608887a6c	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 22:21:34.592747+00	
00000000-0000-0000-0000-000000000000	9e4076b0-7987-45d2-b60f-7d9364a0848a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 23:20:00.191349+00	
00000000-0000-0000-0000-000000000000	d7dd486c-61b5-4a37-b9cc-07895a280604	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-02 23:20:00.195432+00	
00000000-0000-0000-0000-000000000000	732f33ce-1d52-423e-90a8-34008cd8a4cf	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 00:18:01.218898+00	
00000000-0000-0000-0000-000000000000	1e5310c8-3b11-448f-b71f-537517632abb	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 00:18:01.219994+00	
00000000-0000-0000-0000-000000000000	bd253922-e8f3-457e-b0e2-09251bd02a3d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 01:16:02.229926+00	
00000000-0000-0000-0000-000000000000	7278b60f-f47b-4a9c-8bb8-40486a8289f2	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 01:16:02.231013+00	
00000000-0000-0000-0000-000000000000	84bed6f6-faa7-451f-beb3-98303ac79b60	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 02:14:03.293107+00	
00000000-0000-0000-0000-000000000000	95a9f880-bfcd-490a-8784-f1e6f88b7077	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 02:14:03.294012+00	
00000000-0000-0000-0000-000000000000	92b25501-f16c-4bb6-bb0b-598ca63e1278	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 03:12:08.272872+00	
00000000-0000-0000-0000-000000000000	944c0bd4-fe1c-46b1-8879-8f9b152e9bd0	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 03:12:08.273912+00	
00000000-0000-0000-0000-000000000000	80b4c5b9-8897-447b-9556-6d7c569a26f9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 04:10:10.544232+00	
00000000-0000-0000-0000-000000000000	a42f0df0-2418-474b-b142-22dd8a53e373	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 04:10:10.545273+00	
00000000-0000-0000-0000-000000000000	c489854c-aed4-4be5-ba8e-cb5ab6b60b95	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 05:08:21.567521+00	
00000000-0000-0000-0000-000000000000	71d809ea-e00d-4405-84fe-2b72f31317f6	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 05:08:21.56854+00	
00000000-0000-0000-0000-000000000000	dcfe9947-f273-47fd-acb7-3ae54eae6416	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 06:06:50.912774+00	
00000000-0000-0000-0000-000000000000	56e06445-4c29-4c15-b2ae-b35907d53cf2	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 06:06:50.913797+00	
00000000-0000-0000-0000-000000000000	840089ae-a193-43f4-aa26-e00518167417	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-04-03 08:27:33.679957+00	
00000000-0000-0000-0000-000000000000	1e0fe67b-a621-4b03-b2e9-c9faf4f558fa	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-04-03 08:28:17.583776+00	
00000000-0000-0000-0000-000000000000	1f1438b1-ebaf-49dc-a88b-82e5b7f26c68	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 09:37:20.601035+00	
00000000-0000-0000-0000-000000000000	4e64ecc0-1017-4b46-87a9-79b70ae10621	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 09:37:20.602121+00	
00000000-0000-0000-0000-000000000000	6dd19d33-e756-45ad-9400-6ff1d5ccb1bc	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 09:37:20.625549+00	
00000000-0000-0000-0000-000000000000	6e2ff304-270d-4191-87c6-06800a65db9e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 13:12:32.448094+00	
00000000-0000-0000-0000-000000000000	83df2a90-f035-40c6-ad8b-f972143e75e6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 13:47:52.807287+00	
00000000-0000-0000-0000-000000000000	bd1dda79-b2f6-4042-a415-b9ccd46a3bfa	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 13:47:52.808201+00	
00000000-0000-0000-0000-000000000000	825aeb12-42bb-48c5-bebe-33716f58242b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 13:47:55.154856+00	
00000000-0000-0000-0000-000000000000	d8bb8129-d9be-4238-a468-d92711144385	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 14:46:04.934058+00	
00000000-0000-0000-0000-000000000000	b1949652-555a-4436-b3ed-66ef0243dcd3	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 14:46:04.935099+00	
00000000-0000-0000-0000-000000000000	e8d875f6-c4dd-47f6-bda0-0a8650866bfa	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:49:05.825804+00	
00000000-0000-0000-0000-000000000000	96bcebbc-c463-4d98-9d79-77f7b6007054	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:49:05.826764+00	
00000000-0000-0000-0000-000000000000	23c0a180-d5dc-4538-8d30-1900abf65a18	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:49:05.845047+00	
00000000-0000-0000-0000-000000000000	ca66e3ec-1087-4090-a2b8-bbec2cc4ec3c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:49:05.88906+00	
00000000-0000-0000-0000-000000000000	3e09a6a3-7db4-4c2e-b6c0-8a9854c83db6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:49:07.190476+00	
00000000-0000-0000-0000-000000000000	d9096f99-4c4d-4635-84d2-41efcfe22ad4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:49:08.120731+00	
00000000-0000-0000-0000-000000000000	2ab8fd78-df9c-4fe5-a2fc-5b16dd85e615	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:49:10.937224+00	
00000000-0000-0000-0000-000000000000	25ef009c-9e95-4552-9b9d-5c3756cd622f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:49:55.759893+00	
00000000-0000-0000-0000-000000000000	2ebfeadf-dae5-401d-8a81-9534e7d0c1fd	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:49:58.459946+00	
00000000-0000-0000-0000-000000000000	bed6faaa-ffe7-4bd6-95d0-a04d215e9b31	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:49:58.544279+00	
00000000-0000-0000-0000-000000000000	3bd4af90-3478-41bf-8d1f-1547cfe25657	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:50:02.171866+00	
00000000-0000-0000-0000-000000000000	d058e0d2-a602-43fc-9d97-9c7b97448b31	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:50:02.187145+00	
00000000-0000-0000-0000-000000000000	d8b46f2d-1c8b-4254-b38c-6f915ac0f144	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:50:04.271358+00	
00000000-0000-0000-0000-000000000000	eea18e72-1a85-4ecd-8fdd-18c79235d471	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:50:28.657079+00	
00000000-0000-0000-0000-000000000000	ada9b971-435d-44c6-b5b2-675544871a79	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:50:30.100865+00	
00000000-0000-0000-0000-000000000000	77fb143e-b5e5-418b-b279-007d9699f6ed	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:50:30.297727+00	
00000000-0000-0000-0000-000000000000	7c8a165c-b2fe-45fe-a4c3-34804b5a4a69	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-04-03 15:54:19.01774+00	
00000000-0000-0000-0000-000000000000	94208c9a-ac8f-411d-8327-8f0f8124a0d4	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-04-03 15:54:46.297831+00	
00000000-0000-0000-0000-000000000000	1663f3c3-82c1-4b07-8978-4f260d0ad9c6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 22:12:55.202982+00	
00000000-0000-0000-0000-000000000000	2575e33c-d759-4746-89d6-b61198906523	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-03 22:12:55.204037+00	
00000000-0000-0000-0000-000000000000	3d39e57e-4012-474c-ae18-a85593006f96	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-04 03:26:40.437596+00	
00000000-0000-0000-0000-000000000000	387c3b58-e0ba-4858-9373-eadac70043f3	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-04 03:26:40.438618+00	
00000000-0000-0000-0000-000000000000	a5177ca1-af61-46cb-a227-a475349f3c45	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-04 03:26:40.457061+00	
00000000-0000-0000-0000-000000000000	564bb753-9ff9-47f8-8f80-f89d822232a5	{"action":"token_refreshed","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 06:46:27.749579+00	
00000000-0000-0000-0000-000000000000	73ae2fd4-1dc8-4d6c-81e2-eeb299e78ded	{"action":"token_revoked","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 06:46:27.751276+00	
00000000-0000-0000-0000-000000000000	c455a5d9-9218-4b60-b0c9-552fdfd37275	{"action":"token_refreshed","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 06:46:27.7696+00	
00000000-0000-0000-0000-000000000000	be1fe9d6-21ad-4173-9228-6b51fb12a87c	{"action":"token_refreshed","actor_id":"2955c32a-54b5-4f52-a473-9e8fdbbde21d","actor_username":"rk.belton@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 06:46:30.842822+00	
00000000-0000-0000-0000-000000000000	6af6033c-366e-4629-84e3-1d2dd404b2eb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 00:32:21.978888+00	
00000000-0000-0000-0000-000000000000	8e8efb43-2fa5-47cc-8c31-10547dc467c4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 00:32:22.008848+00	
00000000-0000-0000-0000-000000000000	f6da096f-ec85-4807-982a-696c49d33799	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 00:32:24.397575+00	
00000000-0000-0000-0000-000000000000	48543dda-832c-4a05-9d77-b3d6ea630a6e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 03:01:47.910701+00	
00000000-0000-0000-0000-000000000000	befbda33-9b70-4e37-960a-c34ff89c265d	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 03:01:47.91175+00	
00000000-0000-0000-0000-000000000000	fb131065-283d-46fa-8add-f961b6a620b0	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 11:42:19.989505+00	
00000000-0000-0000-0000-000000000000	2b418b73-f82e-4e3a-b107-9ad4f21d9b23	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 11:42:19.990559+00	
00000000-0000-0000-0000-000000000000	0bdccc80-646a-4981-b21b-75fbbb5d16cd	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 11:42:20.022037+00	
00000000-0000-0000-0000-000000000000	cf22a558-dcbe-4c87-a438-87510e665fa4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 11:42:20.033026+00	
00000000-0000-0000-0000-000000000000	c895da36-07d5-4173-a993-9486073ca6fe	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 11:42:21.416251+00	
00000000-0000-0000-0000-000000000000	f4ca6673-5f9a-41d2-9690-545e65d33533	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 11:42:22.30057+00	
00000000-0000-0000-0000-000000000000	34e82142-3e72-4cfd-bee0-970e1f821599	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 11:42:26.143921+00	
00000000-0000-0000-0000-000000000000	53dcdbe0-b60c-4edb-a2a1-1791a825665f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 12:07:50.326093+00	
00000000-0000-0000-0000-000000000000	d58ce813-bcba-4a16-bf44-d58e14519e69	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 12:07:50.327085+00	
00000000-0000-0000-0000-000000000000	18d50a6f-2182-4b0f-b56a-c7f95446d2bb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 12:07:50.395613+00	
00000000-0000-0000-0000-000000000000	55be2b11-73af-4aa8-8daa-c7d2916d80b6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 12:07:50.504338+00	
00000000-0000-0000-0000-000000000000	379d550f-1ecd-4f2f-b15b-448f50a50df2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 12:07:55.018074+00	
00000000-0000-0000-0000-000000000000	97110dc6-d62e-42d5-aa8b-d06d909d24b1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 13:05:58.163477+00	
00000000-0000-0000-0000-000000000000	cf8192bc-2dff-4be5-9707-fd010901af6e	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 13:05:58.164656+00	
00000000-0000-0000-0000-000000000000	e2a003bf-281f-4a4f-a770-6e612e2c1d2b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 13:08:42.440756+00	
00000000-0000-0000-0000-000000000000	4247b32b-ab48-4a75-a32e-65f2d7d86acc	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 13:08:42.44177+00	
00000000-0000-0000-0000-000000000000	55c49e93-f0aa-4a86-b034-8273ef25dfbb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 13:08:42.46145+00	
00000000-0000-0000-0000-000000000000	53b26174-600b-47d1-af96-ff959a7e833f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 13:08:44.517468+00	
00000000-0000-0000-0000-000000000000	b8e78c08-11f3-4d7f-a691-93bf68eaa825	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 13:08:50.300977+00	
00000000-0000-0000-0000-000000000000	423c963c-d4a7-43db-ba15-86c16c75ca17	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 14:27:32.266712+00	
00000000-0000-0000-0000-000000000000	65ddee0b-e3aa-453a-94d9-56083fa4f7d1	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 14:27:32.268439+00	
00000000-0000-0000-0000-000000000000	10b12c19-ca85-4ca4-8d17-4599b287d625	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 14:29:44.362097+00	
00000000-0000-0000-0000-000000000000	4ab714de-919e-4306-8688-175baffa7b59	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 14:29:46.934763+00	
00000000-0000-0000-0000-000000000000	1b125805-f038-4da5-bf38-7ba93638d5e0	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 14:29:46.953967+00	
00000000-0000-0000-0000-000000000000	b2a1ef20-ac1c-4b0b-8236-ff321c8dae8d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 14:30:22.26324+00	
00000000-0000-0000-0000-000000000000	a8ff2f7b-aa63-4434-9c84-d42087d1770a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-05 14:30:24.780975+00	
00000000-0000-0000-0000-000000000000	9fb107c3-73ed-4eb8-ab13-e42a924feb30	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 12:31:16.263191+00	
00000000-0000-0000-0000-000000000000	403fc7f5-a6a3-4f25-8eea-4a91b16a5fdf	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 12:31:16.264284+00	
00000000-0000-0000-0000-000000000000	ffa072e7-60bb-459d-9017-f9ae182f6c17	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 12:33:41.825404+00	
00000000-0000-0000-0000-000000000000	bdd8cf75-36b5-4059-a5ce-969fcb2ec7ee	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 12:33:41.826572+00	
00000000-0000-0000-0000-000000000000	c4bd40c4-a46d-4288-9d11-19d6b49750ad	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 12:33:41.841561+00	
00000000-0000-0000-0000-000000000000	880ec591-58da-4e9a-9b78-25e238393a29	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 12:33:41.867493+00	
00000000-0000-0000-0000-000000000000	166b7bff-18d2-47af-bc77-2d9b79c858a9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 12:33:42.190425+00	
00000000-0000-0000-0000-000000000000	f21560ff-5250-42e3-8c83-af2f23b7d749	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 12:33:42.297579+00	
00000000-0000-0000-0000-000000000000	ae27fa2b-a0b4-4e0c-b9a9-040eadf3d521	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 12:33:43.220726+00	
00000000-0000-0000-0000-000000000000	970df6e5-756c-4644-b1d9-4646e3a86842	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 13:41:35.097967+00	
00000000-0000-0000-0000-000000000000	042260ba-3c1e-445e-bad5-12f32c9b367d	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 13:41:35.099994+00	
00000000-0000-0000-0000-000000000000	4b6f5842-4f81-4624-a20a-8de7ae5039a6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 13:41:36.014765+00	
00000000-0000-0000-0000-000000000000	7027d04a-fc4a-4cd0-bcc8-3207630f0147	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 13:41:36.015497+00	
00000000-0000-0000-0000-000000000000	98ebeab5-e27d-401b-bc20-8e9dbb6d9ff3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 13:41:36.063276+00	
00000000-0000-0000-0000-000000000000	463d083e-5fdc-4580-a6e2-8dbb9d3d0a6d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 13:41:37.424826+00	
00000000-0000-0000-0000-000000000000	5ca6fd43-c587-44aa-a128-aa7ccd2b60a9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 13:41:37.471109+00	
00000000-0000-0000-0000-000000000000	ff096201-4dac-4429-9ccc-d0d114cba5ac	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 13:41:37.4858+00	
00000000-0000-0000-0000-000000000000	65a4ca6d-eb4d-4588-8ffe-1f1639db754a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 13:41:37.549455+00	
00000000-0000-0000-0000-000000000000	aea34528-d41e-44af-936e-6209030cb8e3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 13:41:37.595039+00	
00000000-0000-0000-0000-000000000000	6aab0ea1-c0f1-4b8c-9539-a4aebc83f3d9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 13:41:38.429716+00	
00000000-0000-0000-0000-000000000000	b621bfb0-382a-4f1e-92ee-80eb3294126b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 13:42:01.467169+00	
00000000-0000-0000-0000-000000000000	0c1cc5bd-cc40-4798-82a7-9213f901dc6d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 13:42:03.219112+00	
00000000-0000-0000-0000-000000000000	1447d7c2-06c1-4eda-9551-ed764d59ca0e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 14:39:51.586263+00	
00000000-0000-0000-0000-000000000000	4a45ea3a-9103-4136-ac89-cccede94bc53	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 14:39:51.587197+00	
00000000-0000-0000-0000-000000000000	b69b5e77-1d6e-408d-a5a4-80d2241ccb1f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:05:23.707375+00	
00000000-0000-0000-0000-000000000000	5b605823-86d3-4ff4-9c31-d8edf82b14b5	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:05:23.70927+00	
00000000-0000-0000-0000-000000000000	c72a84f1-6829-49cd-a25b-16fac7423c4f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:05:24.0384+00	
00000000-0000-0000-0000-000000000000	9338689b-9891-4149-b176-ebaa164d517f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:05:24.070387+00	
00000000-0000-0000-0000-000000000000	3af21146-fdbf-4f88-9fad-97e265f763fb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:05:56.093116+00	
00000000-0000-0000-0000-000000000000	72bcd292-593d-40f2-91fd-dad6df030d0f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:05:56.106682+00	
00000000-0000-0000-0000-000000000000	2033983f-c7dd-4f10-bfc8-41573e3d1e1f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:06:01.607728+00	
00000000-0000-0000-0000-000000000000	c6782172-df14-42f2-8cb9-2fbbf272f6d6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:06:01.618119+00	
00000000-0000-0000-0000-000000000000	b8cfad89-f322-426d-baf4-a83594a60e28	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:06:17.972054+00	
00000000-0000-0000-0000-000000000000	31d912f0-1c50-4da9-9995-22a74d158433	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:06:17.981186+00	
00000000-0000-0000-0000-000000000000	d178d592-4caa-43ea-a6db-d78668752895	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:06:30.016149+00	
00000000-0000-0000-0000-000000000000	fe72be90-f3d8-4743-b891-4b181392ddd1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:06:30.040032+00	
00000000-0000-0000-0000-000000000000	d8353e8a-2361-4245-bfa9-bcbb28bbc926	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:06:36.974721+00	
00000000-0000-0000-0000-000000000000	ac379f45-c6df-4cf7-8bbe-40e44f437490	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:06:36.992083+00	
00000000-0000-0000-0000-000000000000	a16edb86-fbba-49c8-9e64-9ce384534201	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:06:41.004704+00	
00000000-0000-0000-0000-000000000000	30922f99-6f28-430c-bf6e-d2c81f8513ec	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:06:41.032212+00	
00000000-0000-0000-0000-000000000000	a68989fa-8442-449b-bff6-17c83bd78879	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-04 03:28:32.46517+00	
00000000-0000-0000-0000-000000000000	f5862eb6-08cc-43c5-b838-91ba29336056	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-04 03:28:32.468105+00	
00000000-0000-0000-0000-000000000000	6c9276d7-3e11-4c23-8d21-62a83f82e11b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:06:48.063881+00	
00000000-0000-0000-0000-000000000000	9e252817-31ee-4337-80e8-30a688945879	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:06:48.093809+00	
00000000-0000-0000-0000-000000000000	ec66f2a3-271d-48b5-88d2-d4de4fe7504b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:07:12.514097+00	
00000000-0000-0000-0000-000000000000	3a4427c6-6897-4a9d-8f4d-a156d7c6488a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:07:12.896526+00	
00000000-0000-0000-0000-000000000000	f480b95f-5ede-43b3-abc8-547ad9612a96	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:08:15.178984+00	
00000000-0000-0000-0000-000000000000	15caee88-a2e7-4808-a494-a1b79c3342d7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:08:15.208644+00	
00000000-0000-0000-0000-000000000000	bae4e29c-15ee-4e8e-a2e5-c63dc5d6b040	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:08:22.428132+00	
00000000-0000-0000-0000-000000000000	38666f0a-1588-4354-95a3-f455c0e6d657	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:08:22.437203+00	
00000000-0000-0000-0000-000000000000	e100bd2b-3fd2-4e48-91e1-2950909e9897	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:08:24.837052+00	
00000000-0000-0000-0000-000000000000	6bfb30bc-40ba-4c3b-b745-db8a7e171598	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:08:24.861096+00	
00000000-0000-0000-0000-000000000000	690d06a6-9516-4a7c-9fcb-6a08005f89b3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:08:27.321267+00	
00000000-0000-0000-0000-000000000000	4846aa89-8962-4584-bffc-9ebd9e01efa7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:08:27.347947+00	
00000000-0000-0000-0000-000000000000	64c056aa-4343-4b11-a1e4-1be48fce516b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:08:46.33304+00	
00000000-0000-0000-0000-000000000000	a0ae5e65-4d7f-46c1-8ba5-5a98ceaf03d5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:08:46.339479+00	
00000000-0000-0000-0000-000000000000	f6f48d2d-6aa1-4224-b3e5-0660f40d03dc	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:15.834749+00	
00000000-0000-0000-0000-000000000000	17e3e3da-3225-4644-b815-59867e7ec7dd	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:15.852442+00	
00000000-0000-0000-0000-000000000000	32d05019-9587-4cd1-a4b7-90ac32dc4281	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:24.779249+00	
00000000-0000-0000-0000-000000000000	584a3070-f466-42f9-be6f-09f6e653aec2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:24.789287+00	
00000000-0000-0000-0000-000000000000	56108ffc-5764-4c6c-9b15-c0dacef5bfb8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:38.86584+00	
00000000-0000-0000-0000-000000000000	355fb176-9754-4f8c-a25b-56501c66ff0d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:38.885201+00	
00000000-0000-0000-0000-000000000000	ca601a71-3627-4175-85e6-c07b658983f6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:43.325584+00	
00000000-0000-0000-0000-000000000000	27bc536d-5fee-4eef-b3e3-0e6d0e2d52a1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:43.3327+00	
00000000-0000-0000-0000-000000000000	b240ff6c-cb4a-4740-84b1-73f6f2b96451	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:46.838171+00	
00000000-0000-0000-0000-000000000000	3b74b761-27dc-4043-8a0d-f09642ca22e7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:46.859253+00	
00000000-0000-0000-0000-000000000000	215b93d6-8652-4024-bc3b-e5375de2f2b3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:51.409794+00	
00000000-0000-0000-0000-000000000000	20e4dbd3-d8ec-4115-8b2f-cb2e720d7a29	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:51.418458+00	
00000000-0000-0000-0000-000000000000	286698ab-0319-475e-90e1-d9870256e933	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:53.542404+00	
00000000-0000-0000-0000-000000000000	b2a1a604-4dc4-418b-aca0-5a07ace5b48f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:53.569846+00	
00000000-0000-0000-0000-000000000000	065d15e3-3ed6-446a-b587-cde0f71f7b6a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:58.35841+00	
00000000-0000-0000-0000-000000000000	609ebd7c-2574-4ea9-87e9-7ff5b50c5575	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:10:58.3815+00	
00000000-0000-0000-0000-000000000000	532e63d4-82e2-4c70-ba66-a23ed5a96823	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:11:03.634364+00	
00000000-0000-0000-0000-000000000000	777781ff-c74f-4cb8-9459-efe03a2802c9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:11:03.644404+00	
00000000-0000-0000-0000-000000000000	dddbafdb-4bd2-4c19-aef0-3390bd8599b7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:11:31.984675+00	
00000000-0000-0000-0000-000000000000	49ee1a87-eb74-477a-89e3-80d0ff9dd064	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:11:31.993651+00	
00000000-0000-0000-0000-000000000000	479abd64-81ed-4ab6-bea1-218e108ce699	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:11:39.108379+00	
00000000-0000-0000-0000-000000000000	53e5a10e-7ca1-432e-86ff-1ac7b3c67670	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:11:39.124314+00	
00000000-0000-0000-0000-000000000000	08b6a609-a0af-4f28-984f-ae681b29178c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:11:44.066146+00	
00000000-0000-0000-0000-000000000000	cb5fae49-05d0-4d20-b623-b857428c0303	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:11:44.075185+00	
00000000-0000-0000-0000-000000000000	4d6f5e25-c736-44b1-9371-e376f044e199	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:11:46.76474+00	
00000000-0000-0000-0000-000000000000	0b83b755-6755-4ee1-9f38-4ddd2f107ef2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:11:46.78587+00	
00000000-0000-0000-0000-000000000000	87bc1717-96d3-4848-8b17-37fe9314b29d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:23.856119+00	
00000000-0000-0000-0000-000000000000	1cc92400-4cfa-454c-9b10-b1cae75f01ca	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:30.569715+00	
00000000-0000-0000-0000-000000000000	085ed9fd-e044-4ced-a894-97e43a3944b0	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:30.58198+00	
00000000-0000-0000-0000-000000000000	b7ccfac1-be1f-4b65-9cec-a31d44cd7515	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:38.287301+00	
00000000-0000-0000-0000-000000000000	23d9b91e-b498-410d-9d06-7105c33df41f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:38.304511+00	
00000000-0000-0000-0000-000000000000	461e2ba8-6dc1-4be4-a35e-57114cf3e24f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:47.695967+00	
00000000-0000-0000-0000-000000000000	9e44b70d-1f37-40ce-9fb3-2d3c82ae4cc8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:47.72824+00	
00000000-0000-0000-0000-000000000000	5ae176d9-41de-4ccf-b692-4a0e038c0b60	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:58.402787+00	
00000000-0000-0000-0000-000000000000	28b6990b-7997-4f7e-8999-c539e4c7f3e6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:58.432166+00	
00000000-0000-0000-0000-000000000000	cec8cbab-d0ed-450d-b7e5-d1610d68660e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:13:01.298633+00	
00000000-0000-0000-0000-000000000000	1eb8796e-ad8a-42b2-8d3c-93ade6b76387	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:13:18.766595+00	
00000000-0000-0000-0000-000000000000	4114aab8-8065-4f2e-ad13-c59fae1ac94c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:13:23.029034+00	
00000000-0000-0000-0000-000000000000	ec04e789-4a50-4110-9782-a5d48c31175c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:13:23.065492+00	
00000000-0000-0000-0000-000000000000	c3fe45f5-08c1-4433-9507-434bf2607e98	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:13:26.974008+00	
00000000-0000-0000-0000-000000000000	7e25aa2e-fed0-45e1-8647-e8bf1f14f5a8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:13:26.982655+00	
00000000-0000-0000-0000-000000000000	f8780e9a-015d-4642-98ae-25d91d86210e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:13:43.055153+00	
00000000-0000-0000-0000-000000000000	7ebbdbb9-a1bb-4a55-bbe5-7e3a249bd1b6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:13:43.085846+00	
00000000-0000-0000-0000-000000000000	1b8e40b7-b197-48c5-a6b7-dba628c540e0	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:13:47.023923+00	
00000000-0000-0000-0000-000000000000	a598511c-42b8-4570-8633-a9a26f09d002	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:13:47.045636+00	
00000000-0000-0000-0000-000000000000	1d20c2e0-81e1-44b3-931b-8ca3986823f7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:13:50.73073+00	
00000000-0000-0000-0000-000000000000	d4a39405-fecf-4ac3-a1da-daddb13f07be	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:13:50.760362+00	
00000000-0000-0000-0000-000000000000	259cdcb5-1be7-47e7-94a3-25babe78eb25	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:01.036766+00	
00000000-0000-0000-0000-000000000000	fef551ec-4b44-494a-93ed-c00081a44327	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:01.428833+00	
00000000-0000-0000-0000-000000000000	907dfffb-0d55-42fd-bdb3-2bbdfbc362db	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:20.326748+00	
00000000-0000-0000-0000-000000000000	52088b4c-8c0f-4802-a3d3-ad32680b5fcc	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:20.34341+00	
00000000-0000-0000-0000-000000000000	9032f44a-8b00-4728-8911-10edd16ada0f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:30.613751+00	
00000000-0000-0000-0000-000000000000	7c0adc45-51cd-4329-8ec6-00f4c029c0bf	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:11:51.648936+00	
00000000-0000-0000-0000-000000000000	6ecae97e-1010-4038-8f94-a39b4dca96c9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:11:51.683308+00	
00000000-0000-0000-0000-000000000000	cc2216f6-2c41-489c-ac82-70cb3310111c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:11:54.918479+00	
00000000-0000-0000-0000-000000000000	2fceb2d7-5b41-4ac7-98af-692c8d025b5c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:11:54.954296+00	
00000000-0000-0000-0000-000000000000	c856565c-6166-4d02-b3e3-97b39af189f8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:02.585175+00	
00000000-0000-0000-0000-000000000000	56099af9-fd45-4699-9121-c82587d0a15f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:02.984637+00	
00000000-0000-0000-0000-000000000000	63ef17d8-0070-41bf-b79d-a459c09a983f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:06.203869+00	
00000000-0000-0000-0000-000000000000	c6445b97-9e58-404d-b336-e9ac079a870a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:06.234059+00	
00000000-0000-0000-0000-000000000000	4d28ca14-bf87-4d57-ac55-74e39b48ec40	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:08.755948+00	
00000000-0000-0000-0000-000000000000	0354e7ba-1e15-4e71-bcee-b2e024ab346c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:08.770523+00	
00000000-0000-0000-0000-000000000000	fdcc4ea7-395b-4286-92dd-6acdb084db5f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:16.900904+00	
00000000-0000-0000-0000-000000000000	b3af28c0-1923-48b1-a703-22643b3a1965	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:16.934144+00	
00000000-0000-0000-0000-000000000000	7ee74420-a58a-49aa-81e1-56a355d1a043	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:12:23.848301+00	
00000000-0000-0000-0000-000000000000	ef69af0b-7e24-455e-9e02-17d0c776ee04	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:13:01.324083+00	
00000000-0000-0000-0000-000000000000	6a19351c-ed88-4f6b-887b-396981381dd0	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:13:18.759096+00	
00000000-0000-0000-0000-000000000000	cd2e65e4-73f5-42a1-9761-cf75f13967eb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:09.218772+00	
00000000-0000-0000-0000-000000000000	eba2a9b2-5548-4671-88fe-a882fb737952	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:09.247069+00	
00000000-0000-0000-0000-000000000000	094d7ea0-29c6-4312-8a81-6c0a8155c16f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:11.824001+00	
00000000-0000-0000-0000-000000000000	5c0179a8-9f6c-4681-bccd-d186b828da4f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:11.834771+00	
00000000-0000-0000-0000-000000000000	2aaed79c-1089-405f-a814-f1f9f3e1b8ce	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:17.424015+00	
00000000-0000-0000-0000-000000000000	556ef23b-9694-483f-a4a9-1fe43ec1e85f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:17.435498+00	
00000000-0000-0000-0000-000000000000	74f3ed80-1b1a-40c4-b19e-0ca354443749	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:30.630194+00	
00000000-0000-0000-0000-000000000000	a7961e4f-c4a7-49c6-aceb-e2facc409881	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:38.429779+00	
00000000-0000-0000-0000-000000000000	f166ab89-900c-4a0d-9ce3-54d720a63d88	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:38.439471+00	
00000000-0000-0000-0000-000000000000	ec554729-7b01-47a0-bef6-2d1012f5c6f7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:40.071254+00	
00000000-0000-0000-0000-000000000000	f078d4be-350b-4fdf-a6a2-0ee483ae797f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:40.099508+00	
00000000-0000-0000-0000-000000000000	116fd9fb-2731-4cbf-b97e-d7f2b29671fc	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:44.461323+00	
00000000-0000-0000-0000-000000000000	065a0252-604b-48dd-a669-dffe69f64737	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:14:44.467446+00	
00000000-0000-0000-0000-000000000000	dbe0eff7-ff27-4ef3-965c-395efac586d8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:15:54.710448+00	
00000000-0000-0000-0000-000000000000	badc88e7-eed4-4ca4-ae9f-97c566e2f4b1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:15:55.082677+00	
00000000-0000-0000-0000-000000000000	2f2603c5-0892-4113-9d0f-c3d450b2d5a6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:16:05.386199+00	
00000000-0000-0000-0000-000000000000	d85ef394-85a5-497f-88d5-e4caa7291aae	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:16:05.39874+00	
00000000-0000-0000-0000-000000000000	93a4d51c-7f85-49a2-83f6-5783e77fe82b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:16:17.866558+00	
00000000-0000-0000-0000-000000000000	de52ac9b-e033-47a0-a18a-bee818f37a17	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:16:17.877506+00	
00000000-0000-0000-0000-000000000000	f11dc2d2-1bcc-4630-bdeb-ae9f83dba6b6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:16:28.614633+00	
00000000-0000-0000-0000-000000000000	3f847a32-5097-47cb-a386-c9b1a8dd36d1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:16:28.623596+00	
00000000-0000-0000-0000-000000000000	050f5f99-f738-48fe-a10a-f6044e57c777	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:17:51.88441+00	
00000000-0000-0000-0000-000000000000	ccc2123a-7c29-4ece-8b65-0a7ac574ec44	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:17:52.253544+00	
00000000-0000-0000-0000-000000000000	cb99e0c7-a361-45da-90ec-07a7f55f6f1e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:18:03.455702+00	
00000000-0000-0000-0000-000000000000	231f2226-a257-4f95-8420-4ca158aa8c6d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:18:03.469498+00	
00000000-0000-0000-0000-000000000000	d1a412a6-bb38-4e23-9b16-b54acc3e3032	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:18:08.803797+00	
00000000-0000-0000-0000-000000000000	7de879a7-a2b8-4e2d-ba19-2772f5743a4f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:18:08.836712+00	
00000000-0000-0000-0000-000000000000	9e51af76-c89e-4a31-8593-a6496d505e3b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:18:26.546853+00	
00000000-0000-0000-0000-000000000000	e2ffbe1b-949e-4287-a5d2-df713a390984	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:18:26.559773+00	
00000000-0000-0000-0000-000000000000	74e69e71-5e21-4101-afd8-c5969b377c5e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:18:38.594927+00	
00000000-0000-0000-0000-000000000000	233eb8e3-287b-4b3e-99f0-e77506da0c72	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:18:38.614461+00	
00000000-0000-0000-0000-000000000000	afd893b4-ba02-4483-be5b-7c563a5fbda9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:23:02.488266+00	
00000000-0000-0000-0000-000000000000	2c5ac3cf-1220-4abd-8ae7-a201e51ac400	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:23:02.500183+00	
00000000-0000-0000-0000-000000000000	20a1b674-2e94-47d4-a088-a129f961630d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 22:23:02.794759+00	
00000000-0000-0000-0000-000000000000	ca87efc5-ef42-45a3-bbb5-fb758601727e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 23:21:04.254022+00	
00000000-0000-0000-0000-000000000000	c299ad71-2056-4cbe-8444-65b14fcdf334	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-06 23:21:04.255099+00	
00000000-0000-0000-0000-000000000000	c455eb74-d8c2-45a9-a226-87fe1ec85971	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 00:19:05.242344+00	
00000000-0000-0000-0000-000000000000	14bf4b3e-43e7-472e-95fe-8d2ec50ceecc	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 00:19:05.244108+00	
00000000-0000-0000-0000-000000000000	298332c4-5b55-4dc1-bf46-a1825c241ca6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 01:17:09.870891+00	
00000000-0000-0000-0000-000000000000	464225b0-f34f-413f-a6bd-eea4c4373e6e	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 01:17:09.872608+00	
00000000-0000-0000-0000-000000000000	cc814d3f-82a5-4d5e-9a92-dfb12e01a2ae	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 02:09:26.677001+00	
00000000-0000-0000-0000-000000000000	01f84d54-88fb-430c-a6e8-dd89b30a8b1c	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 02:09:26.678011+00	
00000000-0000-0000-0000-000000000000	358bf6e9-61aa-4285-8575-d5f2a17e92ec	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 02:09:26.694555+00	
00000000-0000-0000-0000-000000000000	0b66e26a-cb96-4b97-be52-0ae6e5f75e1b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 02:09:29.535618+00	
00000000-0000-0000-0000-000000000000	f0bf8851-8806-46e7-8773-e74deda3e950	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 03:07:50.324699+00	
00000000-0000-0000-0000-000000000000	adc372cc-a12a-4360-a95f-2cdcbacc3253	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 03:07:50.32574+00	
00000000-0000-0000-0000-000000000000	d1a3243b-b7c3-44aa-bb91-d4de3de8ae6e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 03:25:00.710746+00	
00000000-0000-0000-0000-000000000000	bebc7a4a-c1a0-4c7c-a1e2-d9f7b876a343	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 03:25:00.711824+00	
00000000-0000-0000-0000-000000000000	d87960f7-f938-475a-9f61-3f70728c20aa	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 03:25:00.787157+00	
00000000-0000-0000-0000-000000000000	54bfa337-a16e-47d4-99df-a15ae26de8a3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 03:25:00.802623+00	
00000000-0000-0000-0000-000000000000	77fa14c0-7c1d-4245-81df-f0aaafcd4d3a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:05:58.496393+00	
00000000-0000-0000-0000-000000000000	24c40e3e-8956-4d61-b722-5b33d460274b	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:05:58.497485+00	
00000000-0000-0000-0000-000000000000	163f3616-6cc8-4cc0-a942-0d8334d3c7ac	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:16:57.578527+00	
00000000-0000-0000-0000-000000000000	2f744274-7b0d-4862-9353-a1a01ff86534	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:16:57.684829+00	
00000000-0000-0000-0000-000000000000	742ad44a-2b05-4c56-a8c3-110ed688061f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:16:58.951508+00	
00000000-0000-0000-0000-000000000000	d755bc3e-788f-485b-b521-3f252010afed	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:16:58.968425+00	
00000000-0000-0000-0000-000000000000	28be2385-d769-4f09-b1a5-6dc4a157b2a2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:19:48.752973+00	
00000000-0000-0000-0000-000000000000	965965ee-1f80-4716-99b4-1539a3c29a49	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:19:48.870442+00	
00000000-0000-0000-0000-000000000000	498fe7fe-8215-4c56-b773-c92039c10cad	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:36:00.82894+00	
00000000-0000-0000-0000-000000000000	d5d80301-bcfd-4b33-839f-63ec1e802047	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:36:00.848387+00	
00000000-0000-0000-0000-000000000000	afc77d7c-cc6f-4cbb-a213-bc16b0cec85e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:36:45.494869+00	
00000000-0000-0000-0000-000000000000	777d7855-76ef-4628-98b5-c7bc2308f088	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:36:45.520856+00	
00000000-0000-0000-0000-000000000000	58d7bf09-2340-488f-ad8a-a2760ed8a53b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:36:55.602413+00	
00000000-0000-0000-0000-000000000000	ed77ac7c-76ff-43ea-a004-cda4a6dae5ce	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:36:55.611825+00	
00000000-0000-0000-0000-000000000000	2b752568-068d-48b4-a0dd-03267abd3aec	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:40:08.38859+00	
00000000-0000-0000-0000-000000000000	a1a09925-444f-4a79-bf3a-53c9d24ecf7b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:40:08.506071+00	
00000000-0000-0000-0000-000000000000	ef261686-6f3d-4cbf-8bec-541007e7b77d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:40:59.351804+00	
00000000-0000-0000-0000-000000000000	f649614a-2202-43c1-bafe-a475a2f0c51f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:40:59.366948+00	
00000000-0000-0000-0000-000000000000	561663b3-5e9d-4cbc-adfb-fc7e3d462787	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:43:52.777822+00	
00000000-0000-0000-0000-000000000000	769155e6-6aa0-47f7-a5c0-81dc06b34c72	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:43:52.787776+00	
00000000-0000-0000-0000-000000000000	20d17d50-01d5-4c6e-bd59-46f6d625a5ae	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:44:10.647278+00	
00000000-0000-0000-0000-000000000000	ddfc8da0-1da1-4baa-9ccc-9a437793862b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:44:10.678689+00	
00000000-0000-0000-0000-000000000000	c19aa103-8d98-4c83-b328-063c6db9bf18	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:45:16.892554+00	
00000000-0000-0000-0000-000000000000	8a95218b-8932-4c40-9ef2-f199bcfde495	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:45:16.903887+00	
00000000-0000-0000-0000-000000000000	0d7440f9-84c4-4cd5-b2b8-591b80a54ba3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:45:25.228984+00	
00000000-0000-0000-0000-000000000000	1cb4ed99-1635-4aad-9ab7-227f459bb87f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:45:25.262975+00	
00000000-0000-0000-0000-000000000000	e61cbe69-a42c-411b-89c5-08a7794c987c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:45:42.671565+00	
00000000-0000-0000-0000-000000000000	088a1f55-419c-4a94-8ac9-9cf151c80e59	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:45:43.043156+00	
00000000-0000-0000-0000-000000000000	b44eeefb-069f-4e36-a14d-705111f9dd45	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:45:45.193426+00	
00000000-0000-0000-0000-000000000000	b3b9df2a-9450-4722-be92-62bcf9c21d61	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:45:45.237745+00	
00000000-0000-0000-0000-000000000000	72de0352-4448-4f20-ba08-2a16f18db58e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:45:55.723811+00	
00000000-0000-0000-0000-000000000000	1d6e1d41-c3fa-4846-a70a-e4e2e8901cd6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:45:55.730681+00	
00000000-0000-0000-0000-000000000000	07295930-5f6f-417c-b184-ca5cbd3a825b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:47:37.611943+00	
00000000-0000-0000-0000-000000000000	0ae44c5a-7e84-4cea-b633-c37f799fa58a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:47:37.9866+00	
00000000-0000-0000-0000-000000000000	d878a05b-3db2-4b12-9a57-3588c0b8df36	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:49:43.897766+00	
00000000-0000-0000-0000-000000000000	d8f49d5b-296a-4ea3-a8b0-ae20efb58350	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:49:44.023163+00	
00000000-0000-0000-0000-000000000000	e016d48d-7de2-4733-aa38-b26080ea7878	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:56:12.8207+00	
00000000-0000-0000-0000-000000000000	c72b9596-bbdb-48ce-ac9f-9174c78b0036	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:56:12.840119+00	
00000000-0000-0000-0000-000000000000	678f5e18-72a6-408d-965e-7f3fef43773a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:56:58.167919+00	
00000000-0000-0000-0000-000000000000	7abb6ff5-27d9-4a28-8614-e382ed4199ca	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:56:58.200294+00	
00000000-0000-0000-0000-000000000000	74f47b70-dc6c-476c-9c71-80740ea9450b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:57:23.154217+00	
00000000-0000-0000-0000-000000000000	9115fbaf-78c2-41c5-a58f-7836e39bf090	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:57:23.163+00	
00000000-0000-0000-0000-000000000000	57f4487e-a1aa-4951-b102-a927c52166b9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:58:22.809545+00	
00000000-0000-0000-0000-000000000000	948f9039-cedf-4908-a4d1-97a40ff40b91	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 04:58:22.928597+00	
00000000-0000-0000-0000-000000000000	ef4a6f18-1217-469c-a8ad-f81a36e734dd	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:01:18.110677+00	
00000000-0000-0000-0000-000000000000	2f301ff4-fee0-4425-aa5f-5892bba39212	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:01:18.128128+00	
00000000-0000-0000-0000-000000000000	c7cbc9d8-c2ab-4ff1-99f1-f406477f2d74	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:01:39.907488+00	
00000000-0000-0000-0000-000000000000	29c1578c-451a-420f-a877-60d93a54df24	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:01:39.932257+00	
00000000-0000-0000-0000-000000000000	116566c8-2ca8-4d6b-ba80-e0214046d9b9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:02:16.047282+00	
00000000-0000-0000-0000-000000000000	e559569b-78e7-45c8-8920-17a6173ed2df	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:02:16.08202+00	
00000000-0000-0000-0000-000000000000	03ba20cf-266b-404b-b09a-86ef95bd22fb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:02:36.7852+00	
00000000-0000-0000-0000-000000000000	3aa4a632-5ca8-405d-9fa6-e986db110987	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:02:36.799929+00	
00000000-0000-0000-0000-000000000000	45409ff4-7db1-4795-be99-48ef2425ced2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:04:47.417577+00	
00000000-0000-0000-0000-000000000000	e46e7b3c-55a4-403b-b930-33fd43f2e7f0	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:04:47.528833+00	
00000000-0000-0000-0000-000000000000	5a0d30ce-d0ee-4b6a-bffc-596a58f55fe4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:05:06.441814+00	
00000000-0000-0000-0000-000000000000	ed78ba39-3253-49d9-b354-fb7077de3d7d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:05:06.458934+00	
00000000-0000-0000-0000-000000000000	63edaef3-67d2-4d4e-8f40-aa89070fac21	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:05:22.357701+00	
00000000-0000-0000-0000-000000000000	f6bdeb6e-3c5c-4195-a468-1a5b8f610daf	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:05:22.379363+00	
00000000-0000-0000-0000-000000000000	ccb45985-a97c-464b-a3c2-9c049eb4aee1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:05:33.438155+00	
00000000-0000-0000-0000-000000000000	efb89175-0c5d-4650-a5c5-89e14e044b9c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:05:33.445208+00	
00000000-0000-0000-0000-000000000000	1cdcc17d-259f-41eb-aaf2-da79e5481e38	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:06:19.771279+00	
00000000-0000-0000-0000-000000000000	e1285ad5-089e-4f36-b594-504772675f95	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:06:19.78995+00	
00000000-0000-0000-0000-000000000000	72fae980-c590-44d9-911c-b716ccf98b06	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:07:01.050341+00	
00000000-0000-0000-0000-000000000000	2b2a7ee8-2a2f-43ee-9d0d-d6ea50af8d70	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:07:01.073773+00	
00000000-0000-0000-0000-000000000000	95984eca-17ff-48a0-ba70-f0e53ff27a6f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:07:09.569652+00	
00000000-0000-0000-0000-000000000000	17a99477-a757-40bb-9a27-6273a39076e7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:07:09.580056+00	
00000000-0000-0000-0000-000000000000	acab7388-147d-40fc-8abc-913d079bbdd5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:11:43.117756+00	
00000000-0000-0000-0000-000000000000	3c64df06-cef6-407f-9444-3a772c244ba5	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:11:43.11886+00	
00000000-0000-0000-0000-000000000000	fc5d7bd9-c702-4de1-b605-a4bc9207da3b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 05:11:43.15124+00	
00000000-0000-0000-0000-000000000000	f6089642-bdc9-4fb9-ad22-09d36939f9d3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 07:16:13.107367+00	
00000000-0000-0000-0000-000000000000	05941765-b785-4fdb-9b74-46e4848c4c92	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 07:16:13.119066+00	
00000000-0000-0000-0000-000000000000	d7a814db-d3d0-4c17-a335-b265f5e18caf	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 13:07:16.173982+00	
00000000-0000-0000-0000-000000000000	9006c2e7-3aee-4648-9383-658ffab241e6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-07 13:07:16.22019+00	
00000000-0000-0000-0000-000000000000	6d9f2fbc-1a8d-4b99-8552-dafa99a0980e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-08 22:16:19.11089+00	
00000000-0000-0000-0000-000000000000	3d4a9e99-d126-4e7e-b669-ce268a78a8fa	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-08 22:16:19.146163+00	
00000000-0000-0000-0000-000000000000	479b9cd5-fac8-47ec-a297-a23dc4a241d9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-09 03:32:36.896563+00	
00000000-0000-0000-0000-000000000000	3d418aa9-d7c3-43cb-b112-4529a960cf30	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-09 03:32:36.925573+00	
00000000-0000-0000-0000-000000000000	6ea092cd-af1a-41c1-ba76-724aa369d4f4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-11 04:41:19.095942+00	
00000000-0000-0000-0000-000000000000	fba52334-18ba-48b8-842d-df66e15bfb8d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-11 04:41:19.116482+00	
00000000-0000-0000-0000-000000000000	31f34b1d-fc86-467c-97e9-a341ac66c1a5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-12 09:02:14.912063+00	
00000000-0000-0000-0000-000000000000	10674877-4e75-499c-aad5-46ffb5585c3a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-12 09:03:16.878981+00	
00000000-0000-0000-0000-000000000000	54ab9ff7-c26c-4622-9f74-1c14ea31a784	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-04-12 09:03:16.904606+00	
00000000-0000-0000-0000-000000000000	feec5944-d3d6-4054-9fcd-918c24d55ad1	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-04-12 09:03:40.894334+00	
00000000-0000-0000-0000-000000000000	7a2fc957-7933-4600-859c-c4359e88050d	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-04-12 09:08:23.709277+00	
00000000-0000-0000-0000-000000000000	83ee5d0c-aa2e-4775-899e-1e47b30f57db	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-04-12 09:08:58.383334+00	
00000000-0000-0000-0000-000000000000	5af2e2d1-85a4-481d-a523-8385e1142fb6	{"action":"logout","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-04-12 09:10:54.374628+00	
00000000-0000-0000-0000-000000000000	c060bb12-d6a7-4158-8ccb-976493c41b41	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-04-24 02:11:51.086477+00	
00000000-0000-0000-0000-000000000000	d218de7b-32bc-445f-b986-ad798b5cad97	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-04-24 02:13:07.012567+00	
00000000-0000-0000-0000-000000000000	147d0705-737d-4c22-9e67-7228bf07c194	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-04-24 02:15:10.124415+00	
00000000-0000-0000-0000-000000000000	4950ce9a-1dc0-4bef-b740-811a71e8952e	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-04-24 02:15:49.901538+00	
00000000-0000-0000-0000-000000000000	74691748-7038-4b54-8db9-d89480e2f1c0	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 04:59:18.655592+00	
00000000-0000-0000-0000-000000000000	ad23fd14-c322-4a85-b4f4-fa7c57b49a21	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 04:59:18.658313+00	
00000000-0000-0000-0000-000000000000	2843e1b9-6ba9-4abf-a614-d422b19e8e88	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 04:59:18.678507+00	
00000000-0000-0000-0000-000000000000	4e801963-6115-45be-a76d-88cbb263703a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 04:59:19.009477+00	
00000000-0000-0000-0000-000000000000	048e2391-892c-43a5-a350-dee5647144c8	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 04:59:19.010783+00	
00000000-0000-0000-0000-000000000000	dfa9435e-51ff-49db-aba3-b4a2f650bfd3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 04:59:19.128883+00	
00000000-0000-0000-0000-000000000000	9b4c2a34-0b17-4c61-ba06-23a91bfaa4f4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:48.456521+00	
00000000-0000-0000-0000-000000000000	b726f74a-edc7-4161-8466-b3784261342c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:48.47944+00	
00000000-0000-0000-0000-000000000000	8219c6ab-579e-4b2c-9b69-f0bea3128607	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:50.117962+00	
00000000-0000-0000-0000-000000000000	16c07937-4bb0-4933-a0ea-a4bc78223249	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:50.130563+00	
00000000-0000-0000-0000-000000000000	bb7f7c7c-580c-447d-b09e-4392ba1d2901	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:51.14449+00	
00000000-0000-0000-0000-000000000000	63a0c24d-0276-4d8a-a7ba-986aed5feb4e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:51.175455+00	
00000000-0000-0000-0000-000000000000	5b8d28a3-5373-49e8-95c3-f36d3a8b51cb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:52.189546+00	
00000000-0000-0000-0000-000000000000	155fc609-89cf-4f52-a224-75df270fe866	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:52.202261+00	
00000000-0000-0000-0000-000000000000	35d44192-1eb9-4bae-a219-8afca525803e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:53.27399+00	
00000000-0000-0000-0000-000000000000	ea029f6f-1994-4d69-b343-e407cf1b06a4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:53.299095+00	
00000000-0000-0000-0000-000000000000	d37d0c21-13e0-4023-8abc-7fc2ca912dcb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:54.366919+00	
00000000-0000-0000-0000-000000000000	c691a413-1b91-478f-a02d-e5affcad1986	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:54.385075+00	
00000000-0000-0000-0000-000000000000	f8aa3145-07fa-4c48-80e6-cd70489d4c51	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:55.45268+00	
00000000-0000-0000-0000-000000000000	827db362-3daa-41f1-97fc-97833d4211ab	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:55.467432+00	
00000000-0000-0000-0000-000000000000	08812515-9602-4b0d-a73b-e5c43c686b06	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:56.509163+00	
00000000-0000-0000-0000-000000000000	5c13679c-b14f-4d33-947d-7d29ca0d14cd	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:56.529777+00	
00000000-0000-0000-0000-000000000000	0df25d82-5e2f-406e-890f-984742e40f50	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:57.586465+00	
00000000-0000-0000-0000-000000000000	34cfb165-6e4a-4c16-b4af-c02e74c67be3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:57.59484+00	
00000000-0000-0000-0000-000000000000	39351c6c-658c-4fc0-a3eb-ed68a7fc19bd	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:58.657063+00	
00000000-0000-0000-0000-000000000000	d689325c-fe31-4af4-9f2a-d7c2a4606e7a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:58.666713+00	
00000000-0000-0000-0000-000000000000	f6e3fcb0-4f85-4a6c-8ede-fe54045b098a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:59.719617+00	
00000000-0000-0000-0000-000000000000	f0397577-b3a9-4d65-bf3c-2bf5fe1ef9d6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:00:59.727583+00	
00000000-0000-0000-0000-000000000000	90a6e10f-fb1e-407a-8c52-0c145be685eb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:00.809674+00	
00000000-0000-0000-0000-000000000000	898d64aa-0222-47a5-9319-4684e24e5dea	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:00.816361+00	
00000000-0000-0000-0000-000000000000	73199e11-7f70-4ec9-907a-d4fe33913d0d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:01.860052+00	
00000000-0000-0000-0000-000000000000	76cad2f6-8c3a-4054-a0ae-7feadf55abe1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:01.869456+00	
00000000-0000-0000-0000-000000000000	7f424da5-33a0-44b3-bcc5-8e10667fb4bf	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:02.927382+00	
00000000-0000-0000-0000-000000000000	4f3b3579-1b92-496a-97b1-2f8405bccf8a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:03.346393+00	
00000000-0000-0000-0000-000000000000	592eeebf-c5d2-4c8d-8cfc-999ae21deec7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:03.983032+00	
00000000-0000-0000-0000-000000000000	ba3e8a48-f98e-4340-8c3b-4a246b8d1ea9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:04.003142+00	
00000000-0000-0000-0000-000000000000	5ffe0121-c7e0-4b63-afcf-6217e244967b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:05.033172+00	
00000000-0000-0000-0000-000000000000	a1834fd8-10f3-4bd8-9a1f-a4492ce4cffb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:05.055874+00	
00000000-0000-0000-0000-000000000000	28f7787f-ee8c-4041-aa7f-15327677c73b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:06.129904+00	
00000000-0000-0000-0000-000000000000	a39d226d-7c45-4594-b44b-e952ce5bafe3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:06.167482+00	
00000000-0000-0000-0000-000000000000	7f03c047-b4d6-4ee0-9534-ac68fff6ab87	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:07.189027+00	
00000000-0000-0000-0000-000000000000	bed17a8f-1936-4580-bd99-969c7f5303f4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:07.219268+00	
00000000-0000-0000-0000-000000000000	288f27a0-cbca-4070-83d3-2976b7c7e271	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:08.250485+00	
00000000-0000-0000-0000-000000000000	a42904f3-ec3c-45a2-950c-5eee8b5425b7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:08.276073+00	
00000000-0000-0000-0000-000000000000	1191caf1-e1e0-429a-90bf-fd2f3d1476d1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:09.338419+00	
00000000-0000-0000-0000-000000000000	509274a1-c7a1-4bf1-b12f-5cfe7430bea5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:09.349601+00	
00000000-0000-0000-0000-000000000000	2fdb5e41-3f06-4861-a93d-0e48c1f72840	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:20.252002+00	
00000000-0000-0000-0000-000000000000	79130ccd-627c-4842-86f9-bd6d2200e5ee	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:23.123958+00	
00000000-0000-0000-0000-000000000000	5fd7c043-09c8-466c-9dcd-d1ced20dabe2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:23.340074+00	
00000000-0000-0000-0000-000000000000	06265543-aafd-4709-93d1-283b8850563a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:01:23.355329+00	
00000000-0000-0000-0000-000000000000	64c59301-1141-4b59-82d0-ce554280b710	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:02:11.901817+00	
00000000-0000-0000-0000-000000000000	fd89898d-1411-4da3-8eff-95caf743942c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:02:11.918971+00	
00000000-0000-0000-0000-000000000000	52236978-3407-4023-b30c-571070d214e5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:03:09.901348+00	
00000000-0000-0000-0000-000000000000	ed0ae209-edb5-4ceb-af97-b00ab22fa0b8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:03:10.015814+00	
00000000-0000-0000-0000-000000000000	fcd344f3-4ac3-4bb1-b5dd-9994993818fa	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:03:58.903465+00	
00000000-0000-0000-0000-000000000000	6d9357c3-6663-4d23-88c7-4a314a5c0062	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:03:58.917646+00	
00000000-0000-0000-0000-000000000000	38cffd3b-b50e-4942-a289-8fc17a7c205f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:04:12.299601+00	
00000000-0000-0000-0000-000000000000	3fa0e197-a3a2-46bf-b8a2-bf6da4ff4289	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:04:12.311592+00	
00000000-0000-0000-0000-000000000000	d3267dc4-8bfe-49ea-b00c-d32d1e91fb47	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:04:33.728816+00	
00000000-0000-0000-0000-000000000000	68f0cecd-e77e-435d-b5d3-e03550348fa5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:04:33.738184+00	
00000000-0000-0000-0000-000000000000	e99735ce-e176-4770-8efa-409b2f85b695	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:05:03.078819+00	
00000000-0000-0000-0000-000000000000	36933df1-35f7-4b66-aedd-9e45d834d24c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:05:03.483133+00	
00000000-0000-0000-0000-000000000000	e0b24f58-be16-4181-a8f9-001c2a7c0769	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:35:05.389612+00	
00000000-0000-0000-0000-000000000000	74ad8476-26ab-4e1d-af7b-5c4e51fd1b2a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:35:05.404327+00	
00000000-0000-0000-0000-000000000000	20b6a917-6dd5-4a66-bf9b-55b8559f15d0	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:39:05.487652+00	
00000000-0000-0000-0000-000000000000	db41ebcc-ce82-4672-a2dc-94667f9ad3e9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:39:05.5878+00	
00000000-0000-0000-0000-000000000000	fc4c4ed2-d41a-4d36-96c7-36226cb66196	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:41:52.945558+00	
00000000-0000-0000-0000-000000000000	618824ab-b7af-4441-8efd-ee3178eb0d3d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:41:52.970583+00	
00000000-0000-0000-0000-000000000000	bfbd6062-781e-4590-ab70-40a901a9d6de	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:42:39.746121+00	
00000000-0000-0000-0000-000000000000	d7e3d029-d944-4c62-a34b-563d09499dc3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:42:39.755035+00	
00000000-0000-0000-0000-000000000000	fd7244a1-e2e9-45c1-85b2-226753727ffb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:43:22.394398+00	
00000000-0000-0000-0000-000000000000	cb8a8dde-5aca-4a4b-a679-369dfd7a0689	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:43:22.406541+00	
00000000-0000-0000-0000-000000000000	31aa0d87-b920-4717-b6d6-3cb93a47d634	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:44:04.242317+00	
00000000-0000-0000-0000-000000000000	76475775-e374-4bb5-a39e-5054d5fadbb2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:44:04.260746+00	
00000000-0000-0000-0000-000000000000	2a70d7fa-66ae-43c5-bb3f-9edae95b2572	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:48:31.657268+00	
00000000-0000-0000-0000-000000000000	031c0cc9-d319-4267-8de1-89e2110528e6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:48:31.767922+00	
00000000-0000-0000-0000-000000000000	4a59bc7e-1446-435d-b612-a2075748cdca	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:50:16.417118+00	
00000000-0000-0000-0000-000000000000	7910f79f-92f0-4135-ae7e-4a544cc3c0bc	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:50:16.801908+00	
00000000-0000-0000-0000-000000000000	fbbc4649-0b6f-46ea-a92c-45d5e76839a4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:50:46.056328+00	
00000000-0000-0000-0000-000000000000	1dccb468-4824-4f1e-9ac0-1526e8cb66c5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:50:46.070165+00	
00000000-0000-0000-0000-000000000000	53dfd4b4-8445-4255-9baf-497826420397	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:50:56.125106+00	
00000000-0000-0000-0000-000000000000	f833c382-5553-48c7-86e3-6e5ca73602ee	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:50:56.138672+00	
00000000-0000-0000-0000-000000000000	c571a0e9-077b-4be2-8a8d-ce1f39f41423	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:52:32.74946+00	
00000000-0000-0000-0000-000000000000	cc9ed112-9721-4e7e-9f3c-54ad1c59cc48	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:52:32.780022+00	
00000000-0000-0000-0000-000000000000	892ff1e7-3ec3-431d-9912-4657a34de0a4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:52:51.447834+00	
00000000-0000-0000-0000-000000000000	7218e227-66f8-4548-9b3b-66bf41597b66	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:52:51.46706+00	
00000000-0000-0000-0000-000000000000	4bac3e47-7986-4e5e-a997-fb988ae62c97	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:53:35.481568+00	
00000000-0000-0000-0000-000000000000	4b14056e-3349-40ae-b5ef-9d4e106e9d33	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:53:35.51138+00	
00000000-0000-0000-0000-000000000000	7a0f95ec-cce0-49e2-8541-8b5c6422b76d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:53:45.224976+00	
00000000-0000-0000-0000-000000000000	6d50b430-71c9-432d-b7b2-9ee7a6a7696e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:53:45.250862+00	
00000000-0000-0000-0000-000000000000	a0e84192-a964-4be3-903a-ea3b112bdbd2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:53:51.870158+00	
00000000-0000-0000-0000-000000000000	b887564c-93ad-4c61-8a34-c836dd313bae	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:53:51.895782+00	
00000000-0000-0000-0000-000000000000	1fe802f1-6a50-4d89-a4ed-14f61b78a15d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:56:02.929731+00	
00000000-0000-0000-0000-000000000000	98791c54-9d92-4c5b-99aa-515a5dfd76f5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 05:56:02.949447+00	
00000000-0000-0000-0000-000000000000	aa2abef3-b78b-4c76-b508-177eb152eccf	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 06:07:20.200064+00	
00000000-0000-0000-0000-000000000000	52bfb953-b591-44f8-adfb-97c7688ff3d9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 06:07:20.21553+00	
00000000-0000-0000-0000-000000000000	c5b9d7b8-a03a-461e-9004-89307357c73d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 06:07:28.274596+00	
00000000-0000-0000-0000-000000000000	bf02d25f-1bbe-4dd1-8f1d-39beb2a7553e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 06:07:28.294491+00	
00000000-0000-0000-0000-000000000000	bd0486fc-5c92-40e0-b3ae-64eccffb1387	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 06:19:55.698421+00	
00000000-0000-0000-0000-000000000000	217aa491-0ec7-4f88-9e9e-a78f32e91396	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 06:19:55.715304+00	
00000000-0000-0000-0000-000000000000	d7b8b091-93bb-407a-a9f9-f5248d64375a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 06:19:55.837676+00	
00000000-0000-0000-0000-000000000000	639722b7-24cf-427d-b66e-2591521fe68f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 06:19:55.924556+00	
00000000-0000-0000-0000-000000000000	035c18ac-9b64-40d7-877e-06b915573828	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 06:20:34.291337+00	
00000000-0000-0000-0000-000000000000	eade439d-c368-4d03-a342-ee40592fda6b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-04-24 06:20:34.299952+00	
00000000-0000-0000-0000-000000000000	0dbc8834-a273-4bb5-a99d-ab8cc0b9e0bd	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-05-12 10:43:57.697362+00	
00000000-0000-0000-0000-000000000000	58e11cb9-ce36-495e-8e0c-51480b5ea755	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-05-12 10:44:43.041628+00	
00000000-0000-0000-0000-000000000000	7f118664-7547-46bf-acd6-95c0a1a8d107	{"action":"user_signedup","actor_id":"8e552a4c-da01-402d-afca-ef07a989b933","actor_username":"thecobra@ironcobra.net","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-05-12 10:46:53.756262+00	
00000000-0000-0000-0000-000000000000	b506d27e-47e8-4a30-a3d3-656628a90e4d	{"action":"login","actor_id":"8e552a4c-da01-402d-afca-ef07a989b933","actor_username":"thecobra@ironcobra.net","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-12 10:46:53.762029+00	
00000000-0000-0000-0000-000000000000	7951decb-dddf-435c-9c63-26e3d64060f8	{"action":"user_recovery_requested","actor_id":"8e552a4c-da01-402d-afca-ef07a989b933","actor_username":"thecobra@ironcobra.net","actor_via_sso":false,"log_type":"user"}	2025-05-12 10:46:53.776295+00	
00000000-0000-0000-0000-000000000000	5731f4f6-2076-446a-bb6d-0749469eb23f	{"action":"login","actor_id":"8e552a4c-da01-402d-afca-ef07a989b933","actor_username":"thecobra@ironcobra.net","actor_via_sso":false,"log_type":"account"}	2025-05-12 10:47:43.888426+00	
00000000-0000-0000-0000-000000000000	ddcaa9ab-229f-4adb-aa17-a4448e64ed0d	{"action":"token_refreshed","actor_id":"8e552a4c-da01-402d-afca-ef07a989b933","actor_username":"thecobra@ironcobra.net","actor_via_sso":false,"log_type":"token"}	2025-05-12 11:49:38.36639+00	
00000000-0000-0000-0000-000000000000	cf313c63-2bc3-4ae1-942b-84daca4e9f06	{"action":"token_revoked","actor_id":"8e552a4c-da01-402d-afca-ef07a989b933","actor_username":"thecobra@ironcobra.net","actor_via_sso":false,"log_type":"token"}	2025-05-12 11:49:38.367937+00	
00000000-0000-0000-0000-000000000000	f927ab9a-e554-4591-a6c1-db46205ddd65	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-12 16:49:06.678152+00	
00000000-0000-0000-0000-000000000000	1b162e19-49c8-4135-9f27-716aaaf008ed	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-12 16:49:06.67986+00	
00000000-0000-0000-0000-000000000000	1b916766-0e27-45ee-b68e-deb31210e757	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-12 16:49:06.705254+00	
00000000-0000-0000-0000-000000000000	9185bed0-bd8d-4c33-89c0-64741d5ab9e1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-12 16:49:06.725122+00	
00000000-0000-0000-0000-000000000000	2873b21b-9762-446d-adb9-8ca59c05dda0	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-12 16:49:08.030368+00	
00000000-0000-0000-0000-000000000000	8393dd9e-2574-4c25-a165-a790274c6cb9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-12 16:49:08.949967+00	
00000000-0000-0000-0000-000000000000	e85c2b6d-67a2-4331-8606-259cc638d36b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-12 16:54:15.513154+00	
00000000-0000-0000-0000-000000000000	53166e2c-9db6-497e-ae76-a9f4a08d3c3e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-13 06:49:31.446499+00	
00000000-0000-0000-0000-000000000000	ba77ec50-d1ef-454a-b49e-7a4da767dbdc	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-13 06:49:31.449913+00	
00000000-0000-0000-0000-000000000000	6a1f36c6-7fe8-421e-bafb-ca5b8573a979	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-13 06:49:31.478137+00	
00000000-0000-0000-0000-000000000000	e5dc41ef-528e-4cc1-a860-cafd4de8cd32	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-13 06:49:31.513093+00	
00000000-0000-0000-0000-000000000000	dd47745b-c8e1-4e60-98a7-1e37ffd73020	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-13 06:49:32.870527+00	
00000000-0000-0000-0000-000000000000	f0699a4d-eaa0-4ad1-b448-fb61e0b53822	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-13 06:49:34.18664+00	
00000000-0000-0000-0000-000000000000	7f817555-c67e-412e-a40b-5782acee1e97	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-13 06:49:37.584568+00	
00000000-0000-0000-0000-000000000000	30f9c2b7-1268-4abc-9cac-4c238bb71f8b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-13 16:58:10.544062+00	
00000000-0000-0000-0000-000000000000	d2f558c3-9ef5-47db-a3f3-be1dc822dd3b	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-13 16:58:10.54759+00	
00000000-0000-0000-0000-000000000000	5e8a6aa3-294c-4b83-9b41-100f2ab3a8aa	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-13 16:58:10.575327+00	
00000000-0000-0000-0000-000000000000	c5f017fa-a337-4e4c-b829-b440008fba7f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-13 16:58:10.700004+00	
00000000-0000-0000-0000-000000000000	3d5bb6ad-ee57-415b-9ea7-d0abead97da4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-13 16:58:12.026559+00	
00000000-0000-0000-0000-000000000000	8660ddf2-ec68-436a-b6a4-109c1e09b3a2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-13 16:58:13.370043+00	
00000000-0000-0000-0000-000000000000	b57506f9-652a-466e-b838-996c5f759e87	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-13 16:58:16.672464+00	
00000000-0000-0000-0000-000000000000	aa2b62e1-92a9-4a01-bbbd-382cb575c47e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-14 08:53:28.24387+00	
00000000-0000-0000-0000-000000000000	18d43995-7a17-49eb-af7e-cc36126c2b95	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-14 08:53:28.248737+00	
00000000-0000-0000-0000-000000000000	808f3b52-d524-4c96-ae21-6540214b197c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-14 08:53:28.264937+00	
00000000-0000-0000-0000-000000000000	aef3c66d-d258-404c-a5d1-daea8d746e5e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-14 08:53:28.316293+00	
00000000-0000-0000-0000-000000000000	74845141-6f34-42ad-8be3-ef3012f39883	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-14 08:53:29.587947+00	
00000000-0000-0000-0000-000000000000	69f6d33f-ec8d-4a73-b9ed-4ee281187f74	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-14 08:53:30.902987+00	
00000000-0000-0000-0000-000000000000	b8b11200-3408-4512-8b0f-56ba47e3fafe	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-14 08:53:33.584744+00	
00000000-0000-0000-0000-000000000000	16490eb3-d366-47c8-b6b3-e0314b0aaded	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-14 12:21:57.897606+00	
00000000-0000-0000-0000-000000000000	4a0d1ec5-05f4-433b-8e5a-1479a2a4fa22	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-14 12:21:57.900386+00	
00000000-0000-0000-0000-000000000000	bb62f583-e68a-4a4b-bf2d-cee73deb8535	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-14 12:21:57.914911+00	
00000000-0000-0000-0000-000000000000	89020861-0226-4961-97de-26160dc87e66	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-14 12:21:57.933042+00	
00000000-0000-0000-0000-000000000000	4111cc90-6825-4019-9430-14feaf7dd82e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-14 12:21:59.244473+00	
00000000-0000-0000-0000-000000000000	ba921694-7ab0-4c2e-af2f-e696cba42fef	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-14 12:22:00.167372+00	
00000000-0000-0000-0000-000000000000	116970db-c812-4e1d-9eef-3ede0803d00a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-14 12:22:03.42627+00	
00000000-0000-0000-0000-000000000000	d4367a0b-73c3-4537-9a1a-01e0efdecbda	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-15 21:49:43.375107+00	
00000000-0000-0000-0000-000000000000	0204412e-60b6-4423-9e25-93ac11edae74	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-15 21:49:43.378531+00	
00000000-0000-0000-0000-000000000000	c07f1888-4275-4b74-ba53-30e3c5644246	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-15 21:49:43.396782+00	
00000000-0000-0000-0000-000000000000	d6487017-88b6-4cba-90da-dbbb0b3fb3dd	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-15 21:49:43.406292+00	
00000000-0000-0000-0000-000000000000	560bdb3b-8550-4576-aa88-69796ab74731	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-15 21:49:44.767528+00	
00000000-0000-0000-0000-000000000000	25ec4671-37ec-4d6d-a520-c6911e79b5a3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-15 21:49:46.078847+00	
00000000-0000-0000-0000-000000000000	440fa5f7-f890-4218-a2d8-ed885eae1044	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-15 21:49:49.208323+00	
00000000-0000-0000-0000-000000000000	7f9789e9-fb5b-4b10-b40c-a8ebe60d1494	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-16 03:06:05.809372+00	
00000000-0000-0000-0000-000000000000	f4995747-0b6f-4c1e-b5d2-b9eee219461b	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-16 03:06:05.811512+00	
00000000-0000-0000-0000-000000000000	83ea4b29-8a12-45e5-ae2a-a87e0da06285	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-16 03:06:05.832468+00	
00000000-0000-0000-0000-000000000000	c4073d9a-c494-4bb0-90d3-23220ff85e1d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-16 03:06:05.862877+00	
00000000-0000-0000-0000-000000000000	dbbf140d-43c8-4193-b3e5-43e8042225bb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-16 03:06:07.12822+00	
00000000-0000-0000-0000-000000000000	d44e5a8e-02b9-4045-8461-f91626b4c2e6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-16 03:06:08.014647+00	
00000000-0000-0000-0000-000000000000	eae3e5fd-832c-4757-91ec-894c1d20b8af	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-16 03:06:11.256462+00	
00000000-0000-0000-0000-000000000000	f2e1380c-c536-4da0-9d57-741484f325d6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-18 21:59:37.835756+00	
00000000-0000-0000-0000-000000000000	308c26bc-cb04-463f-a923-ae4263d031c4	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-18 21:59:37.840051+00	
00000000-0000-0000-0000-000000000000	e403893a-dbe5-4152-a533-f3bd7161c0e5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-18 21:59:37.872498+00	
00000000-0000-0000-0000-000000000000	7bb77669-ecba-4ef9-b213-8a589248d928	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-18 21:59:37.888652+00	
00000000-0000-0000-0000-000000000000	9d9172fb-8f7d-4899-a0af-37f701b13a06	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-18 21:59:39.226021+00	
00000000-0000-0000-0000-000000000000	2275398f-0c83-4cda-ada0-2925f837a3dd	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-18 21:59:40.550164+00	
00000000-0000-0000-0000-000000000000	9e1a2381-8d17-42c3-9637-2c67a6765ac7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-18 21:59:44.15119+00	
00000000-0000-0000-0000-000000000000	0b17a24a-8fd2-42e4-92c2-3ba04140a31a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-19 05:14:51.423656+00	
00000000-0000-0000-0000-000000000000	ad733579-cece-40ef-9cfc-658e533e19c5	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-19 05:14:51.425778+00	
00000000-0000-0000-0000-000000000000	dddb68f3-7da3-4d9a-8847-3f0187f9f381	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-20 04:56:48.313583+00	
00000000-0000-0000-0000-000000000000	50279332-fe64-4435-a20d-b9a96667699e	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-20 04:56:48.317896+00	
00000000-0000-0000-0000-000000000000	21d35888-1667-49e9-9970-f7e6ac35ef1f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-20 04:56:48.35659+00	
00000000-0000-0000-0000-000000000000	6de5fa05-4f55-48ba-aadb-d970ef6ab62f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-20 04:56:48.368842+00	
00000000-0000-0000-0000-000000000000	5c84e423-6013-43b6-a8b7-5013a263028b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-20 04:56:49.736359+00	
00000000-0000-0000-0000-000000000000	13918508-1ebd-4291-a3cb-0d6d51faec20	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-20 04:56:50.633735+00	
00000000-0000-0000-0000-000000000000	96afa455-5287-4afb-996f-3cd19d29ce37	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-20 13:41:55.555603+00	
00000000-0000-0000-0000-000000000000	99c9c684-6591-4671-a485-52dfb655168d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-20 13:41:55.580222+00	
00000000-0000-0000-0000-000000000000	9e6d4cec-9159-4b07-9eb9-592823c3cc68	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-20 13:41:55.588545+00	
00000000-0000-0000-0000-000000000000	3a518ab7-20fe-462c-979d-a8b44c1bf548	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-20 13:41:56.959838+00	
00000000-0000-0000-0000-000000000000	53677241-0041-48c3-9a5f-7bf53931f31a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-20 13:41:57.865652+00	
00000000-0000-0000-0000-000000000000	9b65f614-4321-43b5-9605-591a52c24413	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-20 13:42:01.351462+00	
00000000-0000-0000-0000-000000000000	d35826e0-e022-40d9-96a3-e3b570684de2	{"action":"token_refreshed","actor_id":"8e552a4c-da01-402d-afca-ef07a989b933","actor_username":"thecobra@ironcobra.net","actor_via_sso":false,"log_type":"token"}	2025-05-21 12:33:29.223301+00	
00000000-0000-0000-0000-000000000000	e716270d-9aee-43cf-8321-d27a543b39d4	{"action":"token_revoked","actor_id":"8e552a4c-da01-402d-afca-ef07a989b933","actor_username":"thecobra@ironcobra.net","actor_via_sso":false,"log_type":"token"}	2025-05-21 12:33:29.227241+00	
00000000-0000-0000-0000-000000000000	489799f8-0fc1-4d80-8e49-85f75f57f3b2	{"action":"token_refreshed","actor_id":"8e552a4c-da01-402d-afca-ef07a989b933","actor_username":"thecobra@ironcobra.net","actor_via_sso":false,"log_type":"token"}	2025-05-21 12:33:29.260945+00	
00000000-0000-0000-0000-000000000000	db926301-71ec-476d-836a-2caa9aff0079	{"action":"token_refreshed","actor_id":"8e552a4c-da01-402d-afca-ef07a989b933","actor_username":"thecobra@ironcobra.net","actor_via_sso":false,"log_type":"token"}	2025-05-21 12:33:30.792055+00	
00000000-0000-0000-0000-000000000000	871225ce-7210-4e18-96f1-841b4e482a15	{"action":"token_refreshed","actor_id":"8e552a4c-da01-402d-afca-ef07a989b933","actor_username":"thecobra@ironcobra.net","actor_via_sso":false,"log_type":"token"}	2025-05-21 12:33:34.198818+00	
00000000-0000-0000-0000-000000000000	fe8625e9-20cd-4187-b65a-521555cfad6a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-23 16:39:20.999833+00	
00000000-0000-0000-0000-000000000000	1cc95d1a-061c-4586-a546-1d8c51f19e1d	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-23 16:39:21.006448+00	
00000000-0000-0000-0000-000000000000	98c2ba6e-08cf-4647-a65c-75c014ad512e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-23 16:39:21.041275+00	
00000000-0000-0000-0000-000000000000	f950cc79-05aa-4134-a761-885e0846dc34	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-23 16:39:21.054549+00	
00000000-0000-0000-0000-000000000000	faa9aacf-5f70-480a-81d2-949ab22026a9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-23 16:39:22.039973+00	
00000000-0000-0000-0000-000000000000	cc02b60c-f0fb-4552-bcd1-09597913ed21	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-23 16:39:23.02772+00	
00000000-0000-0000-0000-000000000000	2ae93aeb-d7c2-42a7-bf78-ba2e03bc079b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-23 16:39:25.543753+00	
00000000-0000-0000-0000-000000000000	0a9063e5-2c13-4f18-9366-0506420d0e1f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-25 05:11:40.43701+00	
00000000-0000-0000-0000-000000000000	217ced71-ed13-47aa-90d5-8d2c912d5add	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-25 05:11:40.439982+00	
00000000-0000-0000-0000-000000000000	fce542e7-9ad5-45a0-b223-81e5b4be6208	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-25 05:11:40.467638+00	
00000000-0000-0000-0000-000000000000	bfb1c6b8-7791-41f0-865b-817e00f4bfc9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-25 05:11:40.491668+00	
00000000-0000-0000-0000-000000000000	e6efc501-92a6-4df5-b76d-1af54f972929	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-25 05:11:41.803306+00	
00000000-0000-0000-0000-000000000000	7e3186bd-3473-4a16-8fef-a4ba92bda411	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-25 05:11:42.686665+00	
00000000-0000-0000-0000-000000000000	ab5b56b9-8873-46a3-9576-4c79c7dda065	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-25 05:11:46.923508+00	
00000000-0000-0000-0000-000000000000	e2f88b76-93e9-4c1e-b10a-b682cb432559	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-25 11:43:02.447312+00	
00000000-0000-0000-0000-000000000000	0efaa934-3970-417e-845d-f2f50ce64a7d	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-25 11:43:02.450196+00	
00000000-0000-0000-0000-000000000000	01a6cda4-f8fa-4a00-b4f3-867b3f1a3bac	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-25 11:43:02.474147+00	
00000000-0000-0000-0000-000000000000	03b97adc-8042-4c88-bd9e-d58830ac9966	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-25 11:43:02.500095+00	
00000000-0000-0000-0000-000000000000	cb572a67-bcbf-41fb-8173-1eb9f6d6ac2a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-25 11:43:03.391627+00	
00000000-0000-0000-0000-000000000000	86a98360-4310-4072-b15a-e6332a0f7c71	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-25 11:43:04.715925+00	
00000000-0000-0000-0000-000000000000	1b0cbfcc-5875-4789-be80-55051fe555bd	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-26 21:46:48.672993+00	
00000000-0000-0000-0000-000000000000	683a612c-6083-4504-8031-738b3bd79603	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-26 21:46:48.694843+00	
00000000-0000-0000-0000-000000000000	963fc50a-f417-44aa-b7c7-28812be83e99	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-26 21:46:48.708691+00	
00000000-0000-0000-0000-000000000000	1d352a99-5ede-4acc-a5c4-b8bfc96dd86a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-26 21:46:49.610569+00	
00000000-0000-0000-0000-000000000000	6eee9ad9-9b31-48cd-9c3b-5ceb814137e3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-26 21:46:50.496725+00	
00000000-0000-0000-0000-000000000000	e7c79bbd-47d5-4310-ba60-68030dca6e3e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-26 21:46:52.488359+00	
00000000-0000-0000-0000-000000000000	c3154d77-6d94-496b-8b72-4a0e888f47c9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-27 05:44:22.230344+00	
00000000-0000-0000-0000-000000000000	9f17930c-69f5-4727-964e-d3c79111b874	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-27 05:44:22.235157+00	
00000000-0000-0000-0000-000000000000	9975a571-6f6d-4545-8807-56305e90f4cf	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-27 05:44:22.258019+00	
00000000-0000-0000-0000-000000000000	918e8acb-6e0c-4bf0-9895-196ef4c4f106	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-27 05:44:22.279688+00	
00000000-0000-0000-0000-000000000000	3e94cf51-7094-44a0-840b-b6b76a8ae8e7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-27 05:44:23.621436+00	
00000000-0000-0000-0000-000000000000	d4e29635-686a-43f9-902f-2a030143eafb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-27 05:44:24.941131+00	
00000000-0000-0000-0000-000000000000	ca1c98dc-1a27-4a3d-a3e5-39f8fa15575a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-27 09:05:58.987219+00	
00000000-0000-0000-0000-000000000000	925269fe-1a33-47ab-a99a-2b20c36c84d5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-27 09:05:59.011696+00	
00000000-0000-0000-0000-000000000000	4707305e-f90f-41ad-b6d1-4f6a7829e094	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-27 09:05:59.02034+00	
00000000-0000-0000-0000-000000000000	7eed29b2-7483-4194-b53d-d8ffbbf45feb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-27 09:06:00.365517+00	
00000000-0000-0000-0000-000000000000	e7e19dc5-8c18-45b8-9aa9-4407b19078f5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-27 09:06:01.672309+00	
00000000-0000-0000-0000-000000000000	4405930d-2f94-4bcf-82e6-4a611dc015a9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-27 09:06:04.844469+00	
00000000-0000-0000-0000-000000000000	24aca33c-69b9-4e28-b0b8-1c6e32f2477f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-28 09:47:32.111008+00	
00000000-0000-0000-0000-000000000000	fe71f33d-5d96-4521-baad-e4ebdba760f7	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-28 09:47:32.115383+00	
00000000-0000-0000-0000-000000000000	015e5631-b66e-4b49-b7a0-889d29156ae2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-28 09:47:32.142591+00	
00000000-0000-0000-0000-000000000000	74f014f6-ad13-4fbd-b5ea-43e7e9e76f90	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-28 09:47:32.163417+00	
00000000-0000-0000-0000-000000000000	fae8766d-e29b-423f-8d66-b9a8f880a9a4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-28 09:47:33.478129+00	
00000000-0000-0000-0000-000000000000	34fcd525-0b8e-407a-b15b-89ec21564b4e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-05-28 09:47:34.784645+00	
00000000-0000-0000-0000-000000000000	7ef88d03-2cf6-4f6c-a3ed-4a2651eb44c5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-01 10:07:37.490497+00	
00000000-0000-0000-0000-000000000000	4fd257ca-4aa6-4640-b8a1-7c5d83eccc23	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-01 10:07:37.518618+00	
00000000-0000-0000-0000-000000000000	f177c3b7-8bb8-4c1e-89eb-dd8443c4177a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-01 10:07:37.543618+00	
00000000-0000-0000-0000-000000000000	f0b41448-e736-4def-b885-8892502037bc	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-01 10:07:38.846064+00	
00000000-0000-0000-0000-000000000000	52e94e8c-29b1-4478-8c28-72237eae3789	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-01 10:07:39.747183+00	
00000000-0000-0000-0000-000000000000	209f12b1-5442-4338-af07-d139e1fa21ea	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-01 10:07:42.762209+00	
00000000-0000-0000-0000-000000000000	3b7d99fd-3425-439b-bcea-30c14a20f3dd	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-02 03:06:43.114877+00	
00000000-0000-0000-0000-000000000000	ab38abb1-7407-43d5-9253-2feb2ef5df67	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-02 03:06:43.119716+00	
00000000-0000-0000-0000-000000000000	d6bdd220-0075-4e58-b88a-44acdb256a07	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-02 03:06:43.159234+00	
00000000-0000-0000-0000-000000000000	fb46bc45-f0a9-4ee0-9858-b37e6f4fec3f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-02 03:06:43.188494+00	
00000000-0000-0000-0000-000000000000	af5bf36c-7e14-421e-9c96-938ce906ba89	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-02 03:06:44.524032+00	
00000000-0000-0000-0000-000000000000	03617e12-abff-4642-9973-5b33d1da246d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-02 03:06:45.834763+00	
00000000-0000-0000-0000-000000000000	31af861e-a9e4-4eba-ac86-2bb33995fd2d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-02 03:06:48.985292+00	
00000000-0000-0000-0000-000000000000	326b27e9-14c8-40b7-bb7a-f1c6ea4961e4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-03 09:52:23.995179+00	
00000000-0000-0000-0000-000000000000	6c820b28-9c78-4f0f-99dd-a5fc717756e9	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-03 09:52:24.003378+00	
00000000-0000-0000-0000-000000000000	94b463dc-6889-4960-b2d1-20c0430d84d9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-03 09:52:24.034435+00	
00000000-0000-0000-0000-000000000000	098a4e1a-9562-4a40-ada8-6c3e7e7ae293	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-03 09:52:24.070667+00	
00000000-0000-0000-0000-000000000000	39b0368f-4f29-4a62-abb1-fd44abb0d974	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-03 09:52:25.351095+00	
00000000-0000-0000-0000-000000000000	3883aba4-0454-4a86-8e12-3b9c136476b1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-03 09:52:26.671261+00	
00000000-0000-0000-0000-000000000000	0510fd45-4716-4f7d-a909-1956ab01e896	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-03 09:52:30.025991+00	
00000000-0000-0000-0000-000000000000	7b24d248-f543-4fee-bf0a-a3ed76536c39	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-06 03:38:04.180404+00	
00000000-0000-0000-0000-000000000000	d387a6c0-9595-4d5c-adb2-a68a8356521d	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-06 03:38:04.183948+00	
00000000-0000-0000-0000-000000000000	55fa9779-4088-4dbb-a9da-caeae3b50571	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-06 03:38:04.207397+00	
00000000-0000-0000-0000-000000000000	7dee44bb-5ac2-4156-920e-8b80f93e3b7b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-06 03:38:04.222205+00	
00000000-0000-0000-0000-000000000000	c2ae8c75-09e9-43ca-bf4f-12096e7ba1d9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-06 03:38:05.125475+00	
00000000-0000-0000-0000-000000000000	7ec51adc-57c5-4c98-9eb4-7fff0910fbaa	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-06 03:38:06.43786+00	
00000000-0000-0000-0000-000000000000	dc49cc56-c49e-48ec-bac6-af80d25e9e76	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-06 03:38:09.32281+00	
00000000-0000-0000-0000-000000000000	57d7905a-4513-4045-b67d-bbc43e4be171	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-24 03:32:28.071848+00	
00000000-0000-0000-0000-000000000000	7896c83d-11b3-4efd-b373-d0eb44e28872	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-24 03:32:58.276746+00	
00000000-0000-0000-0000-000000000000	5055afb8-8c17-46e3-bfbe-8492eb6d0e88	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-24 03:33:02.796212+00	
00000000-0000-0000-0000-000000000000	54c84159-1bfb-47bd-9f2d-80df3910c65e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-24 03:33:02.830099+00	
00000000-0000-0000-0000-000000000000	60e67113-b02a-4355-a135-c53e894f5625	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-24 04:05:27.081521+00	
00000000-0000-0000-0000-000000000000	42b1605c-d8e1-4103-af96-23eefaa3f078	{"action":"logout","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-06-24 04:05:27.231503+00	
00000000-0000-0000-0000-000000000000	26440611-d5f5-423f-95a5-9d06666c2dfa	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-06-24 04:13:09.444818+00	
00000000-0000-0000-0000-000000000000	c11dcb87-5d38-4684-867b-1e1a861aeeb9	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-06-24 04:14:47.02028+00	
00000000-0000-0000-0000-000000000000	ba898aed-c389-4daa-8138-deab3c44360d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-24 07:07:58.700651+00	
00000000-0000-0000-0000-000000000000	f679d173-3f72-43ad-90cb-be13fe530c2f	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-24 07:07:58.701593+00	
00000000-0000-0000-0000-000000000000	0e49c988-dd25-48c9-af24-5ece662a243f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-24 07:08:01.7627+00	
00000000-0000-0000-0000-000000000000	d288504d-ba0c-4239-9df9-30eaae5ad935	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-24 23:24:47.927306+00	
00000000-0000-0000-0000-000000000000	ba3fb045-36bf-4aac-9f99-970d6c0e07e1	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-24 23:24:47.928229+00	
00000000-0000-0000-0000-000000000000	60215b1c-a020-4104-8b85-c10346b0890e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-25 04:06:04.016509+00	
00000000-0000-0000-0000-000000000000	dfa646be-5aa1-42f3-b0ff-a867a30c2575	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-25 04:06:04.018332+00	
00000000-0000-0000-0000-000000000000	291088b9-84ed-4a56-bc53-b6d9363f71ae	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-25 05:04:05.027468+00	
00000000-0000-0000-0000-000000000000	1ff78f97-d636-4364-bc82-f93de86e8c61	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-25 05:04:05.029173+00	
00000000-0000-0000-0000-000000000000	43d6b552-42de-4f7c-821e-63ad99b6c9e4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-25 06:02:06.266012+00	
00000000-0000-0000-0000-000000000000	7b9c72de-acd5-40b4-ad4e-be767c36ff96	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-25 06:02:06.267682+00	
00000000-0000-0000-0000-000000000000	948d78a3-10af-448d-9ae5-fb63a825d2df	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-30 12:19:37.735423+00	
00000000-0000-0000-0000-000000000000	0ef9f098-c13e-4663-9805-2be6c0552f55	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-30 12:19:37.738143+00	
00000000-0000-0000-0000-000000000000	b5fbfee3-b4a7-4c08-bf02-b3cb68e350d7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-30 12:19:37.776641+00	
00000000-0000-0000-0000-000000000000	0fa8a782-d03d-426d-9025-94b2b2a037dd	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-06-30 12:19:41.539177+00	
00000000-0000-0000-0000-000000000000	de128c35-06b2-40df-ab73-aacc42aa5690	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-06 23:17:19.423533+00	
00000000-0000-0000-0000-000000000000	d0280f8b-d65e-47f8-be1a-93f99280b5c5	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-06 23:17:19.430326+00	
00000000-0000-0000-0000-000000000000	3c30262c-ec28-46ec-ab74-4bb95cfa0356	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-06 23:17:19.465022+00	
00000000-0000-0000-0000-000000000000	dc01b270-1159-4d9a-bf32-1e8eb937c741	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-06 23:17:22.122144+00	
00000000-0000-0000-0000-000000000000	2baf0e79-f525-4347-8494-0841e05a6925	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 00:15:23.770324+00	
00000000-0000-0000-0000-000000000000	bda2b733-41f2-43b2-a200-2089adda1519	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 00:15:23.773201+00	
00000000-0000-0000-0000-000000000000	031fdaf7-fc56-4a55-8bdb-2ff8303ef550	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 01:13:24.710182+00	
00000000-0000-0000-0000-000000000000	c802cbe5-c1b8-4ead-9173-34fc00a1077f	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 01:13:24.711816+00	
00000000-0000-0000-0000-000000000000	200e445d-8fb6-4ba9-9490-42877a33c013	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 02:11:25.843576+00	
00000000-0000-0000-0000-000000000000	527a9ad7-9f99-46f8-a28b-51812096e60f	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 02:11:25.845042+00	
00000000-0000-0000-0000-000000000000	925b7d3b-ce5c-41bb-bddd-714d5b2a58df	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 03:09:26.495464+00	
00000000-0000-0000-0000-000000000000	fbd4a3b2-abc1-4123-8f79-4b1a8f6ef8ed	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 03:09:26.497679+00	
00000000-0000-0000-0000-000000000000	46d9ea65-6ade-4c3e-8f49-38497a03876e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 04:07:27.491996+00	
00000000-0000-0000-0000-000000000000	ffb445b9-c11d-48d0-925c-abf08a650b82	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 04:07:27.492906+00	
00000000-0000-0000-0000-000000000000	d2ae27f9-2d08-4b5c-8046-efcf005bcc65	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 05:05:35.980189+00	
00000000-0000-0000-0000-000000000000	207672e4-76fe-47fd-a45d-5d145ef4f568	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 05:05:35.981723+00	
00000000-0000-0000-0000-000000000000	42a690b7-8ebf-4678-b10b-03047d502435	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 06:03:59.576212+00	
00000000-0000-0000-0000-000000000000	5a445d7b-6542-420c-bfc7-55f49d658a93	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 06:03:59.578417+00	
00000000-0000-0000-0000-000000000000	2071f975-6862-4b1a-a719-efcf765ccf09	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 07:02:00.64556+00	
00000000-0000-0000-0000-000000000000	c4eb1a12-8016-4e84-84fa-cad31971e94e	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 07:02:00.64766+00	
00000000-0000-0000-0000-000000000000	30afd442-bed5-4295-b8c7-6b8fcc93fbd9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 08:00:02.336638+00	
00000000-0000-0000-0000-000000000000	34d88721-f84f-4eae-bef8-c423e1965fc2	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 08:00:02.339215+00	
00000000-0000-0000-0000-000000000000	855187d1-ea28-4062-8512-d5242b0be359	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 08:58:32.575064+00	
00000000-0000-0000-0000-000000000000	7d634df6-5c6f-4764-84dc-ce5df1718ae7	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 08:58:32.576058+00	
00000000-0000-0000-0000-000000000000	b7990c50-2f44-4ea7-90c1-90ef585e56ae	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 09:56:33.630073+00	
00000000-0000-0000-0000-000000000000	3f1bb968-004e-4355-9c2b-714180e77d83	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 09:56:33.632291+00	
00000000-0000-0000-0000-000000000000	072532c6-45f2-4d2b-9abc-76bd9bbab688	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 10:54:34.601895+00	
00000000-0000-0000-0000-000000000000	bfca9814-4b02-4886-b358-d99ca49af74e	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 10:54:34.604897+00	
00000000-0000-0000-0000-000000000000	49adf477-383e-41dc-badd-bd4467b04e83	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 11:52:36.124881+00	
00000000-0000-0000-0000-000000000000	d6e2dc39-2eaa-436d-b819-fbc59143d253	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 11:52:36.127759+00	
00000000-0000-0000-0000-000000000000	2afea296-9d67-4b70-872e-7af29f71896e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 12:51:06.65441+00	
00000000-0000-0000-0000-000000000000	04b68daf-f30c-4fb8-a81d-a5fcfbb410ec	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 12:51:06.657131+00	
00000000-0000-0000-0000-000000000000	0a684fa1-254e-4e7c-a034-b6006f75abd1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 13:49:07.587194+00	
00000000-0000-0000-0000-000000000000	fb839c9f-b727-4204-84a1-afd727133bd7	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 13:49:07.58814+00	
00000000-0000-0000-0000-000000000000	c1aa36dd-d47d-47a2-8372-ff0a3fdc14b7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 14:47:08.620851+00	
00000000-0000-0000-0000-000000000000	0e7645e0-d8d7-446b-99f0-be86feece2af	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 14:47:08.623435+00	
00000000-0000-0000-0000-000000000000	c85bef3f-7618-4fae-8ac0-773975925cae	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 15:45:09.375813+00	
00000000-0000-0000-0000-000000000000	31317020-dd66-4929-8b23-45bdc2696ca6	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 15:45:09.379666+00	
00000000-0000-0000-0000-000000000000	a91c68fc-d1d3-40c5-894c-26f96769cf13	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 16:43:10.461025+00	
00000000-0000-0000-0000-000000000000	28e9561f-d1fc-4525-978a-b065d2eef2c9	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 16:43:10.4619+00	
00000000-0000-0000-0000-000000000000	82bbae02-c73a-42fc-a501-8eecd7a9cc3c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 17:41:11.389198+00	
00000000-0000-0000-0000-000000000000	f8668690-0fc2-4429-a1ca-23a70a4b11d0	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 17:41:11.391559+00	
00000000-0000-0000-0000-000000000000	59b551d4-c21b-4b88-b16f-d15631c6bc1d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 18:39:12.372584+00	
00000000-0000-0000-0000-000000000000	a0bbb3d1-ff79-4fc6-9aa1-a16a56c9f1c1	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 18:39:12.373483+00	
00000000-0000-0000-0000-000000000000	aa54aade-0836-416c-8f35-b96fb5462386	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 19:37:13.535954+00	
00000000-0000-0000-0000-000000000000	2d9a2911-f319-447d-bf8b-c59008f239f7	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 19:37:13.53805+00	
00000000-0000-0000-0000-000000000000	7c7efe94-3599-4e95-bd9a-e06498d823ab	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 20:35:14.281072+00	
00000000-0000-0000-0000-000000000000	94148f1d-89e0-4a3b-818b-1093a42528a2	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 20:35:14.283026+00	
00000000-0000-0000-0000-000000000000	42358431-df98-42c4-ac62-776b4a5fc4e2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 21:33:15.692256+00	
00000000-0000-0000-0000-000000000000	83d76fb0-ebb8-4f24-829e-71b513cdbdc5	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 21:33:15.694586+00	
00000000-0000-0000-0000-000000000000	97a68278-1a60-4330-96be-5a36c6c03e2a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 22:31:16.643761+00	
00000000-0000-0000-0000-000000000000	b7d1563d-f3d5-4a0a-8e66-c478848c5728	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-07 22:31:16.644896+00	
00000000-0000-0000-0000-000000000000	b6be1ae5-d1eb-4176-b295-a1d275e0fd48	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-13 12:44:02.599165+00	
00000000-0000-0000-0000-000000000000	a4d3012e-cd14-47b2-8d18-29fdcba86c21	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-13 12:44:02.603122+00	
00000000-0000-0000-0000-000000000000	bf326858-fefc-42c1-96da-d9f007777c7e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-13 12:44:02.643349+00	
00000000-0000-0000-0000-000000000000	7a574a8b-1b66-47e6-ae44-46e1a613e4c1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-13 12:44:05.536268+00	
00000000-0000-0000-0000-000000000000	878e4f44-6967-4dfa-ae16-6a765731ebc4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-17 04:36:12.478125+00	
00000000-0000-0000-0000-000000000000	0ad5550e-0839-4942-bd41-af157fe05573	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-17 04:36:12.480391+00	
00000000-0000-0000-0000-000000000000	24f29e74-06ec-4eb3-8daf-3c506311d17c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-20 23:53:35.040847+00	
00000000-0000-0000-0000-000000000000	75661387-4c79-4f3e-8d35-9e34fa0661c5	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-20 23:53:35.043422+00	
00000000-0000-0000-0000-000000000000	7a2f8e7f-ed5c-4661-b973-ded0a9bd1980	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-20 23:53:35.071029+00	
00000000-0000-0000-0000-000000000000	6cebe0b9-dc1a-4292-b652-9e30e957b6fe	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-20 23:53:37.629423+00	
00000000-0000-0000-0000-000000000000	5e199d8d-ba2f-4ce3-8791-23bc87a49675	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-21 22:35:53.114471+00	
00000000-0000-0000-0000-000000000000	9a71a4ea-41ec-48e8-8c59-adadf906bb49	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-21 22:35:53.11669+00	
00000000-0000-0000-0000-000000000000	4803a00f-4a2e-4217-bdf9-5651b47aa3db	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-21 22:35:58.604648+00	
00000000-0000-0000-0000-000000000000	30773dbd-3498-4506-b694-bb28b30bed64	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-21 22:36:00.907316+00	
00000000-0000-0000-0000-000000000000	8fe4add5-c6c0-4c02-a5e8-a91d2f0e6ce8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-21 22:36:00.949827+00	
00000000-0000-0000-0000-000000000000	993470bb-8168-42b9-9e31-02c36da33a13	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-21 22:36:09.003792+00	
00000000-0000-0000-0000-000000000000	d93d63f1-4299-4cb0-a97e-acbe551cb4ce	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-07-22 00:25:33.15231+00	
00000000-0000-0000-0000-000000000000	d5512f08-274e-4474-a8a5-8077e095198f	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-07-22 00:25:58.484052+00	
00000000-0000-0000-0000-000000000000	9c2bc454-4e0a-481e-8ba0-4b09dfd5722e	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-07-22 01:13:39.940488+00	
00000000-0000-0000-0000-000000000000	bdd28eb7-3160-4acf-8f5a-076847a4ea46	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-07-22 01:14:21.329579+00	
00000000-0000-0000-0000-000000000000	7b843778-1a6c-4826-9c25-7a8586ad223e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-22 02:12:45.66452+00	
00000000-0000-0000-0000-000000000000	9cd626cb-2395-49b4-aea3-1ce39e6a85af	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-22 02:12:45.668332+00	
00000000-0000-0000-0000-000000000000	5f2edd2b-7436-4d1e-a049-193803e433a3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-22 03:10:46.559562+00	
00000000-0000-0000-0000-000000000000	fd1c59ac-a0f7-4832-8afb-f468e8e1fc98	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-22 03:10:46.561964+00	
00000000-0000-0000-0000-000000000000	7ba9dfba-0c53-4afe-9eeb-1b5f516f18a5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-22 04:08:47.505094+00	
00000000-0000-0000-0000-000000000000	59dab9a7-0b17-49ce-bcf1-23b78302a086	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-22 04:08:47.506858+00	
00000000-0000-0000-0000-000000000000	efbce6d0-7145-40a6-a2ca-8aedb7846782	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-22 05:07:18.395052+00	
00000000-0000-0000-0000-000000000000	fd59afa7-4933-4697-b0c0-f3d1a19a8b21	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-22 05:07:18.39679+00	
00000000-0000-0000-0000-000000000000	af8c1fff-558c-47fe-8566-e572b60ce68c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-22 06:05:49.258454+00	
00000000-0000-0000-0000-000000000000	83e017c3-9a74-425e-a21e-c83240f2f702	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-22 06:05:49.259349+00	
00000000-0000-0000-0000-000000000000	2c746564-7d19-497f-92f0-a0d1e30ed615	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-22 07:04:20.240449+00	
00000000-0000-0000-0000-000000000000	38762293-cc62-4a73-869e-0c17f03657d8	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-07-22 07:04:20.242746+00	
00000000-0000-0000-0000-000000000000	9d7c57ab-27ae-4a5e-b135-bb701517f26a	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-09-12 06:19:25.108611+00	
00000000-0000-0000-0000-000000000000	f620e761-6034-4966-8fe9-cfac79b326fe	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-09-12 06:20:03.508963+00	
00000000-0000-0000-0000-000000000000	8a748967-c354-4152-86b5-ca92c5afec7f	{"action":"user_signedup","actor_id":"2c14713b-a581-4614-812c-e2ea5b3e2835","actor_username":"mandy@ironcobra.net","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-09-20 00:57:03.664974+00	
00000000-0000-0000-0000-000000000000	77f1fdcf-72e5-49ea-a42b-c28a9916bf6a	{"action":"login","actor_id":"2c14713b-a581-4614-812c-e2ea5b3e2835","actor_username":"mandy@ironcobra.net","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-09-20 00:57:03.682942+00	
00000000-0000-0000-0000-000000000000	e327395f-54d4-430b-894c-51b05b2b7b1f	{"action":"user_recovery_requested","actor_id":"2c14713b-a581-4614-812c-e2ea5b3e2835","actor_username":"mandy@ironcobra.net","actor_via_sso":false,"log_type":"user"}	2025-09-20 00:57:03.738456+00	
00000000-0000-0000-0000-000000000000	0a1e51eb-1a3c-4047-a68b-a7fd04a10938	{"action":"login","actor_id":"2c14713b-a581-4614-812c-e2ea5b3e2835","actor_username":"mandy@ironcobra.net","actor_via_sso":false,"log_type":"account"}	2025-09-20 00:57:42.137332+00	
00000000-0000-0000-0000-000000000000	affe3d6d-a9e3-4f6e-81a8-ed1ae09ffc8d	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-10-13 00:23:20.020563+00	
00000000-0000-0000-0000-000000000000	f27dca45-ca20-4f2d-9427-532e7f4a9bc2	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-10-13 00:23:50.164928+00	
00000000-0000-0000-0000-000000000000	b5e6c2aa-bf4d-4562-be75-670e30cdc105	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-10-22 11:24:42.985236+00	
00000000-0000-0000-0000-000000000000	cc54994e-8844-4bc7-b14a-a24a2a83fc4d	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-10-22 11:25:05.730878+00	
00000000-0000-0000-0000-000000000000	0e9d5119-e905-41ae-8fcd-d1d7e3951012	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-10-22 11:26:45.07712+00	
00000000-0000-0000-0000-000000000000	c113b39a-5e16-4db2-ad0b-66d7fc0f9f64	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-10-22 11:27:14.45836+00	
00000000-0000-0000-0000-000000000000	82a8fb66-3dcb-4379-a185-8265ede74b75	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-22 12:25:39.123986+00	
00000000-0000-0000-0000-000000000000	72df127b-0452-44b7-ba11-c73782becdfe	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-22 12:25:39.128659+00	
00000000-0000-0000-0000-000000000000	250f0cee-8d7e-46bc-952c-c67018e47693	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-22 13:23:51.338516+00	
00000000-0000-0000-0000-000000000000	d983141f-ebf1-436d-818d-34e1b0c02926	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-22 13:23:51.340987+00	
00000000-0000-0000-0000-000000000000	5af16fa8-b574-4c37-9cc6-69e8a18634f5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-22 22:03:32.822618+00	
00000000-0000-0000-0000-000000000000	4410a92b-a2bc-400c-8825-d88fcd64997f	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-22 22:03:32.82707+00	
00000000-0000-0000-0000-000000000000	56b9cc93-bc6b-43a8-8fe2-aec75f421be6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-22 23:01:51.097512+00	
00000000-0000-0000-0000-000000000000	336162ab-163d-4a3e-a245-ae5ce76855f0	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-22 23:01:51.101599+00	
00000000-0000-0000-0000-000000000000	af477452-6e9a-47fb-aece-06f2d24ecea4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 00:00:21.482562+00	
00000000-0000-0000-0000-000000000000	e487c718-2571-4b11-8965-a5f2becbf80e	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 00:00:21.48622+00	
00000000-0000-0000-0000-000000000000	89223d02-a143-4089-bbd3-2aaa64a857be	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 00:58:22.749094+00	
00000000-0000-0000-0000-000000000000	838976b0-7859-4579-9078-932d280e9324	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 00:58:22.753126+00	
00000000-0000-0000-0000-000000000000	eed0817a-47fe-4152-b94b-8f275d9158ca	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 01:56:23.246192+00	
00000000-0000-0000-0000-000000000000	41769705-0630-4a60-b087-9dcada610473	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 01:56:23.248039+00	
00000000-0000-0000-0000-000000000000	5310ed43-9bf8-463b-a2a0-9fef4b1501f8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 06:11:21.219344+00	
00000000-0000-0000-0000-000000000000	fd8d8308-d4d9-4269-bde4-feaaba7c4188	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 06:11:21.222923+00	
00000000-0000-0000-0000-000000000000	32a0b47a-fde8-4eef-b058-854cbf7a774c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 06:11:22.129438+00	
00000000-0000-0000-0000-000000000000	3c7159e8-3f19-41c5-8f1f-01e49181e74a	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 06:11:22.130166+00	
00000000-0000-0000-0000-000000000000	0bd82b7d-baa7-4da3-ad28-f8b3a9288153	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 07:09:45.873032+00	
00000000-0000-0000-0000-000000000000	f9327553-ec02-498f-982d-d31e58334f00	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 07:09:45.876205+00	
00000000-0000-0000-0000-000000000000	8ea7f553-0997-402f-aa37-5d63bdf107e8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 08:07:56.37592+00	
00000000-0000-0000-0000-000000000000	a613d5ef-d15e-435d-9c27-07aea5188ba0	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 08:07:56.3838+00	
00000000-0000-0000-0000-000000000000	bec89ece-e10a-4f4f-a37f-3b72a912bad4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 09:05:57.214198+00	
00000000-0000-0000-0000-000000000000	395fd9c0-0e30-46c8-9571-a76668c18bf4	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 09:05:57.216621+00	
00000000-0000-0000-0000-000000000000	6be48c3e-706b-4b9b-bdf8-009160cc08d4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 10:03:58.128691+00	
00000000-0000-0000-0000-000000000000	05b6aad9-d386-43ee-bd32-95ad25fccced	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 10:03:58.132121+00	
00000000-0000-0000-0000-000000000000	cb881d87-6a3b-4a6f-bfc0-9c14d722d30a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 11:01:59.140098+00	
00000000-0000-0000-0000-000000000000	3a8be60f-71c4-40e6-ac68-d45191240c8b	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 11:01:59.142407+00	
00000000-0000-0000-0000-000000000000	ad7b9a2d-79b4-4aa7-8474-c363b3747b31	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 12:00:29.938171+00	
00000000-0000-0000-0000-000000000000	c5b671c9-c16c-41c2-b158-44e2b39371d4	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 12:00:29.941021+00	
00000000-0000-0000-0000-000000000000	2601bb62-af83-4279-b170-7531fa57e79f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 12:58:30.751199+00	
00000000-0000-0000-0000-000000000000	365170a3-c4ee-4c5d-9108-a4d5df0a19ef	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 12:58:30.754341+00	
00000000-0000-0000-0000-000000000000	260f8e29-57bb-4974-82dc-9bc6671c2091	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 13:56:38.095875+00	
00000000-0000-0000-0000-000000000000	7b87c1e4-8cec-4a09-bea5-5521ab6be356	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 13:56:38.099701+00	
00000000-0000-0000-0000-000000000000	cfc497b1-1e61-45a1-b70c-58d742c60ef1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 14:54:39.451006+00	
00000000-0000-0000-0000-000000000000	955e7fae-976a-4925-ace5-005c29036a26	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 14:54:39.453505+00	
00000000-0000-0000-0000-000000000000	5e1318df-a37e-4e84-9c57-ce84d7ad548c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 15:53:00.171378+00	
00000000-0000-0000-0000-000000000000	1474927d-9294-4093-b53a-6e90319cf5db	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 15:53:00.184154+00	
00000000-0000-0000-0000-000000000000	f2befb9e-bfdb-4374-972f-572e92d5383b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 22:10:43.559933+00	
00000000-0000-0000-0000-000000000000	1dcd6f1c-4d89-4d0d-8dac-ec31c93a61b0	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 22:10:43.561647+00	
00000000-0000-0000-0000-000000000000	73167cb8-89b1-4517-ae35-bab81529ab6a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 23:09:00.875708+00	
00000000-0000-0000-0000-000000000000	2cf6555f-8995-4c7c-a46b-2b577d9cb072	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 23:09:00.879844+00	
00000000-0000-0000-0000-000000000000	320967be-dd15-4862-8a31-81bf81a1caca	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 23:44:02.202712+00	
00000000-0000-0000-0000-000000000000	29290e2c-e64c-49a3-a13b-935a4e346e76	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 23:44:02.20489+00	
00000000-0000-0000-0000-000000000000	7012d2ec-6e0f-4601-871b-e83bb2479d7c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-23 23:44:02.224206+00	
00000000-0000-0000-0000-000000000000	9741785b-e353-4767-9f69-211816024a6c	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-10-24 00:03:07.95607+00	
00000000-0000-0000-0000-000000000000	524cc1ac-a212-4ea4-9f84-db30ed08215c	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-10-24 00:03:32.994582+00	
00000000-0000-0000-0000-000000000000	f32c0cbd-8cf3-4fe7-9019-c7c02b5ac83e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 00:07:41.95228+00	
00000000-0000-0000-0000-000000000000	ff32871f-001e-454c-92ec-e0b7accc5bb3	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 00:07:41.955937+00	
00000000-0000-0000-0000-000000000000	be12f4f7-035e-4a12-ab07-96363d74c487	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 01:06:12.390687+00	
00000000-0000-0000-0000-000000000000	83dc8466-ccdd-4eb8-a545-ffb8ae989216	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 01:06:12.393042+00	
00000000-0000-0000-0000-000000000000	c6fab51c-c808-4783-ade8-dad0fc38fae8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 02:04:13.225496+00	
00000000-0000-0000-0000-000000000000	42af3803-4aa0-4432-a69e-1f46eb83806c	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 02:04:13.228622+00	
00000000-0000-0000-0000-000000000000	4e813c67-ec2c-4601-9a5e-28618aad18f3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 06:43:16.159888+00	
00000000-0000-0000-0000-000000000000	ee5cd935-7b3a-4220-8dd4-44b4df1b4a56	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 06:43:16.164104+00	
00000000-0000-0000-0000-000000000000	b09a1061-611d-4c33-ba94-3e2a9b66584d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 07:41:42.895981+00	
00000000-0000-0000-0000-000000000000	049101f5-d19d-4782-b520-98b956a4c43b	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 07:41:42.898445+00	
00000000-0000-0000-0000-000000000000	a9edb434-1240-4277-81ae-a625ca2e328a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 08:39:43.844907+00	
00000000-0000-0000-0000-000000000000	2b52caf8-9e87-48b6-b1aa-6181398eec6c	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 08:39:43.847926+00	
00000000-0000-0000-0000-000000000000	d406db2c-fa11-49f9-916c-9bad612c7937	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 09:37:44.90123+00	
00000000-0000-0000-0000-000000000000	555c1f90-4fed-4072-ab02-ae5baebac370	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 09:37:44.904184+00	
00000000-0000-0000-0000-000000000000	a1212da4-66ac-4fbb-94e4-4cb720119994	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 10:35:45.770456+00	
00000000-0000-0000-0000-000000000000	9ec36eb5-e6c2-4f91-a32b-3e879d57d05e	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 10:35:45.774177+00	
00000000-0000-0000-0000-000000000000	afb2c76a-482c-42b8-8f3b-e2e92c217c1c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 11:33:46.683736+00	
00000000-0000-0000-0000-000000000000	9b8bc7b0-d278-45cd-acb6-2e70088aca22	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 11:33:46.686746+00	
00000000-0000-0000-0000-000000000000	c586a91d-8adc-484d-a344-64a7de5c70b8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 12:31:47.521697+00	
00000000-0000-0000-0000-000000000000	0ea1d6e7-6a70-4a64-8a03-a6c49ddd3517	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-24 12:31:47.523737+00	
00000000-0000-0000-0000-000000000000	ff808f13-9b8e-487f-9478-7a7840d7d49b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 01:56:20.860905+00	
00000000-0000-0000-0000-000000000000	2e73d0c9-f457-4a97-9d66-8e327abe1bc9	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 01:56:20.864462+00	
00000000-0000-0000-0000-000000000000	7a190cd7-9623-4aca-a41b-1ff55a469a4e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 01:56:21.228074+00	
00000000-0000-0000-0000-000000000000	dea08dcd-8e53-4af6-b1ef-ebf14c0446b2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 02:54:22.901422+00	
00000000-0000-0000-0000-000000000000	1649578e-cfa2-4959-8325-9e37405f8e0c	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 02:54:22.904886+00	
00000000-0000-0000-0000-000000000000	3c3f0e7e-1376-4044-bf01-c9af21c4715c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 03:52:47.804799+00	
00000000-0000-0000-0000-000000000000	85f2475b-bfef-4c8f-bac8-6d9c232a971c	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 03:52:47.807884+00	
00000000-0000-0000-0000-000000000000	6a2e8f1e-c23f-4a8e-962d-62ab3b64b986	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 04:50:57.198719+00	
00000000-0000-0000-0000-000000000000	9d31f4e0-488e-415d-a2e3-dd954a96ab3c	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 04:50:57.20305+00	
00000000-0000-0000-0000-000000000000	d6830032-42c0-481a-a29e-1154a5bab5c4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 05:49:22.090631+00	
00000000-0000-0000-0000-000000000000	ccc0b5f5-4a3a-4926-8bc6-bfc23cd02763	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 05:49:22.09455+00	
00000000-0000-0000-0000-000000000000	bd3c3570-daff-481e-989d-6414c23a1446	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 06:47:22.651674+00	
00000000-0000-0000-0000-000000000000	9a703bbd-1d20-4e2a-9cd5-9e3ac469e308	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 06:47:22.654967+00	
00000000-0000-0000-0000-000000000000	3e43ff3f-2ec6-4633-97be-81321c1d8eab	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 07:45:38.839307+00	
00000000-0000-0000-0000-000000000000	50012b01-aa0d-4de9-86bc-151aeea39f4f	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 07:45:38.842216+00	
00000000-0000-0000-0000-000000000000	9d146cd3-c3a7-49e2-901e-1853d699bed6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 10:20:50.749677+00	
00000000-0000-0000-0000-000000000000	1cf130dc-3c99-47f6-b61b-0954d09e06fc	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 10:20:50.752206+00	
00000000-0000-0000-0000-000000000000	4c7b8c1d-8e69-4230-abff-2fcdaac719b0	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 11:18:51.744393+00	
00000000-0000-0000-0000-000000000000	6ab039f5-39cf-4bf9-a290-311331c91d88	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 11:18:51.747463+00	
00000000-0000-0000-0000-000000000000	33cb1c0e-e276-4479-a156-ef48a4e4b9f6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 12:17:18.581588+00	
00000000-0000-0000-0000-000000000000	bc6f5a15-3933-401e-9abf-4757aa3b072c	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 12:17:18.583416+00	
00000000-0000-0000-0000-000000000000	90da8737-15c4-4448-90ef-51888ad7bfcb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 13:15:19.661024+00	
00000000-0000-0000-0000-000000000000	8281b5ee-b343-4bdf-9259-de5109897c86	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 13:15:19.662272+00	
00000000-0000-0000-0000-000000000000	a37f6798-9d7b-4fc6-90bb-3d307db94ef5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 14:17:20.713769+00	
00000000-0000-0000-0000-000000000000	88da3835-f5a4-4974-9232-3921ff3524b2	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 14:17:20.715956+00	
00000000-0000-0000-0000-000000000000	cb89a28a-8e83-4587-9dbc-25b9388c4cc7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 15:15:40.460403+00	
00000000-0000-0000-0000-000000000000	8e6e0e84-8b36-4a8e-9247-4a2d4ae901d8	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 15:15:40.463072+00	
00000000-0000-0000-0000-000000000000	d0f94de5-cf4e-4997-ba50-737ad2d85ddf	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 16:13:41.37652+00	
00000000-0000-0000-0000-000000000000	8c7a013d-0604-4c75-a644-25f8687ca75a	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 16:13:41.379356+00	
00000000-0000-0000-0000-000000000000	765e5745-36d7-425d-b278-5adb96f69077	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 17:11:42.216884+00	
00000000-0000-0000-0000-000000000000	994e837a-3290-4cc5-9a9e-96bca2c7fc25	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 17:11:42.221255+00	
00000000-0000-0000-0000-000000000000	71dcbb57-606c-41a6-92f0-b3a3bec084b6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 18:09:43.380585+00	
00000000-0000-0000-0000-000000000000	b2b26f18-1a35-437e-915f-cb11f20a3abe	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 18:09:43.383187+00	
00000000-0000-0000-0000-000000000000	9c500d9c-b542-41dd-b930-4138f5d30b84	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 19:08:14.22015+00	
00000000-0000-0000-0000-000000000000	ba0eecbe-a624-4027-8d12-4f0c1f6abfaf	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 19:08:14.224068+00	
00000000-0000-0000-0000-000000000000	15546d0c-86cf-4b62-8eb3-825b496ddd73	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 20:06:45.209994+00	
00000000-0000-0000-0000-000000000000	3892d24a-41bc-424f-a877-7a0251bca80d	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 20:06:45.21304+00	
00000000-0000-0000-0000-000000000000	b0dad838-a0cf-4b69-b02f-9d5c50a0daf2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 21:04:46.194359+00	
00000000-0000-0000-0000-000000000000	2e124c16-768f-42bd-8549-eac2d9d8ce3a	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 21:04:46.197128+00	
00000000-0000-0000-0000-000000000000	78d75bdc-7bee-4f27-8643-9cbfbcb6b1cf	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 22:02:47.298546+00	
00000000-0000-0000-0000-000000000000	cb09734e-237f-4bea-b783-e097a22ff453	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 22:02:47.301122+00	
00000000-0000-0000-0000-000000000000	7554d786-0bc0-46c7-a85f-7be54ec249e4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 23:00:48.227152+00	
00000000-0000-0000-0000-000000000000	a7759def-cffc-434b-b954-463e5f226783	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 23:00:48.229445+00	
00000000-0000-0000-0000-000000000000	622a3ce0-17ca-4565-816c-20615c177079	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 23:58:49.165979+00	
00000000-0000-0000-0000-000000000000	d5a6ccba-6997-4d33-a5df-1b46401654dd	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-25 23:58:49.169715+00	
00000000-0000-0000-0000-000000000000	cfbe7fe1-65d0-4ee5-86fa-301d78dc3e02	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 00:56:50.108867+00	
00000000-0000-0000-0000-000000000000	5cbb3a82-61f6-4299-b8ee-3c30476ceda9	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 00:56:50.112204+00	
00000000-0000-0000-0000-000000000000	909d6e95-3538-48dd-8602-4182ee1a63f0	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 01:54:51.190346+00	
00000000-0000-0000-0000-000000000000	184cfb06-03a9-445d-b5b7-b466974bde13	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 01:54:51.19265+00	
00000000-0000-0000-0000-000000000000	ad51e142-0bab-4ca4-b4b6-359e079fa7b6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 02:52:52.078313+00	
00000000-0000-0000-0000-000000000000	637c8995-7a59-442f-be6b-49ba4cf2f01e	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 02:52:52.082116+00	
00000000-0000-0000-0000-000000000000	32ffa989-ae22-463e-ab2f-54a5972831f4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 03:50:53.134726+00	
00000000-0000-0000-0000-000000000000	5fb11cbf-189d-45a1-91b5-5f7bcc66a128	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 03:50:53.137486+00	
00000000-0000-0000-0000-000000000000	3aac171c-c21d-4ed0-b3a5-b705a8d21100	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 04:48:54.145616+00	
00000000-0000-0000-0000-000000000000	505b4b76-2b7b-429f-83c4-0e5ad87c0657	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 04:48:54.147332+00	
00000000-0000-0000-0000-000000000000	0a5e8d97-e800-4d1f-afba-66103025e13f	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-10-26 05:18:41.924585+00	
00000000-0000-0000-0000-000000000000	d204843b-ff53-45ce-b130-344c3f733624	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-10-26 05:19:16.01342+00	
00000000-0000-0000-0000-000000000000	7dfee956-5ec3-4f40-b64d-9d9d7bab9181	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 05:46:55.083908+00	
00000000-0000-0000-0000-000000000000	615d5f68-0254-4d99-95e0-9cd3d2eacf72	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 05:46:55.086747+00	
00000000-0000-0000-0000-000000000000	72515e68-21e9-40e8-9c16-e9339cef04e1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 06:44:56.067562+00	
00000000-0000-0000-0000-000000000000	894279a0-2051-4fe4-82c7-343b047e3543	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 06:44:56.070723+00	
00000000-0000-0000-0000-000000000000	30974bf3-cf39-4b95-8386-52db52340350	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 07:42:56.993686+00	
00000000-0000-0000-0000-000000000000	a87b3392-9bc8-453c-b22e-58163fa8d96f	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 07:42:56.997164+00	
00000000-0000-0000-0000-000000000000	c56f611c-8d3c-4b87-9997-c58989a0d7e4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 08:40:57.869597+00	
00000000-0000-0000-0000-000000000000	15f3227a-e5c4-400f-87c3-a0200a1772f2	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 08:40:57.872389+00	
00000000-0000-0000-0000-000000000000	3ad197d4-886a-4481-9164-710d2fcbcdd7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 09:09:47.153947+00	
00000000-0000-0000-0000-000000000000	e88b3109-21da-4b30-8c86-d9868f6104e1	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 09:09:47.155536+00	
00000000-0000-0000-0000-000000000000	f5218cf3-1732-4a2f-a34c-d5116514b7e8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 09:38:59.096337+00	
00000000-0000-0000-0000-000000000000	596cc641-122a-48d5-abce-c6f13513f5b6	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 09:38:59.099224+00	
00000000-0000-0000-0000-000000000000	7563a90c-3ad3-451d-b3c6-9db32188a262	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 10:36:59.940372+00	
00000000-0000-0000-0000-000000000000	bec100fa-e028-4af7-91c5-85c2c3524b42	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 10:36:59.943635+00	
00000000-0000-0000-0000-000000000000	ce6646ab-e919-4fc7-b6af-37135a7c5542	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 11:35:00.926507+00	
00000000-0000-0000-0000-000000000000	1575df94-1487-456e-80b4-3dcdf4f21b07	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 11:35:00.930221+00	
00000000-0000-0000-0000-000000000000	b1ff5822-de21-4b30-a9a1-3f57e4f6504e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 12:33:01.880666+00	
00000000-0000-0000-0000-000000000000	6bb56d31-0ed6-447d-8008-acd478e8d7ad	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 12:33:01.883291+00	
00000000-0000-0000-0000-000000000000	e64e0b5a-0a65-4adc-943f-4a94d82b8b4a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 13:31:02.806689+00	
00000000-0000-0000-0000-000000000000	2f03f482-fe83-4956-9b95-0748a642e2fb	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 13:31:02.808899+00	
00000000-0000-0000-0000-000000000000	4180055b-e70a-4abe-9882-8dc66cc4e55b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 14:29:03.772033+00	
00000000-0000-0000-0000-000000000000	62dbbe31-cd6e-42f4-a5a5-aa5f65d85d02	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 14:29:03.774377+00	
00000000-0000-0000-0000-000000000000	a7a18564-2214-422a-8e6b-f6913fcfb800	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 15:27:04.990783+00	
00000000-0000-0000-0000-000000000000	b83e01bd-0fcf-41ea-a84f-fb1e3364afee	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 15:27:04.997445+00	
00000000-0000-0000-0000-000000000000	18fe6f65-31c5-4d0d-8482-c8c85b621ea2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 22:04:21.788656+00	
00000000-0000-0000-0000-000000000000	9f8d5fff-536e-4b9f-9cdb-509d311b9a69	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 22:04:21.792427+00	
00000000-0000-0000-0000-000000000000	3615ff79-7d51-4264-9648-caf1cfe01e51	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 22:04:56.187732+00	
00000000-0000-0000-0000-000000000000	facaeb0e-6fcc-4698-bd11-788cc2178d13	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 22:06:02.81812+00	
00000000-0000-0000-0000-000000000000	adc0184f-8172-413d-8c59-e11cf01f7e80	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 22:06:03.448777+00	
00000000-0000-0000-0000-000000000000	46c1e0aa-3609-416d-987c-903df48e1bc8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 23:04:05.178548+00	
00000000-0000-0000-0000-000000000000	6285497d-9342-4f42-a6cb-670462a495b1	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-26 23:04:05.180959+00	
00000000-0000-0000-0000-000000000000	4921b918-101f-4358-9913-2ac981dcc252	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-27 00:02:16.069334+00	
00000000-0000-0000-0000-000000000000	d7c548b6-58b1-474f-b6b3-2492d102467c	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-27 00:02:16.071815+00	
00000000-0000-0000-0000-000000000000	0f19f2f1-7ce5-485d-a956-c53b804a6505	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-27 06:16:48.802208+00	
00000000-0000-0000-0000-000000000000	0bb24d22-075a-4f3a-b63c-27ac1fe43df4	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-27 06:16:48.804747+00	
00000000-0000-0000-0000-000000000000	9201f4da-d450-40c0-8b05-986626a54a46	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-27 06:16:48.846378+00	
00000000-0000-0000-0000-000000000000	dd65d9f0-e2df-45f2-83a1-f1dc5a692146	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-27 11:23:03.818022+00	
00000000-0000-0000-0000-000000000000	162bf4df-7dff-4164-97ec-bf941cb8ff90	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-27 11:23:03.848364+00	
00000000-0000-0000-0000-000000000000	9657fbef-015c-4908-b029-e9e5515c3761	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-27 11:23:09.190625+00	
00000000-0000-0000-0000-000000000000	7b8f3f3f-6526-4b59-b4d0-023aa6572f26	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-27 11:23:11.670529+00	
00000000-0000-0000-0000-000000000000	5a99ba92-9a68-4247-9058-1dff1ca8aec7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-28 00:28:57.284376+00	
00000000-0000-0000-0000-000000000000	fde477bf-411b-4187-9c54-f2b0060fe352	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-28 00:28:57.286878+00	
00000000-0000-0000-0000-000000000000	3a549fc4-97db-47e7-9bf4-a110cf5059ac	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-28 00:28:57.325257+00	
00000000-0000-0000-0000-000000000000	209e3b38-d2b6-4b75-9798-eb8b5147cfa1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-28 00:29:51.225478+00	
00000000-0000-0000-0000-000000000000	7317a6d2-e279-4e5d-b43e-85995810b43f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-28 00:29:51.2559+00	
00000000-0000-0000-0000-000000000000	47dbcf4d-4b3f-42e3-92fa-51e707a43771	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-28 00:29:51.487935+00	
00000000-0000-0000-0000-000000000000	b899e2c7-359d-4415-bf3c-ba6c2aa80917	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-28 00:29:51.499936+00	
00000000-0000-0000-0000-000000000000	56b73663-9049-472d-b8ec-18a41e235c78	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-28 06:19:28.439637+00	
00000000-0000-0000-0000-000000000000	082a69d3-9391-4f9b-9a15-1df2718ce877	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-28 06:19:28.444383+00	
00000000-0000-0000-0000-000000000000	c1ac3f10-3794-4bf4-a5ce-5208859659d3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-28 06:19:28.470084+00	
00000000-0000-0000-0000-000000000000	be02ae12-3c78-4352-a35c-451836d426e2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-28 06:19:28.491651+00	
00000000-0000-0000-0000-000000000000	d629e84e-f5bb-4e97-8492-63c357c0cf01	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-28 06:19:29.09899+00	
00000000-0000-0000-0000-000000000000	55195ebd-61b0-4a7d-8584-89e90e70964a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-28 06:19:30.279213+00	
00000000-0000-0000-0000-000000000000	f14c4d45-7660-4992-bd51-ddce3c05b1ca	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-28 06:19:33.675595+00	
00000000-0000-0000-0000-000000000000	f081dc24-1591-41cb-ba57-fd1baad20734	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-29 08:24:43.86626+00	
00000000-0000-0000-0000-000000000000	3eadf8ca-4bc0-47df-aaab-a5f726e5db85	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-29 08:24:43.886359+00	
00000000-0000-0000-0000-000000000000	6998fa51-19c2-4e5a-89a7-9d04c3785628	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 09:47:04.645061+00	
00000000-0000-0000-0000-000000000000	fe755752-a346-4c02-856d-668a02730f97	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 09:47:04.651306+00	
00000000-0000-0000-0000-000000000000	b7f8ad2f-c4a2-4f2e-ab17-bc9b3e4f2832	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 09:47:04.68796+00	
00000000-0000-0000-0000-000000000000	fd7f7fa8-f2c1-40bd-9553-1a2229aa1f58	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 09:47:04.701789+00	
00000000-0000-0000-0000-000000000000	507b90f0-1e71-4b73-b83b-c7fd3faf1add	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 09:47:05.907449+00	
00000000-0000-0000-0000-000000000000	f924d8f9-6347-47ce-b34f-fba257ce10e2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 09:47:06.54789+00	
00000000-0000-0000-0000-000000000000	570af2f7-19f8-4ae7-b936-f87becd898d6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 09:47:10.981224+00	
00000000-0000-0000-0000-000000000000	f6dc4ace-a65d-4d24-9c1c-1b6b5143a686	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 14:50:04.722728+00	
00000000-0000-0000-0000-000000000000	660109cf-a97f-4be0-b68b-8b758ac45dfb	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 14:50:04.725749+00	
00000000-0000-0000-0000-000000000000	83b2b8e1-8eef-4d98-8d6c-644c23cbed32	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 14:50:04.75458+00	
00000000-0000-0000-0000-000000000000	8fd407e9-b51f-47fb-b7d6-e84e3a4b83ef	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 14:50:09.105678+00	
00000000-0000-0000-0000-000000000000	ba33dfb1-79e2-45e8-9cb8-d69a25abeb64	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 14:50:41.780201+00	
00000000-0000-0000-0000-000000000000	fdcb3e86-24a5-48e4-bbde-bec7522d60f6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 15:07:57.468544+00	
00000000-0000-0000-0000-000000000000	34188e2e-5712-4683-97c8-0757470493a0	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 15:07:57.48901+00	
00000000-0000-0000-0000-000000000000	15519b62-808e-4ebf-953c-791245dd8a26	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 15:07:57.688608+00	
00000000-0000-0000-0000-000000000000	cfd86dbe-9479-4c5e-9be1-cfc8c96b7d30	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 15:07:57.795693+00	
00000000-0000-0000-0000-000000000000	4118e408-3478-4e5b-b616-3d3a79ebc2ca	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 15:07:58.155516+00	
00000000-0000-0000-0000-000000000000	d563dab0-ceb6-427f-9125-1aebbc8a52a1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:37:55.578444+00	
00000000-0000-0000-0000-000000000000	f76fb4c0-25c8-449d-b5b0-2220847ffaab	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:37:55.580887+00	
00000000-0000-0000-0000-000000000000	38b00853-a264-4c03-ab72-352a33abb982	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:37:55.607124+00	
00000000-0000-0000-0000-000000000000	be2c31e4-99f1-4b1d-b7d1-c770d97938f9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:39:50.019714+00	
00000000-0000-0000-0000-000000000000	96c20fa5-6588-42b3-8aa5-a40b437d545a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:39:50.290766+00	
00000000-0000-0000-0000-000000000000	eb3e76b8-e97e-4c41-9759-5343872d2251	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:39:50.466429+00	
00000000-0000-0000-0000-000000000000	9d32f799-54e3-40e5-845b-ad492959dd50	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:39:50.746808+00	
00000000-0000-0000-0000-000000000000	e0580837-d231-4e2a-8647-146dfc992c12	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:39:51.022508+00	
00000000-0000-0000-0000-000000000000	65883710-1b9c-49bd-a6c1-61646e382d15	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:39:51.167729+00	
00000000-0000-0000-0000-000000000000	d393cb53-ab5d-4632-bbd4-1cc73a364058	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:03.117769+00	
00000000-0000-0000-0000-000000000000	a57e875d-b4f7-4948-b4f9-34b5e1c3cff0	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:03.128083+00	
00000000-0000-0000-0000-000000000000	a2adc1ac-f726-49be-a6ba-9c813ac8519d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:03.5206+00	
00000000-0000-0000-0000-000000000000	209342e9-045e-4a3e-9ae7-a7305b8175e2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:03.787651+00	
00000000-0000-0000-0000-000000000000	34b73411-8d07-49f7-bc30-fd44bf8a6066	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:04.04499+00	
00000000-0000-0000-0000-000000000000	206b064b-5609-4e68-9409-ff65115208e5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:04.170641+00	
00000000-0000-0000-0000-000000000000	254f03f2-047b-4ee0-971f-ce7a4d7996ea	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:19.062438+00	
00000000-0000-0000-0000-000000000000	caf19e8b-b3b2-4827-868d-1ffe8ab89574	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:19.088789+00	
00000000-0000-0000-0000-000000000000	fab60b23-fe01-4212-b706-bdb9ca1bcca1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:19.433902+00	
00000000-0000-0000-0000-000000000000	8c9dd39a-3fcf-4761-8a55-bb060cac5b71	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:19.765769+00	
00000000-0000-0000-0000-000000000000	faca12d2-7190-4591-9826-e4b6c1ce4f5e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:20.139343+00	
00000000-0000-0000-0000-000000000000	8812f0a3-e357-4535-ae62-08069cfec28e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:20.29112+00	
00000000-0000-0000-0000-000000000000	6da5d0b7-b986-4500-a200-cf91356994b4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:34.508158+00	
00000000-0000-0000-0000-000000000000	f7624857-b31d-4dbe-9944-c8f47d9f69f6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:34.513925+00	
00000000-0000-0000-0000-000000000000	6a5c8ecd-0cc6-4352-a15e-1c19a4de3c29	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:34.867414+00	
00000000-0000-0000-0000-000000000000	e67532f2-4104-440d-9c2e-35e0c9fe8e9b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:35.14512+00	
00000000-0000-0000-0000-000000000000	a5a9f0e3-64ba-4e2c-b9ae-0fb9e17bbfa4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:35.407888+00	
00000000-0000-0000-0000-000000000000	7a0ecbe7-53d5-487d-ba45-dfe6e6fed57b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:35.544935+00	
00000000-0000-0000-0000-000000000000	17327b25-3d22-4de3-b421-e9d49557d1d3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:42.855024+00	
00000000-0000-0000-0000-000000000000	ec5115e5-a08d-4916-9125-6d7c67bc0452	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:42.863145+00	
00000000-0000-0000-0000-000000000000	308c7e0e-dd50-49ee-9559-da2e98590f12	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:43.269481+00	
00000000-0000-0000-0000-000000000000	a6f17e68-ee95-43a3-ab39-2bf52e5fd02a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:43.567509+00	
00000000-0000-0000-0000-000000000000	a73837b1-b244-46ab-bab5-8f100b8a9f9b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:43.85554+00	
00000000-0000-0000-0000-000000000000	9e4a75f1-c3c7-4f27-8d41-574d4e9b67e7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:40:44.017968+00	
00000000-0000-0000-0000-000000000000	b50597d3-78fd-4b9c-bebb-1e7e4e36d4d6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:41:06.825306+00	
00000000-0000-0000-0000-000000000000	75700c40-c2f7-442d-8c19-d65f69741356	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:41:06.84252+00	
00000000-0000-0000-0000-000000000000	8b6d5be6-0e53-462d-9ca0-f3347d650c5b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:41:07.403293+00	
00000000-0000-0000-0000-000000000000	e7c82ce5-9146-4b8d-b5a1-7b2b731acb82	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:41:07.883863+00	
00000000-0000-0000-0000-000000000000	0987e5b6-caed-47eb-972d-3bbcab7615f8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:41:08.437343+00	
00000000-0000-0000-0000-000000000000	ce4f6b4c-aae0-48dc-bef3-1b4ee2d8a5c8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:41:08.727341+00	
00000000-0000-0000-0000-000000000000	8f3562fc-e8ae-4fc8-b1fc-03c85badd1f8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:41:11.551677+00	
00000000-0000-0000-0000-000000000000	bff74720-e35e-4c3a-a17b-212a4b4d2088	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:41:11.572604+00	
00000000-0000-0000-0000-000000000000	f014a4eb-71a7-4744-933d-d3e8e38c11d8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:41:12.325108+00	
00000000-0000-0000-0000-000000000000	5cbea75d-2941-41a8-b7a7-30cadcf4327c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:41:13.029646+00	
00000000-0000-0000-0000-000000000000	7cae52f0-7c5b-469f-96da-a5566aa6d0df	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:41:13.418733+00	
00000000-0000-0000-0000-000000000000	1d710289-4d53-436e-97fe-0c526f2e5a98	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:41:13.596675+00	
00000000-0000-0000-0000-000000000000	4baed9c8-f485-457c-9da2-0b41369ce6aa	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:56:59.964891+00	
00000000-0000-0000-0000-000000000000	700733a1-b31f-4bba-a92a-c6626ec25140	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:56:59.990534+00	
00000000-0000-0000-0000-000000000000	d995788f-d74e-4c97-8bab-284346f6182b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:57:00.434181+00	
00000000-0000-0000-0000-000000000000	381df331-6778-41f6-b04a-72f990b665aa	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:57:00.571332+00	
00000000-0000-0000-0000-000000000000	154b9bff-67a5-4af5-8743-523fdb824544	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:57:00.595091+00	
00000000-0000-0000-0000-000000000000	73d9e5da-aa37-4da8-9a1b-91d463ccbf1e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:57:00.783926+00	
00000000-0000-0000-0000-000000000000	a8a6c93f-eb73-4865-97d1-bccb7098aa17	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:57:01.066757+00	
00000000-0000-0000-0000-000000000000	93719b90-0528-4303-ba61-49f7c7596e82	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:57:01.110518+00	
00000000-0000-0000-0000-000000000000	93bbbcd3-3e42-4c94-9ebe-bc67e1a9a861	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:57:01.184645+00	
00000000-0000-0000-0000-000000000000	d4dda5fb-b577-44d1-9d4d-ac3cad97e33d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:57:01.342666+00	
00000000-0000-0000-0000-000000000000	c793c7c1-ad14-4785-920e-3387435b3c70	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:57:01.620262+00	
00000000-0000-0000-0000-000000000000	7ec7adb2-46a5-4c0a-9ffc-3e82a41b411e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:57:01.750216+00	
00000000-0000-0000-0000-000000000000	2f50e85f-3bbb-4be8-ba06-a14a6dce645b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:57:11.560546+00	
00000000-0000-0000-0000-000000000000	993ce5e9-844c-49f7-8bc1-d3490c1ec403	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:57:11.892605+00	
00000000-0000-0000-0000-000000000000	c4134c5d-71ad-44eb-ac59-cf3a00768509	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:57:21.062354+00	
00000000-0000-0000-0000-000000000000	e653e08f-6bc9-43d9-a432-20898492492d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 22:57:21.342395+00	
00000000-0000-0000-0000-000000000000	8e4361ba-1bdc-4c43-801a-767b3b92b07e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:09:43.001242+00	
00000000-0000-0000-0000-000000000000	6b8712da-f7ae-4a72-8d7c-7f511a6afd28	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:09:43.014562+00	
00000000-0000-0000-0000-000000000000	46b7e0f4-4d78-48be-8383-f2484f9811d3	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:09:43.591168+00	
00000000-0000-0000-0000-000000000000	c5687a70-7001-430f-9e81-26fbe4f70450	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:09:43.853481+00	
00000000-0000-0000-0000-000000000000	f16ab9f9-8753-43ae-9a99-50aa3a65b68c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:09:44.148127+00	
00000000-0000-0000-0000-000000000000	254d776d-2b4f-4ded-94c4-391103eb83fd	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:09:44.279865+00	
00000000-0000-0000-0000-000000000000	1526331a-e51a-4565-bd4a-2a6db8162ebb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:05.491406+00	
00000000-0000-0000-0000-000000000000	ce37879f-1483-41ea-ac8a-ac0ac313631a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:05.502861+00	
00000000-0000-0000-0000-000000000000	0a0ecdbd-1ee4-43ea-bc53-1df2de22e69b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:05.953741+00	
00000000-0000-0000-0000-000000000000	8d89d9b5-c39a-44e3-b666-957d0a22b593	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:06.203318+00	
00000000-0000-0000-0000-000000000000	d7b2b8ef-27fe-4296-9d2a-c95e22f9bc32	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:06.42072+00	
00000000-0000-0000-0000-000000000000	5f0425e4-1193-4c28-b647-7bdbc9d32ebd	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:06.539716+00	
00000000-0000-0000-0000-000000000000	437746a5-b9f2-4c12-9fa5-26ed6014eb77	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:12.008808+00	
00000000-0000-0000-0000-000000000000	90174ec2-9f7e-49c5-bce6-8001bb1e117d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:12.017804+00	
00000000-0000-0000-0000-000000000000	839eebe5-6c78-4c2e-b3a8-8f1a2d3bcff0	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:12.41991+00	
00000000-0000-0000-0000-000000000000	73a73563-d086-4d12-befc-1966cda1a23b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:12.657253+00	
00000000-0000-0000-0000-000000000000	3d56a6a7-7d11-451e-8863-9d5f66820b06	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:13.008312+00	
00000000-0000-0000-0000-000000000000	3272df59-c03b-4d70-b7db-ddc142e7d2e6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:13.132435+00	
00000000-0000-0000-0000-000000000000	6ecb70e4-38d6-48a3-aadf-81966bfb8423	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:14.894253+00	
00000000-0000-0000-0000-000000000000	759e97e6-4362-4591-9e6b-87d15d17f788	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:15.356935+00	
00000000-0000-0000-0000-000000000000	5092c8b4-04a6-4392-89f3-ddc2c43c068a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:18.00867+00	
00000000-0000-0000-0000-000000000000	b2bb9ac9-de53-4f88-bd5a-5a502b830388	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:10:18.323895+00	
00000000-0000-0000-0000-000000000000	70e9b9db-182f-4192-9ceb-57df8ad72404	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:34.572628+00	
00000000-0000-0000-0000-000000000000	713f514c-1acc-4656-abae-fde8f36265ad	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:34.592779+00	
00000000-0000-0000-0000-000000000000	ced4e971-9168-4112-bc99-9e71101418b1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:34.968858+00	
00000000-0000-0000-0000-000000000000	809ab6a5-0349-4707-b1ea-f2eb51b24872	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:35.131329+00	
00000000-0000-0000-0000-000000000000	c3223876-7ead-4b61-8776-e957b6dd77ec	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:36.236232+00	
00000000-0000-0000-0000-000000000000	3f718f2c-0aa0-466e-9eac-e012e67fe4ef	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:36.482799+00	
00000000-0000-0000-0000-000000000000	6a337d36-c82b-48dc-9e77-00870dae06f8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:39.233405+00	
00000000-0000-0000-0000-000000000000	00cbdb55-7da8-4351-8628-64d2021a2666	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:39.269577+00	
00000000-0000-0000-0000-000000000000	14e06f05-e1e0-4b1d-923d-f2c1f5469b58	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:39.557878+00	
00000000-0000-0000-0000-000000000000	386abf75-563a-436d-94f5-efc175c6e737	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:39.676761+00	
00000000-0000-0000-0000-000000000000	2a8359ce-5535-4beb-b2b1-d2e01ef9d98c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:40.740275+00	
00000000-0000-0000-0000-000000000000	74697dc0-f74e-483f-b072-7be78bd052e4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:40.957133+00	
00000000-0000-0000-0000-000000000000	efb26796-d676-4bc7-9c16-be3508212e55	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:43.565353+00	
00000000-0000-0000-0000-000000000000	193032c2-486c-4b61-89c2-bc5e8213d292	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:43.825726+00	
00000000-0000-0000-0000-000000000000	21628a21-a49e-4bd5-8c02-1ff70161a6ae	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:55.789567+00	
00000000-0000-0000-0000-000000000000	c7d68bbc-4b02-403f-b195-0ada15e54513	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:56.202954+00	
00000000-0000-0000-0000-000000000000	d7f6b463-c74c-429b-9cfe-b04851d5263e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:16:56.429072+00	
00000000-0000-0000-0000-000000000000	d61b7237-f42f-4205-8573-b78813bac137	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:17:02.6783+00	
00000000-0000-0000-0000-000000000000	2e66cbd5-f13d-4cc9-a5fd-d4d738610892	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:17:02.822485+00	
00000000-0000-0000-0000-000000000000	8d374e5a-8b60-42c1-9f84-9bb08694f3af	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:17:03.336095+00	
00000000-0000-0000-0000-000000000000	faffee3e-a636-42e7-bfa3-08586e7358c2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:17:03.610521+00	
00000000-0000-0000-0000-000000000000	f93f3fbd-ad5e-4585-baaa-13ff1d029b20	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:17:09.374201+00	
00000000-0000-0000-0000-000000000000	43dcff18-e2ad-46e8-9469-281a41257b0f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:17:09.392545+00	
00000000-0000-0000-0000-000000000000	fe4bc2a7-772f-47d2-a058-6aefd858d154	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:17:09.66569+00	
00000000-0000-0000-0000-000000000000	4f883bbb-a9cc-4779-a47f-950407b93411	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:17:09.797559+00	
00000000-0000-0000-0000-000000000000	642129c1-460b-44ec-b647-83f34ac1ea2b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-30 23:17:10.190657+00	
00000000-0000-0000-0000-000000000000	211a8f2b-d535-468d-86b6-9cf5dbac01f8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 00:15:11.917967+00	
00000000-0000-0000-0000-000000000000	8bf6882d-1ea1-4fa0-940b-4b7da23a6c8c	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 00:15:11.921717+00	
00000000-0000-0000-0000-000000000000	a4fbbc03-67fb-404c-9442-2c296d24699c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 01:13:12.957055+00	
00000000-0000-0000-0000-000000000000	fd69869e-b0c2-4638-b1a5-11e0dd3a3fb2	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 01:13:12.960714+00	
00000000-0000-0000-0000-000000000000	1719d1a8-54db-47b4-a845-904f6a3e4ef6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 02:11:14.051608+00	
00000000-0000-0000-0000-000000000000	470ce78b-c217-43d9-a8d5-f838dc063985	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 02:11:14.056046+00	
00000000-0000-0000-0000-000000000000	89c8ba2f-3efb-46ad-93a9-13d1d0d4f245	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 03:09:18.253179+00	
00000000-0000-0000-0000-000000000000	0f75c870-89bb-4dda-a0cf-f69fdeab2217	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 03:09:18.257116+00	
00000000-0000-0000-0000-000000000000	ca12a93f-0cb3-4c6c-91b6-06792d2011ab	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 04:07:41.385637+00	
00000000-0000-0000-0000-000000000000	e0fab672-28d3-4538-b108-56c3e3ca54f1	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 04:07:41.387645+00	
00000000-0000-0000-0000-000000000000	13e8dabd-fd6c-4fdf-82cc-eebc491bceae	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 06:27:26.38113+00	
00000000-0000-0000-0000-000000000000	813aa0d1-9bb5-4750-9fea-7a85d2ab150f	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 06:27:26.385904+00	
00000000-0000-0000-0000-000000000000	4d776334-d5df-45de-a427-93fcc4fab054	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 06:27:26.426979+00	
00000000-0000-0000-0000-000000000000	99ddbf20-6e69-4700-86d5-55c488f32078	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 07:25:27.761796+00	
00000000-0000-0000-0000-000000000000	dfb61675-afed-485f-ac61-a79f3d11a632	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 07:25:27.765195+00	
00000000-0000-0000-0000-000000000000	4d2e97cb-6df9-4416-a3ed-e7da1726b7e1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 09:50:56.477827+00	
00000000-0000-0000-0000-000000000000	e4395f79-28f7-4f93-9e39-e8c39474285d	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 09:50:56.480927+00	
00000000-0000-0000-0000-000000000000	731ade2a-d9a2-49a1-8406-ff7bfe256cc5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 09:50:56.502942+00	
00000000-0000-0000-0000-000000000000	a67753c2-2cfe-4346-9634-1557e6adf585	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 09:50:56.521819+00	
00000000-0000-0000-0000-000000000000	43559062-4863-4d09-99ab-1923f03b5115	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 09:50:57.199765+00	
00000000-0000-0000-0000-000000000000	b0f571b8-2403-4ab6-8b4e-a4d97b189149	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 09:50:57.833457+00	
00000000-0000-0000-0000-000000000000	b9914eb6-2b20-4f75-bb3b-04b71d1e2c1a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 09:51:01.428975+00	
00000000-0000-0000-0000-000000000000	51c56913-4df7-4ea3-91ef-5b3929bf0ff1	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 10:23:05.34546+00	
00000000-0000-0000-0000-000000000000	f9dbedd1-39c6-4424-975c-cddaf52d4c2f	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 10:23:05.347267+00	
00000000-0000-0000-0000-000000000000	8fa32318-99e7-486f-873d-257c0e677184	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 10:23:05.37174+00	
00000000-0000-0000-0000-000000000000	589232e3-3972-4e5e-8fb3-038f21287897	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 10:23:05.623742+00	
00000000-0000-0000-0000-000000000000	6e2d6ecc-10ff-45a4-b23c-2c5aa424cf70	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 12:47:51.383441+00	
00000000-0000-0000-0000-000000000000	e1092faf-b477-424b-974c-2aa193151499	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 13:46:11.864267+00	
00000000-0000-0000-0000-000000000000	5da8123b-dcd3-4fcc-8de8-e490f5e4c5cf	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 13:46:11.868639+00	
00000000-0000-0000-0000-000000000000	9396b90e-5529-4f7b-8a60-850dc6b2b5e6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 14:44:12.816147+00	
00000000-0000-0000-0000-000000000000	f0c1606b-3436-4867-9ce2-353740298dc8	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 14:44:12.818768+00	
00000000-0000-0000-0000-000000000000	979b74ef-a23f-4581-b15d-4e8412d91f6b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 15:42:31.748262+00	
00000000-0000-0000-0000-000000000000	0d632404-d481-4f87-b51b-af2c1862933c	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 15:42:31.750886+00	
00000000-0000-0000-0000-000000000000	3711615c-c8e0-4649-a78e-a32c564b4e9f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 22:38:07.889736+00	
00000000-0000-0000-0000-000000000000	47c29e38-0e8c-4123-9c03-bd85e6296ec1	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 22:38:07.892109+00	
00000000-0000-0000-0000-000000000000	3e21caab-a81f-4297-8f56-68baee91db11	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 22:59:21.407694+00	
00000000-0000-0000-0000-000000000000	dbea4df5-ae7a-49d6-b52d-f130706ccc29	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-10-31 22:59:21.41141+00	
00000000-0000-0000-0000-000000000000	6abf6420-4446-4ee0-85d2-bce27bdb2556	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-01 01:24:33.82982+00	
00000000-0000-0000-0000-000000000000	643857c8-756c-4b2a-b702-b52eb771de47	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-01 01:24:33.834463+00	
00000000-0000-0000-0000-000000000000	2aff89ea-6932-4864-85f5-54fd1934f149	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-01 01:24:33.873269+00	
00000000-0000-0000-0000-000000000000	2ee6e035-8be9-41a3-8e8f-156f6e36fd94	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-01 01:24:33.894791+00	
00000000-0000-0000-0000-000000000000	4fa7abd9-2ebc-4360-9290-c17f85c66004	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-01 01:24:34.521864+00	
00000000-0000-0000-0000-000000000000	cd502581-5048-4afa-a9f7-212600b5e2c2	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-01 01:24:35.149854+00	
00000000-0000-0000-0000-000000000000	b1f08f47-0852-4f36-af66-6ca6e9783ef8	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-01 10:00:11.121135+00	
00000000-0000-0000-0000-000000000000	87df3fad-797d-44b2-a1da-3871fa0104fe	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-01 10:00:11.139943+00	
00000000-0000-0000-0000-000000000000	04c9eb1a-70ee-4f08-8ff2-73e1f50f0982	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-01 10:00:11.16135+00	
00000000-0000-0000-0000-000000000000	048216e9-4439-4922-a4c5-cf7db5f597fe	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-01 10:00:12.368719+00	
00000000-0000-0000-0000-000000000000	6eb051b7-0941-41e0-a52c-eb52ab81c473	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-01 10:00:12.98288+00	
00000000-0000-0000-0000-000000000000	6ebca49f-3880-4798-846c-e13e952dbfed	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-01 10:00:16.248271+00	
00000000-0000-0000-0000-000000000000	16f92492-4654-424c-b2ba-1e9199b36b82	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-01 11:49:35.70365+00	
00000000-0000-0000-0000-000000000000	2eeded97-60fa-4378-b5ef-c85ad2664100	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-01 11:49:35.706853+00	
00000000-0000-0000-0000-000000000000	e4fd05fe-12fd-48c3-bd24-f839fb297778	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-02 12:22:21.552028+00	
00000000-0000-0000-0000-000000000000	7ccf32c5-cf76-4c29-b042-8de52a04e963	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-02 12:22:21.567883+00	
00000000-0000-0000-0000-000000000000	ff0dfcb4-ff33-47e9-b8a0-2a6b087ed43e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-02 12:22:26.618121+00	
00000000-0000-0000-0000-000000000000	d118ec4f-01a2-4386-8ce8-d47fade9fd49	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-02 12:22:27.394475+00	
00000000-0000-0000-0000-000000000000	a08446dc-42bd-48ee-9183-5e9475091ebd	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-02 12:26:11.823131+00	
00000000-0000-0000-0000-000000000000	f0d6eddc-f49a-4bc2-8152-8d5f0aada201	{"action":"logout","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-11-02 12:26:11.924293+00	
00000000-0000-0000-0000-000000000000	cea76961-5e46-4dcd-9fde-1b677a4dd6ef	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-11-02 23:49:33.310211+00	
00000000-0000-0000-0000-000000000000	6a55d651-6044-437b-af4b-6595e5f75d86	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-11-02 23:49:58.021977+00	
00000000-0000-0000-0000-000000000000	138085ba-9915-448e-b83c-a31460c0d9c8	{"action":"user_recovery_requested","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"user"}	2025-11-03 08:42:36.231132+00	
00000000-0000-0000-0000-000000000000	db99e919-392f-4a83-9477-dac922077907	{"action":"login","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"account"}	2025-11-03 08:42:58.177542+00	
00000000-0000-0000-0000-000000000000	d9756676-995a-4fd1-871f-5462e44c6f91	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:23.631943+00	
00000000-0000-0000-0000-000000000000	dbd239fc-07b9-4a2f-bf70-cb53a82de4bc	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:23.63538+00	
00000000-0000-0000-0000-000000000000	90b651c7-19fa-4cbe-b5ff-e13ac193a8a5	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:33.18216+00	
00000000-0000-0000-0000-000000000000	3086024d-7c82-49ce-890c-6244165ce287	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:33.194248+00	
00000000-0000-0000-0000-000000000000	66e77781-e572-49c1-9881-74c8f211cbd4	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:34.768007+00	
00000000-0000-0000-0000-000000000000	faeb36f4-e292-4c4c-ae76-1b9ab728597a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:35.980827+00	
00000000-0000-0000-0000-000000000000	fd849ed2-7f28-48c2-99b6-203d92161916	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:37.179208+00	
00000000-0000-0000-0000-000000000000	4b754ae9-3e5d-4f91-af4e-18c1ae79f158	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:38.372006+00	
00000000-0000-0000-0000-000000000000	b3f4f568-d9c8-4b57-9a48-76adbb09b435	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:39.562494+00	
00000000-0000-0000-0000-000000000000	96f84258-43c2-44aa-801c-717130e1e024	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:43.73002+00	
00000000-0000-0000-0000-000000000000	30453216-62a9-482a-bdfc-bd2d949b4836	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:45.236939+00	
00000000-0000-0000-0000-000000000000	e22144f9-9fdf-41ad-9232-b8dabcecaff6	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:46.417823+00	
00000000-0000-0000-0000-000000000000	5605a1c2-b8ed-4835-905d-d0da86a0e269	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:47.602108+00	
00000000-0000-0000-0000-000000000000	6d3693af-b732-4a72-9671-a538077f2f87	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:48.786409+00	
00000000-0000-0000-0000-000000000000	d534529e-ff1b-42a4-9c30-4607b6a4651e	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:49.975738+00	
00000000-0000-0000-0000-000000000000	87bfbd87-ecaf-4786-9172-937553b9f71d	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:50.666464+00	
00000000-0000-0000-0000-000000000000	534362e8-f57b-41c7-9f3f-99c720aba8ba	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 14:05:52.707562+00	
00000000-0000-0000-0000-000000000000	f7987897-173f-44b3-a457-6e82756964e9	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 15:44:24.852899+00	
00000000-0000-0000-0000-000000000000	c753e0b8-31c6-4d9e-92a0-6cbfbc098fba	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 15:44:24.855333+00	
00000000-0000-0000-0000-000000000000	7581a2db-25e3-4bdd-8cbf-aa0f12ff66f7	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 23:02:11.311064+00	
00000000-0000-0000-0000-000000000000	61948fdc-3b01-442b-89a0-3d329fa10218	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 23:02:11.314891+00	
00000000-0000-0000-0000-000000000000	59949dda-64c4-4a04-a6a3-352f01cc303f	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 23:02:11.330943+00	
00000000-0000-0000-0000-000000000000	727feaf8-ae40-43b8-880e-e79f9d3ce3cb	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 23:02:11.35176+00	
00000000-0000-0000-0000-000000000000	b0c9a716-2e75-468a-abf9-4ffccfa8822c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 23:02:11.951619+00	
00000000-0000-0000-0000-000000000000	969818a4-1b57-4a4f-828d-86c3429c6054	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 23:02:13.108142+00	
00000000-0000-0000-0000-000000000000	15808328-47ad-45fd-82ab-42a17c5e655a	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-03 23:02:20.127047+00	
00000000-0000-0000-0000-000000000000	c51484f4-f3cc-45b7-99c3-59a481e1e86c	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-04 00:44:07.585794+00	
00000000-0000-0000-0000-000000000000	3aaae7d5-a095-4b8c-8430-e615aa558a81	{"action":"token_revoked","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-04 00:44:07.589549+00	
00000000-0000-0000-0000-000000000000	9888a80d-c34f-4865-a808-3f71bd59541b	{"action":"token_refreshed","actor_id":"29bd5153-a7df-428e-a47b-449a13462da8","actor_username":"richard@haddads.net.au","actor_via_sso":false,"log_type":"token"}	2025-11-04 00:44:17.915086+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
08132f4a-0148-4080-abbb-92e94ee4f5b8	29bd5153-a7df-428e-a47b-449a13462da8	1881b9ac-84ea-4cfd-b6fe-fb11fb6e4341	s256	23mZgFDnDcIVclsrCw0RxS_pbQUpsORCOI4fdEFk764	magiclink			2025-03-29 07:19:07.461018+00	2025-03-29 07:19:07.461018+00	magiclink	\N
484136d0-83d7-4797-a366-e6fa47935fd5	29bd5153-a7df-428e-a47b-449a13462da8	ac0b8a93-093b-4f7c-bec7-46b2287c181d	s256	0mCJD5LLmKPAfMqnDTZrSOmb5s3r4WO3A7sQNtcnOrE	magiclink			2025-03-29 07:39:06.327774+00	2025-03-29 07:39:06.327774+00	magiclink	\N
4d23ad4d-9561-43f6-9da5-5b3414ee6426	29bd5153-a7df-428e-a47b-449a13462da8	b2c78484-e3ce-4c65-9aa7-609dc0ce1502	s256	8wI7KscmcCufn9R7wHDp5XzAXmlsaHP2yj1Kpn9FPqo	magiclink			2025-03-29 11:42:20.186134+00	2025-03-29 11:42:20.186134+00	magiclink	\N
1e2dfce4-8e5f-46f6-b4c6-acaeef855902	29bd5153-a7df-428e-a47b-449a13462da8	a79dc6c7-004c-4583-8b1e-ff8d33f67fdd	s256	fkoPbmekPeloggrEiqUwc6QDlsuZv5mUpckh1URuy8o	magiclink			2025-03-29 11:52:50.537647+00	2025-03-29 11:52:50.537647+00	magiclink	\N
e9b46969-a241-4616-a610-9fb8491e7fa7	29bd5153-a7df-428e-a47b-449a13462da8	9346e43a-98fe-4c34-937d-08606921bd70	s256	T0j6tbayniLsLXuV_suKLgvf9hY0VU1VMcPGdb4oMaI	magiclink			2025-03-29 11:55:44.344043+00	2025-03-29 11:55:44.344043+00	magiclink	\N
95c38c30-b0e9-48f1-8bab-40ea4c15a102	29bd5153-a7df-428e-a47b-449a13462da8	454a8a22-4c0c-41f2-9526-616b99d3e8a8	s256	U7RB_h4D-3WeANIQSK4jebUfLXxM-YCeEikwleVZ_tU	magiclink			2025-03-30 05:07:41.458851+00	2025-03-30 05:07:41.458851+00	magiclink	\N
70c3542b-5e29-4837-8cce-1e0a069bf6d0	29bd5153-a7df-428e-a47b-449a13462da8	9e2177a2-b2b6-4571-bd02-1f2c41138470	s256	j2ysgSU0xhDXuhHUsELqv97uBpLXr-RGeBg0PZYki80	magiclink			2025-03-30 06:00:58.66528+00	2025-03-30 06:00:58.66528+00	magiclink	\N
3f902c94-375e-4f66-a617-32745420fff0	2955c32a-54b5-4f52-a473-9e8fdbbde21d	74359728-89cf-419a-bdcd-295eccc06812	s256	OTP2ObnV1mTH28lWOXbgrO_2K_pZuRsmCjs2Hwt3JvQ	magiclink			2025-03-30 11:15:08.454077+00	2025-03-30 11:15:08.454077+00	magiclink	\N
119791fa-d577-411e-be2a-f2d4103ef62d	2955c32a-54b5-4f52-a473-9e8fdbbde21d	117967a9-eee3-4322-a10c-d8204264475e	s256	t2xMZnnEiBxIRLnuOuhGpbzZe-OlbMyn9RshwnsVMS4	magiclink			2025-03-30 11:27:53.078827+00	2025-03-30 11:27:53.078827+00	magiclink	\N
6ab61fdc-9a66-4b34-a45e-29571842b488	2955c32a-54b5-4f52-a473-9e8fdbbde21d	bbf37315-6b24-4907-886f-09e6469d2dca	s256	qElLeBGA-OBS1HT2KiOGXIh0A-fbGYpDTn5r0PgK0qw	magiclink			2025-03-30 11:32:00.620317+00	2025-03-30 11:32:00.620317+00	magiclink	\N
68472cc0-7d8f-446e-b7d1-0b54b9e1ef22	29bd5153-a7df-428e-a47b-449a13462da8	d2b367ed-3819-4899-996b-f27d8de2622e	s256	qI6Z1J1kzYP4jp8AJ4pNwCXVjCz1jpeLlJf9lHI2svs	magiclink			2025-03-30 13:15:44.871315+00	2025-03-30 13:15:44.871315+00	magiclink	\N
951cd4ee-e214-484a-8b88-a84e56d0f0fb	2955c32a-54b5-4f52-a473-9e8fdbbde21d	458cb2f8-ccf3-4939-b3b0-bde0252e7f9c	s256	zcUkft2BasikhlVN3rj8aAZlL8zHYJc462Z_cwwas14	magiclink			2025-03-30 13:19:55.242893+00	2025-03-30 13:19:55.242893+00	magiclink	\N
fb42eea0-4b2e-4f31-a447-1f7d0823ed5c	8d4988f6-3593-4a1d-b835-7d25b58314f0	cfa88e4b-8416-4eb7-bee2-ac57cb1d453b	s256	GGrdxf6-QOsqy80Mhfjc9V3ctGx0J55hTddD-kWV96c	magiclink			2025-03-30 13:27:46.707045+00	2025-03-30 13:27:46.707045+00	magiclink	\N
261498b5-13e1-400f-8fbc-a5ebb3f48ff5	2955c32a-54b5-4f52-a473-9e8fdbbde21d	ad41b974-a8a6-470a-94f3-0b67416b7871	s256	RCI-IwxhTG1YZvSPvYap3XB7pnOW4tqUPgaHi2u7Pbs	magiclink			2025-03-30 13:28:09.995+00	2025-03-30 13:28:09.995+00	magiclink	\N
a5e352ff-443f-4bd6-93a3-a34cd1ec7b1c	2955c32a-54b5-4f52-a473-9e8fdbbde21d	26cf0a22-7e3e-4450-a1cb-ce0f40951afe	s256	Wx7O9uotEFCkjYOzWW6yeMBLHGyi64FhJnhwbzihYm4	magiclink			2025-03-30 13:35:40.227066+00	2025-03-30 13:35:40.227066+00	magiclink	\N
4c2aa29c-e85e-4f03-a5d8-20b26676e760	29bd5153-a7df-428e-a47b-449a13462da8	d192e8b7-929e-4706-9bdb-af10634904bd	s256	kZgXPFOxHf4M7NDFlwxDqDmRXbc26zq9O_gklvKkhsk	magiclink			2025-03-31 06:35:40.411475+00	2025-03-31 06:35:40.411475+00	magiclink	\N
90e8decf-cecd-464f-a418-7c8eae228300	3e9e5cdc-8387-4fb3-b1c3-866d24551cfe	ad6f46d1-5cc1-4302-bc7a-efe41ad03d0e	s256	EYoR1_LiusHmPX5PuVNavIztFHqEkRXn0KNLyZ_14-E	magiclink			2025-03-31 23:47:57.206736+00	2025-03-31 23:47:57.206736+00	magiclink	\N
fb11746a-c35f-42ab-89ea-a0805df3553f	29bd5153-a7df-428e-a47b-449a13462da8	89a751d4-25a1-4aa9-a74e-259ec8699ddb	s256	bsfWhivXXa7BhB7itgg_Hycwe4sqFfOsGPR0HZeI5sM	magiclink			2025-04-03 08:27:33.674267+00	2025-04-03 08:27:33.674267+00	magiclink	\N
9dcce9ff-1138-4e0e-99bc-2073f2adec55	29bd5153-a7df-428e-a47b-449a13462da8	b0ced73c-6b68-405d-916b-342c375f8871	s256	40oRL8_i2o2kklhdhjyQvupzwD0ilAq0rviik7eyqhg	magiclink			2025-04-03 15:54:19.015318+00	2025-04-03 15:54:19.015318+00	magiclink	\N
317ed089-7e1f-4e42-aa8d-97993b36d1ba	29bd5153-a7df-428e-a47b-449a13462da8	53c67034-cb12-4042-a0aa-cfb57929a7c8	s256	VgmymtsWeZSsMZTromA4JSIE5xn3YqgiKBYrCrgVwmQ	magiclink			2025-04-12 09:03:16.894205+00	2025-04-12 09:03:16.894205+00	magiclink	\N
212a0faf-2f6a-4279-9c4b-580dad1d889f	29bd5153-a7df-428e-a47b-449a13462da8	2de81e85-a411-4d96-9d60-d96ffa9dabb9	s256	ceX35emyiMO6NiFtYJ8_sz_VjrOc9Qq-WVWCQvw6Ook	magiclink			2025-04-12 09:03:24.355911+00	2025-04-12 09:03:24.355911+00	magiclink	\N
017ce5e5-4533-4e1d-8452-8e9555549acb	29bd5153-a7df-428e-a47b-449a13462da8	7dfb44a4-8ada-4b14-958b-5ab109bc5e80	s256	Chcy9cD38gsbjRmKvZtX7Q_HpqcC4B_AqyKv0rBbEBs	magiclink			2025-04-12 09:08:23.706925+00	2025-04-12 09:08:23.706925+00	magiclink	\N
2f897b6a-b5f2-4644-bfab-8120b025e2ff	29bd5153-a7df-428e-a47b-449a13462da8	41b947de-6d59-41e6-bee9-7e831bbc388f	s256	ye_ofhqV5KePI_YWDOnk51xak4uVYQeZKaNYujS72lQ	magiclink			2025-04-24 02:11:51.077909+00	2025-04-24 02:11:51.077909+00	magiclink	\N
8498cf60-1ff1-40a8-a5d5-2d3898d43116	29bd5153-a7df-428e-a47b-449a13462da8	634b27e0-f10c-49c0-95fe-000784bfcb07	s256	xlMQ5F3uCoR_4DHqCOP4exOMl_U3iF43LxhP9lba9Gs	magiclink			2025-04-24 02:15:10.122007+00	2025-04-24 02:15:10.122007+00	magiclink	\N
f878a84a-9b81-4ccf-88b0-55771366379b	29bd5153-a7df-428e-a47b-449a13462da8	a1333d23-3452-482c-8679-c255c9a1933a	s256	dkNnEXs99YAe7MPZymw18O8HuwbNKkYNLfz4F-Uf70E	magiclink			2025-05-12 10:43:57.689406+00	2025-05-12 10:43:57.689406+00	magiclink	\N
6ce6dc91-1d22-41a9-beba-e935a5b79751	8e552a4c-da01-402d-afca-ef07a989b933	fd7f0340-9b97-4755-8a20-5a5a760e96e0	s256	aQcOeSujzXQWCjHAs-XAfIig1iWfCZ7Yd8sELSycZRk	magiclink			2025-05-12 10:46:53.774105+00	2025-05-12 10:46:53.774105+00	magiclink	\N
fa819451-f11f-4661-b527-26ca11538531	29bd5153-a7df-428e-a47b-449a13462da8	9b16e13f-eab2-449b-a56c-50cb243f9116	s256	g5osD6UWNV0oU_-f567wj6boG1pZrNztb0O7VzQBz6c	magiclink			2025-06-24 04:13:09.439222+00	2025-06-24 04:13:09.439222+00	magiclink	\N
5791f13f-6efd-4c2d-8b4d-7b3ac25c7096	29bd5153-a7df-428e-a47b-449a13462da8	372b2052-11f9-407b-9dc0-08cc69e9833c	s256	hss6y8gobhK18Qq4_elPDI4R6wIm2it3MvV97a6Eznc	magiclink			2025-07-22 00:25:33.142933+00	2025-07-22 00:25:33.142933+00	magiclink	\N
d4a46b2a-26b5-4653-99ea-750ce6b31a24	29bd5153-a7df-428e-a47b-449a13462da8	c277ffb6-9eaf-427f-b5fd-6941ce9bb9fe	s256	qLw8ULVakOHhwhmIy5uEDChPUv2xLK9e_QO0_rBqAtQ	magiclink			2025-07-22 01:13:39.935597+00	2025-07-22 01:13:39.935597+00	magiclink	\N
4da85148-2255-4d8c-85af-de14f10958f2	29bd5153-a7df-428e-a47b-449a13462da8	f3d11677-4115-4f2e-99f9-c61fb9ae9eeb	s256	6vHvKh036k5XqAIpRVUCDpVn09fH7i3mVg0s7oUkmmw	magiclink			2025-09-12 06:19:25.095379+00	2025-09-12 06:19:25.095379+00	magiclink	\N
03155567-926c-4753-aef5-8ad3e472b0f8	2c14713b-a581-4614-812c-e2ea5b3e2835	0cdf35bf-4fce-4aa2-bfa9-4c3bbb774988	s256	PGou8gyBQGviJzyyqe06bC6m_kuGxIwiS-CVKVvEuq4	magiclink			2025-09-20 00:57:03.73148+00	2025-09-20 00:57:03.73148+00	magiclink	\N
0d7d0c21-2bf5-4e28-9c4c-af4a81581c88	29bd5153-a7df-428e-a47b-449a13462da8	ca6a2791-af06-4dd9-8709-405e7e0b1bbc	s256	mEB1GzBCvwoC7l95e8YQidHQmrFWtP79eTB5_4191rM	magiclink			2025-10-13 00:23:20.006516+00	2025-10-13 00:23:20.006516+00	magiclink	\N
5b54cda9-4960-45ee-a947-477e8fccf3ec	29bd5153-a7df-428e-a47b-449a13462da8	b65939fd-6dc3-4e24-9b33-126f66869101	s256	BC_0Yh6FFDOq4mqIQPhBpkfewzrTKFogalHuoD1Lwoo	magiclink			2025-10-22 11:24:42.968391+00	2025-10-22 11:24:42.968391+00	magiclink	\N
87c5e07b-6190-48ca-bc5d-22f975bd813e	29bd5153-a7df-428e-a47b-449a13462da8	18161372-5509-4f45-be39-959113a5e4b1	s256	_Uf_UhDWEr7ESy7MDyV4xJdJGx8RaGYW3f4Q88Sndwc	magiclink			2025-10-22 11:26:45.071129+00	2025-10-22 11:26:45.071129+00	magiclink	\N
346e9019-8ec8-4c74-af46-523187492347	29bd5153-a7df-428e-a47b-449a13462da8	b64915a4-0d5b-44ca-ab66-9565eee7622b	s256	uSFHAj8MCuDJV4ZVPxW0PjxNTip-Z28zcQpS6wXF7ME	magiclink			2025-10-24 00:03:07.948513+00	2025-10-24 00:03:07.948513+00	magiclink	\N
e534ca40-61cd-40d2-8e31-56d397387453	29bd5153-a7df-428e-a47b-449a13462da8	1b437557-927d-4907-be2c-2603004f48d3	s256	0tuEyXefNGwcqQoLc7K9RoanxzXGV3BH0XS-r5tZdBI	magiclink			2025-10-26 05:18:41.91437+00	2025-10-26 05:18:41.91437+00	magiclink	\N
e7df8928-4dd8-40af-be7d-c58cbaef910d	29bd5153-a7df-428e-a47b-449a13462da8	e8cffec3-d0a4-4f37-a3c2-e5024ea81e2c	s256	D4Ui52N7i6t3iix9XCP_h5lP-kbQovusb1meUrGseag	magiclink			2025-11-02 23:49:33.301425+00	2025-11-02 23:49:33.301425+00	magiclink	\N
905f3830-d14c-42fe-888e-68a471c6b674	29bd5153-a7df-428e-a47b-449a13462da8	419e1eb4-1788-40ff-91d8-2bd1c9c50008	s256	EockL8Ywrr3z-WQxI9q-HRL2SYIG9Dn4qTzLObCzWJA	magiclink			2025-11-03 08:42:36.22052+00	2025-11-03 08:42:36.22052+00	magiclink	\N
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
29bd5153-a7df-428e-a47b-449a13462da8	29bd5153-a7df-428e-a47b-449a13462da8	{"sub": "29bd5153-a7df-428e-a47b-449a13462da8", "email": "richard@haddads.net.au", "email_verified": false, "phone_verified": false}	email	2025-03-29 07:19:07.421324+00	2025-03-29 07:19:07.421372+00	2025-03-29 07:19:07.421372+00	d6cb3fe2-0e57-4b27-9f6e-cecccb400fa1
2955c32a-54b5-4f52-a473-9e8fdbbde21d	2955c32a-54b5-4f52-a473-9e8fdbbde21d	{"sub": "2955c32a-54b5-4f52-a473-9e8fdbbde21d", "email": "rk.belton@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-03-30 11:15:08.427557+00	2025-03-30 11:15:08.427624+00	2025-03-30 11:15:08.427624+00	7ad9d8ec-aaa1-4b3e-ae3c-3de520421d2a
8d4988f6-3593-4a1d-b835-7d25b58314f0	8d4988f6-3593-4a1d-b835-7d25b58314f0	{"sub": "8d4988f6-3593-4a1d-b835-7d25b58314f0", "email": "rk.belton@gmail.co", "email_verified": false, "phone_verified": false}	email	2025-03-30 13:27:46.68637+00	2025-03-30 13:27:46.686442+00	2025-03-30 13:27:46.686442+00	fe381043-d4f6-420a-9f5b-12a96c892b22
3e9e5cdc-8387-4fb3-b1c3-866d24551cfe	3e9e5cdc-8387-4fb3-b1c3-866d24551cfe	{"sub": "3e9e5cdc-8387-4fb3-b1c3-866d24551cfe", "email": "william@haddads.net.au", "email_verified": false, "phone_verified": false}	email	2025-03-31 23:47:57.185437+00	2025-03-31 23:47:57.185517+00	2025-03-31 23:47:57.185517+00	c8df7684-1e53-4f88-9046-36df76ebae02
8e552a4c-da01-402d-afca-ef07a989b933	8e552a4c-da01-402d-afca-ef07a989b933	{"sub": "8e552a4c-da01-402d-afca-ef07a989b933", "email": "thecobra@ironcobra.net", "email_verified": false, "phone_verified": false}	email	2025-05-12 10:46:53.752232+00	2025-05-12 10:46:53.752291+00	2025-05-12 10:46:53.752291+00	f3860de1-a181-4fa4-bcd7-6fd6c9833f99
2c14713b-a581-4614-812c-e2ea5b3e2835	2c14713b-a581-4614-812c-e2ea5b3e2835	{"sub": "2c14713b-a581-4614-812c-e2ea5b3e2835", "email": "mandy@ironcobra.net", "email_verified": false, "phone_verified": false}	email	2025-09-20 00:57:03.655977+00	2025-09-20 00:57:03.656037+00	2025-09-20 00:57:03.656037+00	fb4c3420-62ca-428b-af0c-ffe3ec275d4b
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
4985b5dc-a1ff-4bc2-acc5-0a03a01991be	2025-03-30 13:27:46.70173+00	2025-03-30 13:27:46.70173+00	password	a44c37b3-ac12-478a-b28b-49d25e3f1563
9dae8e0e-8077-47a1-bffb-d73ceaafe585	2025-03-30 13:36:20.611688+00	2025-03-30 13:36:20.611688+00	otp	5e1d9746-bc34-4ad1-8ca3-0307c2e05e84
dc10f3bb-6b00-4e89-a527-953447b1c312	2025-03-31 23:47:57.200973+00	2025-03-31 23:47:57.200973+00	password	0f6f4ac1-a123-4ed6-b471-7076fb4e1ff0
1baee01d-b613-4fc3-ac31-b1c9e1a8267f	2025-03-31 23:48:41.710288+00	2025-03-31 23:48:41.710288+00	otp	7c9cfda5-76d1-4559-b5ae-a436485a269f
83be6450-1d82-4168-85ec-7d1d0af2d595	2025-05-12 10:46:53.766121+00	2025-05-12 10:46:53.766121+00	password	5ac13d7a-a56b-4efb-a8ee-a80368198bf8
8f27c6f5-f4ed-4db2-93ca-55b7b0e4d9f7	2025-05-12 10:47:43.89277+00	2025-05-12 10:47:43.89277+00	otp	34fae69e-54a6-471d-adb0-72f5e3bdd6e3
6a9e13df-3cf9-4467-8741-29756b530894	2025-09-20 00:57:03.713312+00	2025-09-20 00:57:03.713312+00	password	808c0b69-7a9e-47fc-97af-396b46c3115b
c5db7975-61ba-4bcb-8ff7-dccb027158c7	2025-09-20 00:57:42.147965+00	2025-09-20 00:57:42.147965+00	otp	ba2a04f5-bb54-40ae-bb52-06ae82755656
0eaec7ce-a408-4f9a-ae79-14ff6f2bffb3	2025-11-02 23:49:58.036628+00	2025-11-02 23:49:58.036628+00	otp	da7fe142-0cfa-4949-ae4c-bbafaa46fbfa
17381775-cc4e-4c78-83d7-c1605b03c171	2025-11-03 08:42:58.193088+00	2025-11-03 08:42:58.193088+00	otp	d32a6159-335c-4707-90fa-ef0fa4ef0e55
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
9487529d-58e3-475d-87af-7b94d449fe1f	8d4988f6-3593-4a1d-b835-7d25b58314f0	recovery_token	pkce_014dabf556623e2d729d3a48383a2fd49e5630afd70e5dbe03128aa4	rk.belton@gmail.co	2025-03-30 13:27:51.130822	2025-03-30 13:27:51.130822
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	252	hrdtmpg3srtz	29bd5153-a7df-428e-a47b-449a13462da8	t	2025-11-02 23:49:58.033737+00	2025-11-03 14:05:23.636063+00	\N	0eaec7ce-a408-4f9a-ae79-14ff6f2bffb3
00000000-0000-0000-0000-000000000000	254	nvyv4cwsmjlu	29bd5153-a7df-428e-a47b-449a13462da8	t	2025-11-03 14:05:23.638301+00	2025-11-03 15:44:24.856722+00	hrdtmpg3srtz	0eaec7ce-a408-4f9a-ae79-14ff6f2bffb3
00000000-0000-0000-0000-000000000000	28	0HpjtR3r4uIg2Eu9Adyhjw	2955c32a-54b5-4f52-a473-9e8fdbbde21d	t	2025-03-31 11:03:03.717419+00	2025-04-04 06:46:27.754316+00	0aMBX7g43U1LFAzRCWDZkQ	9dae8e0e-8077-47a1-bffb-d73ceaafe585
00000000-0000-0000-0000-000000000000	53	R1IM3V330BkfpATUt4PmDw	2955c32a-54b5-4f52-a473-9e8fdbbde21d	f	2025-04-04 06:46:27.755055+00	2025-04-04 06:46:27.755055+00	0HpjtR3r4uIg2Eu9Adyhjw	9dae8e0e-8077-47a1-bffb-d73ceaafe585
00000000-0000-0000-0000-000000000000	256	qhox2cruyqgy	29bd5153-a7df-428e-a47b-449a13462da8	t	2025-11-03 23:02:11.318541+00	2025-11-04 03:28:32.468958+00	tbhhxvkbuzoz	0eaec7ce-a408-4f9a-ae79-14ff6f2bffb3
00000000-0000-0000-0000-000000000000	258	4rc3topu4y66	29bd5153-a7df-428e-a47b-449a13462da8	f	2025-11-04 03:28:32.469701+00	2025-11-04 03:28:32.469701+00	qhox2cruyqgy	0eaec7ce-a408-4f9a-ae79-14ff6f2bffb3
00000000-0000-0000-0000-000000000000	81	rxgegaajtjty	8e552a4c-da01-402d-afca-ef07a989b933	f	2025-05-12 10:46:53.763713+00	2025-05-12 10:46:53.763713+00	\N	83be6450-1d82-4168-85ec-7d1d0af2d595
00000000-0000-0000-0000-000000000000	82	3yabp4rsvhd7	8e552a4c-da01-402d-afca-ef07a989b933	t	2025-05-12 10:47:43.891037+00	2025-05-12 11:49:38.369165+00	\N	8f27c6f5-f4ed-4db2-93ca-55b7b0e4d9f7
00000000-0000-0000-0000-000000000000	21	B1_AGfoamzZWdtrs8hhsow	8d4988f6-3593-4a1d-b835-7d25b58314f0	f	2025-03-30 13:27:46.698209+00	2025-03-30 13:27:46.698209+00	\N	4985b5dc-a1ff-4bc2-acc5-0a03a01991be
00000000-0000-0000-0000-000000000000	83	3wojlxw56bvv	8e552a4c-da01-402d-afca-ef07a989b933	t	2025-05-12 11:49:38.370512+00	2025-05-21 12:33:29.228462+00	3yabp4rsvhd7	8f27c6f5-f4ed-4db2-93ca-55b7b0e4d9f7
00000000-0000-0000-0000-000000000000	94	6ognov7zlilo	8e552a4c-da01-402d-afca-ef07a989b933	f	2025-05-21 12:33:29.230386+00	2025-05-21 12:33:29.230386+00	3wojlxw56bvv	8f27c6f5-f4ed-4db2-93ca-55b7b0e4d9f7
00000000-0000-0000-0000-000000000000	22	0aMBX7g43U1LFAzRCWDZkQ	2955c32a-54b5-4f52-a473-9e8fdbbde21d	t	2025-03-30 13:36:20.607221+00	2025-03-31 11:03:03.711175+00	\N	9dae8e0e-8077-47a1-bffb-d73ceaafe585
00000000-0000-0000-0000-000000000000	30	7GDvGICNr5L3Ur5zGXGSEA	3e9e5cdc-8387-4fb3-b1c3-866d24551cfe	f	2025-03-31 23:47:57.199781+00	2025-03-31 23:47:57.199781+00	\N	dc10f3bb-6b00-4e89-a527-953447b1c312
00000000-0000-0000-0000-000000000000	31	6e6OddGIbIaUucg48PFUbA	3e9e5cdc-8387-4fb3-b1c3-866d24551cfe	f	2025-03-31 23:48:41.708079+00	2025-03-31 23:48:41.708079+00	\N	1baee01d-b613-4fc3-ac31-b1c9e1a8267f
00000000-0000-0000-0000-000000000000	255	tbhhxvkbuzoz	29bd5153-a7df-428e-a47b-449a13462da8	t	2025-11-03 15:44:24.858813+00	2025-11-03 23:02:11.316393+00	nvyv4cwsmjlu	0eaec7ce-a408-4f9a-ae79-14ff6f2bffb3
00000000-0000-0000-0000-000000000000	253	uhmjb3m5cy5u	29bd5153-a7df-428e-a47b-449a13462da8	t	2025-11-03 08:42:58.189455+00	2025-11-04 00:44:07.591472+00	\N	17381775-cc4e-4c78-83d7-c1605b03c171
00000000-0000-0000-0000-000000000000	257	sjedukiq57qj	29bd5153-a7df-428e-a47b-449a13462da8	f	2025-11-04 00:44:07.592908+00	2025-11-04 00:44:07.592908+00	uhmjb3m5cy5u	17381775-cc4e-4c78-83d7-c1605b03c171
00000000-0000-0000-0000-000000000000	148	umu2bce4tnyx	2c14713b-a581-4614-812c-e2ea5b3e2835	f	2025-09-20 00:57:03.696863+00	2025-09-20 00:57:03.696863+00	\N	6a9e13df-3cf9-4467-8741-29756b530894
00000000-0000-0000-0000-000000000000	149	ucf3q2pxvfvf	2c14713b-a581-4614-812c-e2ea5b3e2835	f	2025-09-20 00:57:42.146127+00	2025-09-20 00:57:42.146127+00	\N	c5db7975-61ba-4bcb-8ff7-dccb027158c7
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id) FROM stdin;
9dae8e0e-8077-47a1-bffb-d73ceaafe585	2955c32a-54b5-4f52-a473-9e8fdbbde21d	2025-03-30 13:36:20.606039+00	2025-04-04 06:46:30.844205+00	\N	aal1	\N	2025-04-04 06:46:30.844133	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	211.30.206.8	\N	\N
17381775-cc4e-4c78-83d7-c1605b03c171	29bd5153-a7df-428e-a47b-449a13462da8	2025-11-03 08:42:58.180695+00	2025-11-04 00:44:17.917101+00	\N	aal1	\N	2025-11-04 00:44:17.917008	node	49.13.198.143	\N	\N
0eaec7ce-a408-4f9a-ae79-14ff6f2bffb3	29bd5153-a7df-428e-a47b-449a13462da8	2025-11-02 23:49:58.025432+00	2025-11-04 03:28:32.473162+00	\N	aal1	\N	2025-11-04 03:28:32.473087	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36	110.32.140.180	\N	\N
83be6450-1d82-4168-85ec-7d1d0af2d595	8e552a4c-da01-402d-afca-ef07a989b933	2025-05-12 10:46:53.762679+00	2025-05-12 10:46:53.762679+00	\N	aal1	\N	\N	node	100.24.210.49	\N	\N
4985b5dc-a1ff-4bc2-acc5-0a03a01991be	8d4988f6-3593-4a1d-b835-7d25b58314f0	2025-03-30 13:27:46.697373+00	2025-03-30 13:27:46.697373+00	\N	aal1	\N	\N	node	3.80.140.190	\N	\N
6a9e13df-3cf9-4467-8741-29756b530894	2c14713b-a581-4614-812c-e2ea5b3e2835	2025-09-20 00:57:03.684335+00	2025-09-20 00:57:03.684335+00	\N	aal1	\N	\N	node	98.80.100.59	\N	\N
c5db7975-61ba-4bcb-8ff7-dccb027158c7	2c14713b-a581-4614-812c-e2ea5b3e2835	2025-09-20 00:57:42.144061+00	2025-09-20 00:57:42.144061+00	\N	aal1	\N	\N	node	98.80.100.59	\N	\N
dc10f3bb-6b00-4e89-a527-953447b1c312	3e9e5cdc-8387-4fb3-b1c3-866d24551cfe	2025-03-31 23:47:57.196669+00	2025-03-31 23:47:57.196669+00	\N	aal1	\N	\N	node	44.221.45.15	\N	\N
1baee01d-b613-4fc3-ac31-b1c9e1a8267f	3e9e5cdc-8387-4fb3-b1c3-866d24551cfe	2025-03-31 23:48:41.706289+00	2025-03-31 23:48:41.706289+00	\N	aal1	\N	\N	node	44.221.45.15	\N	\N
8f27c6f5-f4ed-4db2-93ca-55b7b0e4d9f7	8e552a4c-da01-402d-afca-ef07a989b933	2025-05-12 10:47:43.890368+00	2025-05-21 12:33:34.201798+00	\N	aal1	\N	2025-05-21 12:33:34.201723	Mozilla/5.0 (iPhone; CPU iPhone OS 18_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Mobile/15E148 Safari/604.1	110.32.134.53	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	8e552a4c-da01-402d-afca-ef07a989b933	authenticated	authenticated	thecobra@ironcobra.net	$2a$10$9i4d/6BgZVTILfadcH6ij.5AAS3adZ3eB2Se8SRsgF6gjUJxeHH.u	2025-05-12 10:46:53.758471+00	\N		\N		2025-05-12 10:46:53.776973+00			\N	2025-05-12 10:47:43.8903+00	{"provider": "email", "providers": ["email"]}	{"sub": "8e552a4c-da01-402d-afca-ef07a989b933", "email": "thecobra@ironcobra.net", "email_verified": true, "phone_verified": false}	\N	2025-05-12 10:46:53.740539+00	2025-05-21 12:33:29.232231+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	2c14713b-a581-4614-812c-e2ea5b3e2835	authenticated	authenticated	mandy@ironcobra.net	$2a$10$3PvhWGTf9e94zpPAi7mV.OaVKgrhyueqzfso6EdmAZL5GQIjAn4/u	2025-09-20 00:57:03.673687+00	\N		\N		2025-09-20 00:57:03.739785+00			\N	2025-09-20 00:57:42.143947+00	{"provider": "email", "providers": ["email"]}	{"sub": "2c14713b-a581-4614-812c-e2ea5b3e2835", "email": "mandy@ironcobra.net", "email_verified": true, "phone_verified": false}	\N	2025-09-20 00:57:03.621157+00	2025-09-20 00:57:42.147437+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	2955c32a-54b5-4f52-a473-9e8fdbbde21d	authenticated	authenticated	rk.belton@gmail.com	$2a$10$9/slXdU07M0vg5AUBCMJ9efyw4E0jfODvogIKDxSbr7aVC.1Aks/a	2025-03-30 11:15:08.432525+00	\N		\N		2025-03-30 13:35:40.230746+00			\N	2025-03-30 13:36:20.605953+00	{"provider": "email", "providers": ["email"]}	{"sub": "2955c32a-54b5-4f52-a473-9e8fdbbde21d", "email": "rk.belton@gmail.com", "email_verified": true, "phone_verified": false}	\N	2025-03-30 11:15:08.403781+00	2025-04-04 06:46:27.756175+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	8d4988f6-3593-4a1d-b835-7d25b58314f0	authenticated	authenticated	rk.belton@gmail.co	$2a$10$XxcM/EI2vUCfybL4qFgcbOCyz6u.DPloKzBByPqzD9D7P7rQZAOrm	2025-03-30 13:27:46.693306+00	\N		\N	pkce_014dabf556623e2d729d3a48383a2fd49e5630afd70e5dbe03128aa4	2025-03-30 13:27:46.709781+00			\N	2025-03-30 13:27:46.697294+00	{"provider": "email", "providers": ["email"]}	{"sub": "8d4988f6-3593-4a1d-b835-7d25b58314f0", "email": "rk.belton@gmail.co", "email_verified": true, "phone_verified": false}	\N	2025-03-30 13:27:46.661271+00	2025-03-30 13:27:51.128585+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	29bd5153-a7df-428e-a47b-449a13462da8	authenticated	authenticated	richard@haddads.net.au	$2a$10$5FHogLmGoUHL2gLIDQ3hye6Gm7eGekMKaYSXvdZtPN.GfyDCNEx8.	2025-03-29 07:19:07.428017+00	\N		\N		2025-11-03 08:42:36.237674+00			\N	2025-11-03 08:42:58.180617+00	{"provider": "email", "providers": ["email"]}	{"sub": "29bd5153-a7df-428e-a47b-449a13462da8", "email": "richard@haddads.net.au", "email_verified": true, "phone_verified": false}	\N	2025-03-29 07:19:07.388853+00	2025-11-04 03:28:32.470926+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	3e9e5cdc-8387-4fb3-b1c3-866d24551cfe	authenticated	authenticated	william@haddads.net.au	$2a$10$7cHG70nqb053pbHNZNiFbuTC7wfkJp6Hu9ed9CJXXDZhcBW.duWyS	2025-03-31 23:47:57.190365+00	\N		\N		2025-03-31 23:47:57.217754+00			\N	2025-03-31 23:48:41.706209+00	{"provider": "email", "providers": ["email"]}	{"sub": "3e9e5cdc-8387-4fb3-b1c3-866d24551cfe", "email": "william@haddads.net.au", "email_verified": true, "phone_verified": false}	\N	2025-03-31 23:47:57.155964+00	2025-03-31 23:48:41.709882+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: -
--

COPY pgsodium.key (id, status, created, expires, key_type, key_id, key_context, name, associated_data, raw_key, raw_key_nonce, parent_key, comment, user_data) FROM stdin;
\.


--
-- Data for Name: collections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.collections (created_at, title, owner, is_public, id) FROM stdin;
2025-03-30 11:16:03.532164+00	Kids	2955c32a-54b5-4f52-a473-9e8fdbbde21d	f	0051b194-c615-4750-949c-e6830a49a04e
2025-03-29 15:17:31.438067+00	Monday Movie Nights	29bd5153-a7df-428e-a47b-449a13462da8	f	c396be00-a182-4b7b-b10f-90b855da38b8
2025-03-31 23:50:12.458561+00	The Haddads	29bd5153-a7df-428e-a47b-449a13462da8	f	1f496b87-3ada-4038-95ed-da27ef1db249
2025-03-30 11:17:52.617461+00	Crazy Cool Collection	29bd5153-a7df-428e-a47b-449a13462da8	f	2f4c5d1b-d54e-4ec5-aaee-40a8c3a0ee59
\.


--
-- Data for Name: episode_comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.episode_comments (id, episode_id, user_id, parent_comment_id, content, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: episode_watches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.episode_watches (id, user_id, episode_id, series_id, watched_at, created_at) FROM stdin;
dec0c207-be7f-4ae9-bd90-efb58a70e36a	29bd5153-a7df-428e-a47b-449a13462da8	a16341db-f943-4a28-88f6-154e54392f86	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
27d1b8e4-9c7d-4bcb-b39c-6a46c5dcc37c	29bd5153-a7df-428e-a47b-449a13462da8	631e4760-44db-4d0c-a9a0-2ce4393d8015	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
675ece47-f6ee-4e5b-8215-97b6501111f7	29bd5153-a7df-428e-a47b-449a13462da8	42b582cf-21cc-43ed-9f20-1c0b9b021877	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
3851172f-dc88-452d-a6f2-e2f4c20b999e	29bd5153-a7df-428e-a47b-449a13462da8	3874728a-7a24-4e5f-b0a7-0681bad8d650	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
61995f38-f6ad-4f3c-9416-dd6325b396ff	29bd5153-a7df-428e-a47b-449a13462da8	42619661-9c26-468e-aac5-7e29f731c5d5	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
dcbec905-9f4c-448d-a375-1d40823a675c	29bd5153-a7df-428e-a47b-449a13462da8	5ae5eb28-61a5-48c3-bace-a99a5b48bf7a	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
fd6117f5-62b6-4d31-b745-d6ef35783535	29bd5153-a7df-428e-a47b-449a13462da8	6c7b14b3-52a2-4b3c-972a-96480ba73536	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
45ec8691-2877-49dd-814e-7988cae89e78	29bd5153-a7df-428e-a47b-449a13462da8	b4981095-d543-4133-ac59-674bd5e39963	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
134f77ea-9bb3-4c6f-9a30-ec26118142d4	29bd5153-a7df-428e-a47b-449a13462da8	32a7fdc1-e6bf-4232-815b-4f9ba07d1ca9	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
a65cea6a-9829-4cdf-9b6a-2a52b05d3152	29bd5153-a7df-428e-a47b-449a13462da8	d55de8ee-f1ea-4c11-9e18-09fa44753d58	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
26628fff-460e-4317-86f9-63f513a68324	29bd5153-a7df-428e-a47b-449a13462da8	861ee5a3-d48a-4371-bf8c-1954faaa6178	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
2e3a1ebf-e4ad-4ede-ac01-585ce2b7c8e0	29bd5153-a7df-428e-a47b-449a13462da8	848983a7-adfb-48aa-bd58-fdadc660a014	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
bcebcfdc-de49-454b-9e61-f99a1626d73a	29bd5153-a7df-428e-a47b-449a13462da8	b8a3149e-dacf-435f-91cc-5fad242fc70e	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
5451a586-e4d0-4a01-b799-2bf34b565fb6	29bd5153-a7df-428e-a47b-449a13462da8	9f5e9de2-8b55-4484-8816-33186399f883	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
b1c432f8-04b6-4d7e-88f6-f0104a530a93	29bd5153-a7df-428e-a47b-449a13462da8	0fc1564d-e74f-4108-b941-994a3b214ae1	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
a7f039f8-361c-4d9e-be17-59f0a99dba63	29bd5153-a7df-428e-a47b-449a13462da8	ce84a80f-14ad-454a-a6c1-1469ead0fa0a	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
8344ddf8-f8ac-4172-96e2-6208f9d2474d	29bd5153-a7df-428e-a47b-449a13462da8	9554457b-510c-479e-8886-2c5d97242886	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
e0d41251-7d30-4706-bb22-a4fe485c36d9	29bd5153-a7df-428e-a47b-449a13462da8	666e1b5a-e8ea-4aaf-8a49-d2633b3e7c4c	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
c1a29b9c-5d69-4308-8403-6ed40d19e68e	29bd5153-a7df-428e-a47b-449a13462da8	9246a7c5-8b52-41ae-88ce-83fb64d1dd55	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
f0baa4f2-a181-4084-a57d-269abff98049	29bd5153-a7df-428e-a47b-449a13462da8	589c6e2a-f301-41c0-a413-111911dd576d	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
8dd1543d-0155-4032-8422-b272aa958d60	29bd5153-a7df-428e-a47b-449a13462da8	2f36d468-f4d5-4882-9f8f-5283ff94adde	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
c38b1c6f-c091-410e-b796-924205462231	29bd5153-a7df-428e-a47b-449a13462da8	f6dff7f5-495c-4e1c-a730-78abd66a92a3	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:52.719+00	2025-10-31 07:07:53.095357+00
b7895ff7-2b37-464e-8cb3-5a87a42be2e1	29bd5153-a7df-428e-a47b-449a13462da8	b378c275-dd99-4cfd-aa55-11f57967399c	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:54.937+00	2025-10-31 07:07:55.311094+00
616411f3-b175-45ff-8584-a2f16988f1d9	29bd5153-a7df-428e-a47b-449a13462da8	0a8df599-40a5-41ff-9a91-dbdb59169c71	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:54.937+00	2025-10-31 07:07:55.311094+00
2031d5fb-e0c4-4a6e-b716-6885f61c44c5	29bd5153-a7df-428e-a47b-449a13462da8	0ccf5bdb-c138-40f8-a19d-fbb16c6244e3	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:54.937+00	2025-10-31 07:07:55.311094+00
dc4130c3-bfb6-4d03-a1ab-488085edbd46	29bd5153-a7df-428e-a47b-449a13462da8	b3a783e7-323d-4cbc-8253-66402c3a3c98	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:54.937+00	2025-10-31 07:07:55.311094+00
d24099db-feb2-4063-8992-a74bda92293f	29bd5153-a7df-428e-a47b-449a13462da8	3fa40f41-dc6e-4abc-82dd-b5eb9c5ddcb1	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:54.937+00	2025-10-31 07:07:55.311094+00
0a458bf5-eeb8-4980-9276-7c8d201c388c	29bd5153-a7df-428e-a47b-449a13462da8	d3bafd15-d739-44ab-9aa1-6ec3aff0d1b8	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:54.937+00	2025-10-31 07:07:55.311094+00
35dd1353-37bb-4cf1-8519-859a9c8e2979	29bd5153-a7df-428e-a47b-449a13462da8	38b30850-0ce8-4cb1-898b-8e750cb47061	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:54.937+00	2025-10-31 07:07:55.311094+00
ff726745-85f4-4472-9391-4eb68159ca07	29bd5153-a7df-428e-a47b-449a13462da8	3a5b9085-d491-4c7c-b7f0-453400d78e13	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:54.937+00	2025-10-31 07:07:55.311094+00
36aa71d0-ded3-47ac-8a3f-00504f2abd5f	29bd5153-a7df-428e-a47b-449a13462da8	5e6efcdf-b424-41fd-a851-b74c43c7f12f	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:54.937+00	2025-10-31 07:07:55.311094+00
c8175c8e-b207-4c8b-a2b1-3f3548c9ba86	29bd5153-a7df-428e-a47b-449a13462da8	c2f96873-86ed-4219-bfbb-f47997b825dc	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:54.937+00	2025-10-31 07:07:55.311094+00
a9bd40a3-9361-4f94-bf0e-8a27831eeaca	29bd5153-a7df-428e-a47b-449a13462da8	6c4e8e6c-f78d-4d7f-bbbd-827a79b37d54	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
1b69e379-9741-4afa-8289-b67179b22b9f	29bd5153-a7df-428e-a47b-449a13462da8	3915e893-8362-4331-808a-b0e5fe5b53a8	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
ed07641a-feb3-4eb9-ae17-a3d32fdc5587	29bd5153-a7df-428e-a47b-449a13462da8	0bc768e2-fc60-4d96-829a-9ec39f4ca0a5	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
1db8dcd5-a6df-4c70-b0ea-bb75332a1fe2	29bd5153-a7df-428e-a47b-449a13462da8	1f5441f0-f3f9-4497-8f02-c0b8404ad77d	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
889943ca-75c5-4231-bfae-ac193d448037	29bd5153-a7df-428e-a47b-449a13462da8	8e2ce0da-7965-40d2-9e1a-8f715b849dfb	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
51d45456-1f68-4e71-b348-c46a9c195690	29bd5153-a7df-428e-a47b-449a13462da8	5d2ade06-7376-40fd-9ed2-c1a072e04324	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
9f7f7e95-dc75-4984-8e10-475974b6f4dd	29bd5153-a7df-428e-a47b-449a13462da8	b9e17558-6f69-4a8b-a412-c7167c2e1f21	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
dcb20a83-d39e-4358-8ae5-6d83bca5aab0	29bd5153-a7df-428e-a47b-449a13462da8	24f63021-34b3-4fa6-8d61-e4a4291703d7	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
e7d1241c-5ccc-4631-8770-f8cb0e3f9ecb	29bd5153-a7df-428e-a47b-449a13462da8	05860db7-64ff-4002-a92a-04d75a1a7fe5	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
86161eac-0371-4594-bc27-f22004f44e7f	29bd5153-a7df-428e-a47b-449a13462da8	9c052281-f2f6-459b-8718-f339f2eacca4	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
30440e03-25e6-4f14-91df-8ce02745d18f	29bd5153-a7df-428e-a47b-449a13462da8	93547656-b8ca-44b4-ae94-a63324e83ada	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
e4e5b8d0-9941-4089-a158-a60ebba1aec8	29bd5153-a7df-428e-a47b-449a13462da8	9b5c80f3-3ad9-480d-8859-4abde08cf0cc	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
66dc5fcd-c8da-477a-bf6c-e27713960f8c	29bd5153-a7df-428e-a47b-449a13462da8	29dbf6dc-1c46-4d27-9c87-9c2ec97e02e2	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
32f0e05b-2299-461a-bfb4-faf4a02d2e02	29bd5153-a7df-428e-a47b-449a13462da8	64b14943-f54e-46fe-8651-b7b120de7fc8	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
14686445-3412-459f-badb-0f73707c1f4a	29bd5153-a7df-428e-a47b-449a13462da8	4def70f3-c6d7-4a79-9076-370975e5740e	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
d200de1e-9f6e-4927-91e9-a29a55ebb1de	29bd5153-a7df-428e-a47b-449a13462da8	18008382-4247-4b3a-bf1d-866e3299c99c	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
be316be6-f93c-4442-b4d1-055eaba1c82c	29bd5153-a7df-428e-a47b-449a13462da8	7cd1db52-7633-4513-8813-2324d98f4824	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
e3b29edb-2037-4b4a-803e-0fcaf4189f2a	29bd5153-a7df-428e-a47b-449a13462da8	a94d7bd8-050e-4f92-814b-e34e1d34d721	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
d16886d3-b54c-4775-bf6b-93a5d2c37c91	29bd5153-a7df-428e-a47b-449a13462da8	f3e47fea-a2db-494a-884e-6ff450341a62	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
f7786248-6e52-4866-bf03-81483f32fa20	29bd5153-a7df-428e-a47b-449a13462da8	19ac716d-d470-4dc0-9cfd-1cfa0dc4a97e	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:07:55.728+00	2025-10-31 07:07:56.105858+00
27b644bb-4dc0-4d2c-bd64-d3adcc684799	29bd5153-a7df-428e-a47b-449a13462da8	afcf0816-6f4c-4e9d-b010-fa806a0590e4	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:08:00.387+00	2025-10-31 07:08:00.756192+00
aa359527-af79-4c6d-9ff9-2512b3c42f92	29bd5153-a7df-428e-a47b-449a13462da8	82a0d60a-1374-4f12-bdd8-f700238c64ab	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2025-10-31 07:08:00.52+00	2025-10-31 07:08:00.890772+00
4b3adc61-9071-414f-b517-40a4d35a6175	29bd5153-a7df-428e-a47b-449a13462da8	7726bb34-2305-49e8-b686-e48e6925e5d0	525ad006-b49f-4790-b22e-c426b3fd2445	2025-10-31 13:02:57.731+00	2025-10-31 13:02:57.867365+00
8630e1c8-da06-4bc6-878a-cd4cec5dc1f7	29bd5153-a7df-428e-a47b-449a13462da8	e60a514a-38e0-4c30-88e0-05797c60b88b	525ad006-b49f-4790-b22e-c426b3fd2445	2025-10-31 13:02:57.731+00	2025-10-31 13:02:57.867365+00
82134e0b-da78-46fe-9281-5bcb5b7d37bc	29bd5153-a7df-428e-a47b-449a13462da8	b7f74c5f-798a-415c-b507-65ce11904675	525ad006-b49f-4790-b22e-c426b3fd2445	2025-10-31 13:02:57.731+00	2025-10-31 13:02:57.867365+00
82ffe0f1-a5cf-4b40-b362-da87202f8409	29bd5153-a7df-428e-a47b-449a13462da8	f4e0d0c7-bca3-4cb8-884a-4b7bfeddedb3	525ad006-b49f-4790-b22e-c426b3fd2445	2025-10-31 13:02:57.731+00	2025-10-31 13:02:57.867365+00
f5289e94-8500-4541-8ec9-0ddb4bec36f8	29bd5153-a7df-428e-a47b-449a13462da8	7c497e76-88cc-49a0-b735-e22efc09584b	525ad006-b49f-4790-b22e-c426b3fd2445	2025-10-31 13:02:57.731+00	2025-10-31 13:02:57.867365+00
da01acc0-3914-4700-a40a-4760e45fda57	29bd5153-a7df-428e-a47b-449a13462da8	febd7ac6-9e14-4cbb-a0c6-7289820e5730	525ad006-b49f-4790-b22e-c426b3fd2445	2025-10-31 13:02:57.731+00	2025-10-31 13:02:57.867365+00
d07a01b5-3f35-436c-96f7-b91c4bd0643c	29bd5153-a7df-428e-a47b-449a13462da8	17679b8d-b205-4066-8954-b3bdc61eb920	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:02.717+00	2025-10-31 13:43:02.860282+00
afb906be-23ec-4c27-a2ec-580788461ab0	29bd5153-a7df-428e-a47b-449a13462da8	c4e3c982-e6e1-43f2-be41-9fc7f2264abb	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:02.717+00	2025-10-31 13:43:02.860282+00
139b8d57-1003-421a-9446-a46580f8a782	29bd5153-a7df-428e-a47b-449a13462da8	6074d32e-825a-4db7-88f0-b0e05a09a658	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:02.717+00	2025-10-31 13:43:02.860282+00
1feba5b3-2586-4c2b-b740-cc8ab5a46bf9	29bd5153-a7df-428e-a47b-449a13462da8	400f3b48-7144-4c5f-bf2a-275ea414da4b	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:02.717+00	2025-10-31 13:43:02.860282+00
3437dff9-3acb-4dea-b07a-4e542bb7f88c	29bd5153-a7df-428e-a47b-449a13462da8	07c4638b-ad85-49ba-b55d-353056e3954c	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:02.769+00	2025-10-31 13:35:02.907077+00
03dd42d2-7229-4914-936f-3ddbfc6548a4	29bd5153-a7df-428e-a47b-449a13462da8	4727606c-048c-4e0a-b240-66f4e42ba664	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:02.769+00	2025-10-31 13:35:02.907077+00
3a70ee47-e7ec-4bea-a967-4637b426db00	29bd5153-a7df-428e-a47b-449a13462da8	12f218ad-3757-4b5d-ad87-ebc68abf6f18	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:02.769+00	2025-10-31 13:35:02.907077+00
612d20ef-5409-4f3e-9ec8-475a0fcad6b4	29bd5153-a7df-428e-a47b-449a13462da8	45a7e06a-e696-4955-8a14-ca906598a56f	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:02.769+00	2025-10-31 13:35:02.907077+00
cb9788b5-8119-4d50-9838-b13a0de33c82	29bd5153-a7df-428e-a47b-449a13462da8	131a078f-7aae-413f-bb05-fe67d014493a	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:02.769+00	2025-10-31 13:35:02.907077+00
02c38ab3-975a-405f-8c2e-f16910bef258	29bd5153-a7df-428e-a47b-449a13462da8	086c6c37-5ab1-4c61-a171-d69350dc26c6	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:02.769+00	2025-10-31 13:35:02.907077+00
76f62e1f-ba95-48c3-81b8-30641e5e751c	29bd5153-a7df-428e-a47b-449a13462da8	8aac7f92-969f-45a3-82e6-f12802b5db56	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:02.769+00	2025-10-31 13:35:02.907077+00
451dade9-0865-47b5-af0b-5d9c0ca89338	29bd5153-a7df-428e-a47b-449a13462da8	4eaa9206-8e3e-41ea-a320-282d30296a22	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:02.769+00	2025-10-31 13:35:02.907077+00
cedf5f99-b3a9-415e-8712-4e77e560e041	29bd5153-a7df-428e-a47b-449a13462da8	3927ec4e-05b4-46ee-9731-9f2cd21b01b9	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:02.769+00	2025-10-31 13:35:02.907077+00
f3d0e07b-df52-4ab5-9347-8bfa8aff62db	29bd5153-a7df-428e-a47b-449a13462da8	72b221a5-626d-4c4c-a6e6-1e6b2d8edd24	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:02.769+00	2025-10-31 13:35:02.907077+00
85753776-9ea0-4226-a471-6725cf385740	29bd5153-a7df-428e-a47b-449a13462da8	04fd24ce-0bf7-441f-a357-d48cc26dfa08	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:02.769+00	2025-10-31 13:35:02.907077+00
5c0380ac-53b2-4867-b5fd-a414ccdb5463	29bd5153-a7df-428e-a47b-449a13462da8	33ddc984-3e8d-4cde-b5e1-cbaa7ff7ad93	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:02.769+00	2025-10-31 13:35:02.907077+00
c401003d-78a6-4217-8cd5-e1bbeb1038a5	29bd5153-a7df-428e-a47b-449a13462da8	bbaba926-331e-4020-9408-dd4b6df907e7	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:02.769+00	2025-10-31 13:35:02.907077+00
96781d0e-3696-480a-ad82-c4d35f47638a	29bd5153-a7df-428e-a47b-449a13462da8	2dab39da-7eed-42e3-8c69-30325a9e0aa1	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:08.731+00	2025-10-31 13:35:08.875984+00
d118d30a-82e3-48c0-b055-441fecedb965	29bd5153-a7df-428e-a47b-449a13462da8	b7948680-0042-463f-bd82-b0e3b583fe46	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:08.968+00	2025-10-31 13:35:09.115576+00
ca9ef533-ef64-428d-b07d-3a185572f4c9	29bd5153-a7df-428e-a47b-449a13462da8	c2a5579a-79c3-413e-8ef3-59b7379285bd	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:09.38+00	2025-10-31 13:35:09.520937+00
12e275cd-ba39-4277-a0c5-594e8995627a	29bd5153-a7df-428e-a47b-449a13462da8	d691b2c2-3104-4b62-9ac4-9f98a5f88538	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:09.84+00	2025-10-31 13:35:09.980511+00
4957e648-caa2-4828-8a8f-43f9edab123e	29bd5153-a7df-428e-a47b-449a13462da8	c592220c-6ebd-4d69-a774-2f725ba2d114	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:13.372+00	2025-10-31 13:35:13.51633+00
0c570929-990e-4119-993d-de3a586929d2	29bd5153-a7df-428e-a47b-449a13462da8	65e10912-60ac-4f18-8723-f54c4bde87df	76301014-3c2f-4caf-9658-12e18781e39e	2025-10-31 13:35:13.793+00	2025-10-31 13:35:13.943304+00
b7801e4b-e9d6-4548-9346-323c8a85d468	29bd5153-a7df-428e-a47b-449a13462da8	9512cc83-2984-451b-80b6-dd9d07c3a24d	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:00.502+00	2025-10-31 13:43:00.644884+00
f571b260-0dfe-4d24-8973-ed4a320073d9	29bd5153-a7df-428e-a47b-449a13462da8	79a3e41d-fc64-47fb-b069-44daf216c1aa	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:00.502+00	2025-10-31 13:43:00.644884+00
5897958e-9b11-4d49-b6ef-f38cf0088c17	29bd5153-a7df-428e-a47b-449a13462da8	15eb8ade-ce6d-4d64-92d5-9b355b2e8109	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:00.502+00	2025-10-31 13:43:00.644884+00
19132c8a-8ff4-4ff7-8a94-cb9617a57fd9	29bd5153-a7df-428e-a47b-449a13462da8	55728b20-2b62-436c-b721-1abc54448d01	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:00.502+00	2025-10-31 13:43:00.644884+00
b7bb2bdb-7687-47d8-bee8-e741957b56ba	29bd5153-a7df-428e-a47b-449a13462da8	603263ff-5716-4626-9a9e-1d279d0eabeb	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:00.502+00	2025-10-31 13:43:00.644884+00
d4916e61-fd61-4389-9094-deb114cd851d	29bd5153-a7df-428e-a47b-449a13462da8	aa115f10-0dc9-4ab5-bfa3-2c046ff4fbb7	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:00.502+00	2025-10-31 13:43:00.644884+00
d0f963ab-aacf-45d2-8c22-07dadf9f6224	29bd5153-a7df-428e-a47b-449a13462da8	585cd5b0-4a1c-4009-9c40-8e5efb94a764	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:02.717+00	2025-10-31 13:43:02.860282+00
c3fbe6d9-468d-444a-8df6-3f4147726f0c	29bd5153-a7df-428e-a47b-449a13462da8	5e689073-5df1-41d6-af70-496904b95900	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:02.717+00	2025-10-31 13:43:02.860282+00
5b25b08d-94aa-4dbc-9e27-fe873588bec3	29bd5153-a7df-428e-a47b-449a13462da8	51d43ec9-9039-43a5-ad8e-23ada9c6ec9a	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:03.43+00	2025-10-31 13:43:03.580031+00
40742ee7-0163-45dc-8f89-94c21897fb47	29bd5153-a7df-428e-a47b-449a13462da8	8bc44685-9623-40de-84f3-7df4c34f174b	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:03.43+00	2025-10-31 13:43:03.580031+00
b669df99-b836-4b13-bd2c-4505b06d1883	29bd5153-a7df-428e-a47b-449a13462da8	1c2400ac-f7ff-42a3-95ad-30693beff639	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:03.43+00	2025-10-31 13:43:03.580031+00
681b61ad-0575-4da9-92c2-f86e50331593	29bd5153-a7df-428e-a47b-449a13462da8	49b68e88-8cb3-4a94-b9d3-5835c8ea8579	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:03.43+00	2025-10-31 13:43:03.580031+00
0bba2987-8d56-4d22-8197-33e8ef129062	29bd5153-a7df-428e-a47b-449a13462da8	edd6fa41-41dd-4c82-a55b-5811c5ec98bd	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:04.241+00	2025-10-31 13:43:04.383593+00
bdbbc53a-c688-45e0-a468-1f8f323d472d	29bd5153-a7df-428e-a47b-449a13462da8	2403ee46-87ce-47a7-b293-7acff0f724ec	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:04.241+00	2025-10-31 13:43:04.383593+00
e38b0225-5a9d-4aae-be29-916caf9f2703	29bd5153-a7df-428e-a47b-449a13462da8	4eab415f-4200-46bc-9407-66132414346e	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:04.241+00	2025-10-31 13:43:04.383593+00
a074afef-afe0-4f69-b028-6730deda942a	29bd5153-a7df-428e-a47b-449a13462da8	58fdef51-8a20-47b7-bfd0-d3359a26f65b	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:04.241+00	2025-10-31 13:43:04.383593+00
c46244eb-3bc9-4988-bdc0-527bf049ed21	29bd5153-a7df-428e-a47b-449a13462da8	6c590622-1d85-494c-8e65-d2ede9e092ca	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:05.365+00	2025-10-31 13:43:05.51009+00
bcc4c632-984e-4a22-b976-a3195a1b0fe6	29bd5153-a7df-428e-a47b-449a13462da8	d0a1eb09-6d6c-40b9-a5dd-dfdd495ed483	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:05.365+00	2025-10-31 13:43:05.51009+00
1c023bc8-86df-4ab1-a68a-1c8e610251ee	29bd5153-a7df-428e-a47b-449a13462da8	ce6e467f-7a23-4d25-b8d1-489cd6019054	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:06.428+00	2025-10-31 13:43:06.576981+00
8003125f-e35a-4abf-8386-09612916573d	29bd5153-a7df-428e-a47b-449a13462da8	f7a343ce-d206-47cc-99df-fa7dcb87b924	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:06.428+00	2025-10-31 13:43:06.576981+00
6d485f0b-2a3a-4c68-a45f-40b6ce7133ac	29bd5153-a7df-428e-a47b-449a13462da8	c778ffd0-5d63-4303-965e-d25141daf334	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:06.428+00	2025-10-31 13:43:06.576981+00
7cdd8b75-fa45-466c-bce7-f280d00f9a9f	29bd5153-a7df-428e-a47b-449a13462da8	f67345e2-8f5f-4a0e-927f-8d47ec088ad8	4f92630b-d34e-40d9-96aa-546c390600c7	2025-10-31 13:43:06.428+00	2025-10-31 13:43:06.576981+00
1279d3a1-dc20-491f-9f14-024c19a89d25	29bd5153-a7df-428e-a47b-449a13462da8	8a60f29e-9cd4-4e37-afd4-f37cd1d332e9	525ad006-b49f-4790-b22e-c426b3fd2445	2025-10-31 14:46:59.175+00	2025-10-31 14:46:59.346724+00
d038ad48-50d4-4192-a0ec-56cef843e61e	29bd5153-a7df-428e-a47b-449a13462da8	f565be8a-12d7-4274-adf4-0b5b0febd9a7	525ad006-b49f-4790-b22e-c426b3fd2445	2025-10-31 15:18:22.541+00	2025-10-31 15:18:23.032524+00
bc7c4eb6-192b-4815-b33e-46a77c43fa63	29bd5153-a7df-428e-a47b-449a13462da8	71b88c59-67e8-4a56-80a2-e2be2a799463	76301014-3c2f-4caf-9658-12e18781e39e	2025-11-01 12:15:38.918+00	2025-11-01 12:15:39.049247+00
c4bf0aa1-2647-4265-9d3d-2f5f97ea133d	29bd5153-a7df-428e-a47b-449a13462da8	b56584be-c8b4-4334-883c-27097ce8dc97	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:06.66+00	2025-11-02 23:52:06.795626+00
e5276ce3-8650-4b09-86ad-5ffe43a5e414	29bd5153-a7df-428e-a47b-449a13462da8	1868fa41-8871-4dd3-b65b-f1fef2e2380b	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:06.66+00	2025-11-02 23:52:06.795626+00
069cb8b9-02dd-49a1-b699-cd827e47206c	29bd5153-a7df-428e-a47b-449a13462da8	9cf821f3-6dc2-4284-9910-a6af96c25628	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:06.66+00	2025-11-02 23:52:06.795626+00
ff5b9673-aa69-4278-bca5-dbc2e3c390c8	29bd5153-a7df-428e-a47b-449a13462da8	c4e4902d-887d-40f1-8e64-a67ade7fa7d8	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:06.66+00	2025-11-02 23:52:06.795626+00
8e8e8987-a63c-4ac0-9384-d75095886979	29bd5153-a7df-428e-a47b-449a13462da8	5a5849ab-0709-438c-943a-4ed74e18d74f	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:06.66+00	2025-11-02 23:52:06.795626+00
74f25264-cae5-4b35-ae12-11c841558476	29bd5153-a7df-428e-a47b-449a13462da8	9352138b-8f2f-4b00-b212-e0dbf9dbd092	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:06.66+00	2025-11-02 23:52:06.795626+00
0f2719f6-d126-4aa4-8624-b20e37879ae9	29bd5153-a7df-428e-a47b-449a13462da8	9d70a866-da4b-4190-ab94-f820ae5dbe04	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:06.66+00	2025-11-02 23:52:06.795626+00
977c8375-ee13-4d34-b6ce-b3cd1210a8a5	29bd5153-a7df-428e-a47b-449a13462da8	2edd1ac5-a03f-40c5-877c-20d16cc76aa6	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:06.66+00	2025-11-02 23:52:06.795626+00
c0196246-6a89-4d17-82a5-df6d102fc606	29bd5153-a7df-428e-a47b-449a13462da8	9e791cae-3cbb-4f2e-8a0f-b47f44c26c32	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:06.66+00	2025-11-02 23:52:06.795626+00
f8e3c7a0-daef-4cb1-b4c1-cc3f1b019876	29bd5153-a7df-428e-a47b-449a13462da8	8231defb-465a-4f18-85b8-16a6e8524f45	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:06.66+00	2025-11-02 23:52:06.795626+00
7fc2a3fc-7dcd-4c8a-bdde-50c09847df77	29bd5153-a7df-428e-a47b-449a13462da8	ecb1515c-d631-4239-845e-8826ecc0539f	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:08.496+00	2025-11-02 23:52:08.62683+00
3885a1f9-fe77-4691-a230-c32e42689643	29bd5153-a7df-428e-a47b-449a13462da8	e6c6722b-f5b6-42c6-ae55-c52fcca8e201	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:08.496+00	2025-11-02 23:52:08.62683+00
997b24cd-32e6-456b-9199-db060b5ff6fb	29bd5153-a7df-428e-a47b-449a13462da8	ee3006b1-68da-4f85-a1c5-f83a1b349ee0	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:08.496+00	2025-11-02 23:52:08.62683+00
fec456c5-8106-43b2-8127-8e330b42a803	29bd5153-a7df-428e-a47b-449a13462da8	5da62d54-64ba-405b-bf59-db6ac637bac6	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:08.496+00	2025-11-02 23:52:08.62683+00
8ffe50ef-ddc0-4182-b760-279d63549b13	29bd5153-a7df-428e-a47b-449a13462da8	9b64af70-886a-4174-bd8f-1191e3fd8167	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:12.437+00	2025-11-02 23:52:13.127887+00
72905804-4121-46e3-b6ad-12d62845b5f5	29bd5153-a7df-428e-a47b-449a13462da8	8555af8b-e022-4286-b966-91ce4c3144b4	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:08.496+00	2025-11-02 23:52:08.62683+00
1ef891d5-dac9-40d5-8a10-0136ef83e5ec	29bd5153-a7df-428e-a47b-449a13462da8	426e1a30-f7dc-43ee-a00d-5c2249aa3c63	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:08.496+00	2025-11-02 23:52:08.62683+00
05b1b7be-3e3d-4db1-a54d-9245d8163638	29bd5153-a7df-428e-a47b-449a13462da8	e3e3633d-3633-4e15-a6b9-445390d9209d	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:08.496+00	2025-11-02 23:52:08.62683+00
927c056e-b081-4cda-9580-32137e0a3b6d	29bd5153-a7df-428e-a47b-449a13462da8	1dfb11f3-0fce-4051-b701-789e29a1f563	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:08.496+00	2025-11-02 23:52:08.62683+00
cb0815fd-5bba-4f1f-aa05-292d27562d05	29bd5153-a7df-428e-a47b-449a13462da8	5aee4bb1-d9a5-4490-b150-f4a7766a8ef1	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:08.496+00	2025-11-02 23:52:08.62683+00
4983501a-ec53-4661-ad5f-4f3db6dafef1	29bd5153-a7df-428e-a47b-449a13462da8	1cfda893-298f-4dbe-bd7c-325721c3f3c4	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:08.496+00	2025-11-02 23:52:08.62683+00
4cbf4a17-ca5e-4ba2-9b85-9b65ab18b1b2	29bd5153-a7df-428e-a47b-449a13462da8	cc9b078c-4f13-4b3e-bf86-4a1512be6e7b	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:09.732+00	2025-11-02 23:52:09.872883+00
0652ba9e-23d9-4f78-b626-2ea370c16248	29bd5153-a7df-428e-a47b-449a13462da8	bac15c31-d849-41ed-b3a4-83a742f6c7e2	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:09.732+00	2025-11-02 23:52:09.872883+00
fb9a9505-a259-4bdd-8024-698e42f32dbb	29bd5153-a7df-428e-a47b-449a13462da8	3283c9ba-09ea-44e4-8349-e2e011c3fb83	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:09.732+00	2025-11-02 23:52:09.872883+00
5b548642-6559-4d98-a49a-ec77f47dd7e9	29bd5153-a7df-428e-a47b-449a13462da8	dc504c9d-f670-4f9f-891d-5bc1363a4972	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:09.732+00	2025-11-02 23:52:09.872883+00
0135afcc-f00e-4427-b293-e2e4093ccf67	29bd5153-a7df-428e-a47b-449a13462da8	2e6aedf9-02ef-48b6-b9c5-2221111a8d37	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:09.732+00	2025-11-02 23:52:09.872883+00
2928d9a7-ad20-4afe-96a9-7bbe70e1699c	29bd5153-a7df-428e-a47b-449a13462da8	9a932713-5d6a-494f-a4bb-0cc9154a1a93	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:09.732+00	2025-11-02 23:52:09.872883+00
8a1f9fef-1eb9-4a70-b9f3-ff497f6c4e47	29bd5153-a7df-428e-a47b-449a13462da8	893b0c97-cb2f-4f0a-8260-86c2919a9332	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:09.732+00	2025-11-02 23:52:09.872883+00
cb74bc6c-d73d-4564-be8d-743e2589d9b9	29bd5153-a7df-428e-a47b-449a13462da8	26fe27d6-9d73-4f13-a2aa-74dadba404a6	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:09.732+00	2025-11-02 23:52:09.872883+00
fee66a19-0c3f-4a2a-923f-570936f50d70	29bd5153-a7df-428e-a47b-449a13462da8	ca959a2f-e395-4a4f-8c56-8385af7a1608	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:09.732+00	2025-11-02 23:52:09.872883+00
473cc105-1ef4-45fd-81df-833d0e4733c2	29bd5153-a7df-428e-a47b-449a13462da8	9a602e0c-7aee-41a8-bda0-a9fcdcdfbca6	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2025-11-02 23:52:09.732+00	2025-11-02 23:52:09.872883+00
\.


--
-- Data for Name: episodes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.episodes (id, series_id, season_id, episode_number, title, overview, poster_path, release_year, created_at, air_date, runtime, vote_average, last_fetched, tmdb_id, season_number) FROM stdin;
febd7ac6-9e14-4cbb-a0c6-7289820e5730	525ad006-b49f-4790-b22e-c426b3fd2445	8fc12066-b88b-4068-946d-489fe90c3085	6	Follies	Taverner and the Slow Horses attempt different approaches to locate the kidnappers and Hassan. Ho makes a shocking discovery about Sid.	/kvavIgDPCRiKHDbFHhjiuGjiwE2.jpg	2022	2025-10-25 05:06:12.254337+00	2022-04-29	57	8.1	2025-10-25 05:06:12.026+00	3485342	1
7c497e76-88cc-49a0-b735-e22efc09584b	525ad006-b49f-4790-b22e-c426b3fd2445	8fc12066-b88b-4068-946d-489fe90c3085	5	Fiasco	The Slow Horses must disappear to avoid capture by MI5. Lamb and River head to The Park to outwit Taverner.	/r1h2s5XoPnYObXa4fLQBMzPQ7ws.jpg	2022	2025-10-25 05:06:12.254337+00	2022-04-22	46	8.0	2025-10-25 05:06:12.026+00	3485340	1
f4e0d0c7-bca3-4cb8-884a-4b7bfeddedb3	525ad006-b49f-4790-b22e-c426b3fd2445	8fc12066-b88b-4068-946d-489fe90c3085	4	Visiting Hours	Taverner sends the Dogs to hunt down Lamb and the Slow Horses. River holds the secret to saving the gang.	/iwD7NKfSLK7wbl9Psrkl1JryHnh.jpg	2022	2025-10-25 05:06:12.254337+00	2022-04-15	47	7.7	2025-10-25 05:06:12.026+00	3485339	1
b7f74c5f-798a-415c-b507-65ce11904675	525ad006-b49f-4790-b22e-c426b3fd2445	8fc12066-b88b-4068-946d-489fe90c3085	3	Bad Tradecraft	Slough House is the unlikely venue for a secret romance, but events take a dark turn when a dangerous encounter becomes deadly.	/7JU302Tf3afLyn0m6ENQwkzhWzw.jpg	2022	2025-10-25 05:06:12.254337+00	2022-04-08	46	7.9	2025-10-25 05:06:12.026+00	3485338	1
e60a514a-38e0-4c30-88e0-05797c60b88b	525ad006-b49f-4790-b22e-c426b3fd2445	8fc12066-b88b-4068-946d-489fe90c3085	2	Work Drinks	River and Sid join forces. A misfired gun has dire consequences.	/lAYmAPrr8WFUknwVvc2vVSliBtO.jpg	2022	2025-10-25 05:06:12.254337+00	2022-04-01	52	7.5	2025-10-25 05:06:12.026+00	3485337	1
7726bb34-2305-49e8-b686-e48e6925e5d0	525ad006-b49f-4790-b22e-c426b3fd2445	8fc12066-b88b-4068-946d-489fe90c3085	1	Failure's Contagious	River Cartwright is ousted from MI5 and finds himself in a place worse than purgatory: Slough House, dumping ground for failed spies.	/hLDT28rK6YwWHwuIQAgEHfgMjEw.jpg	2022	2025-10-25 05:06:12.254337+00	2022-04-01	57	7.5	2025-10-25 05:06:12.026+00	1984483	1
7437c0c7-2714-4a4e-a6cf-df00cba25f8f	525ad006-b49f-4790-b22e-c426b3fd2445	f87460c0-f2b8-457f-b427-be8515a787f7	3	Drinking Games	River gets cozy in the Cotswolds while searching for a sleeper agent. Min discovers Russian drinking games are the most brutal of all.	/wVV3QZ4S5vNEY6A67oTjPLtfImX.jpg	2022	2025-10-25 05:10:57.034858+00	2022-12-09	56	8.1	2025-10-25 05:11:10.88+00	3987734	2
f565be8a-12d7-4274-adf4-0b5b0febd9a7	525ad006-b49f-4790-b22e-c426b3fd2445	f87460c0-f2b8-457f-b427-be8515a787f7	2	From Upshott with Love	Lamb liaises with a Russian defector who may hold a clue to sleeper agents. River is on the trail of a ruthless assassin.	/6EH3YmOXblz91dw6H64ZcHpy2H5.jpg	2022	2025-10-25 05:10:57.034858+00	2022-12-02	52	7.9	2025-10-25 05:11:10.88+00	3987733	2
8a60f29e-9cd4-4e37-afd4-f37cd1d332e9	525ad006-b49f-4790-b22e-c426b3fd2445	f87460c0-f2b8-457f-b427-be8515a787f7	1	Last Stop	Jackson Lamb is on high alert after a former spy is found dead. Min and Louisa are tempted by an offer from outside Slough House.	/henDWWSmXd0Crdb6YnocCxejO0m.jpg	2022	2025-10-25 05:10:57.034858+00	2022-12-02	47	7.8	2025-10-25 05:11:10.88+00	3974226	2
07c4638b-ad85-49ba-b55d-353056e3954c	76301014-3c2f-4caf-9658-12e18781e39e	2356946f-d27e-4276-a01c-2c8f29065164	4	Survival Mode	Morgan is excited to get her official LAPD badge despite Karadec's reluctance. The detectives work tirelessly on an emotional missing children case, which hits close to home for Morgan and sends her mind into overdrive.	/9GqTbOq3dLisimPkYgKKKJZpMNn.jpg	2024	2025-10-30 15:22:07.920072+00	2024-10-15	44	7.8	2025-10-30 15:22:07.882+00	5607627	1
4727606c-048c-4e0a-b240-66f4e42ba664	76301014-3c2f-4caf-9658-12e18781e39e	2356946f-d27e-4276-a01c-2c8f29065164	3	Dirty Rotten Scoundrel	Morgan's intellect and cleaning experience prove useful when the detectives are called to a hotel room murder scene, eventually uncovering the victim's many cons. Morgan navigates Ava's dating while Soto reveals details about Roman's disappearance.	/a83VDtKRfKki0KnaCkkDGQxHtU5.jpg	2024	2025-10-30 15:22:07.920072+00	2024-10-08	45	7.9	2025-10-30 15:22:07.882+00	5606237	1
a16341db-f943-4a28-88f6-154e54392f86	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	19	Watch Your Step	The station 42 crew responds to an out-of-control blaze at a wellness retreat, and the third rock crew tries to protect one of their own from a dangerous overdose.	/pMtXRB0dJZGiY48ApEWhZq8IoH8.jpg	2023	2025-10-30 23:17:13.717322+00	2023-04-21	44	7.0	2025-10-30 23:17:13.425+00	4325022	1
631e4760-44db-4d0c-a9a0-2ce4393d8015	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	18	Off the Rails	The crews respond to the scene of a train crash where the rescue has the potential to spiral out of control when they discover the train is full of illicit cargo, and Robin, an enigmatic modern-day train hopper, helps injured patients.	/mkXpWyTDxCppqCrvFvH55E1UjxJ.jpg	2023	2025-10-30 23:17:13.717322+00	2023-04-07	42	8.2	2025-10-30 23:17:13.425+00	4295838	1
42b582cf-21cc-43ed-9f20-1c0b9b021877	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	17	A Cry for Help	An internal investigator suspects Jake of being the serial arsonist setting recent fires, so Bode and the crew take it upon themselves to investigate.	/sdb1lbkLonwiCjLgYboyoy62urJ.jpg	2023	2025-10-30 23:17:13.717322+00	2023-03-31	44	7.0	2025-10-30 23:17:13.425+00	4290249	1
3874728a-7a24-4e5f-b0a7-0681bad8d650	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	16	My Kinda Leader	When a massive and unpredictable wildfire breaks out in neighboring Drake Country, the station 42 and third rock crews are called to help aid in the rescue efforts.	/mwMkLBabjRxN5iaskVVP2STErl2.jpg	2023	2025-10-30 23:17:13.717322+00	2023-03-10	44	7.0	2025-10-30 23:17:13.425+00	4232517	1
42619661-9c26-468e-aac5-7e29f731c5d5	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	15	False Promises	A massive tree falls during a reforestation assignment, threatening Eve’s life and forcing Bode to step up and lead the rescue efforts.	/o9GlG9eXkbehQUVyozjsnNZ1ElS.jpg	2023	2025-10-30 23:17:13.717322+00	2023-03-03	43	7.0	2025-10-30 23:17:13.425+00	4184075	1
88e0a0a5-98be-4053-a681-4c9240308344	59adf09f-4e36-406c-9429-559f59f7a206	eb253b37-36f6-41a7-b0e8-69ac29532975	1	Da Vinci's Demons Making of (T1)		\N	\N	2025-11-02 12:40:47.486364+00	\N	60	0.0	2025-11-02 12:40:47.252+00	3009975	\N
ae6fe5e0-669a-447a-ac34-78fe1d432d8a	59adf09f-4e36-406c-9429-559f59f7a206	eb253b37-36f6-41a7-b0e8-69ac29532975	2	Da Vinci's Demons: Anatomy of a Show (T2)		\N	\N	2025-11-02 12:40:47.486364+00	\N	60	0.0	2025-11-02 12:40:47.252+00	3009976	\N
b56584be-c8b4-4334-883c-27097ce8dc97	9e469f16-cddc-49cb-8bb0-9a423e3fff40	3571a748-f14b-434b-9915-6a54be3f77f1	1	The Mayor of Kingstown	Brothers Mitch and Mike McLusky navigate Kingstown, home to multiple prisons, as they act as the liaisons between prisoners and the community. When a young guard, Sam, is set up to deliver a letter for a prisoner, Mike works to get him off the hook.	\N	\N	2025-11-02 23:51:48.247107+00	2021-11-14	66	\N	2025-11-02 23:51:48.247107+00	2050638	1
6e544c1b-1210-4e4e-9ce6-cb5316857720	59adf09f-4e36-406c-9429-559f59f7a206	6d2c9fcb-e3df-4a79-8e64-27deff7cd9cb	8	The Lovers	The Pazzis prepare a murderous plot for Easter Sunday. The Turk tells Leonardo where to find the Book of Leaves. Lucrezia makes a confession as Leonardo attempts to save the Medicis.	\N	2013	2025-11-02 12:40:58.743649+00	2013-06-07	60	7.2	2025-11-02 12:41:07.29+00	872291	\N
1868fa41-8871-4dd3-b65b-f1fef2e2380b	9e469f16-cddc-49cb-8bb0-9a423e3fff40	3571a748-f14b-434b-9915-6a54be3f77f1	2	The End Begins	Local gang leader, Bunny is upset when one of his guys gets taken off the yard. Mike brokers a deal, and is later visited by two FBI agents whom Mitch worked for. Milo has instructions for Josef on how to get closer to Mike.	\N	\N	2025-11-02 23:51:48.247107+00	2021-11-14	50	\N	2025-11-02 23:51:48.247107+00	3329720	1
9cf821f3-6dc2-4284-9910-a6af96c25628	9e469f16-cddc-49cb-8bb0-9a423e3fff40	3571a748-f14b-434b-9915-6a54be3f77f1	3	Simply Murder	After a tragic accident has deadly consequences, an all-out manhunt ensues. Meanwhile, Mike reaches out to a former prison contact.	\N	\N	2025-11-02 23:51:48.247107+00	2021-11-21	55	\N	2025-11-02 23:51:48.247107+00	3336812	1
c4e4902d-887d-40f1-8e64-a67ade7fa7d8	9e469f16-cddc-49cb-8bb0-9a423e3fff40	3571a748-f14b-434b-9915-6a54be3f77f1	4	The Price	Everyone wants something from Mike, who reminds them who is in control. Iris visits Mike’s office. Mariam and Mike discuss Kyle’s future.	\N	\N	2025-11-02 23:51:48.247107+00	2021-11-28	47	\N	2025-11-02 23:51:48.247107+00	3336814	1
5a5849ab-0709-438c-943a-4ed74e18d74f	9e469f16-cddc-49cb-8bb0-9a423e3fff40	3571a748-f14b-434b-9915-6a54be3f77f1	5	Orion	Kyle and Ian are questioned by internal affairs in the wake of the shootout. Bunny asks Mike for help with a close family member.	\N	\N	2025-11-02 23:51:48.247107+00	2021-12-05	47	\N	2025-11-02 23:51:48.247107+00	3358606	1
9352138b-8f2f-4b00-b212-e0dbf9dbd092	9e469f16-cddc-49cb-8bb0-9a423e3fff40	3571a748-f14b-434b-9915-6a54be3f77f1	6	Every Feather	When a fight breaks out on the yard, Sam finds himself in trouble again. Milo goes to extreme lengths to get what he wants. Mike sends a message.	\N	\N	2025-11-02 23:51:48.247107+00	2021-12-12	51	\N	2025-11-02 23:51:48.247107+00	3358607	1
9d70a866-da4b-4190-ab94-f820ae5dbe04	9e469f16-cddc-49cb-8bb0-9a423e3fff40	3571a748-f14b-434b-9915-6a54be3f77f1	7	Along Came a Spider	Mike pays Milo a visit, looking for answers. Tensions at the men’s prison reach a boiling point. Mike makes a disturbing discovery.	\N	\N	2025-11-02 23:51:48.247107+00	2021-12-19	57	\N	2025-11-02 23:51:48.247107+00	3390885	1
1a577f03-841f-422f-9769-4f5539e19e1c	525ad006-b49f-4790-b22e-c426b3fd2445	f87460c0-f2b8-457f-b427-be8515a787f7	6	Old Scores	Lamb and Katinsky go head-to-head. Ho finds himself trapped on a train with a Russian assassin.	/j7NQIxyVruZtOm8i6Q3FjS08OUy.jpg	2022	2025-10-25 05:10:57.034858+00	2022-12-30	49	8.3	2025-10-25 05:11:10.88+00	3987737	2
488575fa-d5aa-4c52-84fb-37399523da7e	525ad006-b49f-4790-b22e-c426b3fd2445	f87460c0-f2b8-457f-b427-be8515a787f7	5	Boardroom Politics	Lamb orders his Slow Horses to walk into traps. River believes something alarming is heading toward London.	/bn7PfRXevaN9EEvaK5f9sAdEwMX.jpg	2022	2025-10-25 05:10:57.034858+00	2022-12-23	45	8.3	2025-10-25 05:11:10.88+00	3987736	2
8cf689a9-83dd-44a8-8506-41e93bad378d	525ad006-b49f-4790-b22e-c426b3fd2445	f87460c0-f2b8-457f-b427-be8515a787f7	4	Cicada	Louisa makes her move on Pashkin. Catherine makes moves of a different kind when she plays high-stakes chess with a sinister stranger.	/wCnfdJi05f5GCSNu3GJmOStJPGM.jpg	2022	2025-10-25 05:10:57.034858+00	2022-12-16	49	8.1	2025-10-25 05:11:10.88+00	3987735	2
33c7041d-385f-4405-8e7d-628045012372	525ad006-b49f-4790-b22e-c426b3fd2445	ec7c8429-8b23-4f0e-8509-4255db455b0d	6	Scars	It's up to the Slow Horses to stop Farouk's team from completing its mission in a final act of mass carnage.	/dPEWltoCYwpAddG3xDUD3ebLW9w.jpg	2025	2025-10-26 09:16:28.525323+00	2025-10-29	52	0.0	2025-10-26 09:16:27.841+00	6284968	5
4ab1a06b-e68c-4640-b5e7-61a7c7748604	525ad006-b49f-4790-b22e-c426b3fd2445	ec7c8429-8b23-4f0e-8509-4255db455b0d	5	Circus	Lamb debriefs River and Coe. Roddy is pulled in to help decipher a piece of code as the destabilization strategy nears its final stage.	/f1rUTzqanS6rRv1gyahuS0yFB8N.jpg	2025	2025-10-26 09:16:28.525323+00	2025-10-22	45	8.1	2025-10-26 09:16:27.841+00	6284967	5
04b8407f-ec90-46a0-a7bc-1deac1e87e5a	525ad006-b49f-4790-b22e-c426b3fd2445	ec7c8429-8b23-4f0e-8509-4255db455b0d	4	Missiles	Flyte sets out to find Roddy's girlfriend. The gang is dispatched to two different campaign events to prevent another attack.	/pohbbnImWScFAE55SUrqe2UdOfn.jpg	2025	2025-10-26 09:16:28.525323+00	2025-10-15	40	8.7	2025-10-26 09:16:27.841+00	6284966	5
dd4d16cd-9a57-457c-9c4d-04f0bf3b2844	525ad006-b49f-4790-b22e-c426b3fd2445	ec7c8429-8b23-4f0e-8509-4255db455b0d	3	Tall Tales	An act of sabotage grinds London to a halt. Taverner interrogates Roddy. Coe is convinced a destabilization strategy is at play.	/c4gbt7hDg6gJni52j9ChQFPon8E.jpg	2025	2025-10-26 09:16:28.525323+00	2025-10-08	40	7.5	2025-10-26 09:16:27.841+00	6284965	5
8006b773-cde8-4422-9ea4-e0b615a2cd55	525ad006-b49f-4790-b22e-c426b3fd2445	ec7c8429-8b23-4f0e-8509-4255db455b0d	2	Incommunicado	Lamb intercepts an assassin. Taverner receives a key piece of intel about the Abbotsfield shooting.	/pqYIYtIYDfWYVXbAJh4cbayy1V2.jpg	2025	2025-10-26 09:16:28.525323+00	2025-10-01	48	8.1	2025-10-26 09:16:27.841+00	6284964	5
dc37079c-5eb4-48d8-aad9-faf9eeef1f97	525ad006-b49f-4790-b22e-c426b3fd2445	ec7c8429-8b23-4f0e-8509-4255db455b0d	1	Bad Dates	A mass shooting rocks London, intensifying a testy mayoral race. Shirley believes one of the Slow Horses was the target of an attempted hit.	/qE61tCQ8u1n0G1zi4GO42nrgW5Q.jpg	2025	2025-10-26 09:16:28.525323+00	2025-09-24	46	8.4	2025-10-26 09:16:27.841+00	6284963	5
12f218ad-3757-4b5d-ad87-ebc68abf6f18	76301014-3c2f-4caf-9658-12e18781e39e	2356946f-d27e-4276-a01c-2c8f29065164	10	Chutes and Murders	A nanny is found bludgeoned to death in the park. Elsewhere, Morgan interferes when Elliot admits to not being invited to his classmate’s party.	/mHONoQ1n6siVwQCuGl6MFaOPQGs.jpg	2025	2025-10-30 15:22:07.920072+00	2025-01-21	44	6.9	2025-10-30 15:22:07.882+00	5882960	1
45a7e06a-e696-4955-8a14-ca906598a56f	76301014-3c2f-4caf-9658-12e18781e39e	2356946f-d27e-4276-a01c-2c8f29065164	2	Dancers in the Dark	As Morgan and the detectives adjust to her new role as a consultant, they investigate the attempted murder of a tap dancer and discover things are not quite as they seem. Meanwhile, Ava learns more about her father, and Morgan surprises her kids.	/8tvVYTPOjaGJqqAR4YeifhezFVA.jpg	2024	2025-10-30 15:22:07.920072+00	2024-09-24	44	7.9	2025-10-30 15:22:07.882+00	5469748	1
131a078f-7aae-413f-bb05-fe67d014493a	76301014-3c2f-4caf-9658-12e18781e39e	2356946f-d27e-4276-a01c-2c8f29065164	1	Pilot	A single mom with an exceptional mind is recruited to the LAPD Major Crimes unit, where her unconventional knack for solving crimes leads to an unusual and unstoppable partnership with a by-the-book seasoned detective.	/28Ntz14QyOrwnuPnBZzMsFdqmZv.jpg	2024	2025-10-30 15:22:07.920072+00	2024-09-17	45	8.4	2025-10-30 15:22:07.882+00	4447673	1
5ae5eb28-61a5-48c3-bace-a99a5b48bf7a	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	14	A Fair to Remember	The crews respond to mass chaos and injuries when a ride malfunctions at the annual Edgewater town fair. Meanwhile, Sharon receives life-changing news.	/tgfJZB4qq34dC3ULCdEevJLBUSS.jpg	2023	2025-10-30 23:17:13.717322+00	2023-02-10	44	7.3	2025-10-30 23:17:13.425+00	4175669	1
2edd1ac5-a03f-40c5-877c-20d16cc76aa6	9e469f16-cddc-49cb-8bb0-9a423e3fff40	3571a748-f14b-434b-9915-6a54be3f77f1	8	The Devil Is Us	Kyle and Kingstown PD try to make sense of the crime scene. Mike takes matters into his own hands. Sam makes a costly mistake.	\N	\N	2025-11-02 23:51:48.247107+00	2021-12-26	55	\N	2025-11-02 23:51:48.247107+00	3390886	1
9e791cae-3cbb-4f2e-8a0f-b47f44c26c32	9e469f16-cddc-49cb-8bb0-9a423e3fff40	3571a748-f14b-434b-9915-6a54be3f77f1	9	The Lie of the Truth	Tracy has good news for Kyle. Mike and Iris spend a peaceful day at the cabin, unaware of the trouble escalating back in town.	\N	\N	2025-11-02 23:51:48.247107+00	2022-01-02	47	\N	2025-11-02 23:51:48.247107+00	3406396	1
8231defb-465a-4f18-85b8-16a6e8524f45	9e469f16-cddc-49cb-8bb0-9a423e3fff40	3571a748-f14b-434b-9915-6a54be3f77f1	10	This Piece of My Soul	Kingstown Prison descends into total chaos. Mike desperately works to help stop a riot that will have serious consequences for all involved.	\N	\N	2025-11-02 23:51:48.247107+00	2022-01-09	51	\N	2025-11-02 23:51:48.247107+00	3423751	1
9b64af70-886a-4174-bd8f-1191e3fd8167	9e469f16-cddc-49cb-8bb0-9a423e3fff40	e36b7492-6473-4a86-87fb-ff58a9253775	1	Coming 'Round the Mountain	Mike works every angle to protect his brother.	\N	\N	2025-11-02 23:51:49.298694+00	2025-10-26	53	\N	2025-11-02 23:51:49.298694+00	6449710	4
58edf6da-cc2e-4dfd-a795-7bb664156627	9e469f16-cddc-49cb-8bb0-9a423e3fff40	e36b7492-6473-4a86-87fb-ff58a9253775	2	Promises to Keep	Mike sends the prison a message and considers an offer from a Detroit legend; Kyle struggles to adjust to his new reality as Ian finds himself in Evelyn's crosshairs.	\N	\N	2025-11-02 23:51:49.298694+00	2025-11-02	\N	\N	2025-11-02 23:51:49.298694+00	6449711	4
e221d8d1-f0b6-4593-a66d-9d7b5fc0e4c9	9e469f16-cddc-49cb-8bb0-9a423e3fff40	e36b7492-6473-4a86-87fb-ff58a9253775	3	People Who Died	Mike and Ian discover a coverup that leads to an unexpected source; Moses shows Bunny the ropes, Kyle wrestles with his newfound futility and as the cartel threat grows, Mike enlists help to snuff it out at its source.	\N	\N	2025-11-02 23:51:49.298694+00	2025-11-09	\N	\N	2025-11-02 23:51:49.298694+00	6449712	4
97c4bb66-bb59-41d1-9e89-b90bdefb540d	9e469f16-cddc-49cb-8bb0-9a423e3fff40	e36b7492-6473-4a86-87fb-ff58a9253775	4	Sins of Omission	Confronted with the cartel's unexpected strength, Mike's orders weave their way through the prison; Evelyn's continued probe puts her in danger; Mike grows closer to a new C.O. while putting an old friend on notice.	\N	\N	2025-11-02 23:51:49.298694+00	2025-11-16	\N	\N	2025-11-02 23:51:49.298694+00	6449717	4
f0951b8d-9f56-40f8-a102-10ba9f1bf26d	9e469f16-cddc-49cb-8bb0-9a423e3fff40	e36b7492-6473-4a86-87fb-ff58a9253775	5	Damned	New dangers threaten Mike's family as Callahan comes back into focus; Mike goes toe-to-toe with Hobbs as Ian goes to great lengths to sabotage Evelyn's case against him.	\N	\N	2025-11-02 23:51:49.298694+00	2025-11-23	\N	\N	2025-11-02 23:51:49.298694+00	6449718	4
a8d78394-1ea9-4ef4-bfe3-c702f4c6d588	9e469f16-cddc-49cb-8bb0-9a423e3fff40	e36b7492-6473-4a86-87fb-ff58a9253775	6	Episode 6		\N	\N	2025-11-02 23:51:49.298694+00	2025-11-30	\N	\N	2025-11-02 23:51:49.298694+00	6449719	4
3b2dc7b9-e9d9-4ef5-89a6-f415588b0b70	9e469f16-cddc-49cb-8bb0-9a423e3fff40	e36b7492-6473-4a86-87fb-ff58a9253775	7	My Way		\N	\N	2025-11-02 23:51:49.298694+00	2025-12-07	\N	\N	2025-11-02 23:51:49.298694+00	6449720	4
8f6f4b71-3d6e-4a0d-a19b-94444efd519f	9e469f16-cddc-49cb-8bb0-9a423e3fff40	e36b7492-6473-4a86-87fb-ff58a9253775	8	Belleville		\N	\N	2025-11-02 23:51:49.298694+00	2025-12-14	\N	\N	2025-11-02 23:51:49.298694+00	6449721	4
39e6baba-f6a9-48ad-8dcc-dc9ecf8b3986	9e469f16-cddc-49cb-8bb0-9a423e3fff40	e36b7492-6473-4a86-87fb-ff58a9253775	9	Teeth and Tissue		\N	\N	2025-11-02 23:51:49.298694+00	2025-12-21	\N	\N	2025-11-02 23:51:49.298694+00	6449722	4
21c98aa5-6e2b-4aa8-b623-b1b7ae5e43d8	9e469f16-cddc-49cb-8bb0-9a423e3fff40	e36b7492-6473-4a86-87fb-ff58a9253775	10	Belly of the Beast		\N	\N	2025-11-02 23:51:49.298694+00	2025-12-28	\N	\N	2025-11-02 23:51:49.298694+00	6449723	4
086c6c37-5ab1-4c61-a171-d69350dc26c6	76301014-3c2f-4caf-9658-12e18781e39e	2356946f-d27e-4276-a01c-2c8f29065164	13	Let's Play	An anonymous tip to the LAPD sparks an unusual multiple-victim kidnapping investigation, forcing the team to rely on board games and puzzles to track down their suspect.	/qsLQhCvq6mYWRS3k3bdTlJ7D9uq.jpg	2025	2025-10-30 15:22:07.920072+00	2025-02-11	44	7.8	2025-10-30 15:22:07.882+00	5899515	1
8aac7f92-969f-45a3-82e6-f12802b5db56	76301014-3c2f-4caf-9658-12e18781e39e	2356946f-d27e-4276-a01c-2c8f29065164	12	Partners	The FBI joins the investigation into the murder of a controversial tech magnate, forcing Karadec to reunite with his former partner. Meanwhile, Ludo becomes overwhelmed with his increasing childcare duties.	/ix9BoTKRZEIdAYd70vGSrTUDzX9.jpg	2025	2025-10-30 15:22:07.920072+00	2025-02-04	45	8.1	2025-10-30 15:22:07.882+00	5899514	1
ecb1515c-d631-4239-845e-8826ecc0539f	9e469f16-cddc-49cb-8bb0-9a423e3fff40	48bd4f5a-159b-4bcd-bfb2-072cbb79fdd6	1	Never Missed a Pigeon	In the wake of the Kingstown Prison riot, violence and chaos ensue in the newly formed tent city. Mike and Bunny discuss what must be done to solve the leadership void on the inside. Kyle begins his new job with the Michigan State Police.	\N	\N	2025-11-02 23:51:48.610334+00	2023-01-15	53	\N	2025-11-02 23:51:48.610334+00	4036012	2
e6c6722b-f5b6-42c6-ae55-c52fcca8e201	9e469f16-cddc-49cb-8bb0-9a423e3fff40	48bd4f5a-159b-4bcd-bfb2-072cbb79fdd6	2	Staring at the Devil	After a power vacuum in tent city spills out into Kingstown, Mike makes a bold move to try and restore order. Iris is uneasy about her new living arrangement. Kyle finds himself in a dangerous situation.	\N	\N	2025-11-02 23:51:48.610334+00	2023-01-22	47	\N	2025-11-02 23:51:48.610334+00	4165300	2
4eaa9206-8e3e-41ea-a320-282d30296a22	76301014-3c2f-4caf-9658-12e18781e39e	2356946f-d27e-4276-a01c-2c8f29065164	11	The Sauna at the End of the Stairs	Soto reopens an old murder case in the famous Donovan family, determined to uncover the true killer in classic “whodunit” style.	/mbVgPRT9pnHOfOGIQY2e9xcYfM6.jpg	2025	2025-10-30 15:22:07.920072+00	2025-01-28	42	7.8	2025-10-30 15:22:07.882+00	5889903	1
3927ec4e-05b4-46ee-9731-9f2cd21b01b9	76301014-3c2f-4caf-9658-12e18781e39e	2356946f-d27e-4276-a01c-2c8f29065164	9	The RAMs	A famous baseball newscaster is murdered, and the team is on the case. Meanwhile, Soto and Morgan meet with a potential lead to discuss Roman's disappearance, and Tom has some personal news to share with Morgan.	/9BJOIhvFoBPOSJjrnOot0FLNBmb.jpg	2025	2025-10-30 15:22:07.920072+00	2025-01-14	45	7.5	2025-10-30 15:22:07.882+00	5726891	1
72b221a5-626d-4c4c-a6e6-1e6b2d8edd24	76301014-3c2f-4caf-9658-12e18781e39e	2356946f-d27e-4276-a01c-2c8f29065164	8	Obsessed	The team investigates a mysterious young girl who was found attacked on a beach. Meanwhile, Morgan begins to let her guard down on her date with Tom, and Soto comes one step closer to finding out what happened to Roman.	/ohE8T1HBbBt2z0XHm9qoYQItGxs.jpg	2025	2025-10-30 15:22:07.920072+00	2025-01-07	44	7.9	2025-10-30 15:22:07.882+00	5726890	1
04fd24ce-0bf7-441f-a357-d48cc26dfa08	76301014-3c2f-4caf-9658-12e18781e39e	2356946f-d27e-4276-a01c-2c8f29065164	7	One of Us	Morgan agrees to show Ava around the LAPD, but things quickly take a dangerous turn when the precinct is held hostage by the friends of a recently convicted man. Can Morgan and the detectives outsmart their captors and lead everyone to safety?	/7ykO0C073JSSK2nSsZdc1s67byO.jpg	2024	2025-10-30 15:22:07.920072+00	2024-11-12	44	7.8	2025-10-30 15:22:07.882+00	5665470	1
33ddc984-3e8d-4cde-b5e1-cbaa7ff7ad93	76301014-3c2f-4caf-9658-12e18781e39e	2356946f-d27e-4276-a01c-2c8f29065164	6	Hangover	A wild office party at a high-profile medical technology startup leads to the shocking murder of the founder and CEO, and Morgan and the team are on the case. Meanwhile, a new co-worker at the precinct catches Morgan's eye.	/kkoPL9MOcSCGOnwvN9ppffJQAqo.jpg	2024	2025-10-30 15:22:07.920072+00	2024-10-29	45	7.4	2025-10-30 15:22:07.882+00	5665468	1
bbaba926-331e-4020-9408-dd4b6df907e7	76301014-3c2f-4caf-9658-12e18781e39e	2356946f-d27e-4276-a01c-2c8f29065164	5	Croaked	The team investigates the death of an exotic animal veterinarian, uncovering a complicated love triangle in the process. Work interferes with Karadec's dating life, while Morgan follows a parental hunch about her teenage daughter and snoops on Ava.	/gAka0LffdeByxv42UIw9TZTucct.jpg	2024	2025-10-30 15:22:07.920072+00	2024-10-22	45	7.2	2025-10-30 15:22:07.882+00	5646700	1
6c7b14b3-52a2-4b3c-972a-96480ba73536	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	13	You Know Your Dragon Best	The crews work to contain a dangerous forest fire and save a group of environmentalists protesting a housing development.	/dG60EcAX7eDE3BPWSM5oWpnFkwg.jpg	2023	2025-10-30 23:17:13.717322+00	2023-02-03	44	7.3	2025-10-30 23:17:13.425+00	4157676	1
ee3006b1-68da-4f85-a1c5-f83a1b349ee0	9e469f16-cddc-49cb-8bb0-9a423e3fff40	48bd4f5a-159b-4bcd-bfb2-072cbb79fdd6	3	Five at Five	Mike asks for help in finding Iris, and later takes matters into his own hands. A move by Robert and his team puts Mike's larger plan in jeopardy. Kyle has a request for Kingstown PD.	\N	\N	2025-11-02 23:51:48.610334+00	2023-01-29	38	\N	2025-11-02 23:51:48.610334+00	4183496	2
5da62d54-64ba-405b-bf59-db6ac637bac6	9e469f16-cddc-49cb-8bb0-9a423e3fff40	48bd4f5a-159b-4bcd-bfb2-072cbb79fdd6	4	The Pool	Mike increases pressure on Evelyn to honor her side of the deal before another unexpected event at tent city. Bunny worries Mike has lost control. Mariam attempts an act of good will.	\N	\N	2025-11-02 23:51:48.610334+00	2023-02-05	40	\N	2025-11-02 23:51:48.610334+00	4183498	2
8555af8b-e022-4286-b966-91ce4c3144b4	9e469f16-cddc-49cb-8bb0-9a423e3fff40	48bd4f5a-159b-4bcd-bfb2-072cbb79fdd6	5	Kill Box	In the wake of the tent city transfer, Mike finds himself in a race to locate Bunny. Kareem surveys the new power structure, and later gets some unsettling news. Kyle contemplates his next move. Milo looks to fix Joseph's mistake.	\N	\N	2025-11-02 23:51:48.610334+00	2023-02-12	40	\N	2025-11-02 23:51:48.610334+00	4183499	2
426e1a30-f7dc-43ee-a00d-5c2249aa3c63	9e469f16-cddc-49cb-8bb0-9a423e3fff40	48bd4f5a-159b-4bcd-bfb2-072cbb79fdd6	6	Left with the Nose	Mike leverages a favor with the new powers in charge. Bunny finds himself short on patience as Anchor Bay becomes increasingly volatile. Kyle and Mike have a heart to heart. Robert gets some troubling news.	\N	\N	2025-11-02 23:51:48.610334+00	2023-02-19	38	\N	2025-11-02 23:51:48.610334+00	4183501	2
e3e3633d-3633-4e15-a6b9-445390d9209d	9e469f16-cddc-49cb-8bb0-9a423e3fff40	48bd4f5a-159b-4bcd-bfb2-072cbb79fdd6	7	Drones	Robert, Kyle, and Ian look to get their story straight as the internal affairs investigation looms. In the wake of Lockett's murder, Mike and Evelyn's relationship grows tense. Mike takes care of a problem for Bunny. Tracy worries about Kyle.	\N	\N	2025-11-02 23:51:48.610334+00	2023-02-26	35	\N	2025-11-02 23:51:48.610334+00	4243385	2
1dfb11f3-0fce-4051-b701-789e29a1f563	9e469f16-cddc-49cb-8bb0-9a423e3fff40	48bd4f5a-159b-4bcd-bfb2-072cbb79fdd6	8	Santa Jesus	Mike spends his version of a day off the grid. Ian goes to great lengths to solve a problem. Bunny has a gift for Raphael. Milo speaks to Iris alone.	\N	\N	2025-11-02 23:51:48.610334+00	2023-03-05	47	\N	2025-11-02 23:51:48.610334+00	4243388	2
5aee4bb1-d9a5-4490-b150-f4a7766a8ef1	9e469f16-cddc-49cb-8bb0-9a423e3fff40	48bd4f5a-159b-4bcd-bfb2-072cbb79fdd6	9	Peace in the Valley	Mike and Milo discuss a possible trade. Bunny makes a brazen move and later has a demand for Mike. Mariam looks to track down Jacob. Evelyn is livid with Mike.	\N	\N	2025-11-02 23:51:48.610334+00	2023-03-12	37	\N	2025-11-02 23:51:48.610334+00	4243390	2
1cfda893-298f-4dbe-bd7c-325721c3f3c4	9e469f16-cddc-49cb-8bb0-9a423e3fff40	48bd4f5a-159b-4bcd-bfb2-072cbb79fdd6	10	Little Green Ant	It's all hands on deck as the war spills out into the streets of Kingstown. A mistake has serious repercussions. The trust between Mike and Bunny reaches a moment of truth. Iris finds herself with nowhere else to go.	\N	\N	2025-11-02 23:51:48.610334+00	2023-03-19	47	\N	2025-11-02 23:51:48.610334+00	4243393	2
cc9b078c-4f13-4b3e-bf86-4a1512be6e7b	9e469f16-cddc-49cb-8bb0-9a423e3fff40	b0cc2092-95dd-404f-9866-72c7dbb420d0	1	Soldier's Heart	Tensions are high as tragedy strikes in Kingstown. Meanwhile, a new face of the Russian mob sets up shop in the city.	\N	\N	2025-11-02 23:51:48.954982+00	2024-06-02	55	\N	2025-11-02 23:51:48.954982+00	5242214	3
bac15c31-d849-41ed-b3a4-83a742f6c7e2	9e469f16-cddc-49cb-8bb0-9a423e3fff40	b0cc2092-95dd-404f-9866-72c7dbb420d0	2	Guts	Anchor Bay gets a new inmate as Mike investigates recent deaths both inside and outside of prison walls.	\N	\N	2025-11-02 23:51:48.954982+00	2024-06-09	43	\N	2025-11-02 23:51:48.954982+00	5373278	3
3283c9ba-09ea-44e4-8349-e2e011c3fb83	9e469f16-cddc-49cb-8bb0-9a423e3fff40	b0cc2092-95dd-404f-9866-72c7dbb420d0	3	Barbarians at the Gate	The Mayor makes his presence known to Konstantin. Bunny brings Mike up to speed on a failed assassination attempt.	\N	\N	2025-11-02 23:51:48.954982+00	2024-06-16	41	\N	2025-11-02 23:51:48.954982+00	5377236	3
dc504c9d-f670-4f9f-891d-5bc1363a4972	9e469f16-cddc-49cb-8bb0-9a423e3fff40	b0cc2092-95dd-404f-9866-72c7dbb420d0	4	Rag Doll	Desperate to confirm the source of a spate of bombings, Mike extends an unlikely olive branch.	\N	\N	2025-11-02 23:51:48.954982+00	2024-06-23	41	\N	2025-11-02 23:51:48.954982+00	5377237	3
2e6aedf9-02ef-48b6-b9c5-2221111a8d37	9e469f16-cddc-49cb-8bb0-9a423e3fff40	b0cc2092-95dd-404f-9866-72c7dbb420d0	5	Iris	Danger erupts when Iris confronts her past. The Mayor finds a new chess piece as Bunny and Konstantin's rivalry reaches new heights.	\N	\N	2025-11-02 23:51:48.954982+00	2024-06-30	48	\N	2025-11-02 23:51:48.954982+00	5377238	3
9a932713-5d6a-494f-a4bb-0cc9154a1a93	9e469f16-cddc-49cb-8bb0-9a423e3fff40	b0cc2092-95dd-404f-9866-72c7dbb420d0	6	Ecotone	After an attack hits close to home, Mike is given an ultimatum that could change everything.	\N	\N	2025-11-02 23:51:48.954982+00	2024-07-07	39	\N	2025-11-02 23:51:48.954982+00	5377239	3
893b0c97-cb2f-4f0a-8260-86c2919a9332	9e469f16-cddc-49cb-8bb0-9a423e3fff40	b0cc2092-95dd-404f-9866-72c7dbb420d0	7	Marya Was Here	An incident on the bridge raises questions across Kingstown. Mike sets a risky plan in motion.	\N	\N	2025-11-02 23:51:48.954982+00	2024-07-14	44	\N	2025-11-02 23:51:48.954982+00	5377240	3
26fe27d6-9d73-4f13-a2aa-74dadba404a6	9e469f16-cddc-49cb-8bb0-9a423e3fff40	b0cc2092-95dd-404f-9866-72c7dbb420d0	8	Captain of the Sh*t Out of Luck	Anchor Bay is attacked from outside its prison walls. Mike takes care of some important business at Kingstown Women's Prison.	\N	\N	2025-11-02 23:51:48.954982+00	2024-07-21	46	\N	2025-11-02 23:51:48.954982+00	5377242	3
ca959a2f-e395-4a4f-8c56-8385af7a1608	9e469f16-cddc-49cb-8bb0-9a423e3fff40	b0cc2092-95dd-404f-9866-72c7dbb420d0	9	Home on the Range	Unfinished business haunts Kingstown as the Crips seek revenge at the hospital.	\N	\N	2025-11-02 23:51:48.954982+00	2024-07-28	58	\N	2025-11-02 23:51:48.954982+00	5377244	3
9a602e0c-7aee-41a8-bda0-a9fcdcdfbca6	9e469f16-cddc-49cb-8bb0-9a423e3fff40	b0cc2092-95dd-404f-9866-72c7dbb420d0	10	Comeuppance	Mike's plan for the warring factions in Kingstown hits turbulence.	\N	\N	2025-11-02 23:51:48.954982+00	2024-08-04	65	\N	2025-11-02 23:51:48.954982+00	5377245	3
b4981095-d543-4133-ac59-674bd5e39963	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	22	I Know It Feels Impossible	The station 42 and Three Rock crews face a daring rescue when a massive mudslide tears through Edgewater. Meanwhile, Bode's freedom is on the line at his parole hearing.	/f0MJYigcUv9Eqj96U7sYKK3RHK2.jpg	2023	2025-10-30 23:17:13.717322+00	2023-05-19	44	7.5	2025-10-30 23:17:13.425+00	4330163	1
32a7fdc1-e6bf-4232-815b-4f9ba07d1ca9	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	21	Backfire	The station 42 and Three Rock crews are called to a backfire started by a private firefighting company to protect a high-end winery but instead threatens to grow out of control.	/y6EHzgiMCechuusgaJYwK8S1orV.jpg	2023	2025-10-30 23:17:13.717322+00	2023-05-12	44	4.6	2025-10-30 23:17:13.425+00	4330162	1
d55de8ee-f1ea-4c11-9e18-09fa44753d58	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	20	At the End of My Rope	The station 42 and third rock crews respond to a deadly explosion at an abandoned mine. Meanwhile, Bode faces a difficult decision that could have serious consequences	/hfppUGxtMJRLqOIEBPwssGROfyF.jpg	2023	2025-10-30 23:17:13.717322+00	2023-05-05	44	7.3	2025-10-30 23:17:13.425+00	4330159	1
861ee5a3-d48a-4371-bf8c-1954faaa6178	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	11	Mama Bear	A former inmate firefighter harboring a grudge against Sharon returns to carry out his revenge.	/zuy3fguueMvy1ZBECmjs86SPFcd.jpg	2023	2025-10-30 23:17:13.717322+00	2023-01-20	44	7.8	2025-10-30 23:17:13.425+00	4054254	1
848983a7-adfb-48aa-bd58-fdadc660a014	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	12	Two Pink Lines	Bode and his fellow prison inmate firefighters band together with the civilian station 42 crew to battle a monstrous fire that erupts after a plane crash. Meanwhile, the crews welcome a new member to the family.	/25IDdnk5omYnhJou6q6B1UThcy0.jpg	2023	2025-10-30 23:17:13.717322+00	2023-01-29	44	7.0	2025-10-30 23:17:13.425+00	4054256	1
b8a3149e-dacf-435f-91cc-5fad242fc70e	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	10	Get Your Hopes Up	A box truck crashes into the station, causing a power outage and triggering a dangerous fire. Meanwhile, Sharon and Bode's ex-girlfriend, Cara, face multiple medical emergencies.	/5KFIvLC1dOZLmrmRTBfxJ3s32qr.jpg	2023	2025-10-30 23:17:13.717322+00	2023-01-13	40	7.0	2025-10-30 23:17:13.425+00	4054253	1
9f5e9de2-8b55-4484-8816-33186399f883	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	9	No Good Deed	An internal investigation is launched after a difficult rescue went awry and a life was lost.	/uc0FU1qtch0w28e0PEIRKScGHNv.jpg	2023	2025-10-30 23:17:13.717322+00	2023-01-06	44	7.4	2025-10-30 23:17:13.425+00	4054252	1
0fc1564d-e74f-4108-b941-994a3b214ae1	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	8	Bad Guy	Vince's judgment is compromised when a harrowing rescue of two siblings triggers emotional memories of the night his daughter died in a car accident.	/xcUEAM5v2m2kSpUtxf0tAGkBVXM.jpg	2022	2025-10-30 23:17:13.717322+00	2022-12-09	44	7.7	2025-10-30 23:17:13.425+00	4042668	1
ce84a80f-14ad-454a-a6c1-1469ead0fa0a	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	7	Happy to Help	Bode's crew is accused of stealing a designer watch from a fire mop up, and the crew responds to a high-stakes call about an extremely dangerous gas leak.	/4PPFvdbr0VPzxuHpvT7E9tkkhYl.jpg	2022	2025-10-30 23:17:13.717322+00	2022-12-02	44	7.3	2025-10-30 23:17:13.425+00	4040484	1
9554457b-510c-479e-8886-2c5d97242886	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	6	Like Old Times	After a hiker falls from a steep cliff, Bode and Jake put aside their differences to make a daring rescue. Also, Sharon reveals devastating news to Bode.	/9gGKj5gdX853wlZzD0WfGzJxRHH.jpg	2022	2025-10-30 23:17:13.717322+00	2022-11-18	44	7.3	2025-10-30 23:17:13.425+00	4003494	1
666e1b5a-e8ea-4aaf-8a49-d2633b3e7c4c	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	5	Get Some, Be Safe	A vegetation fire gets complicated for the crew when a panicked horse refuses to evacuate a burning barn. Meanwhile, Vince's brother Luke, the Cal Fire communications director, makes a surprise visit in town.	/nSbSjnk5tLT804UV0yZLCxA6thD.jpg	2022	2025-10-30 23:17:13.717322+00	2022-11-04	43	8.0	2025-10-30 23:17:13.425+00	4003493	1
9246a7c5-8b52-41ae-88ce-83fb64d1dd55	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	4	Work, Don't Worry	The crew engages in a search and rescue mission after a building collapses and Division Chief Sharon is forced to make a gut-wrenching decision.	/tzvkGSLwX4fWJl1P360jZqMNZEY.jpg	2022	2025-10-30 23:17:13.717322+00	2022-10-28	44	7.5	2025-10-30 23:17:13.425+00	3976049	1
589c6e2a-f301-41c0-a413-111911dd576d	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	3	Where There's Smoke...	When the crew responds to a call in a remote forest, they come under fire by an outlaw protecting illegal marijuana crops.	/ulPfrTyQo2qPHdM0ZM9BNxH6vy9.jpg	2022	2025-10-30 23:17:13.717322+00	2022-10-21	40	7.2	2025-10-30 23:17:13.425+00	3976047	1
2f36d468-f4d5-4882-9f8f-5283ff94adde	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	2	The Fresh Prince of Edgewater	After Bode requests to be transferred to a different city, his future in Edgewater hangs in the balance. Meanwhile, the crew joins forces to protect the town from a treacherous storm.	/lgCSSOTfsIhkDuIpFshEP2sPV9B.jpg	2022	2025-10-30 23:17:13.717322+00	2022-10-14	44	8.4	2025-10-30 23:17:13.425+00	3967545	1
f6dff7f5-495c-4e1c-a730-78abd66a92a3	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	ea7e2acc-8b5d-4abb-8f92-1081af26f034	1	Pilot	Five years ago, Bode burned down everything in his life, leaving town with a big secret. Now he's back, with the rap sheet of a criminal and the audacity to believe in a chance for redemption with Cal Fire.	/peUwLXgtG8DDDTBm3eFYGKqKXCi.jpg	2022	2025-10-30 23:17:13.717322+00	2022-10-07	44	8.1	2025-10-30 23:17:13.425+00	3729098	1
c7ffa72c-8633-449a-9e5a-3d9ba7f7602b	525ad006-b49f-4790-b22e-c426b3fd2445	08dff48e-c356-44d5-a707-072749b0b360	1	Strange Games	A romantic relationship in Istanbul ends badly. Lamb hits the panic button when one of his Slow Horses fails to show up for work.	\N	\N	2025-10-31 04:17:52.627392+00	2023-11-29	47	\N	2025-10-31 04:17:52.627392+00	4745574	3
3be5a350-b817-4ec7-b1f2-7d36e92c073a	525ad006-b49f-4790-b22e-c426b3fd2445	08dff48e-c356-44d5-a707-072749b0b360	2	Hard Lessons	River has to steal something out of the Park to save a life. Lamb realizes a stranger game is afoot.	\N	\N	2025-10-31 04:17:52.627392+00	2023-11-29	44	\N	2025-10-31 04:17:52.627392+00	4745575	3
dbd682fc-3d12-46d3-9fb0-65d4cc3544a7	525ad006-b49f-4790-b22e-c426b3fd2445	08dff48e-c356-44d5-a707-072749b0b360	3	Negotiating with Tigers	Marcus and Shirley face Lamb's wrath. River discovers revenge is a dish best served cold.	\N	\N	2025-10-31 04:17:52.627392+00	2023-12-06	47	\N	2025-10-31 04:17:52.627392+00	4745576	3
64ac1f7b-0e0c-40ac-b654-94223bea292c	525ad006-b49f-4790-b22e-c426b3fd2445	08dff48e-c356-44d5-a707-072749b0b360	4	Uninvited Guests	Tearney makes a bold move. The Slow Horses assist the Tiger Team, unaware of their hidden agenda. Lamb and Ho take a road trip.	\N	\N	2025-10-31 04:17:52.627392+00	2023-12-13	48	\N	2025-10-31 04:17:52.627392+00	4745577	3
b250c161-39ea-4d78-a2dd-ba84a7dbff16	525ad006-b49f-4790-b22e-c426b3fd2445	08dff48e-c356-44d5-a707-072749b0b360	5	Cleaning Up	Taverner and Tearney face off for control of MI5. River and Louisa find themselves caught in the crossfire.	\N	\N	2025-10-31 04:17:52.627392+00	2023-12-20	44	\N	2025-10-31 04:17:52.627392+00	4745578	3
cae4a014-f850-4ac8-b254-f2391b95be82	525ad006-b49f-4790-b22e-c426b3fd2445	08dff48e-c356-44d5-a707-072749b0b360	6	Footprints	The Slow Horses fight for their lives. Lamb shares some devastating truths with Catherine.	\N	\N	2025-10-31 04:17:52.627392+00	2023-12-27	48	\N	2025-10-31 04:17:52.627392+00	4745579	3
58722bce-f093-4132-9daa-26fa2377f247	525ad006-b49f-4790-b22e-c426b3fd2445	f21d1855-c60d-44ee-a3a6-eab94c92f0c4	1	Identity Theft	A London bombing puts Taverner under pressure. When River grows concerned for his grandfather, Louisa encourages him to go for a visit.	\N	\N	2025-10-31 04:17:52.911932+00	2024-09-04	47	\N	2025-10-31 04:17:52.911932+00	5440285	4
f8a1bcff-a05e-4781-a2a3-dbfcce6d90f6	525ad006-b49f-4790-b22e-c426b3fd2445	f21d1855-c60d-44ee-a3a6-eab94c92f0c4	2	A Stranger Comes to Town	A naive agent makes a discovery about the Westacres bomber. Lamb suspects that David knows more than he's letting on.	\N	\N	2025-10-31 04:17:52.911932+00	2024-09-11	49	\N	2025-10-31 04:17:52.911932+00	5440286	4
1196a4b8-7c7b-49f1-b0b5-3f35f0285a9a	525ad006-b49f-4790-b22e-c426b3fd2445	f21d1855-c60d-44ee-a3a6-eab94c92f0c4	3	Penny for Your Thoughts	River is trapped in France. Back at Slough House, the Dogs have come for Lamb.	\N	\N	2025-10-31 04:17:52.911932+00	2024-09-18	49	\N	2025-10-31 04:17:52.911932+00	5440287	4
5077437a-fe8b-4b81-a516-dead8792bf89	525ad006-b49f-4790-b22e-c426b3fd2445	f21d1855-c60d-44ee-a3a6-eab94c92f0c4	4	Returns	Taverner is desperate to hide dangerous secrets. River seeks answers at his grandfather's house.	\N	\N	2025-10-31 04:17:52.911932+00	2024-09-25	46	\N	2025-10-31 04:17:52.911932+00	5440288	4
beb45b8b-3c2b-49c1-b597-cb2a2f634d5c	525ad006-b49f-4790-b22e-c426b3fd2445	f21d1855-c60d-44ee-a3a6-eab94c92f0c4	5	Grave Danger	Lamb questions David about France as River comes face to face with the enemy.	\N	\N	2025-10-31 04:17:52.911932+00	2024-10-02	43	\N	2025-10-31 04:17:52.911932+00	5440289	4
7f5b93e0-2f43-4a20-b3c2-7ffff34ab734	525ad006-b49f-4790-b22e-c426b3fd2445	f21d1855-c60d-44ee-a3a6-eab94c92f0c4	6	Hello Goodbye	Impossible decisions are faced and sacrifices are made.	\N	\N	2025-10-31 04:17:52.911932+00	2024-10-09	56	\N	2025-10-31 04:17:52.911932+00	5440290	4
b378c275-dd99-4cfd-aa55-11f57967399c	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c1706c69-cb44-425d-8246-948d7f16fc87	1	Something's Coming	Bode is back in prison where he receives some shocking news. Meanwhile, the station 42 crew responds to a massive earthquake that rocks Edgewater to its core.	\N	\N	2025-10-31 07:07:47.552585+00	2024-02-16	44	\N	2025-10-31 07:07:47.552585+00	4918706	2
0a8df599-40a5-41ff-9a91-dbdb59169c71	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c1706c69-cb44-425d-8246-948d7f16fc87	2	Like Breathing Again	While breaking up a bonfire party, the station 42 crew is called to complete a dangerous and highly complex cave rescue.	\N	\N	2025-10-31 07:07:47.552585+00	2024-02-23	44	\N	2025-10-31 07:07:47.552585+00	5103672	2
0ccf5bdb-c138-40f8-a19d-fbb16c6244e3	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c1706c69-cb44-425d-8246-948d7f16fc87	3	See You Next Apocalypse	When a family refuses to evacuate their property during a massive wildfire that is escalating quickly, Jake is faced with a heartbreaking decision.	\N	\N	2025-10-31 07:07:47.552585+00	2024-03-01	44	\N	2025-10-31 07:07:47.552585+00	5124757	2
b3a783e7-323d-4cbc-8253-66402c3a3c98	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c1706c69-cb44-425d-8246-948d7f16fc87	4	Too Many Unknowns	The station 42 and third rock crews respond to a chemical plant after a dangerous toxic spill goes up in flames.	\N	\N	2025-10-31 07:07:47.552585+00	2024-03-15	44	\N	2025-10-31 07:07:47.552585+00	5177511	2
3fa40f41-dc6e-4abc-82dd-b5eb9c5ddcb1	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c1706c69-cb44-425d-8246-948d7f16fc87	5	This Storm Will Pass	The station 42 crew must protect Edgewater and take cover when an extremely rare and dangerous fire tornado leaves lives in peril.	\N	\N	2025-10-31 07:07:47.552585+00	2024-04-05	44	\N	2025-10-31 07:07:47.552585+00	5204131	2
d3bafd15-d739-44ab-9aa1-6ec3aff0d1b8	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c1706c69-cb44-425d-8246-948d7f16fc87	6	Alert the Sheriff	After a fire camp inmate escapes from Three Rock, the deputy sheriff with a surprising connection to the Leones, Mickey, is called to investigate.	\N	\N	2025-10-31 07:07:47.552585+00	2024-04-12	44	\N	2025-10-31 07:07:47.552585+00	5259953	2
38b30850-0ce8-4cb1-898b-8e750cb47061	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c1706c69-cb44-425d-8246-948d7f16fc87	7	A Hail Mary	The future of Three Rock is in jeopardy as public opinion of the camp grows increasingly negative.	\N	\N	2025-10-31 07:07:47.552585+00	2024-04-26	42	\N	2025-10-31 07:07:47.552585+00	5261427	2
3a5b9085-d491-4c7c-b7f0-453400d78e13	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c1706c69-cb44-425d-8246-948d7f16fc87	8	It's Not Over	With the future of Three Rock in jeopardy, Station 42 and Three Rock host Edgewater's 22nd Annual Firefighters' Ball in an effort to impress the governor and save the camp. Meanwhile, Gabriela's mom, Roberta, makes a surprise appearance at the event.	\N	\N	2025-10-31 07:07:47.552585+00	2024-05-03	44	\N	2025-10-31 07:07:47.552585+00	5261428	2
5e6efcdf-b424-41fd-a851-b74c43c7f12f	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c1706c69-cb44-425d-8246-948d7f16fc87	9	No Future, No Consequences	Station 42 and Three Rock battle a dangerous campaign fire where our heroes struggle with difficult decisions.	\N	\N	2025-10-31 07:07:47.552585+00	2024-05-10	43	\N	2025-10-31 07:07:47.552585+00	5261429	2
c2f96873-86ed-4219-bfbb-f47997b825dc	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c1706c69-cb44-425d-8246-948d7f16fc87	10	I Do	Gabriela prepares to walk down the aisle on her wedding day as Bode receives some surprising news.	\N	\N	2025-10-31 07:07:47.552585+00	2024-05-17	44	\N	2025-10-31 07:07:47.552585+00	5265635	2
6c4e8e6c-f78d-4d7f-bbbd-827a79b37d54	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	1	What the Bride Said	In the midst of Gabriela and Diego's wedding, a helicopter crash ignites chaos and the team immediately jumps into action to stop fires and help victims.	\N	\N	2025-10-31 07:07:47.952882+00	2024-10-18	43	\N	2025-10-31 07:07:47.952882+00	5474928	3
3915e893-8362-4331-808a-b0e5fe5b53a8	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	2	Firing Squad	Bode receives a life-changing opportunity that could impact his future as a firefighter.	\N	\N	2025-10-31 07:07:47.952882+00	2024-10-25	44	\N	2025-10-31 07:07:47.952882+00	5638508	3
0bc768e2-fc60-4d96-829a-9ec39f4ca0a5	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	3	Welcome to the Cult	Bode and Gabriela consider confessing a huge secret they have been hiding.	\N	\N	2025-10-31 07:07:47.952882+00	2024-11-01	44	\N	2025-10-31 07:07:47.952882+00	5680164	3
1f5441f0-f3f9-4497-8f02-c0b8404ad77d	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	4	Keep Your Cool	The temperature is high and tensions are even higher when the crew has to execute an advanced elevator rescue during a heat-induced power outage.	\N	\N	2025-10-31 07:07:47.952882+00	2024-11-08	43	\N	2025-10-31 07:07:47.952882+00	5680165	3
8e2ce0da-7965-40d2-9e1a-8f715b849dfb	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	5	Edgewater's About to Get Real Cozy	Station 42 and Three Rock jump into action when an airplane makes an emergency landing outside of Edgewater.	\N	\N	2025-10-31 07:07:47.952882+00	2024-11-15	44	\N	2025-10-31 07:07:47.952882+00	5700641	3
5d2ade06-7376-40fd-9ed2-c1a072e04324	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	6	Not Without My Birds	When a fire breaks out in a park containing an eagle nest, Station 42 and Three Rock work to rescue the protected species and prevent the fire from spreading into town.	\N	\N	2025-10-31 07:07:47.952882+00	2024-11-22	43	\N	2025-10-31 07:07:47.952882+00	5700644	3
b9e17558-6f69-4a8b-a412-c7167c2e1f21	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	7	False Alarm	Station 42 responds to a false alarm call that escalates into a dangerous hostage situation.	\N	\N	2025-10-31 07:07:47.952882+00	2024-12-06	43	\N	2025-10-31 07:07:47.952882+00	5735505	3
24f63021-34b3-4fa6-8d61-e4a4291703d7	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	8	Promise Me	When a series of dangerous underground zombie fires emerge, the team must protect the town, forcing Eve to have a less-than-warm reunion with her estranged father, Elroy Edwards.	\N	\N	2025-10-31 07:07:47.952882+00	2024-12-13	43	\N	2025-10-31 07:07:47.952882+00	5735506	3
05860db7-64ff-4002-a92a-04d75a1a7fe5	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	9	Coming In Hot	With the Chezem Valley fire blazing out of control, Bode and Audrey must find a way to save themselves; Manny risks his freedom for his missing daughter; and Eve tries to protect her father and their family's ranch.	\N	\N	2025-10-31 07:07:47.952882+00	2025-01-31	44	\N	2025-10-31 07:07:47.952882+00	5775048	3
9c052281-f2f6-459b-8718-f339f2eacca4	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	10	The Leone Way	The Leone men attempt a daring rescue while on a family fishing trip and Sharon faces a tough decision when a baby is safely surrendered at station 42.	\N	\N	2025-10-31 07:07:47.952882+00	2025-02-07	44	\N	2025-10-31 07:07:47.952882+00	5948978	3
93547656-b8ca-44b4-ae94-a63324e83ada	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	11	Fare Thee Well	The crew responds to a call from the local renaissance fair after a fire breather loses their balance and sets off a tent filled with fireworks.	\N	\N	2025-10-31 07:07:47.952882+00	2025-02-14	43	\N	2025-10-31 07:07:47.952882+00	5948979	3
9b5c80f3-3ad9-480d-8859-4abde08cf0cc	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	12	I'm the One Who Just Goes Away	While on a risk assessment trip to the Trinity National Forest, Bode and Jake attempt a daring rescue despite avalanche danger.	\N	\N	2025-10-31 07:07:47.952882+00	2025-02-21	44	\N	2025-10-31 07:07:47.952882+00	5955698	3
29dbf6dc-1c46-4d27-9c87-9c2ec97e02e2	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	13	My Team	Station 42 responds to a fire in the dugout before the annual county clash baseball rivalry game; Vince's ex-girlfriend returns.	\N	\N	2025-10-31 07:07:47.952882+00	2025-02-28	44	\N	2025-10-31 07:07:47.952882+00	5992434	3
64b14943-f54e-46fe-8651-b7b120de7fc8	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	14	Death Trap	The station 42 crew responds to a wellness check at the home of a hoarder that escalates into a full-blown house fire; Vince and Sharon are forced to face the reality of his father's ballooning cognitive troubles.	\N	\N	2025-10-31 07:07:47.952882+00	2025-03-07	44	\N	2025-10-31 07:07:47.952882+00	6016870	3
4def70f3-c6d7-4a79-9076-370975e5740e	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	15	One Last Time	Bode and Jake respond to a lighthouse rescue operation that turns into a mission to prevent a ship from crashing during an intense storm. Eve investigates the origins of a flu outbreak at Three Rock.	\N	\N	2025-10-31 07:07:47.952882+00	2025-03-14	44	\N	2025-10-31 07:07:47.952882+00	6026160	3
18008382-4247-4b3a-bf1d-866e3299c99c	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	16	Dirty Money	Bode and his aunt, Sheriff Mickey Fox (Morena Baccarin), investigate the attempted murder of her estranged father, Wes Fox (W. Earl Brown), Mickey’s estranged father and Sharon’s stepfather who runs an illegal marijuana business.	\N	\N	2025-10-31 07:07:47.952882+00	2025-04-04	44	\N	2025-10-31 07:07:47.952882+00	6030114	3
7cd1db52-7633-4513-8813-2324d98f4824	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	17	Fire and Ice	The station 42 crew responds to a ski resort accident after a chair lift malfunctions, and Vince struggles to connect with his father.	\N	\N	2025-10-31 07:07:47.952882+00	2025-04-11	\N	\N	2025-10-31 07:07:47.952882+00	6050017	3
a94d7bd8-050e-4f92-814b-e34e1d34d721	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	18	Eyes and Ears Everywhere	The station 42 crew responds to a routine house fire that escalates into a dangerous situation for one of their own.	\N	\N	2025-10-31 07:07:47.952882+00	2025-04-18	\N	\N	2025-10-31 07:07:47.952882+00	6063433	3
f3e47fea-a2db-494a-884e-6ff450341a62	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	19	A Change in the Wind (1)	When a fire erupts at a gas station, Bode and Manny jump into action to protect the patrons and property.	\N	\N	2025-10-31 07:07:47.952882+00	2025-04-25	\N	\N	2025-10-31 07:07:47.952882+00	6063434	3
19ac716d-d470-4dc0-9cfd-1cfa0dc4a97e	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	20	I'd Do It Again (2)	Extremely high winds and dangerous conditions push the Zebel Ridge fire into Edgewater, threatening Three Rock and Walter's care facility.	\N	\N	2025-10-31 07:07:47.952882+00	2025-04-25	\N	\N	2025-10-31 07:07:47.952882+00	6063436	3
afcf0816-6f4c-4e9d-b010-fa806a0590e4	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	3dca8442-3fc1-45d1-ae05-f82d10e2e907	1	Goodbye for Now	In the aftermath of the Zabel Ridge fire, Station 42 faces internal turmoil but must rally together for a high-stakes rescue that tests their strength, loyalty and the future of the firehouse.	\N	\N	2025-10-31 07:07:48.330077+00	2025-10-17	\N	\N	2025-10-31 07:07:48.330077+00	6374515	4
82a0d60a-1374-4f12-bdd8-f700238c64ab	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	3dca8442-3fc1-45d1-ae05-f82d10e2e907	2	Not a Stray	Station 42 faces a high-stakes wildfire situation that tests their unity, leadership and personal resilience; the new battalion chief is on site, but he has a polarizing leadership style that gets under everyone's skin.	\N	\N	2025-10-31 07:07:48.330077+00	2025-10-24	\N	\N	2025-10-31 07:07:48.330077+00	6374516	4
ba6bb6a4-e620-4bc7-a276-d2c0c849dc71	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	3dca8442-3fc1-45d1-ae05-f82d10e2e907	3	The Tiny Ways We Start to Heal	The Station 42 team responds to a dangerous zipline accident that escalates into a wildfire due to illegal fireworks; Sharon struggles with letting go of Vince's belongings and unexpectedly finds comfort in Vince's ex, Renee.	\N	\N	2025-10-31 07:07:48.330077+00	2025-10-31	\N	\N	2025-10-31 07:07:48.330077+00	6599025	4
ff15f9f0-d014-42a5-bd66-6c11739bd021	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	3dca8442-3fc1-45d1-ae05-f82d10e2e907	4	Episode 4		\N	\N	2025-10-31 07:07:48.330077+00	2025-11-07	\N	\N	2025-10-31 07:07:48.330077+00	6599026	4
2dab39da-7eed-42e3-8c69-30325a9e0aa1	76301014-3c2f-4caf-9658-12e18781e39e	c563a899-f274-4dcc-9805-a44e2fe57383	1	Pawns	While working tirelessly to shield her family from the Game Maker's threats, another crime drags Morgan back into his game and the LAPD must decide whether to trust her instincts before the next move turns fatal.	\N	\N	2025-10-31 13:32:44.950123+00	2025-09-16	44	\N	2025-10-31 13:32:44.950123+00	6388491	2
b7948680-0042-463f-bd82-b0e3b583fe46	76301014-3c2f-4caf-9658-12e18781e39e	c563a899-f274-4dcc-9805-a44e2fe57383	2	Checkmate	As the Major Crimes team desperately seek answers amidst a string of unresolved crimes, Morgan suspects the Game Maker is responsible. Meanwhile, Daphne and Oz set out to find Roman, and Elliot prepares a surprise act for his school’s talent show.	\N	\N	2025-10-31 13:32:44.950123+00	2025-09-23	44	\N	2025-10-31 13:32:44.950123+00	6388492	2
c2a5579a-79c3-413e-8ef3-59b7379285bd	76301014-3c2f-4caf-9658-12e18781e39e	c563a899-f274-4dcc-9805-a44e2fe57383	3	Eleven Minutes	When a man with a troubled past is killed under mysterious circumstances, Morgan and the LAPD uncover a tragic motive behind his death. Meanwhile, Morgan opens up to Ava about her father, forcing Ava to confront truths she isn’t ready to face.	\N	\N	2025-10-31 13:32:44.950123+00	2025-09-30	44	\N	2025-10-31 13:32:44.950123+00	6388493	2
d691b2c2-3104-4b62-9ac4-9f98a5f88538	76301014-3c2f-4caf-9658-12e18781e39e	c563a899-f274-4dcc-9805-a44e2fe57383	4	Behind the Music	An investigation involving the murder of a local singer uncovers details that reopen a strikingly similar decades-old cold case. Later on, the team rallies around Soto after she is passed over for the captain’s chair.	\N	\N	2025-10-31 13:32:44.950123+00	2025-10-07	43	\N	2025-10-31 13:32:44.950123+00	6494308	2
65e10912-60ac-4f18-8723-f54c4bde87df	76301014-3c2f-4caf-9658-12e18781e39e	c563a899-f274-4dcc-9805-a44e2fe57383	5	Content Warning	When a social media stunt turns deadly, Morgan and Karadec head to an influencer content house to track down answers. Meanwhile, the LAPD team adjusts to Captain Nick Wagner's new role, and Ava seeks out more information on Roman’s disappearance.	\N	\N	2025-10-31 13:32:44.950123+00	2025-10-14	44	\N	2025-10-31 13:32:44.950123+00	6533717	2
c592220c-6ebd-4d69-a774-2f725ba2d114	76301014-3c2f-4caf-9658-12e18781e39e	c563a899-f274-4dcc-9805-a44e2fe57383	6	Chasing Ghosts	It's almost Halloween, and a wealthy lawyer is found dead in his "haunted" Victorian mansion. As the team investigates the spooky case, Captain Wagner surprises everyone with his skills. At home, Elliot plays mediator between Morgan and Ava.	\N	\N	2025-10-31 13:32:44.950123+00	2025-10-21	42	\N	2025-10-31 13:32:44.950123+00	6537377	2
71b88c59-67e8-4a56-80a2-e2be2a799463	76301014-3c2f-4caf-9658-12e18781e39e	c563a899-f274-4dcc-9805-a44e2fe57383	7	The One That Got Away	When a priceless painting is stolen in a museum heist, Morgan and Karadec team up with an art-recovery expert to unravel a tangled case and fierce ownership battle. Meanwhile, Soto is determined to uncover the secrets hidden inside Roman’s backpack.	\N	\N	2025-10-31 13:32:44.950123+00	2025-10-28	\N	\N	2025-10-31 13:32:44.950123+00	6537379	2
227f3de7-f7c9-4d8f-b32a-f82002b30af7	76301014-3c2f-4caf-9658-12e18781e39e	c563a899-f274-4dcc-9805-a44e2fe57383	8	The One That Got Away (2)		\N	\N	2025-10-31 13:32:44.950123+00	2026-01-06	\N	\N	2025-10-31 13:32:44.950123+00	6537380	2
333c1872-325e-46b6-babe-4e9cde20f8f1	76301014-3c2f-4caf-9658-12e18781e39e	c563a899-f274-4dcc-9805-a44e2fe57383	9	Grounded		\N	\N	2025-10-31 13:32:44.950123+00	2026-01-13	\N	\N	2025-10-31 13:32:44.950123+00	6537381	2
af162e42-6998-4575-bf96-756650a338df	76301014-3c2f-4caf-9658-12e18781e39e	c563a899-f274-4dcc-9805-a44e2fe57383	10	Under the Rug		\N	\N	2025-10-31 13:32:44.950123+00	2026-01-20	\N	\N	2025-10-31 13:32:44.950123+00	6537382	2
9512cc83-2984-451b-80b6-dd9d07c3a24d	4f92630b-d34e-40d9-96aa-546c390600c7	216e289a-7068-4699-9c3c-26bfaa7c50a8	1	Extended Inside Look - S1 Ep 1	Series creator and writer Neil Cross, and Luther star, Idris Elba take you inside the first episode and inside the mind of Luther himself.	\N	\N	2025-10-31 13:42:54.227879+00	2010-10-18	60	\N	2025-10-31 13:42:54.227879+00	1148228	0
79a3e41d-fc64-47fb-b069-44daf216c1aa	4f92630b-d34e-40d9-96aa-546c390600c7	216e289a-7068-4699-9c3c-26bfaa7c50a8	2	Extended Inside Look - S1 Ep 2	Idris Elba takes you deeper inside the mind of Luther, his marriage, why it's falling apart, and so much more!	\N	\N	2025-10-31 13:42:54.227879+00	2010-10-27	60	\N	2025-10-31 13:42:54.227879+00	1148229	0
15eb8ade-ce6d-4d64-92d5-9b355b2e8109	4f92630b-d34e-40d9-96aa-546c390600c7	216e289a-7068-4699-9c3c-26bfaa7c50a8	3	Extended Inside Look - S1 Ep 3	Creator, Neil Cross reveals that he's a HUGE Columbo fan, as is Idris, and how that show influenced his style, especially in regards to structuring Luther.	\N	\N	2025-10-31 13:42:54.227879+00	2010-11-04	60	\N	2025-10-31 13:42:54.227879+00	1148230	0
55728b20-2b62-436c-b721-1abc54448d01	4f92630b-d34e-40d9-96aa-546c390600c7	216e289a-7068-4699-9c3c-26bfaa7c50a8	4	Extended Inside Look - S1 Ep 4	Find out how the relationship between Luther and Alice is getting more intertwined, and how it's becoming more and more difficult to sever the ties between them.	\N	\N	2025-10-31 13:42:54.227879+00	2010-11-09	60	\N	2025-10-31 13:42:54.227879+00	1148231	0
603263ff-5716-4626-9a9e-1d279d0eabeb	4f92630b-d34e-40d9-96aa-546c390600c7	216e289a-7068-4699-9c3c-26bfaa7c50a8	5	Extended Inside Look - S1 Ep 5	Indira takes you inside Zoe's thoughts about Luther and how dealing a passionate man makes for fun in some areas of life, and problems in others.	\N	\N	2025-10-31 13:42:54.227879+00	2010-11-17	60	\N	2025-10-31 13:42:54.227879+00	1148232	0
aa115f10-0dc9-4ab5-bfa3-2c046ff4fbb7	4f92630b-d34e-40d9-96aa-546c390600c7	216e289a-7068-4699-9c3c-26bfaa7c50a8	6	Luther - The Journey So Far	Summary of the most exciting moments from the first three seasons.	\N	\N	2025-10-31 13:42:54.227879+00	2015-12-08	60	\N	2025-10-31 13:42:54.227879+00	1146858	0
17679b8d-b205-4066-8954-b3bdc61eb920	4f92630b-d34e-40d9-96aa-546c390600c7	d19675b4-ac67-4b99-ba32-b5291be82816	1	Episode 1	Luther returns to work after a traumatic arrest to investigate the murder of a former child genius's parents, and quickly deduces that their daughter is responsible. However, unable to find evidence to convict, he becomes embroiled in a battle of wits with the suspect - who has set her sights on him and his estranged wife.	\N	\N	2025-10-31 13:42:54.551658+00	2010-05-04	52	\N	2025-10-31 13:42:54.551658+00	65200	1
c4e3c982-e6e1-43f2-be41-9fc7f2264abb	4f92630b-d34e-40d9-96aa-546c390600c7	d19675b4-ac67-4b99-ba32-b5291be82816	2	Episode 2	A gunman begins murdering uniformed police officers, prompting the detective to taunt the killer on TV in the hope of inspiring him to turn his anger on him and come out into the open. To his horror, Luther also learns that Alice Morgan has been investigating his past - and is threatening to tell Zoe what she has discovered.	\N	\N	2025-10-31 13:42:54.551658+00	2010-05-11	52	\N	2025-10-31 13:42:54.551658+00	65201	1
6074d32e-825a-4db7-88f0-b0e05a09a658	4f92630b-d34e-40d9-96aa-546c390600c7	d19675b4-ac67-4b99-ba32-b5291be82816	3	Episode 3	John Luther must catch a Satanic occult killer accused of kidnap and murder. However, with a young mother's life at stake, Luther must use all his skills to build an airtight case.	\N	\N	2025-10-31 13:42:54.551658+00	2010-05-18	53	\N	2025-10-31 13:42:54.551658+00	65202	1
400f3b48-7144-4c5f-bf2a-275ea414da4b	4f92630b-d34e-40d9-96aa-546c390600c7	d19675b4-ac67-4b99-ba32-b5291be82816	4	Episode 4	When a serial killer goes on the rampage, Luther must put his personal life aside and delve inside the murderer's mind to discover what is driving him to kill so many girls, and why.	\N	\N	2025-10-31 13:42:54.551658+00	2010-05-25	59	\N	2025-10-31 13:42:54.551658+00	65199	1
585cd5b0-4a1c-4009-9c40-8e5efb94a764	4f92630b-d34e-40d9-96aa-546c390600c7	d19675b4-ac67-4b99-ba32-b5291be82816	5	Episode 5	When a wealthy couple are taken hostage, Luther must try to avert a disastrous chain of events. However, what he doesn't know is that it will soon become very personal.	\N	\N	2025-10-31 13:42:54.551658+00	2010-06-01	53	\N	2025-10-31 13:42:54.551658+00	65198	1
5e689073-5df1-41d6-af70-496904b95900	4f92630b-d34e-40d9-96aa-546c390600c7	d19675b4-ac67-4b99-ba32-b5291be82816	6	Episode 6	Luther, suspected of murder, goes on the run to try and prove his innocence. With Alice's assistance, they set out together to exact revenge on the real killer.	\N	\N	2025-10-31 13:42:54.551658+00	2010-06-08	53	\N	2025-10-31 13:42:54.551658+00	65203	1
51d43ec9-9039-43a5-ad8e-23ada9c6ec9a	4f92630b-d34e-40d9-96aa-546c390600c7	a2347b96-f111-49c7-a1a9-775e12c7a6bf	1	Episode 1	Still plagued by the death of his ex-wife, Luther returns to work to face a surreal and nightmarish case of a masked murderer determined to enter into folklore. As the body count rises, Luther must use all his skills to stop the killer, at the same time trying to rescue an old acquaintance's daughter from the dangerous world of prostitution.	\N	\N	2025-10-31 13:42:54.880454+00	2011-06-14	57	\N	2025-10-31 13:42:54.880454+00	65204	2
8bc44685-9623-40de-84f3-7df4c34f174b	4f92630b-d34e-40d9-96aa-546c390600c7	a2347b96-f111-49c7-a1a9-775e12c7a6bf	2	Episode 2	Luther must rescue Ripley, abducted by Cameron, in time to prevent Cameron's final murderous set piece. But Jenny's ruthless and vengeful boss is demanding compensation for stealing her protege. Luther is torn; will his visionary mind provide the team with the tools to save Ripley and the killer's intended victims, or will his focus be compromised?	\N	\N	2025-10-31 13:42:54.880454+00	2011-06-21	58	\N	2025-10-31 13:42:54.880454+00	65205	2
1c2400ac-f7ff-42a3-95ad-30693beff639	4f92630b-d34e-40d9-96aa-546c390600c7	a2347b96-f111-49c7-a1a9-775e12c7a6bf	3	Episode 3	As Luther's affection for Jenny grows, so does his determination to protect her and help her back on her feet. Baba, however, is determined to keep Luther on a tight leash. To add to Luther's difficulties, he is called in to investigate a man whose brutal and escalating murders seem to have no motive, leaving Jenny alone and vulnerable.	\N	\N	2025-10-31 13:42:54.880454+00	2011-06-28	58	\N	2025-10-31 13:42:54.880454+00	65206	2
49b68e88-8cb3-4a94-b9d3-5835c8ea8579	4f92630b-d34e-40d9-96aa-546c390600c7	a2347b96-f111-49c7-a1a9-775e12c7a6bf	4	Episode 4	Luther's personal and professional life spirals out of control as he tries to cover up Toby's death and appease a suspicious Baba. He must also protect Jenny from any further harm. At work there's also a killer at large whose actions are ruled by his dice. How do you stop a man who sees life and death as a game and whose actions can't be predicted?	\N	\N	2025-10-31 13:42:54.880454+00	2011-07-05	58	\N	2025-10-31 13:42:54.880454+00	65207	2
ce6e467f-7a23-4d25-b8d1-489cd6019054	4f92630b-d34e-40d9-96aa-546c390600c7	cd8a9736-19fe-456d-a1cb-a0e7ce3727fe	1	Episode 1	A new spate of nightmarish murders brings DCI John Luther to once again face the depths of human depravity on the streets of London. As the body count rises, and gangster George Cornelius applies his own pressure, can Luther catch the killer and save his own neck?	\N	\N	2025-10-31 13:42:55.84308+00	2019-01-01	53	\N	2025-10-31 13:42:55.84308+00	1626346	5
f7a343ce-d206-47cc-99df-fa7dcb87b924	4f92630b-d34e-40d9-96aa-546c390600c7	cd8a9736-19fe-456d-a1cb-a0e7ce3727fe	2	Episode 2	Luther must confront a demon from his past, as both the police and Cornelius converge on his home. With Halliday convinced that the body in the morgue isn't their killer, can Luther put his own troubles to one side and find the true murderer before he strikes again?	\N	\N	2025-10-31 13:42:55.84308+00	2019-01-02	53	\N	2025-10-31 13:42:55.84308+00	1657776	5
c778ffd0-5d63-4303-965e-d25141daf334	4f92630b-d34e-40d9-96aa-546c390600c7	cd8a9736-19fe-456d-a1cb-a0e7ce3727fe	3	Episode 3	With his friend in peril and a young woman kidnapped by the relentless serial killer, can Luther protect the innocent while preventing Cornelius's violent revenge from consuming him? Who is Luther willing to save, and who can't he bear to lose?	\N	\N	2025-10-31 13:42:55.84308+00	2019-01-03	53	\N	2025-10-31 13:42:55.84308+00	1657778	5
f67345e2-8f5f-4a0e-927f-8d47ec088ad8	4f92630b-d34e-40d9-96aa-546c390600c7	cd8a9736-19fe-456d-a1cb-a0e7ce3727fe	4	Episode 4	Reeling from the death of his friend, Luther races to save the others from Cornelius's terrible retribution. With Luther's increasing absence from the case, Halliday heads the hunt for a killer on the loose - a killer determined to complete his final macabre masterpiece.	\N	\N	2025-10-31 13:42:55.84308+00	2019-01-04	53	\N	2025-10-31 13:42:55.84308+00	1657780	5
edd6fa41-41dd-4c82-a55b-5811c5ec98bd	4f92630b-d34e-40d9-96aa-546c390600c7	be116d51-ec42-419a-ad68-8d44f8cd8802	1	Episode 1	Luther investigates a the case of a fetishist who is murdering women which is similar to an unsolved case from the 1980s. The team attempt to catch the copycat killer, whose murderous spree has only just started.	\N	\N	2025-10-31 13:42:55.196339+00	2013-07-02	58	\N	2025-10-31 13:42:55.196339+00	65208	3
2403ee46-87ce-47a7-b293-7acff0f724ec	4f92630b-d34e-40d9-96aa-546c390600c7	be116d51-ec42-419a-ad68-8d44f8cd8802	2	Episode 2	Luther's date with Mary, and the promise of romance, is interrupted by the news of another murder. The killer has struck again - the number of victims is escalating fast.	\N	\N	2025-10-31 13:42:55.196339+00	2013-07-09	59	\N	2025-10-31 13:42:55.196339+00	65209	3
4eab415f-4200-46bc-9407-66132414346e	4f92630b-d34e-40d9-96aa-546c390600c7	be116d51-ec42-419a-ad68-8d44f8cd8802	3	Episode 3	In what looks like a gangland crime - two hoodies are shot at close range. But an un-connected crime sees Luther make a un-connected connection that might provide the real answer to what happened.	\N	\N	2025-10-31 13:42:55.196339+00	2013-07-16	59	\N	2025-10-31 13:42:55.196339+00	65210	3
58fdef51-8a20-47b7-bfd0-d3359a26f65b	4f92630b-d34e-40d9-96aa-546c390600c7	be116d51-ec42-419a-ad68-8d44f8cd8802	4	Episode 4	Marwood makes his vendetta personal - targeting Luther and those closest to him, raining destruction on everything he touches. Stark and Gray arrive just in time to hurry Mary to a secret place, but is her safety really Stark's priority, or is she just a pawn in his game to lure Luther to him?	\N	\N	2025-10-31 13:42:55.196339+00	2013-07-23	59	\N	2025-10-31 13:42:55.196339+00	65211	3
6c590622-1d85-494c-8e65-d2ede9e092ca	4f92630b-d34e-40d9-96aa-546c390600c7	751329b9-320c-4a9a-8199-e943770c1e88	1	Episode 1	Away from the police force, Luther receives a visit from Detective Chief Inspector Theo Bloom and Detective Sergeant Emma Lane. They bring him some new evidence that will draw him back to London to find the truth. The team tracks a cannibalistic serial killer.	\N	\N	2025-10-31 13:42:55.523967+00	2015-12-15	58	\N	2025-10-31 13:42:55.523967+00	1143289	4
d0a1eb09-6d6c-40b9-a5dd-dfdd495ed483	4f92630b-d34e-40d9-96aa-546c390600c7	751329b9-320c-4a9a-8199-e943770c1e88	2	Episode 2	On the trail of a horrifying killer, Luther finds himself haunted by ghosts from his past.	\N	\N	2025-10-31 13:42:55.523967+00	2015-12-22	58	\N	2025-10-31 13:42:55.523967+00	1146617	4
eb5749b8-a799-4978-8ac1-5a8f83dfddf5	59adf09f-4e36-406c-9429-559f59f7a206	6d2c9fcb-e3df-4a79-8e64-27deff7cd9cb	1	The Hanged Man	Rising artisan Leonardo da Vinci is commissioned by the powerful Medici to create an Easter spectacle in Florence. After some maneuvering, da Vinci is hired to engineer war machines. A mysterious Turk intrigues Leonardo.	\N	2013	2025-11-02 12:40:58.743649+00	2013-04-12	60	6.5	2025-11-02 12:41:07.29+00	872288	\N
313ba28b-2cbc-4dd5-86f2-e84714d28eeb	59adf09f-4e36-406c-9429-559f59f7a206	6d2c9fcb-e3df-4a79-8e64-27deff7cd9cb	3	The Prisoner	Riario engages the Pope and a mysterious prisoner in a discussion concerning the count's defeat, while Leonardo searches for a rational explanation when an outbreak of demonic possession occurs at a convent, and the blame is placed on the Medicis.	\N	2013	2025-11-02 12:40:58.743649+00	2013-04-26	55	6.7	2025-11-02 12:41:07.29+00	872292	\N
c4d448ec-acde-447e-8875-d207187bbf23	59adf09f-4e36-406c-9429-559f59f7a206	6d2c9fcb-e3df-4a79-8e64-27deff7cd9cb	4	The Magician	Bechhi is accused of being a spy for Rome. The armies of Rome and Florence face off, and Leonardo reveals his latest weapon.	\N	2013	2025-11-02 12:40:58.743649+00	2013-05-03	60	7.0	2025-11-02 12:41:07.29+00	872290	\N
a0108ba0-a0aa-4e7b-9a2f-15c0c471d3b9	59adf09f-4e36-406c-9429-559f59f7a206	6d2c9fcb-e3df-4a79-8e64-27deff7cd9cb	5	The Tower	Lorenzo orders Piero da Vinci to defend his estranged son in court. During a performance for visiting royalty, Leonardo surprises the corrupt judge. Back at his workshop, Leonardo is surprised by the Turk.	\N	2013	2025-11-02 12:40:58.743649+00	2013-05-10	60	6.8	2025-11-02 12:41:07.29+00	872289	\N
6d79e8f9-460f-4dcf-9a37-b95e2ac1888b	59adf09f-4e36-406c-9429-559f59f7a206	6d2c9fcb-e3df-4a79-8e64-27deff7cd9cb	6	The Devil	A clue from the Turk about the Book of Leaves sends Leonardo to Wallachia, where he encounters Vlad Dracula. Lorenzo and Piero meet the Duke of Urbino. The search for the true spy continues.	\N	2013	2025-11-02 12:40:58.743649+00	2013-05-17	55	6.5	2025-11-02 12:41:07.29+00	872294	\N
cf620e47-96bf-4e43-956e-5915c30c458f	59adf09f-4e36-406c-9429-559f59f7a206	6d2c9fcb-e3df-4a79-8e64-27deff7cd9cb	7	The Hierophant	Leonardo builds an underwater suit and uses the sewers to enter the Vatican, where he meets the Pope and the mysterious prisoner. Giuliano reveals the true identity of Rome's spy.	\N	2013	2025-11-02 12:40:58.743649+00	2013-05-31	55	7.0	2025-11-02 12:41:07.29+00	872287	\N
dfadb0d9-3abd-4eeb-89e8-34cffedf13e3	59adf09f-4e36-406c-9429-559f59f7a206	6d2c9fcb-e3df-4a79-8e64-27deff7cd9cb	2	The Serpent	Leonardo continues his quest for the Book of Leaves. The Pope’s nephew arrives and meets his spy. Leonardo’s war designs fail, causing a rift with the Medicis. The Pope learns of Leonardo’s prowess.	\N	2013	2025-11-02 12:40:58.743649+00	2013-04-19	60	7.7	2025-11-02 12:41:07.29+00	872293	\N
3e23785c-58de-4624-81d5-a350e9535e51	59adf09f-4e36-406c-9429-559f59f7a206	16f8a3b0-9540-409b-9681-29879d6963d9	1	The Blood of Man	The Pazzis make their move; Leonardo gambles for the future of Florence; Riario makes progress in his quest for the Book of Leaves.	\N	2014	2025-11-02 12:45:32.973993+00	2014-03-22	55	7.7	2025-11-02 12:45:32.752+00	971548	\N
4545fd4d-fb11-44b3-8e42-af9b5d03aae5	59adf09f-4e36-406c-9429-559f59f7a206	16f8a3b0-9540-409b-9681-29879d6963d9	2	The Blood of Brothers	Leonardo uses his intellect to save Florence as Pope Sixtus brings powers together; Nico tries to resist Riario's temptations.	\N	2014	2025-11-02 12:45:32.973993+00	2014-03-29	55	6.3	2025-11-02 12:45:32.752+00	971609	\N
69033492-d1eb-42db-86f0-4c261d48e21d	59adf09f-4e36-406c-9429-559f59f7a206	16f8a3b0-9540-409b-9681-29879d6963d9	3	The Voyage of the Damned	Leonardo continues his search for the Book of Leaves; Lorenzo is forced to make sacrifices when Pope Sixtus takes aggressive measures against Florence; Lucrezia looks for new alliances in Rome.	\N	2014	2025-11-02 12:45:32.973993+00	2014-04-05	55	7.3	2025-11-02 12:45:32.752+00	972216	\N
46bf54e6-689e-43c4-9b5c-8f437be5bf4d	59adf09f-4e36-406c-9429-559f59f7a206	16f8a3b0-9540-409b-9681-29879d6963d9	4	The Ends of the Earth	Leonardo attempts to navigate the Atlantic without maps; Lucrezia is smuggled into the Vatican for an important meeting; Lorenzo's identity is discovered during his trip to Naples.	\N	2014	2025-11-02 12:45:32.973993+00	2014-04-12	55	7.0	2025-11-02 12:45:32.752+00	972546	\N
ccc06d7f-8041-4428-b70e-62665feae17b	59adf09f-4e36-406c-9429-559f59f7a206	16f8a3b0-9540-409b-9681-29879d6963d9	5	The Sun and the Moon	Leonardo makes an unexpected discovery in the New World. Lorenzo attempts to save Florence with the help of an old flame. Clarice struggles to retain control of the Medici Bank.	\N	2014	2025-11-02 12:45:32.973993+00	2014-04-19	55	6.3	2025-11-02 12:45:32.752+00	973102	\N
f0990f2f-bd32-4325-97c3-10b983afbe5f	59adf09f-4e36-406c-9429-559f59f7a206	16f8a3b0-9540-409b-9681-29879d6963d9	6	The Rope of the Dead	Entering the Vault of Heaven presents challenges for Leonardo and Riario; Lorenzo becomes a part of King Ferrante's bloody games; Lucrezia meets the Turk in Constantinople.	\N	2014	2025-11-02 12:45:32.973993+00	2014-04-26	55	6.4	2025-11-02 12:45:32.752+00	973202	\N
32c92f60-5353-4d70-b653-ee9e38ef0f04	59adf09f-4e36-406c-9429-559f59f7a206	16f8a3b0-9540-409b-9681-29879d6963d9	7	The Vault of Heaven	Leonardo and his allies face deadly threats as they search for the Book of Leaves; Carlo helps Clarice; the Sultan's son is intrigued by Lucrezia.	\N	2014	2025-11-02 12:45:32.973993+00	2014-05-03	55	6.7	2025-11-02 12:45:32.752+00	973203	\N
7fae1a4e-1b5d-4d01-9cf6-4e8f3fd00a40	59adf09f-4e36-406c-9429-559f59f7a206	16f8a3b0-9540-409b-9681-29879d6963d9	8	The Fall from Heaven	Leonardo and Riario face death; Zoroaster and Nico plan an escape; Lorenzo waits to meet with the king of Naples; Bayezid seeks diplomacy in Rome.	\N	2014	2025-11-02 12:45:32.973993+00	2014-05-10	55	6.2	2025-11-02 12:45:32.752+00	973898	\N
75752be9-206c-4ae3-9736-01a44536d770	59adf09f-4e36-406c-9429-559f59f7a206	16f8a3b0-9540-409b-9681-29879d6963d9	9	The Enemies of Man	Leonardo returns to learn that Duke Federico has been ruling Florence with an iron fist; a sinful Riario seeks redemption; King Ferrante negotiates with Lorenzo.	\N	2014	2025-11-02 12:45:32.973993+00	2014-05-17	55	7.8	2025-11-02 12:45:32.752+00	973899	\N
3ea77fb6-230a-40e0-a3aa-4d73d779e8ca	59adf09f-4e36-406c-9429-559f59f7a206	16f8a3b0-9540-409b-9681-29879d6963d9	10	The Sins of Daedalus	An unlikely alliance is needed to save Italy from an Ottoman attack; Riario faces danger; Nico takes control of Vanessa's destiny.	\N	2014	2025-11-02 12:45:32.973993+00	2014-05-31	55	7.8	2025-11-02 12:45:32.752+00	974038	\N
b93667a0-ab8d-4091-a3cc-188d7598c0f7	59adf09f-4e36-406c-9429-559f59f7a206	a757a1dc-866e-41f0-ac1e-23c2e227ef05	1	Semper Infidelis	Leonardo and his allies are forced to retreat when the Ottoman Empire storms the city of Otranto.	/4majaBRDkWlntqAP7ozUjArr2EZ.jpg	2015	2025-11-02 13:10:46.320035+00	2015-10-24	55	7.5	2025-11-02 13:11:32.461+00	1090731	\N
524ce261-50f7-4e97-b274-6591dda58e55	59adf09f-4e36-406c-9429-559f59f7a206	a757a1dc-866e-41f0-ac1e-23c2e227ef05	2	Abbadon	Leo devises an escape from Otranto but may not be able to save those closest to him.	/euUNFAQL3RDr3NIcoCIkCcmwrN3.jpg	2015	2025-11-02 13:10:46.320035+00	2015-10-31	55	7.2	2025-11-02 13:11:32.461+00	1116408	\N
98367135-f942-4d31-b780-ba9134222b65	59adf09f-4e36-406c-9429-559f59f7a206	a757a1dc-866e-41f0-ac1e-23c2e227ef05	3	Modus Operandi	Leonardo investigates a horrific murder that may result in the Labyrinth being exposed.	/2cNDJuJOwb9MaQNJhSBC6g3nwQi.jpg	2015	2025-11-02 13:10:46.320035+00	2015-11-07	55	5.4	2025-11-02 13:11:32.461+00	1116409	\N
812b6dce-8066-4b91-97ae-a7584558bbc9	59adf09f-4e36-406c-9429-559f59f7a206	a757a1dc-866e-41f0-ac1e-23c2e227ef05	4	The Labrys	Carlo's attempt to program Leonardo into becoming "one" with the Labyrinth leads him to slip into an alternate reality that could prove life-threatening.	/iRsiz3T3ViD88XTRgeu7VQW8pep.jpg	2015	2025-11-02 13:10:46.320035+00	2015-11-14	55	7.0	2025-11-02 13:11:32.461+00	1116410	\N
c3857cde-41c5-4b6a-8ca4-88d416d30b5c	59adf09f-4e36-406c-9429-559f59f7a206	a757a1dc-866e-41f0-ac1e-23c2e227ef05	5	Anima Venator	A paranoid Leonardo becomes shut off from his friends, while an endangered Lucrezia searches for a way to make amends for past sins.	/rvVnsfdtgJv29hkYHucXLeWcpKI.jpg	2015	2025-11-02 13:10:46.320035+00	2015-11-21	55	5.6	2025-11-02 13:11:32.461+00	1116411	\N
ccf8c66e-7909-4926-8f59-e12977ef6427	59adf09f-4e36-406c-9429-559f59f7a206	a757a1dc-866e-41f0-ac1e-23c2e227ef05	6	Liberum Arbitrium	The Monster of Italy is captured but not all is safe as danger still lurks and poses a threat to the upcoming Crusade Festival.	/u0Rt5pWyth3q7G9ueAsLoeSEAZX.jpg	2015	2025-11-02 13:10:46.320035+00	2015-11-28	55	7.0	2025-11-02 13:11:32.461+00	1116412	\N
d225b39a-5891-4fee-9944-dc4133756d7c	59adf09f-4e36-406c-9429-559f59f7a206	a757a1dc-866e-41f0-ac1e-23c2e227ef05	7	Alis Volat Propiis	A former nemesis returns to Florence and stands in opposition to Crusade efforts. Vanessa and Nico ponder their futures; Leo attempts to decipher the Turkish armor.	/2mPMQfO8zbf7GDGb03dLXZJJfXT.jpg	2015	2025-11-02 13:10:46.320035+00	2015-12-05	55	7.3	2025-11-02 13:11:32.461+00	1132251	\N
14f9e4a1-311e-4aa6-a418-a83b40db5744	59adf09f-4e36-406c-9429-559f59f7a206	a757a1dc-866e-41f0-ac1e-23c2e227ef05	8	La Confessione Della Macchina	Nico and Zoroastre turn to an old enemy to gain support for the Crusade. Leo is ambushed by the Labyrinth.	/toCXt0JQXx2xLmzNyqfTCSaank7.jpg	2015	2025-11-02 13:10:46.320035+00	2015-12-12	55	6.8	2025-11-02 13:11:32.461+00	1132252	\N
c86570f3-e0cb-4407-810c-689454ff32ca	59adf09f-4e36-406c-9429-559f59f7a206	a757a1dc-866e-41f0-ac1e-23c2e227ef05	9	Angelus Iratissimus	Leo and Sophia struggle to control the mysterious device they've built. Back in Florence, Riario awaits judgment while Lorenzo and Vanessa take their partnership to the next level.	/2pa3ICOI7STsUD9k6UFOzpRDGzF.jpg	2015	2025-11-02 13:10:46.320035+00	2015-12-19	55	7.3	2025-11-02 13:11:32.461+00	1132253	\N
c9b52804-49c8-4d11-9b7c-5b4baf7508bb	59adf09f-4e36-406c-9429-559f59f7a206	a757a1dc-866e-41f0-ac1e-23c2e227ef05	10	Ira Deorum	Leo must put his faith in his friends and in himself to have a chance to defeat the Turks.	/uVYrdcmjZGfaGtqxGC1GvDQ28Gh.jpg	2015	2025-11-02 13:10:46.320035+00	2015-12-26	55	6.6	2025-11-02 13:11:32.461+00	1132254	\N
\.


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.genres (id, tmdb_id, name, media_type, icon, last_fetched, created_at) FROM stdin;
d395eb00-2f78-45b0-b67e-c9862a141bdd	28	Action	movie	sword	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
9dce0281-cc2f-4ee5-9dc8-c3281ba94509	12	Adventure	movie	mountain	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
2810f7c2-4372-4f25-9855-e5d60435c517	16	Animation	movie	palette	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
1f57a23f-c336-4301-b236-72b7a07ad02f	35	Comedy	movie	mood-happy	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
14dd459b-04d9-4f77-8aab-684198e8e32a	80	Crime	movie	shield-check	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
7c11446d-628d-47dc-a388-0f96a896006c	99	Documentary	movie	movie	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
8d485f51-ede7-40eb-a9e1-794864ffe720	18	Drama	movie	mask	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
cf689fee-434c-492b-854a-376089064b21	10751	Family	movie	users	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
6fbc294c-4bf5-43cf-a379-39fbc40fd8e1	14	Fantasy	movie	wand	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
a349adbd-8bbb-43db-98b6-316ad184f462	36	History	movie	book	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
29bd65d6-c93d-4834-9dbd-db56cf4c0727	27	Horror	movie	ghost	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
4c8763e6-aff0-4577-840f-abe53aa5d151	10402	Music	movie	music	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
9e4e0ac9-2c6e-42ed-8d34-cf6debdbc98e	9648	Mystery	movie	question-mark	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
f3a0e4fa-8c0b-4409-9e5a-696931801a83	10749	Romance	movie	heart	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
4e3e7a41-9626-494a-92bb-0b2c92b5b7c1	878	Science Fiction	movie	rocket	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
85bb86fe-be7f-4072-8dff-c905f62ca675	10770	TV Movie	movie	device-tv	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
03dda963-9fde-4cec-b96b-dae582313790	53	Thriller	movie	alert-triangle	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
e9acaf42-daca-4fea-bd9f-2a0c0aadd355	10752	War	movie	sword-off	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
b609a350-e59c-4856-8061-8797b8afc43f	37	Western	movie	horse	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
f2ae5194-3e76-4a7f-a4f0-1ee6809d46a2	10759	Action & Adventure	tv	sword	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
a94e6ae5-0668-457e-8ad3-3f7ee8e4b897	16	Animation	tv	palette	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
694affae-c284-43ec-93d7-7f105b88ed0b	35	Comedy	tv	mood-happy	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
aa932591-a5b4-4e6e-817d-f27129195d75	80	Crime	tv	shield-check	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
68730f63-29cf-4a1a-a6f7-aa0a6bf0fb8b	99	Documentary	tv	movie	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
2a2f2006-51c5-4394-8dce-cea09923e47e	18	Drama	tv	mask	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
56ef74df-972e-4583-b030-60d2291b5cc5	10751	Family	tv	users	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
fa5c2ec9-c3c8-4c66-9721-214d41e3a888	10762	Kids	tv	ice-cream	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
d945f5db-82ce-4adc-92f4-00c432487f9f	9648	Mystery	tv	question-mark	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
411a036e-0baf-4f17-ad10-b1e8ba6a8bd6	10763	News	tv	news	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
72ac757a-8077-439c-a02b-2c51028b4455	10764	Reality	tv	camera	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
a6e710e7-0e63-47a9-a99f-c2eba1b6429f	10765	Sci-Fi & Fantasy	tv	rocket	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
d5388403-93dc-497d-a388-23ec7e29c0df	10766	Soap	tv	heart	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
ac182882-3591-4855-8c35-7bbc87dd5e94	10767	Talk	tv	microphone	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
ecd02c16-30b2-4119-a8b1-fa84f451026b	10768	War & Politics	tv	flag	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
85fad53b-5e12-4211-9aa9-a86cd2b3547d	37	Western	tv	horse	2025-10-25 04:59:43.924961+00	2025-10-25 04:59:43.924961+00
\.


--
-- Data for Name: media_collection; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media_collection (id, collection_id, media_id, media_type, title, poster_path, release_year) FROM stdin;
1	c396be00-a182-4b7b-b10f-90b855da38b8	49521	movie	Man of Steel	/dksTL9NXc3GqPBRHYHcy1aIwjS.jpg	2013
2	c396be00-a182-4b7b-b10f-90b855da38b8	558449	movie	Gladiator II	/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg	2024
3	0051b194-c615-4750-949c-e6830a49a04e	14160	movie	Up	/mFvoEwSfLqbcWwFsDjQebn9bzFe.jpg	2009
4	0051b194-c615-4750-949c-e6830a49a04e	277834	movie	Moana	/9tzN8sPbyod2dsa0lwuvrwBDWra.jpg	2016
5	0051b194-c615-4750-949c-e6830a49a04e	1241982	movie	Moana 2	/aLVkiINlIeCkcZIzb7XHzPYgO6L.jpg	2024
6	2f4c5d1b-d54e-4ec5-aaee-40a8c3a0ee59	82728	tv	Bluey	/9p4pNoGcuyCfHcGWKNrTopqMWtq.jpg	2018
7	2f4c5d1b-d54e-4ec5-aaee-40a8c3a0ee59	225180	tv	BLUE EYE SAMURAI	/fXm3JT4WLQVnwukdvghtAblc1wc.jpg	2023
8	c396be00-a182-4b7b-b10f-90b855da38b8	2023	movie	Hidalgo	/iGzENlBPYJEFWZnye4t3nqWSSp1.jpg	2004
9	c396be00-a182-4b7b-b10f-90b855da38b8	272	movie	Batman Begins	/4MpN4kIEqUjW8OPtOQJXlTdHiJV.jpg	2005
10	c396be00-a182-4b7b-b10f-90b855da38b8	155	movie	The Dark Knight	/qJ2tW6WMUDux911r6m7haRef0WH.jpg	2008
11	c396be00-a182-4b7b-b10f-90b855da38b8	49026	movie	The Dark Knight Rises	/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg	2012
12	c396be00-a182-4b7b-b10f-90b855da38b8	6520	movie	First Knight	/xuXkCcrvUTkehVXuTGpnfySsx0Z.jpg	1995
13	c396be00-a182-4b7b-b10f-90b855da38b8	8840	movie	DragonHeart	/5ciO16x4LQ7uhy854YHvQuQvHU9.jpg	1996
14	c396be00-a182-4b7b-b10f-90b855da38b8	8009	movie	Highlander	/8Z8dptJEypuLoOQro1WugD855YE.jpg	1986
16	c396be00-a182-4b7b-b10f-90b855da38b8	121	movie	The Lord of the Rings: The Two Towers	/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg	2002
17	c396be00-a182-4b7b-b10f-90b855da38b8	120	movie	The Lord of the Rings: The Fellowship of the Ring	/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg	2001
18	c396be00-a182-4b7b-b10f-90b855da38b8	122	movie	The Lord of the Rings: The Return of the King	/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg	2003
19	c396be00-a182-4b7b-b10f-90b855da38b8	8698	movie	The League of Extraordinary Gentlemen	/kdAuVFP63XXxnb983ry2pLCKd9S.jpg	2003
20	1f496b87-3ada-4038-95ed-da27ef1db249	1495	movie	Kingdom of Heaven	/uk55nBEFIQFveIiy9jvLGiVtk4h.jpg	2005
21	1f496b87-3ada-4038-95ed-da27ef1db249	9543	movie	Prince of Persia: The Sands of Time	/34Vbk8VNMtETTOSG3jCHWwlWr1m.jpg	2010
\.


--
-- Data for Name: media_watches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media_watches (id, collection_id, media_id, media_type, user_id, watched_at) FROM stdin;
11187259-c42b-49ae-8ff8-c575ab3f9598	c396be00-a182-4b7b-b10f-90b855da38b8	a01eaa6e-fa30-4d01-8a15-b349c91fd55b	movie	29bd5153-a7df-428e-a47b-449a13462da8	2025-04-05 12:33:48.278+00
a5843dc8-4219-4da5-a5f1-35c9d2f652ef	c396be00-a182-4b7b-b10f-90b855da38b8	001164ce-5da9-4145-9d3e-e8af7f66601b	movie	29bd5153-a7df-428e-a47b-449a13462da8	2025-05-12 10:46:32.828+00
af4c4a4b-a123-48aa-8a7f-a029a1dc9e44	c396be00-a182-4b7b-b10f-90b855da38b8	2b779335-76c1-4200-81ec-616518460652	movie	29bd5153-a7df-428e-a47b-449a13462da8	2025-07-21 22:37:16.039+00
ccf2a553-74c4-4ba1-aaf0-bc21207da6d1	c396be00-a182-4b7b-b10f-90b855da38b8	2b779335-76c1-4200-81ec-616518460652	movie	8e552a4c-da01-402d-afca-ef07a989b933	2025-07-21 22:37:16.039+00
9d7aa912-d8b3-425f-974f-5806ebd2e7c5	c396be00-a182-4b7b-b10f-90b855da38b8	7e1e058f-3be9-4c2f-bde9-1cf0408d5659	movie	29bd5153-a7df-428e-a47b-449a13462da8	2025-10-22 13:09:23.849+00
7913b0ae-886e-4779-9f53-f22471935293	c396be00-a182-4b7b-b10f-90b855da38b8	7e1e058f-3be9-4c2f-bde9-1cf0408d5659	movie	8e552a4c-da01-402d-afca-ef07a989b933	2025-10-22 13:09:23.849+00
aceaefe5-4888-4c5c-a221-511969e5ec12	c396be00-a182-4b7b-b10f-90b855da38b8	c8946e5a-c732-4e65-a9b2-a16ae0f8792b	movie	29bd5153-a7df-428e-a47b-449a13462da8	2025-10-22 13:40:19.697+00
c873755e-1c94-4ea1-b8f7-5a9d4be49573	c396be00-a182-4b7b-b10f-90b855da38b8	c8946e5a-c732-4e65-a9b2-a16ae0f8792b	movie	8e552a4c-da01-402d-afca-ef07a989b933	2025-10-22 13:40:19.697+00
4b2fd42a-343c-4f5c-b7f8-2260666e45bc	c396be00-a182-4b7b-b10f-90b855da38b8	41227218-c09c-4190-8e50-0b3ad9bbf51f	movie	29bd5153-a7df-428e-a47b-449a13462da8	2025-10-23 13:26:41.596+00
6f6c83cd-0926-4380-ac90-a82b47535c67	c396be00-a182-4b7b-b10f-90b855da38b8	41227218-c09c-4190-8e50-0b3ad9bbf51f	movie	8e552a4c-da01-402d-afca-ef07a989b933	2025-10-23 13:26:41.596+00
6259d579-7a8f-4890-847a-0d86cee7434b	c396be00-a182-4b7b-b10f-90b855da38b8	4630d06a-5338-49f4-9608-7a0700648814	movie	29bd5153-a7df-428e-a47b-449a13462da8	2025-10-23 14:10:47.252+00
7e6156e8-25c5-4aa8-a2e0-acb1de09e708	c396be00-a182-4b7b-b10f-90b855da38b8	4630d06a-5338-49f4-9608-7a0700648814	movie	8e552a4c-da01-402d-afca-ef07a989b933	2025-10-23 14:10:47.252+00
6cf0a4e3-ba0d-4e95-b2a5-d2b6d74e50bb	c396be00-a182-4b7b-b10f-90b855da38b8	7b3caef4-ae53-476f-b70f-2acf696ba0d6	movie	29bd5153-a7df-428e-a47b-449a13462da8	2025-10-23 15:24:44.201+00
c401b628-72e7-47f3-b1df-f3b77771cfb9	c396be00-a182-4b7b-b10f-90b855da38b8	7b3caef4-ae53-476f-b70f-2acf696ba0d6	movie	8e552a4c-da01-402d-afca-ef07a989b933	2025-10-23 15:24:44.201+00
1482581f-5c2a-4b89-b6b6-be311c49712f	c396be00-a182-4b7b-b10f-90b855da38b8	001164ce-5da9-4145-9d3e-e8af7f66601b	movie	8e552a4c-da01-402d-afca-ef07a989b933	2025-10-23 15:24:57.44+00
9bad5834-fadb-4b14-a00a-6831f534600a	c396be00-a182-4b7b-b10f-90b855da38b8	a01eaa6e-fa30-4d01-8a15-b349c91fd55b	movie	8e552a4c-da01-402d-afca-ef07a989b933	2025-10-23 15:24:58.984+00
b6eb8887-1d06-48d8-bc46-744a93135575	c396be00-a182-4b7b-b10f-90b855da38b8	167c2401-e028-4fd2-96cb-78e9415a4317	movie	29bd5153-a7df-428e-a47b-449a13462da8	2025-11-03 14:06:04.145+00
346e7ab6-73f1-4cc7-b84e-2b812d9ee0a3	c396be00-a182-4b7b-b10f-90b855da38b8	167c2401-e028-4fd2-96cb-78e9415a4317	movie	8e552a4c-da01-402d-afca-ef07a989b933	2025-11-03 14:06:04.145+00
\.


--
-- Data for Name: medias_collections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.medias_collections (id, collection_id, media_id, media_type, created_at, "position") FROM stdin;
1bf72e3f-b825-41e8-978a-77a253a9ced4	c396be00-a182-4b7b-b10f-90b855da38b8	7f634f73-6c03-482a-82f6-74fae93b60af	movie	2025-04-05 12:33:11.526159+00	24
83c74a65-cdab-41ad-9230-d7aafb2abbc8	c396be00-a182-4b7b-b10f-90b855da38b8	5dccc287-c43e-4b48-9d19-b9733dbaf52e	movie	2025-04-05 12:33:22.548281+00	25
d1ccd4e6-497f-43d0-9de2-3f3a5cc492af	c396be00-a182-4b7b-b10f-90b855da38b8	8de058ba-a308-4643-a28b-20f1245078ee	movie	2025-05-12 10:47:52.849436+00	26
b56f9fa1-105d-46ff-b52b-7d0063b481a5	c396be00-a182-4b7b-b10f-90b855da38b8	865a1df3-c277-4292-ba84-bc80dc56aa0c	movie	2025-05-12 11:26:41.33474+00	27
25922001-a0d1-4ed4-aa28-a351a7d9a744	c396be00-a182-4b7b-b10f-90b855da38b8	6c3a56cf-0598-4486-b350-386ad50085cd	movie	2025-05-12 11:26:44.91214+00	28
2de84558-1c39-42d9-922e-6bf0d5a04ea8	c396be00-a182-4b7b-b10f-90b855da38b8	a9eb6964-a8a9-4d1d-ae10-ce9a34c8801b	movie	2025-05-12 11:26:48.162262+00	29
dcab9c66-3705-4d80-ae11-03263ec89302	c396be00-a182-4b7b-b10f-90b855da38b8	cba4eefa-8cec-4e1d-a7d8-7d311e06b28f	movie	2025-07-21 22:39:13.201191+00	30
fd7f7a78-2486-4f26-83bf-c12980173824	c396be00-a182-4b7b-b10f-90b855da38b8	88a62601-9756-4da3-9819-2a3d531e7048	movie	2025-07-21 22:41:13.484104+00	31
c15a3b4e-a8c7-4692-bd8e-f1fadee3428d	c396be00-a182-4b7b-b10f-90b855da38b8	c8e14eaf-ecdd-411f-a21f-256656a6bbbc	movie	2025-07-21 22:42:19.662246+00	32
532be034-efb6-4dbc-8a9d-f4723c87a140	0051b194-c615-4750-949c-e6830a49a04e	1c78ac74-b761-4510-8e9f-05809ba57315	movie	2025-04-02 07:11:25.210908+00	0
f4c1817c-151f-4e38-aefc-555617a78287	0051b194-c615-4750-949c-e6830a49a04e	691f422f-5e53-4a62-801c-73f1afd6fe65	movie	2025-04-02 07:11:25.210908+00	1
f1efeab6-c974-4f5d-af51-d1b10efbd655	0051b194-c615-4750-949c-e6830a49a04e	37f783c7-b3d5-4619-9aac-16c4823c3143	movie	2025-04-02 07:11:25.210908+00	2
25a9fbf3-b38c-409f-9278-299417dd3ee5	c396be00-a182-4b7b-b10f-90b855da38b8	ab743fe5-c299-4f26-b444-702c9556d40e	movie	2025-10-22 13:29:10.598481+00	33
40d0691a-7b44-4a38-add6-b4ae67221897	c396be00-a182-4b7b-b10f-90b855da38b8	c8946e5a-c732-4e65-a9b2-a16ae0f8792b	movie	2025-10-22 13:40:10.757377+00	34
173aa928-fe3d-43ad-a5a7-d391cb27243a	c396be00-a182-4b7b-b10f-90b855da38b8	4630d06a-5338-49f4-9608-7a0700648814	movie	2025-10-23 14:10:42.213187+00	35
60429160-52ba-4cf9-bf9a-bd585d401485	c396be00-a182-4b7b-b10f-90b855da38b8	095ffc2c-95d3-49f0-93e0-9b8998b995d7	movie	2025-10-27 11:24:05.938087+00	36
2c9afceb-d2a8-417b-8c6c-abb3152b3a21	c396be00-a182-4b7b-b10f-90b855da38b8	25891ec6-82cf-47ca-9f9d-a31a312fb043	movie	2025-10-27 11:24:17.160239+00	37
2dedc766-a643-404b-9cc4-c6763a30572a	c396be00-a182-4b7b-b10f-90b855da38b8	b63dc6b1-2732-41bf-a894-fc3045a0e91a	movie	2025-10-27 11:24:26.891618+00	38
c759c694-1144-40b6-ba15-45e25440724c	2f4c5d1b-d54e-4ec5-aaee-40a8c3a0ee59	684e89eb-34a7-4169-b7c0-64df3931411b	tv	2025-04-02 07:11:25.210908+00	0
bfcb3458-ee45-4caf-9cac-5842ee7c6309	2f4c5d1b-d54e-4ec5-aaee-40a8c3a0ee59	5ee1bc31-51b3-460e-809f-d0f8a2334905	tv	2025-04-02 07:11:25.210908+00	1
1312b237-de08-42d7-9937-aadca941f792	c396be00-a182-4b7b-b10f-90b855da38b8	167c2401-e028-4fd2-96cb-78e9415a4317	movie	2025-04-02 07:11:25.210908+00	0
02c2d1d0-73bb-465e-b8bb-45ba12cb2fde	c396be00-a182-4b7b-b10f-90b855da38b8	07fec5c9-94cf-4635-b34a-786b1c3b2ca9	movie	2025-04-02 07:11:25.210908+00	1
d28ade91-a881-43b0-afff-92ef7c134c20	c396be00-a182-4b7b-b10f-90b855da38b8	80c85a89-32ef-4cf1-9ebe-f6c0e39415a4	movie	2025-04-02 07:11:25.210908+00	2
1d420db4-bc91-4131-a1c4-d023d8b8ce2f	c396be00-a182-4b7b-b10f-90b855da38b8	47257ba0-6a1f-44e6-8522-271966e32d5b	movie	2025-04-02 07:11:25.210908+00	3
85d6a26e-d64c-4534-9d95-fce18ef68850	c396be00-a182-4b7b-b10f-90b855da38b8	d2d9e01f-ce69-4bf5-b292-3ee4250c3b4c	movie	2025-04-02 07:11:25.210908+00	4
b85c0e48-561e-41e1-882e-eff4481ce9d7	c396be00-a182-4b7b-b10f-90b855da38b8	2b779335-76c1-4200-81ec-616518460652	movie	2025-04-02 07:11:25.210908+00	5
4a068716-cc53-42b8-8d92-87d97a3a441f	c396be00-a182-4b7b-b10f-90b855da38b8	7e1e058f-3be9-4c2f-bde9-1cf0408d5659	movie	2025-07-21 22:39:53.137915+00	6
f50fe2ba-2b61-480b-9252-635313c52ae5	c396be00-a182-4b7b-b10f-90b855da38b8	7b3caef4-ae53-476f-b70f-2acf696ba0d6	movie	2025-07-21 22:43:00.817529+00	7
d29e5beb-3310-4166-b0ee-dd0693aa865c	c396be00-a182-4b7b-b10f-90b855da38b8	447eda6d-60a9-46b4-97c1-29e3ff5a15cc	movie	2025-07-21 22:40:40.983858+00	8
d7730171-a4a7-43ec-b8d0-6d0c4663e2fa	c396be00-a182-4b7b-b10f-90b855da38b8	e3fe1493-07e9-4af4-b2d8-e81de9d2191b	movie	2025-05-12 10:51:35.982016+00	9
91e21edc-e323-419b-8d7e-501ef26810f1	c396be00-a182-4b7b-b10f-90b855da38b8	7af02b6c-d211-444c-9385-f91394fc72cc	movie	2025-04-02 07:11:25.210908+00	10
5ec11272-ad97-4e0d-b693-48ae36215677	1f496b87-3ada-4038-95ed-da27ef1db249	c8946e5a-c732-4e65-a9b2-a16ae0f8792b	movie	2025-04-02 07:11:25.210908+00	0
6fb49ff4-ab14-4779-85c5-741d11fc9ad9	1f496b87-3ada-4038-95ed-da27ef1db249	ab743fe5-c299-4f26-b444-702c9556d40e	movie	2025-09-12 06:22:52.247679+00	1
9ef30f27-50d0-4586-9dcb-fef3221c881d	1f496b87-3ada-4038-95ed-da27ef1db249	a08ac4ba-88ca-4fc1-b30d-fca5628a4a71	movie	2025-04-02 07:11:25.210908+00	2
01124569-16dd-42ae-ac96-69ee80571d04	c396be00-a182-4b7b-b10f-90b855da38b8	1056741b-4ccf-4a65-9626-46d40f887e40	movie	2025-04-02 07:11:25.210908+00	11
cb6649cb-1802-42ca-b7cc-81030b597317	c396be00-a182-4b7b-b10f-90b855da38b8	d0011d6b-5d96-4889-a710-b786fb0447bd	movie	2025-04-02 07:11:25.210908+00	12
d855c50e-47db-45db-9ccb-1bae82f0e66d	c396be00-a182-4b7b-b10f-90b855da38b8	001164ce-5da9-4145-9d3e-e8af7f66601b	movie	2025-04-02 07:11:25.210908+00	13
a65c8a1c-8544-493a-8c5b-688361b731f8	c396be00-a182-4b7b-b10f-90b855da38b8	a0d2fe52-1e9a-4d44-ad1e-be346f538a38	movie	2025-04-02 07:11:25.210908+00	14
6decda18-0f6e-446f-a9ed-d49c05e2b883	c396be00-a182-4b7b-b10f-90b855da38b8	b2689927-f20f-4001-844a-195c75a103a7	movie	2025-04-02 07:11:25.210908+00	15
0fb9c14b-e0d6-48e5-81f9-010d89edfb2b	c396be00-a182-4b7b-b10f-90b855da38b8	b83967e8-3456-4f50-ba71-79c61acfe62b	movie	2025-04-02 07:11:25.210908+00	16
b3a72a7c-320c-412f-af65-e2b35a7413c5	c396be00-a182-4b7b-b10f-90b855da38b8	a01eaa6e-fa30-4d01-8a15-b349c91fd55b	movie	2025-04-05 12:32:23.072825+00	17
257aaf8a-8008-4547-a857-b35347febbc0	c396be00-a182-4b7b-b10f-90b855da38b8	41227218-c09c-4190-8e50-0b3ad9bbf51f	movie	2025-04-05 12:32:32.668911+00	18
b997cea2-aad9-4a77-b8d7-50c7ec95548e	c396be00-a182-4b7b-b10f-90b855da38b8	c5e7501b-fc34-44f4-91fb-dff57c3ccf0b	movie	2025-04-05 12:32:42.605094+00	19
08f3a491-fef3-4b4c-bb64-6decb921fb55	c396be00-a182-4b7b-b10f-90b855da38b8	d1fdbeb7-7193-4ad3-8324-d6f2f34c62ff	movie	2025-04-05 12:27:03.288786+00	20
7fdd0135-07c5-4af1-be03-9250d5d24944	c396be00-a182-4b7b-b10f-90b855da38b8	040eff48-e016-4835-ba4b-07d42f828acb	movie	2025-04-05 12:29:28.973423+00	21
23f5a5cf-2cf2-4ee0-92f7-8f0660d821a5	c396be00-a182-4b7b-b10f-90b855da38b8	d515d135-870e-4cdb-9216-160f5f8299b4	movie	2025-04-05 12:30:59.497309+00	22
aa994958-2284-479a-a079-fa8eca879afe	c396be00-a182-4b7b-b10f-90b855da38b8	521f225e-15a2-4a99-a107-18f4a97282fd	movie	2025-04-05 12:33:08.038658+00	23
\.


--
-- Data for Name: movie_comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.movie_comments (id, movie_id, user_id, parent_comment_id, content, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: movie_genres; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.movie_genres (id, movie_id, genre_id, created_at) FROM stdin;
ec1780dc-e437-4c01-a96f-e99811e1989d	c0b11ac5-0a4e-4b14-81d6-11d15f47507a	d395eb00-2f78-45b0-b67e-c9862a141bdd	2025-10-25 08:06:58.34917+00
f8ca00e4-92a3-4637-b75f-f04284ab510a	c0b11ac5-0a4e-4b14-81d6-11d15f47507a	9dce0281-cc2f-4ee5-9dc8-c3281ba94509	2025-10-25 08:06:58.34917+00
f34855da-8695-4302-a3de-e816048ee1ee	c0b11ac5-0a4e-4b14-81d6-11d15f47507a	4e3e7a41-9626-494a-92bb-0b2c92b5b7c1	2025-10-25 08:06:58.34917+00
ac4d5221-55ee-47d9-a136-54340fd87fe1	efb3e0b0-3ce5-4cd4-9c46-45eabd0210bd	d395eb00-2f78-45b0-b67e-c9862a141bdd	2025-10-25 08:08:28.642932+00
1accec50-ccbf-455e-abd3-a2b010afa5ea	efb3e0b0-3ce5-4cd4-9c46-45eabd0210bd	9dce0281-cc2f-4ee5-9dc8-c3281ba94509	2025-10-25 08:08:28.642932+00
4027ac46-1eff-4d1f-9865-c4d874e9b88c	efb3e0b0-3ce5-4cd4-9c46-45eabd0210bd	4e3e7a41-9626-494a-92bb-0b2c92b5b7c1	2025-10-25 08:08:28.642932+00
733b7e78-fcab-4cd3-9f61-7ab028734d75	167c2401-e028-4fd2-96cb-78e9415a4317	9dce0281-cc2f-4ee5-9dc8-c3281ba94509	2025-10-25 08:10:09.31287+00
56c7e6c2-3ddb-4248-a846-4d7d3918bbd1	167c2401-e028-4fd2-96cb-78e9415a4317	b609a350-e59c-4856-8061-8797b8afc43f	2025-10-25 08:10:09.31287+00
91ebe453-f230-46ba-b761-8d2452883124	a0d2fe52-1e9a-4d44-ad1e-be346f538a38	d395eb00-2f78-45b0-b67e-c9862a141bdd	2025-10-26 09:15:52.693227+00
7c64c750-9989-4c81-95a5-984e3b546200	a0d2fe52-1e9a-4d44-ad1e-be346f538a38	9dce0281-cc2f-4ee5-9dc8-c3281ba94509	2025-10-26 09:15:52.693227+00
0dec178b-d8ed-4593-a3b7-1fd59b0e6643	a0d2fe52-1e9a-4d44-ad1e-be346f538a38	6fbc294c-4bf5-43cf-a379-39fbc40fd8e1	2025-10-26 09:15:52.693227+00
\.


--
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.movies (id, title, overview, poster_path, tmdb_id, release_year, created_at, backdrop_path, tmdb_popularity, popularity, last_fetched, runtime) FROM stdin;
7af02b6c-d211-444c-9385-f91394fc72cc	Batman Begins		/4MpN4kIEqUjW8OPtOQJXlTdHiJV.jpg	272	2005	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
07fec5c9-94cf-4635-b34a-786b1c3b2ca9	DragonHeart		/5ciO16x4LQ7uhy854YHvQuQvHU9.jpg	8840	1996	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
80c85a89-32ef-4cf1-9ebe-f6c0e39415a4	First Knight		/xuXkCcrvUTkehVXuTGpnfySsx0Z.jpg	6520	1995	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
47257ba0-6a1f-44e6-8522-271966e32d5b	Gladiator II		/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg	558449	2024	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
d2d9e01f-ce69-4bf5-b292-3ee4250c3b4c	Highlander		/8Z8dptJEypuLoOQro1WugD855YE.jpg	8009	1986	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
2b779335-76c1-4200-81ec-616518460652	Man of Steel		/dksTL9NXc3GqPBRHYHcy1aIwjS.jpg	49521	2013	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
691f422f-5e53-4a62-801c-73f1afd6fe65	Moana		/9tzN8sPbyod2dsa0lwuvrwBDWra.jpg	277834	2016	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
37f783c7-b3d5-4619-9aac-16c4823c3143	Moana 2		/aLVkiINlIeCkcZIzb7XHzPYgO6L.jpg	1241982	2024	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
a08ac4ba-88ca-4fc1-b30d-fca5628a4a71	Prince of Persia: The Sands of Time		/34Vbk8VNMtETTOSG3jCHWwlWr1m.jpg	9543	2010	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
1056741b-4ccf-4a65-9626-46d40f887e40	The Dark Knight		/qJ2tW6WMUDux911r6m7haRef0WH.jpg	155	2008	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
d0011d6b-5d96-4889-a710-b786fb0447bd	The Dark Knight Rises		/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg	49026	2012	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
001164ce-5da9-4145-9d3e-e8af7f66601b	The League of Extraordinary Gentlemen		/kdAuVFP63XXxnb983ry2pLCKd9S.jpg	8698	2003	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
a0d2fe52-1e9a-4d44-ad1e-be346f538a38	The Lord of the Rings: The Fellowship of the Ring		/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg	120	2001	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
b2689927-f20f-4001-844a-195c75a103a7	The Lord of the Rings: The Return of the King		/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg	122	2003	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
b83967e8-3456-4f50-ba71-79c61acfe62b	The Lord of the Rings: The Two Towers		/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg	121	2002	2025-04-02 07:11:25.210908+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
d1fdbeb7-7193-4ad3-8324-d6f2f34c62ff	Star Wars: Episode I - The Phantom Menace	Anakin Skywalker, a young slave strong with the Force, is discovered on Tatooine. Meanwhile, the evil Sith have returned, enacting their plot for revenge against the Jedi.	/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg	1893	1999	2025-04-05 12:26:41.926675+00	/aTXhYyxx23AGWAqrkrs1fNGhgSO.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
040eff48-e016-4835-ba4b-07d42f828acb	Star Wars: Episode II - Attack of the Clones	Following an assassination attempt on Senator Padmé Amidala, Jedi Knights Anakin Skywalker and Obi-Wan Kenobi investigate a mysterious plot that could change the galaxy forever.	/oZNPzxqM2s5DyVWab09NTQScDQt.jpg	1894	2002	2025-04-05 12:27:15.626477+00	/1uQSh7P3k0oRbRf0vH8GVt4thpP.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
d515d135-870e-4cdb-9216-160f5f8299b4	Star Wars: Episode III - Revenge of the Sith	The evil Darth Sidious enacts his final plan for unlimited power -- and the heroic Jedi Anakin Skywalker must choose a side.	/xfSAoBEm9MNBjmlNcDYLvLSMlnq.jpg	1895	2005	2025-04-05 12:29:43.026373+00	/5vDuLrjJXFS9PTF7Q1xzobmYKR9.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
a01eaa6e-fa30-4d01-8a15-b349c91fd55b	Star Wars	Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.	/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg	11	1977	2025-04-05 12:32:23.004548+00	/2w4xG178RpB4MDAIfTkqAuSJzec.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
41227218-c09c-4190-8e50-0b3ad9bbf51f	The Empire Strikes Back	The epic saga continues as Luke Skywalker, in hopes of defeating the evil Galactic Empire, learns the ways of the Jedi from aging master Yoda. But Darth Vader is more determined than ever to capture Luke. Meanwhile, rebel leader Princess Leia, cocky Han Solo, Chewbacca, and droids C-3PO and R2-D2 are thrown into various stages of capture, betrayal and despair.	/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg	1891	1980	2025-04-05 12:32:32.567697+00	/dMZxEdrWIzUmUoOz2zvmFuutbj7.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
c5e7501b-fc34-44f4-91fb-dff57c3ccf0b	Return of the Jedi	Luke Skywalker leads a mission to rescue his friend Han Solo from the clutches of Jabba the Hutt, while the Emperor seeks to destroy the Rebellion once and for all with a second dreaded Death Star.	/jQYlydvHm3kUix1f8prMucrplhm.jpg	1892	1983	2025-04-05 12:32:42.512918+00	/r2IOBOeg5wLfLtyOnT5Pur6Tl4q.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
521f225e-15a2-4a99-a107-18f4a97282fd	Star Wars: The Force Awakens	Thirty years after defeating the Galactic Empire, Han Solo and his allies face a new threat from the evil Kylo Ren and his army of Stormtroopers.	/wqnLdwVXoBjKibFRR5U3y0aDUhs.jpg	140607	2015	2025-04-05 12:33:07.975988+00	/k6EOrckWFuz7I4z4wiRwz8zsj4H.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
7f634f73-6c03-482a-82f6-74fae93b60af	Star Wars: The Last Jedi	Rey develops her newly discovered abilities with the guidance of Luke Skywalker, who is unsettled by the strength of her powers. Meanwhile, the Resistance prepares to do battle with the First Order.	/ySaaKHOLAQU5HoZqWmzDIj1VvZ1.jpg	181808	2017	2025-04-05 12:33:11.472118+00	/5Iw7zQTHVRBOYpA0V6z0yypOPZh.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
5dccc287-c43e-4b48-9d19-b9733dbaf52e	Star Wars: The Rise of Skywalker	The surviving Resistance faces the First Order once again as the journey of Rey, Finn and Poe Dameron continues. With the power and knowledge of generations behind them, the final battle begins.	/db32LaOibwEliAmSL2jjDF6oDdj.jpg	181812	2019	2025-04-05 12:33:22.488175+00	/auJKGst3vXpJozHZh4nMFs0xWIU.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
8de058ba-a308-4643-a28b-20f1245078ee	John Carter	John Carter is a war-weary, former military captain who's inexplicably transported to the mysterious and exotic planet of Barsoom (Mars) and reluctantly becomes embroiled in an epic conflict. It's a world on the brink of collapse, and Carter rediscovers his humanity when he realizes the survival of Barsoom and its people rests in his hands.	/lCxz1Yus07QCQQCb6I0Dr3Lmqpx.jpg	49529	2012	2025-05-12 10:47:52.77224+00	/ubNevniKd5NYo60DqYIQ29T0uyB.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
e3fe1493-07e9-4af4-b2d8-e81de9d2191b	Batman Returns	Batman must face The Penguin, a sewer-dwelling gangleader intent on being accepted into Gotham society.  Meanwhile, another Gotham resident finds herself transformed into Catwoman and is out for revenge...	/uEIvgvxzK08922iU61OvO3ORs0s.jpg	364	1992	2025-05-12 10:51:35.895062+00	/3WP0RObZ2t7ShHfqQpKPljF9B22.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
865a1df3-c277-4292-ba84-bc80dc56aa0c	Back to the Future	Eighties teenager Marty McFly is accidentally sent back in time to 1955, inadvertently disrupting his parents' first meeting and attracting his mother's romantic interest. Marty must repair the damage to history by rekindling his parents' romance and - with the help of his eccentric inventor friend Doc Brown - return to 1985.	/vN5B5WgYscRGcQpVhHl6p9DDTP0.jpg	105	1985	2025-05-12 11:26:41.271081+00	/5bzPWQ2dFUl2aZKkp7ILJVVkRed.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
6c3a56cf-0598-4486-b350-386ad50085cd	Back to the Future Part II	Marty and Doc are at it again as the time-traveling duo head to 2015 to nip some McFly family woes in the bud. But things go awry thanks to bully Biff Tannen and a pesky sports almanac. In a last-ditch attempt to set things straight, Marty finds himself bound for 1955 and face to face with his teenage parents -- again.	/YBawEsTkUZBDajKbd5LiHkmMGf.jpg	165	1989	2025-05-12 11:26:44.865904+00	/su0cmtK55eKXq0QjW68LQslUhUY.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
167c2401-e028-4fd2-96cb-78e9415a4317	Hidalgo		/iGzENlBPYJEFWZnye4t3nqWSSp1.jpg	2023	2004	2025-04-02 07:11:25.210908+00	/sAiTihJ8bjEqg8nYUIlTQUnVXuj.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
1c78ac74-b761-4510-8e9f-05809ba57315	Up		/mFvoEwSfLqbcWwFsDjQebn9bzFe.jpg	14160	2009	2025-04-02 07:11:25.210908+00	/hGGC9gKo7CFE3fW07RA587e5kol.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
a9eb6964-a8a9-4d1d-ae10-ce9a34c8801b	Back to the Future Part III	The final installment finds Marty digging the trusty DeLorean out of a mineshaft and looking for Doc in the Wild West of 1885. But when their time machine breaks down, the travelers are stranded in a land of spurs. More problems arise when Doc falls for pretty schoolteacher Clara Clayton, and Marty tangles with Buford Tannen.	/crzoVQnMzIrRfHtQw0tLBirNfVg.jpg	196	1990	2025-05-12 11:26:48.115001+00	/vKp3NvqBkcjHkCHSGi6EbcP7g4J.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
cba4eefa-8cec-4e1d-a7d8-7d311e06b28f	Serenity	When the renegade crew of Serenity agrees to hide a fugitive on their ship, they find themselves in an action-packed battle between the relentless military might of a totalitarian regime who will destroy anything – or anyone – to get the girl back and the bloodthirsty creatures who roam the uncharted areas of space. But... the greatest danger of all may be on their ship.	/4sqUOaPFoP2W81mq1UYqZqf5WzA.jpg	16320	2005	2025-07-21 22:39:13.108612+00	/f9vGIwNFIfctU7vd4rg85csnMZm.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
7e1e058f-3be9-4c2f-bde9-1cf0408d5659	Batman v Superman: Dawn of Justice	Fearing the actions of a god-like Super Hero left unchecked, Gotham City’s own formidable, forceful vigilante takes on Metropolis’s most revered, modern-day savior, while the world wrestles with what sort of hero it really needs. And with Batman and Superman at war with one another, a new threat quickly arises, putting mankind in greater danger than it’s ever known before.	/5UsK3grJvtQrtzEgqNlDljJW96w.jpg	209112	2016	2025-07-21 22:39:53.080669+00	/doiUtOHzcxXFl0GVQ2n8Ay6Pirx.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
447eda6d-60a9-46b4-97c1-29e3ff5a15cc	Zack Snyder's Justice League	Determined to ensure Superman's ultimate sacrifice was not in vain, Bruce Wayne aligns forces with Diana Prince with plans to recruit a team of metahumans to protect the world from an approaching threat of catastrophic proportions.	/tnAuB8q5vv7Ax9UAEje5Xi4BXik.jpg	791373	2021	2025-07-21 22:40:40.912746+00	/pcDc2WJAYGJTTvRSEIpRZwM3Ola.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
88a62601-9756-4da3-9819-2a3d531e7048	Black Adam	Nearly 5,000 years after he was bestowed with the almighty powers of the Egyptian gods—and imprisoned just as quickly—Black Adam is freed from his earthly tomb, ready to unleash his unique form of justice on the modern world.	/3zXceNTtyj5FLjwQXuPvLYK5YYL.jpg	436270	2022	2025-07-21 22:41:13.412096+00	/5sHE4jKJtA9fCkaMeaVUy6KHc2W.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
c8e14eaf-ecdd-411f-a21f-256656a6bbbc	The Flash	When his attempt to save his family inadvertently alters the future, Barry Allen becomes trapped in a reality in which General Zod has returned and there are no Super Heroes to turn to. In order to save the world that he is in and return to the future that he knows, Barry's only hope is to race for his life. But will making the ultimate sacrifice be enough to reset the universe?	/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg	298618	2023	2025-07-21 22:42:19.598095+00	/yF1eOkaYvwiORauRCPWznV9xVvi.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
7b3caef4-ae53-476f-b70f-2acf696ba0d6	Wonder Woman	An Amazon princess comes to the world of Man in the grips of the First World War to confront the forces of evil and bring an end to human conflict.	/v4ncgZjG2Zu8ZW5al1vIZTsSjqX.jpg	297762	2017	2025-07-21 22:43:00.760218+00	/AaABt75ZzfMGrscUR2seabz4PEX.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
ab743fe5-c299-4f26-b444-702c9556d40e	The Man from U.N.C.L.E.	At the height of the Cold War, a mysterious criminal organization plans to use nuclear weapons and technology to upset the fragile balance of power between the United States and Soviet Union. CIA agent Napoleon Solo and KGB agent Illya Kuryakin are forced to put aside their hostilities and work together to stop the evildoers in their tracks. The duo's only lead is the daughter of a missing German scientist, whom they must find soon to prevent a global catastrophe.	/y5yZaForGSJbPD66Cvq9AT5WMAD.jpg	203801	2015	2025-09-12 06:22:52.150577+00	/bu0LiPEWKHWViRoaFwlTAzZ8wyS.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
c8946e5a-c732-4e65-a9b2-a16ae0f8792b	Kingdom of Heaven		/uk55nBEFIQFveIiy9jvLGiVtk4h.jpg	1495	2005	2025-04-02 07:11:25.210908+00	/kP8rK9dGS1pr0HrnmXfIi2heWjo.jpg	\N	\N	2025-10-25 03:55:14.905091+00	\N
4630d06a-5338-49f4-9608-7a0700648814	Robin Hood: Men in Tights	\N	/woexOLEkUlYsPLLuZRK6LjZaF38.jpg	8005	1993	2025-10-23 14:10:41.998398+00	\N	\N	\N	2025-10-25 03:55:14.905091+00	\N
5d942583-525d-4873-80a9-0ab4a0650245	The Lego Movie	An ordinary Lego mini-figure, mistakenly thought to be the extraordinary MasterBuilder, is recruited to join a quest to stop an evil Lego tyrant from conquering the universe.	/oQeusrfyFx6DiSANOXKV3dc2G0g.jpg	137106	2014	2025-10-25 05:33:40.424335+00	/5N2mfRrvJUnCVpsMIebfosEyo1i.jpg	\N	\N	2025-10-25 05:33:40.424335+00	\N
64def74f-c322-45e3-b65f-dd1e6549d6e4	Good Burger	Two L.A. teens with summer jobs at Good Burger try to save their small restaurant when a corporate giant burger franchise moves in across the street.	/imFLUF2TYkm13GpFYTKYF7T27sP.jpg	14817	1997	2025-10-25 07:17:21.65594+00	/gp1Ie3ThtwJHFNNgHz3tC3pOrat.jpg	\N	\N	2025-10-25 07:17:21.65594+00	\N
c0b11ac5-0a4e-4b14-81d6-11d15f47507a	Iron Man	After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.	/78lPtwv72eTNqFW9COBYI0dWDJa.jpg	1726	2008	2025-10-25 08:01:31.571481+00	/cyecB7godJ6kNHGONFjUyVN9OX5.jpg	18.2393	18	2025-10-25 08:01:31.283+00	126
efb3e0b0-3ce5-4cd4-9c46-45eabd0210bd	Iron Man 2	With the world now aware of his dual life as the armored superhero Iron Man, billionaire inventor Tony Stark faces pressure from the government, the press and the public to share his technology with the military. Unwilling to let go of his invention, Stark, with Pepper Potts and James 'Rhodey' Rhodes at his side, must forge new alliances – and confront powerful enemies.	/6WBeq4fCfn7AN0o21W9qNcRF2l9.jpg	10138	2010	2025-10-25 08:08:27.581929+00	/7lmBufEG7P7Y1HClYK3gCxYrkgS.jpg	22.1417	22	2025-10-25 08:08:27.29+00	124
095ffc2c-95d3-49f0-93e0-9b8998b995d7	Air Force One	When Russian neo-nationalists hijack Air Force One, the world's most secure and extraordinary aircraft, the President is faced with a nearly impossible decision to give in to terrorist demands or sacrifice not only the country's dignity, but the lives of his wife and daughter.	/juRFEbyx5JlNuYrZM50vcZmtN78.jpg	9772	1997	2025-10-27 11:24:05.563896+00	/8IFCWQ0fQEukqNY7LAljl7DuFZf.jpg	4.7278	4	2025-10-27 11:24:05.13+00	124
25891ec6-82cf-47ca-9f9d-a31a312fb043	Con Air	Newly-paroled former US Army ranger Cameron Poe is headed back to his wife, but must fly home aboard a prison transport flight dubbed "Jailbird" taking the “worst of the worst” prisoners, a group described as “pure predators”, to a new super-prison. Poe faces impossible odds when the transport plane is skyjacked mid-flight by the most vicious criminals in the country led by the mastermind — genius serial killer Cyrus "The Virus" Grissom, and backed by black militant Diamond Dog and psychopath Billy Bedlam.	/kOKjgrEzGOP92rVQ6srA9jtp60l.jpg	1701	1997	2025-10-27 11:24:16.903052+00	/vsmlShNNHrYlERZaqMOsZ3YctoO.jpg	9.0814	9	2025-10-27 11:24:16.62+00	116
b63dc6b1-2732-41bf-a894-fc3045a0e91a	Free Guy	A bank teller discovers he is actually a background player in an open-world video game, and decides to become the hero of his own story. Now, in a world where there are no limits, he is determined to be the guy who saves his world his way before it's too late.	/6PFJrMvoQwBxQITLYHj09VeJ37q.jpg	550988	2021	2025-10-27 11:24:26.604292+00	/rOJb0yQOCny0bPjg8bCLw8DyAD7.jpg	14.5594	14	2025-10-27 11:24:26.325+00	115
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles (id, created_at, username, settings, last_username_change, role, avatar_path, profile_visibility) FROM stdin;
2955c32a-54b5-4f52-a473-9e8fdbbde21d	2025-03-30 11:15:08.402803+00	ThunderBlade8213	{}	\N	0	\N	public
8d4988f6-3593-4a1d-b835-7d25b58314f0	2025-03-30 13:27:46.660879+00	VictoriousWolf6097	{}	\N	0	\N	public
3e9e5cdc-8387-4fb3-b1c3-866d24551cfe	2025-03-31 23:47:57.155623+00	TitanAvenger8979	{}	\N	0	\N	public
8e552a4c-da01-402d-afca-ef07a989b933	2025-05-12 10:46:53.740167+00	StormSamurai2183	{}	\N	0	\N	public
2c14713b-a581-4614-812c-e2ea5b3e2835	2025-09-20 00:57:03.620183+00	EpicLion1597	{}	\N	0	\N	public
29bd5153-a7df-428e-a47b-449a13462da8	2025-03-29 07:19:07.388528+00	KingArthur	{"show_watching_deck": true}	2025-07-21 22:36:08.463+00	10	29bd5153-a7df-428e-a47b-449a13462da8/1761456559987.jpg	public
\.


--
-- Data for Name: reel_deck; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reel_deck (id, user_id, media_id, media_type, added_at, status, last_watched_at) FROM stdin;
1ef8af7c-6dcb-4bdf-91e4-45be440029db	29bd5153-a7df-428e-a47b-449a13462da8	76301014-3c2f-4caf-9658-12e18781e39e	tv	2025-10-30 15:26:19.545341+00	watching	2025-10-31 03:23:38.349+00
46bf10a2-3c99-446e-be7e-322a87d29e2c	29bd5153-a7df-428e-a47b-449a13462da8	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	tv	2025-10-30 15:27:45.571844+00	watching	2025-10-31 07:08:00.582+00
bd523f6c-1c23-45f5-89d8-cc19ff2a918b	29bd5153-a7df-428e-a47b-449a13462da8	525ad006-b49f-4790-b22e-c426b3fd2445	tv	2025-10-25 08:11:03.684297+00	watching	2025-10-31 12:52:18.659+00
32633726-7932-462f-8224-64e1d887dda4	29bd5153-a7df-428e-a47b-449a13462da8	4f92630b-d34e-40d9-96aa-546c390600c7	tv	2025-10-31 13:42:42.841958+00	completed	\N
c54ac24e-17f8-4e92-9328-d78d86638460	29bd5153-a7df-428e-a47b-449a13462da8	9e469f16-cddc-49cb-8bb0-9a423e3fff40	tv	2025-11-02 23:51:16.927525+00	watching	\N
\.


--
-- Data for Name: season_comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.season_comments (id, season_id, user_id, parent_comment_id, content, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: seasons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.seasons (id, series_id, season_number, title, overview, poster_path, release_year, created_at, air_date, episode_count, last_fetched, tmdb_id) FROM stdin;
8fc12066-b88b-4068-946d-489fe90c3085	525ad006-b49f-4790-b22e-c426b3fd2445	1	Season 1	When a young man is kidnapped and threatened with beheading, the slow horses find themselves unexpectedly embroiled in a dangerous case that forces them to prove their worth.	/oBqlO6ZjTcVFiE0lBj89lAOi18s.jpg	2022	2025-10-25 02:11:47.270056+00	2022-04-01	6	2025-10-31 04:17:51.711+00	135858
f87460c0-f2b8-457f-b427-be8515a787f7	525ad006-b49f-4790-b22e-c426b3fd2445	2	Season 2	Long-buried Cold War secrets emerge which threaten to bring carnage to the streets of London. When a liaison with Russian villains takes a fatal turn, our hapless heroes must overcome their individual failings and raise their spy game in a race to prevent a catastrophic incident.	/8FM8KCgZQSbLLXcZew0MSj6so1k.jpg	2022	2025-10-25 02:11:47.270056+00	2022-12-02	6	2025-10-31 04:17:51.778+00	310117
08dff48e-c356-44d5-a707-072749b0b360	525ad006-b49f-4790-b22e-c426b3fd2445	3	Season 3	A romantic liaison in Istanbul threatens to expose a buried MI5 secret in London. When Jackson Lamb and his team of misfits are dragged into the fight, they find themselves caught in a conspiracy that threatens the future not just of Slough House but of MI5 itself.	/vJI9OcHFHxDy6ZeEmXfM5zhApXV.jpg	2023	2025-10-25 02:11:47.270056+00	2023-11-29	6	2025-10-31 04:17:51.861+00	357755
f21d1855-c60d-44ee-a3a6-eab94c92f0c4	525ad006-b49f-4790-b22e-c426b3fd2445	4	Season 4	In season 4, a bombing detonates personal secrets, rocking Slough House's already unstable foundations.	/lQwWHQHbJkl5pbBX0nKKZpQbly2.jpg	2024	2025-10-25 02:11:47.270056+00	2024-09-04	6	2025-10-31 04:17:51.942+00	400149
ec7c8429-8b23-4f0e-8509-4255db455b0d	525ad006-b49f-4790-b22e-c426b3fd2445	5	Season 5	In season five, everyone is suspicious when resident tech nerd Roddy Ho has a glamorous new girlfriend. When a series of increasingly bizarre events occur across the city, it falls to the Slow Horses to work out how everything is connected. After all, Lamb knows that in the world of espionage, the London Rules — cover your back — always apply.	/5RuZZIouptatjV96BdPmKmRsnGg.jpg	2025	2025-10-25 02:11:47.270056+00	2025-09-24	6	2025-10-31 04:17:52.027+00	459284
ea7e2acc-8b5d-4abb-8f92-1081af26f034	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	1	Season 1		/jMCBW1Z9Ha1Mx0gh7qxrFzhx75U.jpg	2022	2025-10-30 15:27:41.169802+00	2022-10-07	22	2025-10-31 07:07:46.467+00	294271
c1706c69-cb44-425d-8246-948d7f16fc87	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2	Season 2		/6XnA02VRG4dhBpTZWGZuXQdYGDW.jpg	2024	2025-10-30 15:27:41.169802+00	2024-02-16	10	2025-10-31 07:07:46.582+00	365563
c7c013c3-6a37-4d21-b6eb-7ef88e1cb17f	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	3	Season 3		/k4A0gowDmS62tV3aAqEeG9Dq7TN.jpg	2024	2025-10-30 15:27:41.169802+00	2024-10-18	20	2025-10-31 07:07:46.665+00	402121
3dca8442-3fc1-45d1-ae05-f82d10e2e907	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	4	Season 4		/7cxcXEyccuHmyopDKqvEXsv0nJA.jpg	2025	2025-10-30 15:27:41.169802+00	2025-10-17	4	2025-10-31 07:07:46.731+00	465001
2356946f-d27e-4276-a01c-2c8f29065164	76301014-3c2f-4caf-9658-12e18781e39e	1	Season 1		/ylTZ6bfmPrwUz01A0VpvluGFWsv.jpg	2024	2025-10-30 15:21:42.411303+00	2024-09-17	13	2025-10-31 13:32:44.34+00	341174
c563a899-f274-4dcc-9805-a44e2fe57383	76301014-3c2f-4caf-9658-12e18781e39e	2	Season 2		/xCtaUDBUP1iKqtoqpHfeH1T2pWF.jpg	2025	2025-10-30 15:21:42.411303+00	2025-09-16	10	2025-10-31 13:32:44.412+00	465872
216e289a-7068-4699-9c3c-26bfaa7c50a8	4f92630b-d34e-40d9-96aa-546c390600c7	0	Specials		\N	2010	2025-10-31 13:42:34.136715+00	2010-10-17	6	2025-10-31 13:42:53.465+00	72662
d19675b4-ac67-4b99-ba32-b5291be82816	4f92630b-d34e-40d9-96aa-546c390600c7	1	Series 1		/gGnzXAzUwO3oa9u9hk33yOc440j.jpg	2010	2025-10-31 13:42:34.136715+00	2010-05-04	6	2025-10-31 13:42:53.529+00	3769
a2347b96-f111-49c7-a1a9-775e12c7a6bf	4f92630b-d34e-40d9-96aa-546c390600c7	2	Series 2		/69eSub2P8YoQ7xSkDdO46ylWga6.jpg	2011	2025-10-31 13:42:34.136715+00	2011-06-14	4	2025-10-31 13:42:53.579+00	3770
be116d51-ec42-419a-ad68-8d44f8cd8802	4f92630b-d34e-40d9-96aa-546c390600c7	3	Series 3		/tqZ5XsH3R9eRkZRrKdquJrhAfsl.jpg	2013	2025-10-31 13:42:34.136715+00	2013-07-02	4	2025-10-31 13:42:53.624+00	3771
751329b9-320c-4a9a-8199-e943770c1e88	4f92630b-d34e-40d9-96aa-546c390600c7	4	Series 4		/dVSVuuI7RrSOoH8TMlDl44dFoN4.jpg	2015	2025-10-31 13:42:34.136715+00	2015-12-15	2	2025-10-31 13:42:53.667+00	72444
cd8a9736-19fe-456d-a1cb-a0e7ce3727fe	4f92630b-d34e-40d9-96aa-546c390600c7	5	Series 5		/pwvYiNElwC8J83gd8sJFg8Rutba.jpg	2019	2025-10-31 13:42:34.136715+00	2019-01-01	4	2025-10-31 13:42:53.713+00	113142
eb253b37-36f6-41a7-b0e8-69ac29532975	59adf09f-4e36-406c-9429-559f59f7a206	0	Specials		/8Wyq3m3RWrLejS4jJrTNg0VILo0.jpg	\N	2025-11-02 12:40:13.703124+00	\N	2	2025-11-02 12:40:13.512+00	\N
6d2c9fcb-e3df-4a79-8e64-27deff7cd9cb	59adf09f-4e36-406c-9429-559f59f7a206	1	Season 1	Everyone knows that Leonardo da Vinci was an extraordinary artist, sculptor and inventor, but this evocative and involving cable drama paints a portrait of the consummate Renaissance man who, as a twentysomething, was a passionate ladies' man, swashbuckling swordsman and intrepid adventurer. The series opens with da Vinci receiving a commission from the Medicis to create an Easter spectacle in Florence. Later, he's hired to build war machines; investigates the source of demonic possessions at a convent; meets a mysterious Turk; has a chilling encounter with Vlad Dracula; and constructs a suit for underwater transportation.	/o1bt7v4uHKZaMXfBIPvVrMOpyXP.jpg	2013	2025-11-02 12:40:13.703124+00	2013-04-12	8	2025-11-02 12:40:13.512+00	\N
16f8a3b0-9540-409b-9681-29879d6963d9	59adf09f-4e36-406c-9429-559f59f7a206	2	Season 2	Florence is thrown into chaos in the wake of the Pazzi conspiracy and Leonardo da Vinci must push the limits of his mind and body to defend the city against the forces of Rome. When the dust settles, friends are buried and rivalries enflamed. While the Medicis go to unthinkable lengths to deal with new threats, da Vinci continues on his quest to find the fabled Book of Leaves and uncover the secret history of his mother. He'll come to realize that he has lethal competition in his quest -- new enemies who may be even worse than the forces of Pope Sixtus. His search will take him to faraway lands and force him to reevaluate everything he knew about the world and his own history.	/qUoWQyc7R46pLTsaL0e0PBOBqE3.jpg	2014	2025-11-02 12:40:13.703124+00	2014-03-22	10	2025-11-02 12:40:13.512+00	\N
a757a1dc-866e-41f0-ac1e-23c2e227ef05	59adf09f-4e36-406c-9429-559f59f7a206	3	Season 3	Leonardo da Vinci's world comes crashing down when the city of Otranto is torn apart by an Ottoman invasion. On the battlefield, the Turks use da Vinci’s own weapons against him… the designs for which were stolen by someone he trusted. This betrayal will haunt Leo long after the battle is decided, as will the deaths of loved ones lost in the fighting. When Rome instigates a Crusade against the Turks, he seizes the opportunity to join, but his mission is complicated by a series of grisly murders that terrorize Italy and threaten the Crusade itself.	/17qYO4Ax8joXBHZKWSMyS4cBd5h.jpg	2015	2025-11-02 12:40:13.703124+00	2015-10-24	10	2025-11-02 12:40:13.512+00	\N
3571a748-f14b-434b-9915-6a54be3f77f1	9e469f16-cddc-49cb-8bb0-9a423e3fff40	1	Season 1		/p4TQupPl1FSJbktoFLn1899xsrJ.jpg	2021	2025-11-02 23:51:06.074324+00	2021-11-13	10	2025-11-02 23:51:46.453+00	140998
48bd4f5a-159b-4bcd-bfb2-072cbb79fdd6	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2	Season 2	The struggle for power becomes tougher than ever as the McLuskys work to keep order on all sides of the gate.	/d9JSilY7nM3J7LtBMXXNqJ03aDY.jpg	2023	2025-11-02 23:51:06.074324+00	2023-01-14	10	2025-11-02 23:51:46.775+00	314953
b0cc2092-95dd-404f-9866-72c7dbb420d0	9e469f16-cddc-49cb-8bb0-9a423e3fff40	3	Season 3	In season three, a series of explosions rock Kingstown and its citizens, as a new face of the Russian mob sets up shop in the city, and a drug war rages inside and outside prison walls. The pressure is on Mike McLusky to end the war but things get complicated when a familiar face from his incarcerated past threatens to undermine the Mayor's attempts to keep the peace among all factions.	/lJ1yyRGdwuE10pXgJaV0DvvRUiS.jpg	2024	2025-11-02 23:51:06.074324+00	2024-06-01	10	2025-11-02 23:51:47.114+00	385973
e36b7492-6473-4a86-87fb-ff58a9253775	9e469f16-cddc-49cb-8bb0-9a423e3fff40	4	Season 4	In season four, Mike's control over Kingstown is threatened as new players compete to fill the power vacuum left in the Russians' wake, compelling him to confront the resulting gang war and stop them from swallowing the town. Meanwhile, with those he loves in more danger than ever before, Mike must contend with a headstrong new Warden to protect his own while grappling with demons from his past.	/6rWIip9MZELAA0SKii5WqsBDCYW.jpg	2025	2025-11-02 23:51:06.074324+00	2025-10-26	10	2025-11-02 23:51:47.431+00	462138
\.


--
-- Data for Name: series; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.series (id, title, overview, poster_path, tmdb_id, release_year, created_at, backdrop_path, last_fetched, status, first_air_date, last_air_date) FROM stdin;
5ee1bc31-51b3-460e-809f-d0f8a2334905	Bluey		/9p4pNoGcuyCfHcGWKNrTopqMWtq.jpg	82728	2018	2025-04-02 07:11:25.210908+00	\N	2025-10-25 03:55:14.905091+00	\N	\N	\N
684e89eb-34a7-4169-b7c0-64df3931411b	BLUE EYE SAMURAI		/fXm3JT4WLQVnwukdvghtAblc1wc.jpg	225180	2023	2025-04-02 07:11:25.210908+00	/oCMZpwLBcb3dnRuzEKWNWrw1tHz.jpg	2025-10-25 03:55:14.905091+00	\N	\N	\N
525ad006-b49f-4790-b22e-c426b3fd2445	Slow Horses	Follow a dysfunctional team of MI5 agents—and their obnoxious boss, the notorious Jackson Lamb—as they navigate the espionage world's smoke and mirrors to defend England from sinister forces.	/5RuZZIouptatjV96BdPmKmRsnGg.jpg	95480	2022	2025-10-25 02:00:47.11006+00	/bDfboQUb45Cv9MYyVBDZw8M8xSM.jpg	2025-10-31 04:17:51.592+00	\N	\N	\N
01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	Fire Country	Seeking redemption and a shortened prison sentence, young convict Bode Donovan joins a firefighting program that returns him to his small Northern California hometown, where he and other inmates work alongside elite firefighters to extinguish massive blazes across the region.	/6XnA02VRG4dhBpTZWGZuXQdYGDW.jpg	202297	2022	2025-10-30 15:27:39.677381+00	/aPE32AvGzBDdOUgv2jB8tAoWT43.jpg	2025-10-31 07:07:46.382+00	Returning Series	2022-10-07	2025-10-24
76301014-3c2f-4caf-9658-12e18781e39e	High Potential	Morgan is a single mom with an exceptional mind, whose unconventional knack for solving crimes leads to an unusual and unstoppable partnership with a by-the-book seasoned detective.	/xCtaUDBUP1iKqtoqpHfeH1T2pWF.jpg	226637	2024	2025-10-30 15:21:40.278751+00	/nBTCGBbHbUOK8Eo0vQxfZk8Ae94.jpg	2025-10-31 13:32:44.26+00	Returning Series	2024-09-17	2025-10-21
4f92630b-d34e-40d9-96aa-546c390600c7	Luther	A dark psychological crime drama starring Idris Elba as Luther, a man struggling with his own terrible demons, who might be as dangerous as the depraved murderers he hunts.	/hDxOMX8zzH1FiqKWVBzNaYGBkle.jpg	1426	2010	2025-10-31 13:42:30.355785+00	/A2qdFRq9oJDC5E7fbgSS4POUMDF.jpg	2025-10-31 13:42:53.417+00	Ended	2010-05-04	2019-01-04
59adf09f-4e36-406c-9429-559f59f7a206	Da Vinci's Demons	The series follows the "untold" story of Leonardo Da Vinci: the genius during his early years in Renaissance Florence. As a 25-year old artist, inventor, swordsman, lover, dreamer and idealist, he struggles to live within the confines of his own reality and time as he begins to not only see the future, but invent it.	/sR8m3EUxmRJi4S9u5sfBDRLce1Z.jpg	40293	2013	2025-11-02 12:40:08.626428+00	/wHcLMdK85CIJu76RNxnq6rhS2FF.jpg	2025-11-02 12:40:08.439+00	Ended	2013-04-12	2015-12-26
9e469f16-cddc-49cb-8bb0-9a423e3fff40	Mayor of Kingstown	In a small Michigan town where the business of incarceration is the only thriving industry, the McClusky family are the power brokers between the police, criminals, inmates, prison guards and politicians in a city completely dependent on prisons and the prisoners they contain.	\N	97951	2021	2025-11-02 23:51:00.509194+00	/39bifj2FNytJ2m1cqOBcWMTKgmV.jpg	2025-11-02 23:51:46.14+00	Returning Series	2021-11-14	2025-10-26
\.


--
-- Data for Name: series_comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.series_comments (id, series_id, user_id, parent_comment_id, content, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: series_genres; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.series_genres (id, series_id, genre_id, created_at) FROM stdin;
c42d84b3-8ab8-4efe-8be2-76dbbaf36710	525ad006-b49f-4790-b22e-c426b3fd2445	694affae-c284-43ec-93d7-7f105b88ed0b	2025-10-25 08:10:58.188384+00
f8016931-85a6-4c3b-ad7f-3e7879762c4a	525ad006-b49f-4790-b22e-c426b3fd2445	aa932591-a5b4-4e6e-817d-f27129195d75	2025-10-25 08:10:58.188384+00
bb2aa61d-0cec-4448-99e3-5b0f6df2aad9	525ad006-b49f-4790-b22e-c426b3fd2445	2a2f2006-51c5-4394-8dce-cea09923e47e	2025-10-25 08:10:58.188384+00
b4e16b11-bce1-488c-8178-7e80c39ab6cf	76301014-3c2f-4caf-9658-12e18781e39e	aa932591-a5b4-4e6e-817d-f27129195d75	2025-10-30 15:21:42.053809+00
fffc2313-1109-42d6-b8b6-07ff82846c0b	76301014-3c2f-4caf-9658-12e18781e39e	2a2f2006-51c5-4394-8dce-cea09923e47e	2025-10-30 15:21:42.053809+00
403cbcbf-77f7-4b88-a8c6-83dccd3af315	76301014-3c2f-4caf-9658-12e18781e39e	d945f5db-82ce-4adc-92f4-00c432487f9f	2025-10-30 15:21:42.053809+00
1938ca6c-92fd-4c12-8092-f75ac712599a	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	aa932591-a5b4-4e6e-817d-f27129195d75	2025-10-30 15:27:40.719577+00
c4dc6424-2f6d-4b77-bee9-cd7d4db95d19	01c2e91e-c0dc-4f3f-a57e-3635d9e538c7	2a2f2006-51c5-4394-8dce-cea09923e47e	2025-10-30 15:27:40.719577+00
7a1b24da-6b27-420d-9c1d-ff80b5cfcbd7	4f92630b-d34e-40d9-96aa-546c390600c7	aa932591-a5b4-4e6e-817d-f27129195d75	2025-10-31 13:42:33.779638+00
9b04f1db-4af8-4a74-8138-bb5b9e3994a0	4f92630b-d34e-40d9-96aa-546c390600c7	2a2f2006-51c5-4394-8dce-cea09923e47e	2025-10-31 13:42:33.779638+00
0073ec84-38ba-4c54-b77d-2854a7c3c799	4f92630b-d34e-40d9-96aa-546c390600c7	d945f5db-82ce-4adc-92f4-00c432487f9f	2025-10-31 13:42:33.779638+00
86d6ee62-b226-4268-af9a-a3604e122a04	59adf09f-4e36-406c-9429-559f59f7a206	2a2f2006-51c5-4394-8dce-cea09923e47e	2025-11-02 12:40:13.350485+00
4fa62f13-3f67-422d-8a56-bf99942b9576	9e469f16-cddc-49cb-8bb0-9a423e3fff40	aa932591-a5b4-4e6e-817d-f27129195d75	2025-11-02 23:51:03.744814+00
e1695d72-62b2-45d6-ac04-d37064b59e31	9e469f16-cddc-49cb-8bb0-9a423e3fff40	2a2f2006-51c5-4394-8dce-cea09923e47e	2025-11-02 23:51:03.744814+00
\.


--
-- Data for Name: shared_collection; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shared_collection (id, created_at, collection_id, user_id, access_level) FROM stdin;
1	2025-03-30 11:18:11.681382+00	2f4c5d1b-d54e-4ec5-aaee-40a8c3a0ee59	2955c32a-54b5-4f52-a473-9e8fdbbde21d	0
2	2025-03-30 11:18:59.746504+00	0051b194-c615-4750-949c-e6830a49a04e	29bd5153-a7df-428e-a47b-449a13462da8	0
3	2025-03-31 23:50:38.662867+00	1f496b87-3ada-4038-95ed-da27ef1db249	3e9e5cdc-8387-4fb3-b1c3-866d24551cfe	1
4	2025-05-12 10:48:44.81741+00	c396be00-a182-4b7b-b10f-90b855da38b8	8e552a4c-da01-402d-afca-ef07a989b933	1
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-03-22 07:19:30
20211116045059	2025-03-22 07:19:31
20211116050929	2025-03-22 07:19:32
20211116051442	2025-03-22 07:19:33
20211116212300	2025-03-22 07:19:34
20211116213355	2025-03-22 07:19:35
20211116213934	2025-03-22 07:19:36
20211116214523	2025-03-22 07:19:37
20211122062447	2025-03-22 07:19:38
20211124070109	2025-03-22 07:19:39
20211202204204	2025-03-22 07:19:40
20211202204605	2025-03-22 07:19:41
20211210212804	2025-03-22 07:19:44
20211228014915	2025-03-22 07:19:45
20220107221237	2025-03-22 07:19:46
20220228202821	2025-03-22 07:19:47
20220312004840	2025-03-22 07:19:48
20220603231003	2025-03-22 07:19:49
20220603232444	2025-03-22 07:19:50
20220615214548	2025-03-22 07:19:52
20220712093339	2025-03-22 07:19:53
20220908172859	2025-03-22 07:19:54
20220916233421	2025-03-22 07:19:55
20230119133233	2025-03-22 07:19:56
20230128025114	2025-03-22 07:19:57
20230128025212	2025-03-22 07:19:58
20230227211149	2025-03-22 07:19:59
20230228184745	2025-03-22 07:20:00
20230308225145	2025-03-22 07:20:01
20230328144023	2025-03-22 07:20:02
20231018144023	2025-03-22 07:20:04
20231204144023	2025-03-22 07:20:05
20231204144024	2025-03-22 07:20:06
20231204144025	2025-03-22 07:20:07
20240108234812	2025-03-22 07:20:08
20240109165339	2025-03-22 07:20:09
20240227174441	2025-03-22 07:20:11
20240311171622	2025-03-22 07:20:13
20240321100241	2025-03-22 07:20:15
20240401105812	2025-03-22 07:20:17
20240418121054	2025-03-22 07:20:19
20240523004032	2025-03-22 07:20:22
20240618124746	2025-03-22 07:20:23
20240801235015	2025-03-22 07:20:24
20240805133720	2025-03-22 07:20:25
20240827160934	2025-03-22 07:20:26
20240919163303	2025-03-22 07:20:28
20240919163305	2025-03-22 07:20:29
20241019105805	2025-03-22 07:20:30
20241030150047	2025-03-22 07:20:34
20241108114728	2025-03-22 07:20:35
20241121104152	2025-03-22 07:20:36
20241130184212	2025-03-22 07:20:37
20241220035512	2025-03-22 07:20:38
20241220123912	2025-03-22 07:20:39
20241224161212	2025-03-22 07:20:40
20250107150512	2025-03-22 07:20:41
20250110162412	2025-03-22 07:20:42
20250123174212	2025-03-22 07:20:43
20250128220012	2025-03-22 07:20:44
20250506224012	2025-05-27 21:06:19
20250523164012	2025-06-03 04:20:17
20250714121412	2025-07-29 22:35:26
20250905041441	2025-10-13 09:33:42
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
avatars	avatars	\N	2025-10-23 22:21:49.962723+00	2025-10-23 22:21:49.962723+00	t	f	\N	\N	\N	STANDARD
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets_analytics (id, type, format, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-03-22 07:02:59.905256
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-03-22 07:02:59.921743
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-03-22 07:02:59.924537
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-03-22 07:02:59.954417
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-03-22 07:02:59.986496
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-03-22 07:02:59.990946
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-03-22 07:02:59.998719
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-03-22 07:03:00.00316
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-03-22 07:03:00.00719
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-03-22 07:03:00.010853
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-03-22 07:03:00.01561
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-03-22 07:03:00.020348
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-03-22 07:03:00.028396
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-03-22 07:03:00.033918
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-03-22 07:03:00.038458
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-03-22 07:03:00.067109
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-03-22 07:03:00.072026
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-03-22 07:03:00.075429
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-03-22 07:03:00.081385
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-03-22 07:03:00.090595
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-03-22 07:03:00.099468
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-03-22 07:03:00.109036
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-03-22 07:03:00.141867
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-03-22 07:03:00.16717
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-03-22 07:03:00.173637
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-03-22 07:03:00.177384
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-10-13 09:33:45.357148
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-10-13 09:33:45.461282
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-10-13 09:33:45.475114
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-10-13 09:33:45.484673
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-10-13 09:33:45.488307
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-10-13 09:33:45.498853
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-10-13 09:33:45.509492
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-10-13 09:33:45.518828
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-10-13 09:33:45.520445
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-10-13 09:33:45.530309
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-10-13 09:33:45.533335
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-10-13 09:33:45.546058
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-10-13 09:33:45.55358
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-10-13 09:33:45.583446
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-10-13 09:33:45.588803
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-10-13 09:33:45.601478
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-10-13 09:33:45.611129
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-10-13 09:33:45.616848
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
bead5040-57f3-4812-840b-1e9b97609aef	avatars	29bd5153-a7df-428e-a47b-449a13462da8/1761456559987.jpg	29bd5153-a7df-428e-a47b-449a13462da8	2025-10-26 05:29:21.860455+00	2025-10-26 05:29:21.860455+00	2025-10-26 05:29:21.860455+00	{"eTag": "\\"4003dd0133fbbaed6a15560113a888d8\\"", "size": 1944046, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-10-26T05:29:22.000Z", "contentLength": 1944046, "httpStatusCode": 200}	0d6da1f3-4099-4324-8e3a-34a73bed07b6	29bd5153-a7df-428e-a47b-449a13462da8	{}	2
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
avatars	29bd5153-a7df-428e-a47b-449a13462da8	2025-10-26 05:29:21.860455+00	2025-10-26 05:29:21.860455+00
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: -
--

COPY supabase_migrations.schema_migrations (version, statements, name) FROM stdin;
\.


--
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: -
--

COPY supabase_migrations.seed_files (path, hash) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 258, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: -
--

SELECT pg_catalog.setval('pgsodium.key_key_id_seq', 1, false);


--
-- Name: media_collection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.media_collection_id_seq', 21, true);


--
-- Name: shared_collection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shared_collection_id_seq', 4, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);


--
-- Name: episode_comments episode_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.episode_comments
    ADD CONSTRAINT episode_comments_pkey PRIMARY KEY (id);


--
-- Name: episode_watches episode_watches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.episode_watches
    ADD CONSTRAINT episode_watches_pkey PRIMARY KEY (id);


--
-- Name: episode_watches episode_watches_user_id_episode_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.episode_watches
    ADD CONSTRAINT episode_watches_user_id_episode_id_key UNIQUE (user_id, episode_id);


--
-- Name: episodes episodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.episodes
    ADD CONSTRAINT episodes_pkey PRIMARY KEY (id);


--
-- Name: episodes episodes_series_season_episode_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.episodes
    ADD CONSTRAINT episodes_series_season_episode_unique UNIQUE (series_id, season_number, episode_number);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: media_collection media_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_collection
    ADD CONSTRAINT media_collection_pkey PRIMARY KEY (id);


--
-- Name: media_watches media_watches_collection_id_media_id_media_type_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_watches
    ADD CONSTRAINT media_watches_collection_id_media_id_media_type_user_id_key UNIQUE (collection_id, media_id, media_type, user_id);


--
-- Name: media_watches media_watches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_watches
    ADD CONSTRAINT media_watches_pkey PRIMARY KEY (id);


--
-- Name: medias_collections medias_collections_collection_media_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medias_collections
    ADD CONSTRAINT medias_collections_collection_media_unique UNIQUE (collection_id, media_id, media_type);


--
-- Name: medias_collections medias_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medias_collections
    ADD CONSTRAINT medias_collections_pkey PRIMARY KEY (id);


--
-- Name: movie_comments movie_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movie_comments
    ADD CONSTRAINT movie_comments_pkey PRIMARY KEY (id);


--
-- Name: movie_genres movie_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_pkey PRIMARY KEY (id);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: reel_deck reel_deck_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reel_deck
    ADD CONSTRAINT reel_deck_pkey PRIMARY KEY (id);


--
-- Name: reel_deck reel_deck_user_id_media_id_media_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reel_deck
    ADD CONSTRAINT reel_deck_user_id_media_id_media_type_key UNIQUE (user_id, media_id, media_type);


--
-- Name: season_comments season_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.season_comments
    ADD CONSTRAINT season_comments_pkey PRIMARY KEY (id);


--
-- Name: seasons seasons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seasons
    ADD CONSTRAINT seasons_pkey PRIMARY KEY (id);


--
-- Name: series_comments series_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_comments
    ADD CONSTRAINT series_comments_pkey PRIMARY KEY (id);


--
-- Name: series_genres series_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_genres
    ADD CONSTRAINT series_genres_pkey PRIMARY KEY (id);


--
-- Name: series series_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_pkey PRIMARY KEY (id);


--
-- Name: shared_collection shared_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shared_collection
    ADD CONSTRAINT shared_collection_pkey PRIMARY KEY (id);


--
-- Name: genres unique_genre_tmdb; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT unique_genre_tmdb UNIQUE (tmdb_id, media_type);


--
-- Name: movie_genres unique_movie_genre; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT unique_movie_genre UNIQUE (movie_id, genre_id);


--
-- Name: movies unique_movie_tmdb_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT unique_movie_tmdb_id UNIQUE (tmdb_id);


--
-- Name: CONSTRAINT unique_movie_tmdb_id ON movies; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT unique_movie_tmdb_id ON public.movies IS 'Ensures each TMDB movie appears only once in database';


--
-- Name: episodes unique_season_episode; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.episodes
    ADD CONSTRAINT unique_season_episode UNIQUE (season_id, episode_number);


--
-- Name: CONSTRAINT unique_season_episode ON episodes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT unique_season_episode ON public.episodes IS 'Ensures each season has only one record per episode number';


--
-- Name: series_genres unique_series_genre; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_genres
    ADD CONSTRAINT unique_series_genre UNIQUE (series_id, genre_id);


--
-- Name: seasons unique_series_season; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seasons
    ADD CONSTRAINT unique_series_season UNIQUE (series_id, season_number);


--
-- Name: CONSTRAINT unique_series_season ON seasons; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT unique_series_season ON public.seasons IS 'Ensures each series has only one record per season number';


--
-- Name: series unique_series_tmdb_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT unique_series_tmdb_id UNIQUE (tmdb_id);


--
-- Name: CONSTRAINT unique_series_tmdb_id ON series; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT unique_series_tmdb_id ON public.series IS 'Ensures each TMDB series appears only once in database';


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_episode_comments_episode_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_episode_comments_episode_id ON public.episode_comments USING btree (episode_id);


--
-- Name: idx_episode_comments_parent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_episode_comments_parent ON public.episode_comments USING btree (parent_comment_id);


--
-- Name: idx_episode_comments_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_episode_comments_user_id ON public.episode_comments USING btree (user_id);


--
-- Name: idx_episode_watches_episode_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_episode_watches_episode_id ON public.episode_watches USING btree (episode_id);


--
-- Name: idx_episode_watches_series_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_episode_watches_series_id ON public.episode_watches USING btree (series_id);


--
-- Name: idx_episode_watches_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_episode_watches_user_id ON public.episode_watches USING btree (user_id);


--
-- Name: idx_episode_watches_user_series; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_episode_watches_user_series ON public.episode_watches USING btree (user_id, series_id);


--
-- Name: idx_episodes_last_fetched; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_episodes_last_fetched ON public.episodes USING btree (last_fetched);


--
-- Name: idx_episodes_season_episode; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_episodes_season_episode ON public.episodes USING btree (season_id, episode_number);


--
-- Name: idx_episodes_season_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_episodes_season_number ON public.episodes USING btree (season_number);


--
-- Name: idx_episodes_tmdb_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_episodes_tmdb_id ON public.episodes USING btree (tmdb_id);


--
-- Name: idx_genres_last_fetched; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_genres_last_fetched ON public.genres USING btree (last_fetched);


--
-- Name: idx_genres_media_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_genres_media_type ON public.genres USING btree (media_type);


--
-- Name: idx_genres_tmdb_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_genres_tmdb_id ON public.genres USING btree (tmdb_id);


--
-- Name: idx_media_watches_collection_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_watches_collection_user ON public.media_watches USING btree (collection_id, user_id);


--
-- Name: idx_media_watches_media; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_watches_media ON public.media_watches USING btree (media_id, media_type);


--
-- Name: idx_medias_collections_collection_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medias_collections_collection_id ON public.medias_collections USING btree (collection_id);


--
-- Name: idx_medias_collections_media_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medias_collections_media_id ON public.medias_collections USING btree (media_id);


--
-- Name: idx_medias_collections_position; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_medias_collections_position ON public.medias_collections USING btree (collection_id, "position");


--
-- Name: idx_movie_comments_movie_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_movie_comments_movie_id ON public.movie_comments USING btree (movie_id);


--
-- Name: idx_movie_comments_parent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_movie_comments_parent ON public.movie_comments USING btree (parent_comment_id);


--
-- Name: idx_movie_comments_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_movie_comments_user_id ON public.movie_comments USING btree (user_id);


--
-- Name: idx_movie_genres_genre_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_movie_genres_genre_id ON public.movie_genres USING btree (genre_id);


--
-- Name: idx_movie_genres_movie_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_movie_genres_movie_id ON public.movie_genres USING btree (movie_id);


--
-- Name: idx_movies_last_fetched; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_movies_last_fetched ON public.movies USING btree (last_fetched);


--
-- Name: idx_movies_tmdb_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_movies_tmdb_id ON public.movies USING btree (tmdb_id);


--
-- Name: idx_reel_deck_media; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reel_deck_media ON public.reel_deck USING btree (media_id, media_type);


--
-- Name: idx_reel_deck_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reel_deck_user_id ON public.reel_deck USING btree (user_id);


--
-- Name: idx_season_comments_parent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_season_comments_parent ON public.season_comments USING btree (parent_comment_id);


--
-- Name: idx_season_comments_season_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_season_comments_season_id ON public.season_comments USING btree (season_id);


--
-- Name: idx_season_comments_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_season_comments_user_id ON public.season_comments USING btree (user_id);


--
-- Name: idx_seasons_last_fetched; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_seasons_last_fetched ON public.seasons USING btree (last_fetched);


--
-- Name: idx_seasons_series_season; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_seasons_series_season ON public.seasons USING btree (series_id, season_number);


--
-- Name: idx_seasons_tmdb_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_seasons_tmdb_id ON public.seasons USING btree (tmdb_id);


--
-- Name: idx_series_comments_parent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_series_comments_parent ON public.series_comments USING btree (parent_comment_id);


--
-- Name: idx_series_comments_series_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_series_comments_series_id ON public.series_comments USING btree (series_id);


--
-- Name: idx_series_comments_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_series_comments_user_id ON public.series_comments USING btree (user_id);


--
-- Name: idx_series_genres_genre_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_series_genres_genre_id ON public.series_genres USING btree (genre_id);


--
-- Name: idx_series_genres_series_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_series_genres_series_id ON public.series_genres USING btree (series_id);


--
-- Name: idx_series_last_fetched; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_series_last_fetched ON public.series USING btree (last_fetched);


--
-- Name: idx_series_tmdb_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_series_tmdb_id ON public.series USING btree (tmdb_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: medias_collections set_media_position_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_media_position_trigger BEFORE INSERT ON public.medias_collections FOR EACH ROW WHEN ((new."position" IS NULL)) EXECUTE FUNCTION public.set_default_position();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: collections collections_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: episode_comments episode_comments_episode_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.episode_comments
    ADD CONSTRAINT episode_comments_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES public.episodes(id) ON DELETE CASCADE;


--
-- Name: episode_comments episode_comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.episode_comments
    ADD CONSTRAINT episode_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.episode_comments(id) ON DELETE CASCADE;


--
-- Name: episode_comments episode_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.episode_comments
    ADD CONSTRAINT episode_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: episode_watches episode_watches_episode_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.episode_watches
    ADD CONSTRAINT episode_watches_episode_id_fkey FOREIGN KEY (episode_id) REFERENCES public.episodes(id) ON DELETE CASCADE;


--
-- Name: episode_watches episode_watches_series_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.episode_watches
    ADD CONSTRAINT episode_watches_series_id_fkey FOREIGN KEY (series_id) REFERENCES public.series(id) ON DELETE CASCADE;


--
-- Name: episode_watches episode_watches_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.episode_watches
    ADD CONSTRAINT episode_watches_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: episodes episodes_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.episodes
    ADD CONSTRAINT episodes_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE CASCADE;


--
-- Name: episodes episodes_series_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.episodes
    ADD CONSTRAINT episodes_series_id_fkey FOREIGN KEY (series_id) REFERENCES public.series(id) ON DELETE CASCADE;


--
-- Name: media_collection media_collection_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_collection
    ADD CONSTRAINT media_collection_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: media_watches media_watches_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_watches
    ADD CONSTRAINT media_watches_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;


--
-- Name: media_watches media_watches_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_watches
    ADD CONSTRAINT media_watches_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: medias_collections medias_collections_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medias_collections
    ADD CONSTRAINT medias_collections_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;


--
-- Name: movie_comments movie_comments_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movie_comments
    ADD CONSTRAINT movie_comments_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: movie_comments movie_comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movie_comments
    ADD CONSTRAINT movie_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.movie_comments(id) ON DELETE CASCADE;


--
-- Name: movie_comments movie_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movie_comments
    ADD CONSTRAINT movie_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: movie_genres movie_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE CASCADE;


--
-- Name: movie_genres movie_genres_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reel_deck reel_deck_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reel_deck
    ADD CONSTRAINT reel_deck_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: season_comments season_comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.season_comments
    ADD CONSTRAINT season_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.season_comments(id) ON DELETE CASCADE;


--
-- Name: season_comments season_comments_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.season_comments
    ADD CONSTRAINT season_comments_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE CASCADE;


--
-- Name: season_comments season_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.season_comments
    ADD CONSTRAINT season_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: seasons seasons_series_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seasons
    ADD CONSTRAINT seasons_series_id_fkey FOREIGN KEY (series_id) REFERENCES public.series(id) ON DELETE CASCADE;


--
-- Name: series_comments series_comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_comments
    ADD CONSTRAINT series_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.series_comments(id) ON DELETE CASCADE;


--
-- Name: series_comments series_comments_series_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_comments
    ADD CONSTRAINT series_comments_series_id_fkey FOREIGN KEY (series_id) REFERENCES public.series(id) ON DELETE CASCADE;


--
-- Name: series_comments series_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_comments
    ADD CONSTRAINT series_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: series_genres series_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_genres
    ADD CONSTRAINT series_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE CASCADE;


--
-- Name: series_genres series_genres_series_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.series_genres
    ADD CONSTRAINT series_genres_series_id_fkey FOREIGN KEY (series_id) REFERENCES public.series(id) ON DELETE CASCADE;


--
-- Name: shared_collection shared_collection_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shared_collection
    ADD CONSTRAINT shared_collection_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shared_collection shared_collection_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shared_collection
    ADD CONSTRAINT shared_collection_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: movie_genres Anyone can read movie genres; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read movie genres" ON public.movie_genres FOR SELECT USING (true);


--
-- Name: series_genres Anyone can read series genres; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read series genres" ON public.series_genres FOR SELECT USING (true);


--
-- Name: collections Anyone can view all collections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view all collections" ON public.collections FOR SELECT USING (true);


--
-- Name: media_collection Anyone can view all media_collection entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view all media_collection entries" ON public.media_collection FOR SELECT USING (true);


--
-- Name: profiles Anyone can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view all profiles" ON public.profiles FOR SELECT USING (true);


--
-- Name: shared_collection Anyone can view all shared_collection entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view all shared_collection entries" ON public.shared_collection FOR SELECT USING (true);


--
-- Name: episode_comments Anyone can view episode comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view episode comments" ON public.episode_comments FOR SELECT USING (true);


--
-- Name: movie_comments Anyone can view movie comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view movie comments" ON public.movie_comments FOR SELECT USING (true);


--
-- Name: season_comments Anyone can view season comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view season comments" ON public.season_comments FOR SELECT USING (true);


--
-- Name: series_comments Anyone can view series comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view series comments" ON public.series_comments FOR SELECT USING (true);


--
-- Name: collections Authenticated users can create collections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create collections" ON public.collections FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));


--
-- Name: episode_comments Authenticated users can create episode comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create episode comments" ON public.episode_comments FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: media_collection Authenticated users can create media_collection entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create media_collection entries" ON public.media_collection FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));


--
-- Name: movie_comments Authenticated users can create movie comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create movie comments" ON public.movie_comments FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: season_comments Authenticated users can create season comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create season comments" ON public.season_comments FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: series_comments Authenticated users can create series comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create series comments" ON public.series_comments FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: shared_collection Authenticated users can create shared_collection entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create shared_collection entries" ON public.shared_collection FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));


--
-- Name: collections Authenticated users can delete collections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can delete collections" ON public.collections FOR DELETE USING ((auth.role() = 'authenticated'::text));


--
-- Name: episodes Authenticated users can delete episodes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can delete episodes" ON public.episodes FOR DELETE USING ((auth.role() = 'authenticated'::text));


--
-- Name: media_collection Authenticated users can delete media_collection entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can delete media_collection entries" ON public.media_collection FOR DELETE USING ((auth.role() = 'authenticated'::text));


--
-- Name: movies Authenticated users can delete movies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can delete movies" ON public.movies FOR DELETE USING ((auth.role() = 'authenticated'::text));


--
-- Name: seasons Authenticated users can delete seasons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can delete seasons" ON public.seasons FOR DELETE USING ((auth.role() = 'authenticated'::text));


--
-- Name: series Authenticated users can delete series; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can delete series" ON public.series FOR DELETE USING ((auth.role() = 'authenticated'::text));


--
-- Name: shared_collection Authenticated users can delete shared_collection entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can delete shared_collection entries" ON public.shared_collection FOR DELETE USING ((auth.role() = 'authenticated'::text));


--
-- Name: episodes Authenticated users can insert episodes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert episodes" ON public.episodes FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: movies Authenticated users can insert movies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert movies" ON public.movies FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: seasons Authenticated users can insert seasons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert seasons" ON public.seasons FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: series Authenticated users can insert series; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert series" ON public.series FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: movie_genres Authenticated users can manage movie genres; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage movie genres" ON public.movie_genres TO authenticated USING (true) WITH CHECK (true);


--
-- Name: series_genres Authenticated users can manage series genres; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage series genres" ON public.series_genres TO authenticated USING (true) WITH CHECK (true);


--
-- Name: collections Authenticated users can update collections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update collections" ON public.collections FOR UPDATE USING ((auth.role() = 'authenticated'::text));


--
-- Name: episodes Authenticated users can update episodes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update episodes" ON public.episodes FOR UPDATE USING ((auth.role() = 'authenticated'::text));


--
-- Name: media_collection Authenticated users can update media_collection entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update media_collection entries" ON public.media_collection FOR UPDATE USING ((auth.role() = 'authenticated'::text));


--
-- Name: movies Authenticated users can update movies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update movies" ON public.movies FOR UPDATE USING ((auth.role() = 'authenticated'::text));


--
-- Name: seasons Authenticated users can update seasons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update seasons" ON public.seasons FOR UPDATE USING ((auth.role() = 'authenticated'::text));


--
-- Name: series Authenticated users can update series; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update series" ON public.series FOR UPDATE USING ((auth.role() = 'authenticated'::text));


--
-- Name: shared_collection Authenticated users can update shared_collection entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update shared_collection entries" ON public.shared_collection FOR UPDATE USING ((auth.role() = 'authenticated'::text));


--
-- Name: media_watches Collection owners can manage all watches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Collection owners can manage all watches" ON public.media_watches USING ((EXISTS ( SELECT 1
   FROM public.collections c
  WHERE ((c.id = media_watches.collection_id) AND (c.owner = auth.uid())))));


--
-- Name: episodes Episodes are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Episodes are viewable by everyone" ON public.episodes FOR SELECT USING (true);


--
-- Name: genres Genres are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Genres are viewable by everyone" ON public.genres FOR SELECT USING (true);


--
-- Name: movie_genres Movie genres are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Movie genres are viewable by everyone" ON public.movie_genres FOR SELECT USING (true);


--
-- Name: movies Movies are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Movies are viewable by everyone" ON public.movies FOR SELECT USING (true);


--
-- Name: seasons Seasons are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Seasons are viewable by everyone" ON public.seasons FOR SELECT USING (true);


--
-- Name: series Series are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Series are viewable by everyone" ON public.series FOR SELECT USING (true);


--
-- Name: series_genres Series genres are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Series genres are viewable by everyone" ON public.series_genres FOR SELECT USING (true);


--
-- Name: medias_collections Users can add media to collections they have access to; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can add media to collections they have access to" ON public.medias_collections FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM (public.collections c
     LEFT JOIN public.shared_collection sc ON ((c.id = sc.collection_id)))
  WHERE ((c.id = medias_collections.collection_id) AND ((c.owner = auth.uid()) OR (sc.user_id = auth.uid()))))));


--
-- Name: profiles Users can create their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: media_watches Users can create their own watches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own watches" ON public.media_watches FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: episode_watches Users can delete own episode watches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own episode watches" ON public.episode_watches FOR DELETE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: episode_comments Users can delete their own episode comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own episode comments" ON public.episode_comments FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: movie_comments Users can delete their own movie comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own movie comments" ON public.movie_comments FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can delete their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE USING ((auth.uid() = id));


--
-- Name: season_comments Users can delete their own season comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own season comments" ON public.season_comments FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: series_comments Users can delete their own series comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own series comments" ON public.series_comments FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: media_watches Users can delete their own watches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own watches" ON public.media_watches FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: episode_watches Users can insert own episode watches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own episode watches" ON public.episode_watches FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: reel_deck Users can manage their own reel deck; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own reel deck" ON public.reel_deck USING ((auth.uid() = user_id));


--
-- Name: medias_collections Users can remove media from collections they have access to; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can remove media from collections they have access to" ON public.medias_collections FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM (public.collections c
     LEFT JOIN public.shared_collection sc ON ((c.id = sc.collection_id)))
  WHERE ((c.id = medias_collections.collection_id) AND ((c.owner = auth.uid()) OR (sc.user_id = auth.uid()))))));


--
-- Name: medias_collections Users can update media positions in collections they have acces; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update media positions in collections they have acces" ON public.medias_collections FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM (public.collections c
     LEFT JOIN public.shared_collection sc ON ((c.id = sc.collection_id)))
  WHERE ((c.id = medias_collections.collection_id) AND ((c.owner = auth.uid()) OR (sc.user_id = auth.uid()))))));


--
-- Name: episode_watches Users can update own episode watches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own episode watches" ON public.episode_watches FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: episode_comments Users can update their own episode comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own episode comments" ON public.episode_comments FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: movie_comments Users can update their own movie comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own movie comments" ON public.movie_comments FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: season_comments Users can update their own season comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own season comments" ON public.season_comments FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: series_comments Users can update their own series comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own series comments" ON public.series_comments FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: medias_collections Users can view medias in collections they have access to; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view medias in collections they have access to" ON public.medias_collections FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.collections c
     LEFT JOIN public.shared_collection sc ON ((c.id = sc.collection_id)))
  WHERE ((c.id = medias_collections.collection_id) AND ((c.owner = auth.uid()) OR (sc.user_id = auth.uid()) OR (c.is_public = true))))));


--
-- Name: episode_watches Users can view own episode watches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own episode watches" ON public.episode_watches FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: reel_deck Users can view their own reel deck; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own reel deck" ON public.reel_deck FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: media_watches Users can view their own watches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own watches" ON public.media_watches FOR SELECT USING (((auth.uid() = user_id) OR (EXISTS ( SELECT 1
   FROM public.collections c
  WHERE ((c.id = media_watches.collection_id) AND ((c.owner = auth.uid()) OR (c.is_public = true) OR (EXISTS ( SELECT 1
           FROM public.shared_collection sc
          WHERE ((sc.collection_id = c.id) AND (sc.user_id = auth.uid()))))))))));


--
-- Name: collections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

--
-- Name: episode_comments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.episode_comments ENABLE ROW LEVEL SECURITY;

--
-- Name: episode_watches; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.episode_watches ENABLE ROW LEVEL SECURITY;

--
-- Name: media_collection; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.media_collection ENABLE ROW LEVEL SECURITY;

--
-- Name: media_watches; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.media_watches ENABLE ROW LEVEL SECURITY;

--
-- Name: medias_collections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.medias_collections ENABLE ROW LEVEL SECURITY;

--
-- Name: movie_comments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.movie_comments ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: reel_deck; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.reel_deck ENABLE ROW LEVEL SECURITY;

--
-- Name: season_comments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.season_comments ENABLE ROW LEVEL SECURITY;

--
-- Name: series_comments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.series_comments ENABLE ROW LEVEL SECURITY;

--
-- Name: shared_collection; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.shared_collection ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: objects Avatar images are publicly accessible; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING ((bucket_id = 'avatars'::text));


--
-- Name: objects Users can delete their own avatar; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE USING (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- Name: objects Users can update their own avatar; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- Name: objects Users can upload their own avatar; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'avatars'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


--
-- PostgreSQL database dump complete
--

\unrestrict 2vqvDt4MDRdPD5Zv6Lk2be1dWSwhUctycHP3UzckS6AdXPgmvb2wzx0loi6veGl

