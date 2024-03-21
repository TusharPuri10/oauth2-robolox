import * as crypto from 'crypto';

// base64URL encode the verifier and challenge
function base64URLEncode(str: Buffer): string {
  return str.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
}

// create sha256 hash from code verifier
function sha256(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest(`base64`);
}
// create a random code verifier
const code_verifier = crypto.randomBytes(32);

// generate a challenge from the code verifier
const code_challenge = base64URLEncode(Buffer.from(sha256(code_verifier)));