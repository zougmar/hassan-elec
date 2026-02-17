// Centralized JWT config - ensures signing and verification always use the same secret
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
