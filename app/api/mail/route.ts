import { render } from "@react-email/render";
import { z } from "zod";

import WelcomeTemplate from "../../../emails";

import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { MongoRateLimit } from "../../../lib/rate-limit";
import { verifyToken } from "../../../lib/verification-token";

const resend = new Resend(process.env.RESEND_API_KEY);

// Input validation schema
const mailSchema = z.object({
  email: z.string().email().max(254),
  firstname: z.string().max(100),
  token: z.string(), // Verification token required
});

// 2 requests per minute from the same IP address
const ratelimit = new MongoRateLimit(60000, 2);

export async function POST(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";

  // Basic origin check
  const origin = request.headers.get('origin');
  if (!origin?.includes('emailwallets.com') && !origin?.includes('localhost')) {
    return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
  }

  // Try rate limiting, but continue if MongoDB is down
  let rateLimitPassed = true;
  try {
    const result = await ratelimit.limit(ip);
    rateLimitPassed = result.success;
  } catch (error) {
    console.warn("Rate limiting failed (continuing anyway):", error);
    // Continue without rate limiting if MongoDB is down
  }

  if (!rateLimitPassed) {
    return Response.json(
      {
        error: "Too many requests from this IP, please try again later.",
      },
      {
        status: 429,
      },
    );
  }

  try {
    const body = await request.json();
    
    // Validate input
    const validation = mailSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Invalid input", 
        details: validation.error.errors 
      }, { status: 400 });
    }

    const { email, firstname, token } = validation.data;

    // Verify the token to ensure CDP OTP verification happened
    const tokenPayload = await verifyToken(token);
    if (!tokenPayload || tokenPayload.email !== email) {
      return NextResponse.json({ 
        error: "Invalid or expired verification token" 
      }, { status: 401 });
    }

    const { data, error } = await resend.emails.send({
    from: "Email Wallets <hi@keyhub.live>",
    to: [email],
    subject: "Welcome! Your wallet has been created 🎉",
    reply_to: "hi@keyhub.live",
    html:  await render(WelcomeTemplate({ userFirstname: firstname })),
  });

  // const { data, error } = { data: true, error: null }

  if (error) {
    console.error("Email sending error:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ message: "Failed to send email" });
  }

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ 
      message: "Failed to send email" 
    }, { status: 500 });
  }
}
