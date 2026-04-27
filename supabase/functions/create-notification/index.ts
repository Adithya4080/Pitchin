// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  userId: string;
  type: string;
  actorId?: string;
  pitchId?: string;
  message: string;
}

// UUID validation function
function isValidUuid(value: string | undefined | null): boolean {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

// Valid notification types
const VALID_NOTIFICATION_TYPES = ['save', 'reaction', 'contact_request', 'contact_approved', 'follow_request', 'follow_approved'];

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify the caller is authenticated
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
    const { userId, type, actorId, pitchId, message }: NotificationRequest = body;

    // Validate inputs
    if (!userId || !isValidUuid(userId)) {
      throw new Error("Invalid user ID");
    }

    if (!type || !VALID_NOTIFICATION_TYPES.includes(type)) {
      throw new Error("Invalid notification type");
    }

    if (actorId && !isValidUuid(actorId)) {
      throw new Error("Invalid actor ID");
    }

    if (pitchId && !isValidUuid(pitchId)) {
      throw new Error("Invalid pitch ID");
    }

    // Sanitize message - limit length
    const sanitizedMessage = message ? message.trim().slice(0, 500) : '';
    if (!sanitizedMessage) {
      throw new Error("Message is required");
    }

    console.log(`Creating notification for user ${userId}: ${sanitizedMessage}`);

    const { error } = await supabaseClient
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        actor_id: actorId || user.id,
        pitch_id: pitchId || null,
        message: sanitizedMessage,
      });

    if (error) {
      console.error("Notification creation error:", error);
      throw new Error("Failed to create notification");
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in create-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
