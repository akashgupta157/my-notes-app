import jwt from "jsonwebtoken";
import { JwtPayload } from "@/types";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(
  request: NextRequest
): Promise<JwtPayload | null> {
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) return null;

  return verifyToken(token);
}
