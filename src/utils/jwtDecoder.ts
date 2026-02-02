/**
 * JWT Decoder - Safely decode and inspect JWT tokens
 * Used for debugging authentication issues
 */

export const decodeJWT = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid JWT format - must have 3 parts separated by dots');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('❌ Failed to decode JWT:', error);
    return null;
  }
};

export const inspectToken = (token: string): void => {
  console.group('🔍 JWT TOKEN INSPECTION');
  
  const decoded = decodeJWT(token);
  if (!decoded) {
    console.error('Failed to decode token');
    console.groupEnd();
    return;
  }

  console.log('📦 Token Payload:', decoded);
  
  // Check each required claim
  console.log('');
  console.log('✅ CLAIM VERIFICATION:');
  console.log('  role:', decoded.role, decoded.role === 'MERCHANT' ? '✅ CORRECT' : '❌ WRONG');
  console.log('  userId:', decoded.userId, decoded.userId ? '✅ EXISTS' : '❌ MISSING');
  console.log('  sub (email):', decoded.sub, decoded.sub ? '✅ EXISTS' : '❌ MISSING');
  
  // Check expiration
  if (decoded.exp) {
    const expirationTime = new Date(decoded.exp * 1000);
    const now = new Date();
    const isExpired = now > expirationTime;
    console.log('  exp (expiration):', expirationTime.toISOString(), isExpired ? '❌ EXPIRED' : '✅ VALID');
  }

  // Check issued at
  if (decoded.iat) {
    const issuedTime = new Date(decoded.iat * 1000);
    console.log('  iat (issued at):', issuedTime.toISOString());
  }

  console.groupEnd();
};
