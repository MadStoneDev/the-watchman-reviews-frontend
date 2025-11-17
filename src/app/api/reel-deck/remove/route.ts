// /api/reel-deck/remove/route.ts
import { createClient } from "@/src/utils/supabase/server";

export async function POST(req: Request) {
  const { mediaId, mediaType, userId } = await req.json();

  const supabase = await createClient();

  // Delete from reel_deck table
  const { error } = await supabase
    .from("reel_deck")
    .delete()
    .eq("user_id", userId)
    .eq("media_id", mediaId)
    .eq("media_type", mediaType);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
