import { Client } from "@notionhq/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_SECRET });
    
    // Query Notion database to check if email already exists
    const response = await notion.databases.query({
      database_id: `${process.env.NOTION_DB}`,
      filter: {
        property: "Email",
        email: {
          equals: email,
        },
      },
    });

    const exists = response.results.length > 0;
    
    return NextResponse.json({ exists, count: response.results.length });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json({ error: "Failed to check email" }, { status: 500 });
  }
}