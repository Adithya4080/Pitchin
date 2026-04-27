// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FollowRequest {
  followingId: string;
  message?: string;
}

function isValidUuid(value: string | undefined | null): boolean {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const body = await req.json();
    const { followingId, message }: FollowRequest = body;

    if (!followingId || !isValidUuid(followingId)) {
      throw new Error("Invalid user ID");
    }

    if (followingId === user.id) {
      throw new Error("Cannot follow yourself");
    }

    const sanitizedMessage = message ? message.trim().slice(0, 500) : null;

    console.log(`Processing follow request from ${user.id} to ${followingId}`);

    // Check if follow already exists
    const { data: existingFollow } = await supabaseClient
      .from("follows")
      .select("id, status")
      .eq("follower_id", user.id)
      .eq("following_id", followingId)
      .maybeSingle();

    if (existingFollow) {
      if (existingFollow.status === 'pending') {
        return new Response(
          JSON.stringify({ error: "You already have a pending follow request", code: "PENDING_EXISTS" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      if (existingFollow.status === 'approved') {
        return new Response(
          JSON.stringify({ error: "You are already following this user", code: "ALREADY_FOLLOWING" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Get follower's profile
    const { data: followerProfile } = await supabaseClient
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();

    const followerName = followerProfile?.full_name || user.email || "Someone";

    console.log(`Creating follow request from ${followerName} to user ${followingId}`);

    // Create or update follow record
    if (existingFollow) {
      // Update rejected follow to pending
      const { error: updateError } = await supabaseClient
        .from("follows")
        .update({
          status: 'pending',
          message: sanitizedMessage,
          created_at: new Date().toISOString(),
          responded_at: null,
        })
        .eq("id", existingFollow.id);

      if (updateError) {
        console.error("Follow update error:", updateError);
        throw new Error("Failed to update follow request");
      }
    } else {
      // Create new follow
      const { error: insertError } = await supabaseClient
        .from("follows")
        .insert({
          follower_id: user.id,
          following_id: followingId,
          message: sanitizedMessage,
          status: 'pending',
        });

      if (insertError) {
        console.error("Follow insert error:", insertError);
        throw new Error("Failed to create follow request");
      }
    }

    // Create notification for target user
    const { error: notificationError } = await supabaseClient
      .from("notifications")
      .insert({
        user_id: followingId,
        type: "follow_request",
        actor_id: user.id,
        message: `${followerName} wants to follow you`,
      });

    if (notificationError) {
      console.error("Notification error:", notificationError);
    }

    console.log("Follow request created successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Follow request sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-follow-request function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
