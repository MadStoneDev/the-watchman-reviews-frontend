// /api/reel-deck/remove/route.ts
import {createClient} from "@/src/utils/supabase/server";

export async function POST(req: Request) {
    const { collectionId, mediaId, mediaType, userId } = await req.json();
    
    const supabase = await createClient()

    // Delete from medias_collections table
    const { error } = await supabase
        .from('medias_collections')
        .delete()
        .eq('collection_id', collectionId)
        .eq('media_id', mediaId)
        .eq('media_type', mediaType);

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
}