import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.VERIFICATION_TOKEN_SECRET || 'your-secret-key-change-in-production'
);

export async function generateVerificationToken(email: string, walletAddress: string) {
  const token = await new SignJWT({ 
    email, 
    walletAddress,
    verified: true 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10m') // Token expires in 10 minutes
    .sign(secret);
  
  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { email: string; walletAddress: string; verified: boolean };
  } catch (error) {
    return null;
  }
}