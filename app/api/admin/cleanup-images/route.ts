import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { data: tutors, error: dbError } = await supabaseAdmin
      .from("tutors")
      .select("image_src");

    if (dbError) throw dbError;

    const usedFilenames = new Set(
      tutors
        .map((t) => t.image_src)
        .filter((url): url is string => !!url)
        .map((url) => {
          const parts = url.split("/");
          return parts[parts.length - 1];
        })
    );

    const { data: files, error: storageError } = await supabaseAdmin.storage
      .from("tutors")
      .list(undefined, { limit: 1000 });

    if (storageError) throw storageError;

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const filesToDelete = files
      .filter((file) => file.name !== ".emptyFolderPlaceholder")
      .filter((file) => {
         const isUnused = !usedFilenames.has(file.name);
         const fileDate = new Date(file.created_at);
         const isOldEnough = fileDate < oneDayAgo;

         return isUnused && isOldEnough;
      })
      .map((file) => file.name);

    if (filesToDelete.length > 0) {
      const { error: deleteError } = await supabaseAdmin.storage
        .from("tutors")
        .remove(filesToDelete);

      if (deleteError) throw deleteError;
    }

    return NextResponse.json({
      success: true,
      scanned_files: files.length,
      deleted_count: filesToDelete.length,
      deleted_files: filesToDelete,
    });

  } catch (error: any) {
    console.error("Cleanup Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}