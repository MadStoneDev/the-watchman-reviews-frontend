# Reel Deck & Collections Optimization Plan

**Current Performance:**
- Reel Deck Dashboard: 4,056ms (2,426ms server time)
- Reel Deck Next Up: 3,903ms (2,299ms server time)
- Reel Deck Upcoming: 4,062ms (2,448ms server time)
- Collections Page: 3,658ms (1,956ms server time)

**Target Performance:**
- Reel Deck: < 2,000ms (< 1,000ms server time)
- Collections: < 2,000ms (< 800ms server time)

---

## 🔴 CRITICAL ISSUES

### 1. Reel Deck: Sequential Episode Queries (Lines 275-284)

**Current Problem:**
```typescript
const [episodesResult, watchesResult] = await Promise.all([
  supabase
    .from("episodes")
    .select("id, series_id, air_date")
    .in("series_id", seriesIds),
  supabase
    .from("episode_watches")
    .select("episode_id, series_id")
    .eq("user_id", userId)
    .in("series_id", seriesIds),
]);
```

**Issues:**
- Fetches ALL episodes for ALL series (could be 1000+ rows)
- Fetches ALL watches for ALL series
- Heavy processing in Node.js (lines 297-338)

**Solution 1: Create a Database View** ⭐ BEST
```sql
CREATE VIEW user_series_stats AS
SELECT
  rd.user_id,
  rd.media_id as series_id,
  COUNT(e.id) as total_episodes,
  COUNT(CASE WHEN e.air_date <= CURRENT_DATE THEN 1 END) as aired_episodes,
  COUNT(ew.episode_id) as watched_episodes,
  COUNT(CASE WHEN e.air_date <= CURRENT_DATE AND ew.episode_id IS NOT NULL THEN 1 END) as watched_aired,
  MAX(CASE WHEN e.air_date <= CURRENT_DATE THEN e.air_date END) as latest_aired_date,
  MIN(CASE WHEN e.air_date > CURRENT_DATE THEN e.air_date END) as next_upcoming_date,
  COUNT(CASE WHEN e.air_date > CURRENT_DATE THEN 1 END) > 0 as has_upcoming
FROM reel_deck rd
JOIN episodes e ON e.series_id = rd.media_id
LEFT JOIN episode_watches ew ON ew.episode_id = e.id AND ew.user_id = rd.user_id
WHERE rd.media_type = 'tv'
GROUP BY rd.user_id, rd.media_id;
```

**Then query it simply:**
```typescript
const { data: seriesStats } = await supabase
  .from("user_series_stats")
  .select("*")
  .eq("user_id", currentUserId)
  .in("series_id", seriesIds);

const statsMap = new Map(seriesStats.map(s => [s.series_id, s]));
```

**Expected Improvement:** 2,400ms → 800ms (67% faster!)

---

