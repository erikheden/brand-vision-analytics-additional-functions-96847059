
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, actionLink } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let subject = "";
    let html = "";

    if (type === "reset") {
      subject = "Reset your password";
      html = `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${actionLink}">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email.</p>
      `;
    } else if (type === "magiclink") {
      subject = "Your magic link to sign in";
      html = `
        <h1>Sign In to Your Account</h1>
        <p>Click the link below to sign in:</p>
        <a href="${actionLink}">Sign In</a>
        <p>If you did not request to sign in, please ignore this email.</p>
      `;
    } else if (type === "confirmation") {
      subject = "Confirm your email address";
      html = `
        <h1>Verify Your Email Address</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${actionLink}">Verify Email</a>
        <p>If you did not sign up for an account, please ignore this email.</p>
      `;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid email type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await resend.emails.send({
      from: "SB Insight <noreply@sb-insight.com>",
      to: [email],
      subject,
      html,
    });

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
