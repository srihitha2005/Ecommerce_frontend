/**
 * Token Debugger Utility
 * Helps diagnose JWT token issues with backend rejection (403 Forbidden)
 */

interface TokenPayload {
  sub?: string;
  iat?: number;
  exp?: number;
  role?: string;
  userId?: string;
  email?: string;
  [key: string]: any;
}

export const tokenDebugger = {
  /**
   * Decode JWT token WITHOUT verification (frontend only)
   * WARNING: This does NOT verify the signature!
   */
  decodeToken: (token: string): TokenPayload | null => {
    try {
      // JWT format: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('❌ Invalid token format. Expected 3 parts (header.payload.signature)');
        return null;
      }

      // Decode base64url payload
      const payload = parts[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('❌ Failed to decode token:', error);
      return null;
    }
  },

  /**
   * Get all token info and display in console
   */
  inspectToken: (): void => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    console.group('🔍 [Token Inspector] Complete Token Analysis');

    if (!token) {
      console.error('❌ No token found in localStorage');
      console.groupEnd();
      return;
    }

    console.log('📋 Token (first 50 chars):', token.substring(0, 50) + '...');
    console.log('📏 Token length:', token.length);

    // Decode and display payload
    const payload = tokenDebugger.decodeToken(token);
    if (payload) {
      console.log('📦 Token Payload:', payload);
      console.log('🔑 Token Fields:', Object.keys(payload));

      // Check critical fields
      console.group('✅ Required Fields Check');
      console.log('✓ sub (subject):', payload.sub || '❌ MISSING');
      console.log('✓ role:', payload.role || '❌ MISSING');
      console.log('✓ userId:', payload.userId || '❌ MISSING');
      console.log('✓ email:', payload.email || '❌ MISSING');
      console.groupEnd();

      // Check expiration
      if (payload.exp) {
        const expiresAt = new Date(payload.exp * 1000);
        const now = new Date();
        const isExpired = expiresAt < now;
        console.log(`⏰ Expires: ${expiresAt.toISOString()} ${isExpired ? '❌ EXPIRED' : '✅ VALID'}`);
      }
    }

    // Display user info
    if (user) {
      console.log('👤 Stored User:', JSON.parse(user));
    }

    console.groupEnd();
  },

  /**
   * Check if token is likely to cause 403 errors
   */
  validateTokenForOrderService: (): { valid: boolean; issues: string[] } => {
    const token = localStorage.getItem('token');
    const issues: string[] = [];

    if (!token) {
      issues.push('No token found');
      return { valid: false, issues };
    }

    const payload = tokenDebugger.decodeToken(token);
    if (!payload) {
      issues.push('Token cannot be decoded (invalid JWT format)');
      return { valid: false, issues };
    }

    // Check for required fields
    if (!payload.role) {
      issues.push('Missing "role" field (order service may require this)');
    }

    if (payload.role && payload.role !== 'CUSTOMER') {
      issues.push(`Role is "${payload.role}", expected "CUSTOMER"`);
    }

    if (!payload.userId && !payload.sub) {
      issues.push('Missing user identifier (userId or sub)');
    }

    // Check expiration
    if (payload.exp) {
      const expiresAt = new Date(payload.exp * 1000);
      if (expiresAt < new Date()) {
        issues.push('Token is expired');
      }
    }

    return { valid: issues.length === 0, issues };
  },

  /**
   * Display diagnostic report
   */
  diagnose: (): void => {
    console.group('🩺 [Token Diagnostic Report]');

    const { valid, issues } = tokenDebugger.validateTokenForOrderService();

    if (valid) {
      console.log('✅ Token looks valid. If you\'re still getting 403, the issue is likely:');
      console.log('   1. Backend auth secrets don\'t match between services');
      console.log('   2. Order service endpoint is misconfigured');
      console.log('   3. Order service uses different token validation logic');
    } else {
      console.error('❌ Token has issues:');
      issues.forEach((issue) => console.error(`   • ${issue}`));
    }

    console.log('\n📝 Next Steps:');
    console.log('   1. Run: tokenDebugger.inspectToken() to see full token contents');
    console.log('   2. Share the payload with backend team');
    console.log('   3. Ask backend if JWT secrets match between auth-service and order-service');

    console.groupEnd();
  },

  /**
   * Copy token to clipboard for sharing (debugging)
   */
  copyTokenToClipboard: (): void => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    navigator.clipboard.writeText(token);
    console.log('✅ Token copied to clipboard (first 50 chars: ' + token.substring(0, 50) + '...)');
  },

  /**
   * Get simplified token info for bug reports
   */
  getTokenInfo: (): {
    tokenExists: boolean;
    tokenLength: number;
    role: string | undefined;
    userId: string | undefined;
    expiresAt: string | undefined;
  } => {
    const token = localStorage.getItem('token');
    if (!token) {
      return { tokenExists: false, tokenLength: 0, role: undefined, userId: undefined, expiresAt: undefined };
    }

    const payload = tokenDebugger.decodeToken(token);
    return {
      tokenExists: true,
      tokenLength: token.length,
      role: payload?.role,
      userId: payload?.userId || payload?.sub,
      expiresAt: payload?.exp ? new Date(payload.exp * 1000).toISOString() : undefined,
    };
  },
};

// Export for use in browser console
(window as any).tokenDebugger = tokenDebugger;
