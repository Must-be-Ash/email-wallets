import { render } from "@react-email/render";

import WelcomeTemplate from "../../../emails";

import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { MongoRateLimit } from "../../../lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

// 2 requests per minute from the same IP address
const ratelimit = new MongoRateLimit(60000, 2);

export async function POST(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";

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

  const { email, firstname } = await request.json();

  const { data, error } = await resend.emails.send({
    from: "Email Wallets <hi@keyhub.live>",
    to: [email],
    subject: "Welcome! Your wallet has been created 🎉",
    reply_to: "hi@keyhub.live",
    html:  await render(WelcomeTemplate({ userFirstname: firstname })),
  });

  // const { data, error } = { data: true, error: null }

  if (error) {
    return NextResponse.json(error);
  }

  if (!data) {
    return NextResponse.json({ message: "Failed to send email" });
  }

  return NextResponse.json({ message: "Email sent successfully" });
}
