import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from 'next/headers';

interface JWTPayload {
  id: number;  // ← UBAH dari userId jadi id
  nipd: string;
  role: string;
}

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "SECRET_KEY_MINIMUM_32_CHARACTERS_LONG"
);

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}

// Sign token dengan jose (support Edge Runtime)
export async function signToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
  return token;
}

// Verify token dengan jose (support Edge Runtime)
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    console.log("🔓 Token verified:", payload);
    return payload;
  } catch (err) {
    console.log("❌ Token verification failed:", err instanceof Error ? err.message : String(err));
    return null;
  }
}

// ✅ UNTUK API ROUTES - Terima Request object langsung
export async function getUserFromRequest(request: Request): Promise<number | null> {
  try {
    const cookieHeader = request.headers.get('cookie');
    console.log('🍪 Raw cookie header:', cookieHeader ? 'exists' : 'missing');
    
    if (!cookieHeader) {
      console.log("❌ No cookie header found");
      return null;
    }

    // Parse lebih aman
    const token = cookieHeader
      .split('; ')
      .find(c => c.startsWith('token='))
      ?.split('=')[1];

    console.log('🔍 Extracted token:', token ? token.substring(0, 20) + '...' : 'NOT FOUND');

    if (!token) {
      console.log("❌ No token in cookies");
      return null;
    }

    // ✅ Verify pakai jose
    const { payload } = await jwtVerify(token, SECRET);
    const decoded = payload as JWTPayload;
    console.log("✅ User from token:", decoded.id);  // ← UBAH dari userId jadi id
    return decoded.id;  // ← UBAH dari userId jadi id
  } catch (error) {
    console.error('❌ Error verifying token:', error);
    return null;
  }
}

// ⚠️ DEPRECATED - Jangan pakai ini lagi!
export async function getUserFromToken(): Promise<number | null> {
  console.warn("⚠️ getUserFromToken() is deprecated! Use getUserFromRequest(request) instead!");
  return null;
}