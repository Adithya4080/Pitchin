// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InterestRequest {
  pitchId: string;
  message?: string;
}

// UUID validation function
function isValidUuid(value: string | undefined | null): boolean {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the user from the authorization header
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
    const { pitchId, message }: InterestRequest = body;

    // Validate inputs
    if (!pitchId || !isValidUuid(pitchId)) {
      throw new Error("Invalid pitch ID");
    }

    // Sanitize message - limit length and trim
    const sanitizedMessage = message ? message.trim().slice(0, 500) : null;

    console.log(`Processing interest for pitch ${pitchId} from user ${user.id}`);

    // Get the pitch details
    const { data: pitch, error: pitchError } = await supabaseClient
      .from("pitches")
      .select("id, pitch_statement, user_id")
      .eq("id", pitchId)
      .single();

    if (pitchError || !pitch) {
      console.error("Pitch fetch error:", pitchError);
      throw new Error("Pitch not found");
    }

    // Check if user is trying to send interest to their own pitch
    if (pitch.user_id === user.id) {
      throw new Error("Cannot send interest to your own pitch");
    }

    // Check if a pending request already exists
    const { data: existingRequest } = await supabaseClient
      .from("contact_requests")
      .select("id, status")
      .eq("pitch_id", pitchId)
      .eq("requester_id", user.id)
      .maybeSingle();

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return new Response(
          JSON.stringify({ error: "You already have a pending request for this pitch", code: "PENDING_EXISTS" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      if (existingRequest.status === 'approved') {
        return new Response(
          JSON.stringify({ error: "Your request has already been approved", code: "ALREADY_APPROVED" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Get the interested user's profile
    const { data: interestedProfile } = await supabaseClient
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();

    const interestedUserName = interestedProfile?.full_name || user.email || "Someone";

    console.log(`Creating contact request from ${interestedUserName} for pitch owner ${pitch.user_id}`);

    // Create a contact request with sanitized message
    const { error: requestError } = await supabaseClient
      .from("contact_requests")
      .insert({
        pitch_id: pitchId,
        requester_id: user.id,
        message: sanitizedMessage,
        status: 'pending',
      });

    if (requestError) {
      console.error("Contact request error:", requestError);
      throw new Error("Failed to create contact request");
    }

    // Create a notification for the pitch owner
    const { error: notificationError } = await supabaseClient
      .from("notifications")
      .insert({
        user_id: pitch.user_id,
        type: "contact_request",
        pitch_id: pitchId,
        actor_id: user.id,
        message: `${interestedUserName} is interested in your pitch`,
      });

    if (notificationError) {
      console.error("Notification error:", notificationError);
      // Don't fail the whole request if notification fails
    }

    console.log("Contact request created successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Interest request sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-interest function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
