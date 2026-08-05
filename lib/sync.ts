function str2buf(str: string): BufferSource {
  return new TextEncoder().encode(str);
}

function buf2str(buf: BufferSource): string {
  return new TextDecoder().decode(buf);
}

function buf2b64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...bytes));
}

function b642buf(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptData(data: string, password: string, syncId: string): Promise<string> {
  const key = await deriveKey(password, `dimetrack-salt-${syncId}`);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    str2buf(data)
  );

  const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedBuffer), iv.length);

  return buf2b64(combined.buffer);
}

async function decryptData(encryptedB64: string, password: string, syncId: string): Promise<string> {
  const key = await deriveKey(password, `dimetrack-salt-${syncId}`);
  const combined = b642buf(encryptedB64);
  
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  return buf2str(decryptedBuffer);
}

export async function pushSyncData(syncId: string, password: string, state: Record<string, unknown>) {
  try {
    const jsonString = JSON.stringify(state);
    const encrypted = await encryptData(jsonString, password, syncId);

    const response = await fetch(`/api/sync/${syncId}`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: encrypted
    });

    if (!response.ok) throw new Error("Failed to upload data");
    return true;
  } catch (error) {
    console.error("Sync Push Error:", error);
    throw error;
  }
}

export async function pullSyncData(syncId: string, password: string): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(`/api/sync/${syncId}`);
    
    if (response.status === 404) {
      throw new Error("Sync ID not found. Make sure you've set up sync on another device first.");
    }
    if (!response.ok) throw new Error("Failed to fetch data");

    const encryptedB64 = await response.text();
    const decryptedJson = await decryptData(encryptedB64, password, syncId);
    
    return JSON.parse(decryptedJson);
  } catch (error) {
    console.error("Sync Pull Error:", error);
    throw error;
  }
}