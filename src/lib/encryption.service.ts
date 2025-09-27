// 'use server'
import crypto from 'crypto';
import zlib from 'zlib';
import { promisify } from 'util';

// Promisify zlib methods
const deflate = promisify(zlib.deflate);
const inflate = promisify(zlib.inflate);

export class CryptoService {
    private static secretKey: Buffer;

    static {
        const key = process.env.SECRET_KEY_ENCRYPTION as string;
        if (!key || key.length !== 64) {
            throw new Error("Invalid or missing SECRET_KEY_ENCRYPTION. Ensure it's a 32-byte hex string.");
        }
        this.secretKey = Buffer.from(key, 'hex');
    }

    /**
     * Encrypts and compresses the given data using AES-256-GCM with zlib compression.
     */
    public static async encryptData(data: string): Promise<string> {
        try {
            // Compress the data first
            const compressed = await deflate(data);

            // Generate a 12-byte IV for AES-256-GCM
            const iv = crypto.randomBytes(12);
            const cipher = crypto.createCipheriv('aes-256-gcm', this.secretKey, iv);

            // Encrypt the compressed data
            let encrypted = cipher.update(compressed);
            encrypted = Buffer.concat([encrypted, cipher.final()]);

            // Get the auth tag
            const authTag = cipher.getAuthTag();

            // **FIXED**: Properly encode each component as base64
            const encryptedResult = `${iv.toString('base64')}:${encrypted.toString('base64')}:${authTag.toString('base64')}`;
            // console.log(encryptedResult)

            // Return everything in Base64 for compact representation
            return encryptedResult;
        } catch (error) {
            console.error(`Error: Encrypting data - ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Decrypts and decompresses the given data using AES-256-GCM and zlib.
     */
    public static async decryptData(encryptedData: string): Promise<string> {
        try {
            // Decode the base64 outer layer
            const decodedData = Buffer.from(encryptedData, 'base64').toString();
            // console.log(decodedData)

            // Split the decoded string by ':' to get IV, encrypted data, and authTag
            const parts = encryptedData.split(':');
            if (parts.length !== 3) {
                throw new Error('Invalid encrypted data format - expected 3 parts separated by ":"');
            }

            const [ivBase64, encryptedBase64, authTagBase64] = parts;

            // **FIXED**: Decode each component as base64 (not base64url)
            const iv = Buffer.from(ivBase64, 'base64');
            const encrypted = Buffer.from(encryptedBase64, 'base64');
            const authTag = Buffer.from(authTagBase64, 'base64');

            // Create decipher
            const decipher = crypto.createDecipheriv('aes-256-gcm', this.secretKey, iv);
            decipher.setAuthTag(authTag);

            // Decrypt the data
            let decrypted = decipher.update(encrypted);
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            // Decompress the decrypted data
            const decompressed = await inflate(decrypted);
            return decompressed.toString('utf8');
        } catch (error) {
            console.error(`Error: Decrypting data - ${(error as Error).message}`);
            throw error;
        }
    }
}
