import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date().toISOString();

    const { data: expiredSessions, error: selectError } = await supabase
      .from("chat_sessions")
      .select("id")
      .lt("expires_at", now);

    if (selectError) {
      console.error("Error selecting expired sessions:", selectError);
      throw selectError;
    }

    let deletedCount = 0;
    if (expiredSessions && expiredSessions.length > 0) {
      const { error: deleteError } = await supabase
        .from("chat_sessions")
        .delete()
        .lt("expires_at", now);

      if (deleteError) {
        console.error("Error deleting expired sessions:", deleteError);
        throw deleteError;
      }

      deletedCount = expiredSessions.length;
    }

    const result = {
      success: true,
      deletedCount,
      timestamp: now,
      message: `Successfully deleted ${deletedCount} expired session(s)`,
    };

    console.log("Cleanup completed:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Cleanup function error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
