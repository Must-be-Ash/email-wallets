import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { getDatabase } from "../../../lib/mongodb";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const notion = new Client({ auth: process.env.NOTION_SECRET });
    
    // Check Notion for existing emails
    const existingNotionEntries = await notion.databases.query({
      database_id: `${process.env.NOTION_DB}`,
      filter: {
        property: "Email",
        email: {
          equals: body?.email,
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
          email: body?.email,
        },
        Name: {
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: body?.name,
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
                content: body?.walletAddress || "Not available",
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
        email: body?.email,
        name: body?.name,
        walletAddress: body?.walletAddress,
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