**Solution 2: Use a Supabase Function** (if views aren't available)
```sql
CREATE FUNCTION get_series_stats(user_id_param UUID, series_ids UUID[])
RETURNS TABLE (
  series_id UUID,
  total_episodes INT,
  aired_episodes INT,
  watched_episodes INT,
  watched_aired INT,
  latest_aired_date DATE,
  next_upcoming_date DATE,
  has_upcoming BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.series_id,
    COUNT(e.id)::INT,
    COUNT(CASE WHEN e.air_date <= CURRENT_DATE THEN 1 END)::INT,
    COUNT(ew.episode_id)::INT,
    COUNT(CASE WHEN e.air_date <= CURRENT_DATE AND ew.episode_id IS NOT NULL THEN 1 END)::INT,
    MAX(CASE WHEN e.air_date <= CURRENT_DATE THEN e.air_date END),
    MIN(CASE WHEN e.air_date > CURRENT_DATE THEN e.air_date END),
    COUNT(CASE WHEN e.air_date > CURRENT_DATE THEN 1 END) > 0
  FROM episodes e
  LEFT JOIN episode_watches ew ON ew.episode_id = e.id AND ew.user_id = user_id_param
  WHERE e.series_id = ANY(series_ids)
  GROUP BY e.series_id;
END;
$$ LANGUAGE plpgsql;
```

---

### 2. Reel Deck: Heavy Client-Side Processing (Lines 297-338)

**Current Problem:**
- Loops through ALL episodes multiple times
- Multiple `.filter()` operations on large arrays
- Multiple `.reduce()` operations

**Solution:** Move this to the database (see Solution 1 above)

**Expected Improvement:** Eliminate 200-400ms of processing time

---

### 3. Collections: Sequential Queries (Lines 138-157)

**Current Problem:**
```typescript
// First query
const { data: sharedData } = await supabase
  .from("shared_collection")
  .select("collection_id")
  .eq("user_id", currentUserId);

// Second query (depends on first)
const { data: sharedCollections } = await supabase
  .from("collections")
  .select("*")
  .in("id", sharedCollectionIds);
```

**Solution: Use a JOIN**
```typescript
const { data: sharedCollections } = await supabase
  .from("shared_collection")
  .select(`
    collection_id,
    collections (
      id,
      title,
      owner,
      is_public
    )
  `)
  .eq("user_id", currentUserId);
```

**Expected Improvement:** 1,956ms → 1,200ms (39% faster!)

---

### 4. Collections: Fetching ALL Media Items (Line 205)

**Current Problem:**
```typescript
const { data: mediaItems } = await supabase
  .from("medias_collections")
  .select("collection_id, media_id, media_type, position")
  .in("collection_id", collectionIds)
  .order("position", { ascending: true });
```

**Issue:** If collections have 100+ items each, this fetches 1000s of rows!

**Solution: Only Get First Item & Count**
```sql
-- Create a view for collection summaries
CREATE VIEW collection_summaries AS
SELECT
  mc.collection_id,
  COUNT(*) as item_count,
  FIRST_VALUE(mc.media_id) OVER (PARTITION BY mc.collection_id ORDER BY mc.position) as first_media_id,
  FIRST_VALUE(mc.media_type) OVER (PARTITION BY mc.collection_id ORDER BY mc.position) as first_media_type
FROM medias_collections mc
GROUP BY mc.collection_id, mc.media_id, mc.media_type, mc.position;
```

**Then query:**
```typescript
const { data: summaries } = await supabase
  .from("collection_summaries")
  .select("*")
  .in("collection_id", collectionIds);
```

**Expected Improvement:** 1,956ms → 800ms (60% faster!)

---

### 5. Remove Console Logging Overhead

**Current Problem:**
```typescript
console.time("🎬 Total Collections Fetch (Server)");
console.timeEnd("🎬 Total Collections Fetch (Server)");
```

**Issue:** Each console.time/timeEnd adds 1-5ms overhead. With 10+ calls, that's 50ms!

**Solution:**
```typescript
// Create a conditional logger
const isDev = process.env.NODE_ENV === 'development';
const perfLog = isDev ? console : { time: () => {}, timeEnd: () => {}, log: () => {} };

perfLog.time("🎬 Total Collections Fetch");
```

**Expected Improvement:** 50-100ms saved

---

## 🟡 HIGH PRIORITY OPTIMIZATIONS

### 6. Implement ISR (Incremental Static Regeneration)

**Add to both pages:**
```typescript
// At top of page.tsx
export const revalidate = 3600; // 1 hour

// Or more aggressive for Reel Deck
export const revalidate = 300; // 5 minutes
```

**Expected Improvement:**
- First load: 4,000ms (same)
- Subsequent loads: < 500ms (90% faster!)

---

### 7. Add Pagination to Reel Deck

**Current:** Fetches ALL reel deck items
**Solution:**
```typescript
// Add limit to initial query
.limit(50)
.range(0, 49)

// Then implement "Load More" button or infinite scroll
```

**Expected Improvement:** 2,400ms → 1,200ms (50% faster) for users with 100+ items

---

### 8. Lazy Load Images

**Current:** All poster images load immediately
**Solution:**
```typescript
import Image from 'next/image';

<Image
  src={posterPath}
  alt={title}
  loading="lazy"
  priority={false}
/>
```

**Expected Improvement:** Faster perceived performance, reduce initial load

---

### 9. Parallel Profile Queries (Collections Page, Lines 22-44)

**Current:**
```typescript
const { data: urlProfile } = await supabase
  .from("profiles")
  .select()
  .eq("username", username)
  .single();

// Later...
if (user && !isCurrentUser) {
  const { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("id", currentUserId)
    .single();
}
```

**Solution:**
```typescript
const [urlProfileResult, currentProfileResult] = await Promise.all([
  supabase
    .from("profiles")
    .select("id, username") // Only needed fields!
    .eq("username", username)
    .single(),

  user && !isCurrentUser
    ? supabase
        .from("profiles")
        .select("id, username")
        .eq("id", currentUserId)
        .single()
    : Promise.resolve({ data: null })
]);
```

**Expected Improvement:** 200ms saved

---

## 🟢 NICE TO HAVE OPTIMIZATIONS

### 10. Add React Query / SWR for Client-Side Caching

**Install:**
```bash
npm install @tanstack/react-query
```

**Implement:**
```typescript
'use client';

export function ReelDeckWrapper({ initialData }) {
  const { data } = useQuery({
    queryKey: ['reelDeck'],
    queryFn: () => fetchReelDeck(),
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return <ReelDeckGrid items={data} />;
}
```

**Expected Improvement:** Instant navigation for repeat visits

---

### 11. Implement Virtual Scrolling

**For large lists (100+ items):**
```bash
npm install @tanstack/react-virtual
```

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

export function ReelDeckGrid({ items }) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300, // Card height
  });

  // Render only visible items
}
```

**Expected Improvement:** Smooth scrolling even with 1000+ items

---

### 12. Preload Critical Data During Login

**After successful OTP verification:**
```typescript
// In login handler
router.prefetch(`/${username}/reel-deck`);

