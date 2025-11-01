import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/usermodel";
import { connects } from "@/dbconfig/dbconfig";

export async function POST(req) {
  await connects();
  const { token, newPassword } = await req.json();

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }, // token still valid
  });

  if (!user) {
    return NextResponse.json({ message: "Invalid or expired token." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  return NextResponse.json({ message: "Password updated successfully." });
}
