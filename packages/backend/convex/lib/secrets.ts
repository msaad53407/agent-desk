"use node";

import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.SECRETS_ENCRYPTION_KEY;
  if (!key) {
    throw new Error("SECRETS_ENCRYPTION_KEY environment variable is not set");
  }
  return Buffer.from(key, "hex");
}

export interface EncryptedPayload {
  encryptedValue: string;
  iv: string;
  tag: string;
}

export function encrypt(
  plaintext: Record<string, unknown>,
): EncryptedPayload {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(JSON.stringify(plaintext), "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  return {
    encryptedValue: encrypted,
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
}

export function decrypt<T = Record<string, unknown>>(
  payload: EncryptedPayload,
): T | null {
  try {
    const key = getEncryptionKey();
    const decipher = createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(payload.iv, "hex"),
    );
    decipher.setAuthTag(Buffer.from(payload.tag, "hex"));

    let decrypted = decipher.update(payload.encryptedValue, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted) as T;
  } catch {
    return null;
  }
}
