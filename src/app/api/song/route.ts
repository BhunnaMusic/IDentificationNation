import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const isrc = request.nextUrl.searchParams.get("isrc");
  if (!isrc) {
    return NextResponse.json({ error: "Missing 'isrc' query parameter." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("isrc", isrc)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Song not found." }, { status: 404 });
  }

  return NextResponse.json({ song: data });
}
