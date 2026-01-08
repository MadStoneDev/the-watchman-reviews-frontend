# Issues Found During Performance Testing

## Issue Summary

### 1. ✅ Movie Detail Page URL Structure (RESOLVED)
**Problem:** The performance test tried to access `/movies/27205` using a TMDB ID, but the page expects a database UUID.

**Root Cause:**
- Movie page code (line 30 in `movies/[movieId]/page.tsx`): `.eq("id", movieId)`
- The page expects a database UUID, not a TMDB ID

**How It's Supposed to Work:**
1. User searches for media → gets TMDB results
2. User clicks to view details → calls `/api/media/ensure` with TMDB ID
3. API returns database UUID
4. Navigate to `/movies/[database_uuid]`

**Status:** ✅ Working as designed, just needed correct testing approach

---

### 2. ⚠️ `/api/media/ensure` Performance Issue
**Problem:** The API is slow, taking 3.6 seconds to complete.

**Evidence from Server Logs:**
```
GET /api/tmdb/movie/27205?language=en-US 200 in 1662ms
POST /api/media/ensure 200 in 3.6s (compile: 490ms, render: 3.1s)
GET /movies/4fd34ca0-ad64-4211-807b-0768ed6c1ad0 200 in 4.6s
```

**Breakdown:**
- TMDB API call: 1.6s
- Media ensure processing: 3.1s (includes TMDB call + database upsert)
- Movie page render: 4.6s

**Total time to view a movie from search:** ~9.2 seconds!

**Possible Causes:**
- Network latency to TMDB API
- Database upsert operations slow
- Multiple sequential operations (not parallelized)
- No caching of recently ensured media

**Potential 500 Errors:**
- Intermittent TMDB API failures
- Database constraint violations
- Network timeouts (though not observed during test)

---

### 3. ⚠️ Movie Detail Page Slow Render
**Problem:** Movie detail page takes 4.6s to render

**Evidence:**
```
GET /movies/4fd34ca0-ad64-4211-807b-0768ed6c1ad0 200 in 4.6s (compile: 28ms, render: 4.6s)
```

**Operations performed:**
1. Fetch movie from database
2. Check if in user's reel deck
3. Sync genres from TMDB (`syncMovieGenres`) ⚠️
4. Get genres from junction table
5. Fetch comments

**Primary Culprit:** The `syncMovieGenres` function likely makes an external TMDB API call during render, adding significant delay.

---

## Performance Impact

### User Flow Timeline: Search → View Movie

1. **Search for "Inception":** 3.1s (TMDB search API)
2. **Click result → Ensure media:** 3.6s (ensure API)
3. **Navigate → Load movie page:** 4.6s (page render)

**Total:** ~11.3 seconds to view a movie from search! 😱

### Target Timeline

1. **Search:** < 2s (with caching)
2. **Ensure media:** < 500ms (with optimizations)
3. **Movie page:** < 2s (with ISR + optimizations)

**Target Total:** < 4.5 seconds (60% improvement)

---

## Recommended Fixes

### Critical - Fix Performance Bottlenecks

#### 1. Optimize `/api/media/ensure` (Priority 1)

**Current Issues:**
- Takes 3.6s total (3.1s processing)
- Makes synchronous TMDB API call
- No caching for recently ensured media

**Solutions:**
```typescript
// Option A: Add short-term caching (Redis or in-memory)
// Cache recently ensured media for 5 minutes
// If user navigates back and forth, instant response

// Option B: Return immediately if media exists
// Don't wait for refresh check - do it async

// Option C: Parallelize operations
// If checking freshness and fetching TMDB, do both in parallel
```

**Recommended Approach:**
1. Check if media exists in DB
2. If exists and fresh (< 30 days): return immediately
3. If exists but stale: return ID, refresh async in background
4. If doesn't exist: fetch and create (current behavior)

**Expected Improvement:** 3.6s → 100-500ms (85-97% faster)

---

#### 2. Optimize Movie Page Genre Sync (Priority 1)

**Current Issue:**
- `syncMovieGenres` appears to be called during SSR
- Likely makes TMDB API call synchronously
- Blocks page render

**File:** `src/utils/genre-utils.ts` (line 58 in movie page)

**Solutions:**
```typescript
// Option A: Do genre sync in /api/media/ensure
// Genres are synced when media is ensured, not during page load

// Option B: Skip sync if genres already exist
// Add quick check before calling TMDB

// Option C: Make it async/background
// Don't block page render
```

**Expected Improvement:** 4.6s → 1-2s (50-78% faster)

---

#### 3. Implement ISR for Movie Pages (Priority 2)

**Current:** Full SSR on every request (4.6s)

**Solution:**
```typescript
// In movies/[movieId]/page.tsx
export const revalidate = 86400; // 24 hours

// First user: 4.6s (generates static page)
// Subsequent users: < 500ms (from cache)
// After 24h: Regenerates in background
```

**Expected Improvement:** 4.6s → < 500ms for cached pages (89% faster)

---

### High Priority - Improve Search Flow

#### 4. Add Client-Side Caching for Search Results

**Current:** Every search query hits TMDB API (3.1s)

**Solution:**
```typescript
// Use React Query or SWR
// Cache search results for 5 minutes
// Instant results for repeat searches
```

**Expected Improvement:** Repeat searches: 3.1s → < 100ms (97% faster)

---

#### 5. Pre-ensure Popular Media

**Current:** Every movie view requires ensure API call

**Solution:**
```typescript
// Background job to pre-ensure trending/popular media
// When user searches for popular movies, they're already in DB
// Ensure API returns instantly
```

**Expected Improvement:** Popular movies: 3.6s → < 100ms (97% faster)

---

## Testing Needs

### Authenticated Flow Testing

The following critical flows need performance testing with authentication:

1. **Reel Deck Dashboard** (Main Feature)
   - Load time with 10, 50, 100+ items
   - Toggle episode watch status
   - Reset season/series progress

2. **Collections Management**
   - Load user collections
   - Drag-and-drop performance with large collections
   - Add/remove media

3. **User Profile Pages**
   - Profile page load
   - Settings page
   - Notifications

**Recommended:** Create authenticated test suite with Playwright + test user credentials

---

## Next Steps

### Immediate Actions

1. **Profile `syncMovieGenres` function**
   - Add performance logging
   - Determine if TMDB API is being called

2. **Optimize `/api/media/ensure`**
   - Add early return for fresh media
   - Consider background refresh pattern

3. **Implement ISR for movie pages**
   - Add revalidate setting
   - Test cache behavior

### Short Term (This Week)

4. **Add search result caching**
5. **Profile and optimize Browse page** (3.7s render)
6. **Test authenticated flows**

### Medium Term (This Month)

7. **Pre-ensure popular media** (background job)
8. **Implement all critical optimizations from audit report**
9. **Set up monitoring for real user metrics**

---

## Summary

The main performance bottlenecks are:

1. **External API Dependency:** TMDB API calls during SSR
2. **No Caching:** Every action hits TMDB/DB
3. **Synchronous Operations:** Sequential instead of parallel

**Good News:** These are all fixable with the solutions outlined above!

**Expected Overall Improvement:** 11.3s → 2-3s for search → view flow (73-82% faster)
