import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, honeypot } = body;

    // Spam honeypot trap
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Sent" });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    const savedMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject ? subject.trim() : "General Inquiry",
        message: message.trim(),
        ipAddress: ip.split(",")[0].trim(),
      },
    });

    return NextResponse.json({
      success: true,
      messageId: savedMessage.id,
      message: "Message received successfully",
    });
  } catch (error: any) {
    console.error("Contact Form API Error:", error);
    return NextResponse.json(
      { error: "An error occurred while saving your message. Please try again." },
      { status: 500 }
    );
  }
}
