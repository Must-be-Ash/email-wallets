import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDatabase } from "../../../lib/mongodb";
import { verifyToken } from "../../../lib/verification-token";

// Input validation schema
const notionSchema = z.object({
  name: z.string().max(100),
  email: z.string().email().max(254),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  token: z.string(), // Verification token required
});

export async function POST(request: Request) {
  try {
    // Basic origin check
    const origin = request.headers.get('origin');
    if (!origin?.includes('emailwallets.com') && !origin?.includes('localhost')) {
      return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate input
    const validation = notionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Invalid input", 
        details: validation.error.errors 
      }, { status: 400 });
    }

    const { name, email, walletAddress, token } = validation.data;

    // Verify the token to ensure CDP OTP verification happened
    const tokenPayload = await verifyToken(token);
    if (!tokenPayload || tokenPayload.email !== email || tokenPayload.walletAddress !== walletAddress) {
      return NextResponse.json({ 
        error: "Invalid or expired verification token" 
      }, { status: 401 });
    }

    const notion = new Client({ auth: process.env.NOTION_SECRET });
    
    // Check Notion for existing emails
    const existingNotionEntries = await notion.databases.query({
      database_id: `${process.env.NOTION_DB}`,
      filter: {
        property: "Email",
        email: {
          equals: email,
        },
      },
    });

    if (existingNotionEntries.results.length > 0) {
      return NextResponse.json(
        { error: "Email already exists in waitlist" }, 
        { status: 409 }
      );
    }

    // If email doesn't exist, create new entry
    const response = await notion.pages.create({
      parent: {
        database_id: `${process.env.NOTION_DB}`,
      },
      properties: {
        Email: {
          type: "email",
          email: email,
        },
        Name: {
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: name,
              },
            },
          ],
        },
        "wallet address": {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: walletAddress,
              },
            },
          ],
        },
      },
    });

    if (!response) {
      throw new Error("Failed to add email to Notion");
    }

    // Optionally store in MongoDB for tracking (if credentials are working)
    try {
      const db = await getDatabase();
      await db.collection('waitlist_emails').insertOne({
        email: email,
        name: name,
        walletAddress: walletAddress,
        createdAt: new Date(),
        notionId: response.id
      });
    } catch (mongoError) {
      // MongoDB is optional - continue without it if it fails
      console.warn("MongoDB storage failed (optional):", mongoError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error adding email to waitlist:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to add email to waitlist" 
    }, { status: 500 });
  }
}