// Or even better, start fetching
await fetch(`/api/reel-deck/prefetch?userId=${userId}`);
```

**Expected Improvement:** Perceived performance boost - data ready when page loads

---

## 📊 Expected Overall Improvements

### Reel Deck Dashboard
| Optimization | Current | After | Improvement |
|--------------|---------|-------|-------------|
| Database View | 2,400ms | 800ms | 67% |
| Remove Client Processing | 800ms | 600ms | 25% |
| ISR (after first load) | 4,056ms | 400ms | 90% |
| Pagination | 600ms | 400ms | 33% |

**Total: 4,056ms → 1,200ms first load (70% faster)**
**Repeat visits: 400ms (90% faster)**

---

### Collections Page
| Optimization | Current | After | Improvement |
|--------------|---------|-------|-------------|
| JOIN instead of Sequential | 1,956ms | 1,200ms | 39% |
| Collection Summaries View | 1,200ms | 600ms | 50% |
| Parallel Profile Queries | 600ms | 400ms | 33% |
| ISR (after first load) | 3,658ms | 300ms | 92% |

**Total: 3,658ms → 800ms first load (78% faster)**
**Repeat visits: 300ms (92% faster)**

---

## 🚀 Implementation Priority

### Phase 1: Critical (This Week) - 70% improvement
1. ✅ Create `user_series_stats` database view
2. ✅ Update Reel Deck to use view instead of client-side processing
3. ✅ Use JOINs in Collections page
4. ✅ Create `collection_summaries` view

**Estimated Time:** 4-6 hours
**Expected Result:** Reel Deck 4.0s → 1.2s, Collections 3.7s → 1.0s

---

### Phase 2: High Priority (Next Week) - 90% improvement
5. ✅ Implement ISR with 5-minute revalidation
6. ✅ Parallel profile queries
7. ✅ Remove console logging overhead
8. ✅ Add pagination to Reel Deck

**Estimated Time:** 3-4 hours
**Expected Result:** Repeat visits < 500ms

---

### Phase 3: Nice to Have (Future) - 95% improvement
9. ⭐ Add React Query for client-side caching
10. ⭐ Implement virtual scrolling for large lists
11. ⭐ Preload data during login
12. ⭐ Lazy load images

**Estimated Time:** 6-8 hours
**Expected Result:** Near-instant experience for return visitors

---

## 📝 SQL Scripts to Run

### 1. User Series Stats View
```sql
CREATE OR REPLACE VIEW user_series_stats AS
SELECT
  rd.user_id,
  rd.media_id as series_id,
  COUNT(e.id) as total_episodes,
  COUNT(CASE WHEN e.air_date <= CURRENT_DATE THEN 1 END) as aired_episodes,
  COUNT(ew.episode_id) as watched_episodes,
  COUNT(CASE WHEN e.air_date <= CURRENT_DATE AND ew.episode_id IS NOT NULL THEN 1 END) as watched_aired,
  MAX(CASE WHEN e.air_date <= CURRENT_DATE THEN e.air_date END) as latest_aired_date,
  MIN(CASE WHEN e.air_date > CURRENT_DATE THEN e.air_date END) as next_upcoming_date,
  COUNT(CASE WHEN e.air_date > CURRENT_DATE THEN 1 END) > 0 as has_upcoming
FROM reel_deck rd
JOIN episodes e ON e.series_id = rd.media_id
LEFT JOIN episode_watches ew ON ew.episode_id = e.id AND ew.user_id = rd.user_id
WHERE rd.media_type = 'tv'
GROUP BY rd.user_id, rd.media_id;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_user_series_stats
ON user_series_stats(user_id, series_id);
```

### 2. Collection Summaries View
```sql
CREATE OR REPLACE VIEW collection_summaries AS
SELECT DISTINCT ON (mc.collection_id)
  mc.collection_id,
  COUNT(*) OVER (PARTITION BY mc.collection_id) as item_count,
  mc.media_id as first_media_id,
  mc.media_type as first_media_type
FROM medias_collections mc
ORDER BY mc.collection_id, mc.position ASC;

-- Add index
CREATE INDEX IF NOT EXISTS idx_medias_collections_position
ON medias_collections(collection_id, position);
```

---

## ✅ Success Metrics

**Before:**
- Reel Deck Dashboard: 4,056ms
- Collections: 3,658ms
- Average Authenticated Page: 3,765ms

**After Phase 1:**
- Reel Deck Dashboard: ~1,200ms (70% faster)
- Collections: ~1,000ms (73% faster)
- Average Authenticated Page: ~1,500ms (60% faster)

**After Phase 2:**
- Reel Deck Dashboard: ~400ms repeat (90% faster)
- Collections: ~300ms repeat (92% faster)
- Average Authenticated Page: ~500ms repeat (87% faster)

---

**Created:** January 9, 2026
**Next Review:** After Phase 1 implementation
