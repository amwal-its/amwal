import crypto from 'crypto';

const SECRET = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'amwal_default_secret_key_for_aes_256_encryption';

// Ensure 32-byte key using SHA-256
const KEY = crypto.createHash('sha256').update(SECRET).digest();

/**
 * Enkripsi string teks biasa menggunakan algoritma AES-256-CBC.
 * Format output: "ivHex:encryptedHex"
 */
export function encryptAES256(text: string): string {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  } catch (error) {
    console.error('Error encrypting text with AES-256:', error);
    throw new Error('Gagal mengenkripsi data sensitif');
  }
}

/**
 * Dekripsi string AES-256-CBC yang terenkripsi.
 */
export function decryptAES256(encryptedText: string): string {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
  try {
    const [ivHex, encryptedHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedTextBuffer = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedTextBuffer), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Error decrypting text with AES-256:', error);
    return encryptedText; // Fallback jika format bukan terenkripsi
  }
}
