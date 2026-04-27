// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PartnerInterestRequest {
  partnerId: string;
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
    const { partnerId, message }: PartnerInterestRequest = body;

    // Validate inputs
    if (!partnerId || !isValidUuid(partnerId)) {
      throw new Error("Invalid partner ID");
    }

    // Can't send interest to yourself
    if (partnerId === user.id) {
      throw new Error("Cannot send interest to yourself");
    }

    // Sanitize message - limit length and trim
    const sanitizedMessage = message ? message.trim().slice(0, 500) : null;

    console.log(`Processing partner interest from user ${user.id} to partner ${partnerId}`);

    // Check if the target user is actually an ecosystem partner
    const { data: partnerRole, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", partnerId)
      .single();

    if (roleError || !partnerRole || partnerRole.role !== "ecosystem_partner") {
      throw new Error("Target user is not an ecosystem partner");
    }

    // Check if interest was already sent
    const { data: existingNotification } = await supabaseClient
      .from("notifications")
      .select("id")
      .eq("user_id", partnerId)
      .eq("actor_id", user.id)
      .eq("type", "contact_request")
      .maybeSingle();

    if (existingNotification) {
      return new Response(
        JSON.stringify({ error: "You have already sent interest to this partner", code: "ALREADY_SENT" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get the interested user's profile
    const { data: interestedProfile } = await supabaseClient
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();

    const interestedUserName = interestedProfile?.full_name || user.email || "Someone";

    // Get the partner's organization name
    const { data: partnerProfile } = await supabaseClient
      .from("ecosystem_partner_profiles")
      .select("organization_name")
      .eq("user_id", partnerId)
      .single();

    const partnerName = partnerProfile?.organization_name || "your organization";

    console.log(`Creating notification for partner ${partnerId}`);

    // Create a notification for the ecosystem partner
    const notificationMessage = sanitizedMessage 
      ? `${interestedUserName} is interested in connecting: "${sanitizedMessage.slice(0, 100)}${sanitizedMessage.length > 100 ? '...' : ''}"`
      : `${interestedUserName} is interested in connecting with ${partnerName}`;

    const { error: notificationError } = await supabaseClient
      .from("notifications")
      .insert({
        user_id: partnerId,
        type: "contact_request",
        actor_id: user.id,
        message: notificationMessage,
      });

    if (notificationError) {
      console.error("Notification error:", notificationError);
      throw new Error("Failed to create notification");
    }

    console.log("Partner interest sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Interest sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-partner-interest function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
