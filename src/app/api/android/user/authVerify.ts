import jwt, { JwtPayload } from "jsonwebtoken";

export interface DecodedToken extends JwtPayload {
  userId: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * Verify JWT token sent from Flutter app via Authorization: Bearer <token>
 * Use this in any /api/.../android route that needs auth
 */
export function verifyAndroidToken(authHeader?: string): DecodedToken | null {
  if (!authHeader?.startsWith("Bearer ")) {
    console.log("Missing or invalid Authorization header");
    return null;
  }

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  const SECRET_KEY = process.env.SECRET_KEY;
  if (!SECRET_KEY) {
    console.error("SECRET_KEY is not defined");
    return null;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;

    // Optional: extra safety — reject if no userId
    if (!decoded.userId) {
      console.log("Token missing userId");
      return null;
    }

    return decoded;
  } catch (error: any) {
    console.error("Invalid or expired token:", error.message);
    return null;
  }
}