import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateVerificationToken } from "../../../lib/verification-token";

// Input validation schema
const verifySchema = z.object({
  email: z.string().email().max(254),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
});

export async function POST(request: NextRequest) {
  try {
    // Basic origin check (can be spoofed but adds a layer)
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    if (!origin?.includes('emailwallets.com') && !origin?.includes('localhost')) {
      return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate input
    const validation = verifySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Invalid input", 
        details: validation.error.errors 
      }, { status: 400 });
    }

    const { email, walletAddress } = validation.data;

    // Generate verification token (valid for 10 minutes)
    const token = await generateVerificationToken(email, walletAddress);

    return NextResponse.json({ 
      success: true, 
      token,
      expiresIn: 600 // 10 minutes in seconds
    });

  } catch (error) {
    console.error("Error generating verification token:", error);
    return NextResponse.json({ 
      error: "Failed to generate verification token" 
    }, { status: 500 });
  }
}