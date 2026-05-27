// ---------------------------------------------------------------------------
// src/lib/crypto.ts — Client-side AES-256-GCM encryption using Web Crypto API
// ---------------------------------------------------------------------------

const PBKDF2_ITERATIONS = 100_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const KEY_LENGTH = 256;

// ---------------------------------------------------------------------------
// Buffer helpers (handle TypeScript strict ArrayBuffer vs SharedArrayBuffer)
// ---------------------------------------------------------------------------

function toBuffer(data: Uint8Array): ArrayBuffer {
  return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
}

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return toBuffer(bytes);
}

// ---------------------------------------------------------------------------
// Key Derivation
// ---------------------------------------------------------------------------

/** Derive a CryptoKey from a password and salt using PBKDF2. */
export async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(password);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    toBuffer(encoded),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: toBuffer(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['wrapKey', 'unwrapKey']
  );
}

/** Generate a random AES-256-GCM data key (extractable, used to encrypt data). */
export async function generateDataKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

/** Generate a cryptographically random salt. */
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_BYTES));
}

// ---------------------------------------------------------------------------
// Key Wrapping (for storing encrypted data key in Firestore)
// ---------------------------------------------------------------------------

/**
 * Wrap (encrypt) the data key with a password-derived wrapping key.
 * Returns { wrappedKey, iv } as Base64 strings.
 */
export async function wrapDataKey(
  dataKey: CryptoKey,
  wrappingKey: CryptoKey
): Promise<{ wrappedKey: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const wrapped = await crypto.subtle.wrapKey('raw', dataKey, wrappingKey, {
    name: 'AES-GCM',
    iv: toBuffer(iv),
  });
  return {
    wrappedKey: bufferToBase64(wrapped),
    iv: bufferToBase64(iv),
  };
}

/**
 * Unwrap (decrypt) the data key using a password-derived wrapping key.
 * Returns the CryptoKey that can encrypt/decrypt data.
 */
export async function unwrapDataKey(
  wrappedKeyB64: string,
  ivB64: string,
  wrappingKey: CryptoKey
): Promise<CryptoKey> {
  const wrappedKey = base64ToArrayBuffer(wrappedKeyB64);
  const iv = base64ToArrayBuffer(ivB64);
  return crypto.subtle.unwrapKey(
    'raw',
    wrappedKey,
    wrappingKey,
    { name: 'AES-GCM', iv },
    { name: 'AES-GCM', length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

// ---------------------------------------------------------------------------
// Encrypt / Decrypt (raw values)
// ---------------------------------------------------------------------------

/** Encrypt a plaintext string. Returns Base64( IV + ciphertext ). */
export async function encrypt(
  plaintext: string,
  key: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: toBuffer(iv) },
    key,
    toBuffer(encoder.encode(plaintext))
  );
  // Prepend IV to ciphertext
  const ctBytes = new Uint8Array(ciphertext);
  const combined = new Uint8Array(IV_BYTES + ctBytes.byteLength);
  combined.set(iv, 0);
  combined.set(ctBytes, IV_BYTES);
  return bufferToBase64(combined);
}

/** Decrypt a Base64( IV + ciphertext ) string. Returns plaintext. */
export async function decrypt(
  ciphertextB64: string,
  key: CryptoKey
): Promise<string> {
  const combined = base64ToArrayBuffer(ciphertextB64);
  const iv = combined.slice(0, IV_BYTES);
  const ciphertext = combined.slice(IV_BYTES);
  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(plainBuffer);
}

// ---------------------------------------------------------------------------
// Field-level encryption for Firestore documents
// ---------------------------------------------------------------------------

/**
 * Encrypt specified fields of an object. Returns a new object with those
 * fields replaced by ciphertext and an `_encrypted: true` marker.
 */
export async function encryptFields<T extends Record<string, unknown>>(
  obj: T,
  key: CryptoKey,
  fields: string[]
): Promise<T & { _encrypted: boolean }> {
  const result = { ...obj } as Record<string, unknown>;
  for (const field of fields) {
    if (field in result && result[field] !== undefined && result[field] !== null) {
      const value = typeof result[field] === 'string'
        ? result[field] as string
        : JSON.stringify(result[field]);
      result[field] = await encrypt(value, key);
    }
  }
  result._encrypted = true;
  return result as T & { _encrypted: boolean };
}

/**
 * Decrypt specified fields of an object. If `_encrypted` is not set, returns
 * the object unchanged (backward-compatible with legacy unencrypted data).
 */
export async function decryptFields<T extends Record<string, unknown>>(
  obj: T,
  key: CryptoKey | null,
  fields: string[],
  typeHints?: Record<string, 'number' | 'string'>
): Promise<T> {
  // Legacy unencrypted document — return as-is
  if (!(obj as Record<string, unknown>)._encrypted) {
    return obj;
  }
  // Encrypted but no key — can't decrypt
  if (!key) {
    throw new Error('Encryption key required to read encrypted data');
  }

  const result = { ...obj } as Record<string, unknown>;
  for (const field of fields) {
    if (field in result && typeof result[field] === 'string') {
      try {
        const decrypted = await decrypt(result[field] as string, key);
        // Restore original type
        const hint = typeHints?.[field];
        if (hint === 'number') {
          result[field] = Number(decrypted);
        } else {
          // Try JSON parse for complex types, fall back to string
          try {
            result[field] = JSON.parse(decrypted);
          } catch {
            result[field] = decrypted;
          }
        }
      } catch (err) {
        console.error(`Failed to decrypt field "${field}":`, err);
        throw new Error('Decryption failed — wrong encryption password?');
      }
    }
  }
  // Remove the marker from the returned object
  delete result._encrypted;
  return result as T;
}
