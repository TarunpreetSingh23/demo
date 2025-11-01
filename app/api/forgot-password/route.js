import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/usermodel";
import { connects } from "@/dbconfig/dbconfig";
import nodemailer from "nodemailer";

export async function POST(req) {
  await connects();

  const { email } = await req.json();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "No account found with that email." }, { status: 404 });
  }

  // Generate a unique token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // valid for 15 minutes

  user.resetToken = resetToken;
  user.resetTokenExpiry = resetTokenExpiry;
  await user.save();

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  // Send email with Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use another provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Swiftly Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <p>You requested a password reset.</p>
      <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
      <p>This link is valid for 15 minutes.</p>
    `,
  });

  return NextResponse.json({ message: "Reset link sent to your email." });
}
