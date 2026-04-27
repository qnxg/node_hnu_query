import { createRequest } from "@/core/request.js"

const CAS_BASE = "https://cas.hnu.edu.cn"
const CAS_SERVICE_URL = encodeURIComponent(
  "https://hdjw.hnu.edu.cn/authserver/login?service=https://hdjw.hnu.edu.cn/",
)

// RSA exponent (standard)
const RSA_E = "10001"

function rsaEncrypt(text: string, n: string): string {
  // Minimal RSA encryption using big-int simulation
  // For production, replace with proper RSA encryption (node:crypto or jsencrypt)
  const radix = 16
  let result = ""
  const blockSize = 6 // process 3 bytes at a time
  for (let i = text.length - 1; i >= 0; i -= blockSize) {
    let block = 0n
    for (let j = 0; j < blockSize && i - j >= 0; j++) {
      block = block * 256n + BigInt(text.charCodeAt(i - j))
    }
    const encrypted = block ** BigInt.parseInt(RSA_E, 16) % BigInt.parseInt(n, 16)
    result = encrypted.toString(radix).padStart(128, "0") + result
  }
  return result
}

export function encryptPassword(password: string, n: string): string {
  return rsaEncrypt(password, n)
}

export function buildLoginUrl(casToken: string, execution: string): string {
  const params = new URLSearchParams({
    username: "", // filled by caller
    password: "", // encrypted by caller
    _eventId: "submit",
    execution,
    lt: casToken,
  })
  return `${CAS_BASE}/cas/login?service=${CAS_SERVICE_URL}&${params.toString()}`
}

export async function getCasToken(): Promise<{ lt: string, execution: string }> {
  const html = await createRequest()
    .url(`${CAS_BASE}/cas/login?service=${CAS_SERVICE_URL}`)
    .send<string>()

  const ltMatch = String(html).match(/name="lt" value="([^"]+)"/)
  const executionMatch = String(html).match(/name="execution" value="([^"]+)"/)

  if (!ltMatch || !executionMatch) {
    throw new Error("Failed to parse CAS login page")
  }

  return { lt: ltMatch[1], execution: executionMatch[1] }
}

export async function getPublicKey(): Promise<{ n: string, e: string }> {
  const html = await createRequest()
    .url(`${CAS_BASE}/cas/login?service=${CAS_SERVICE_URL}`)
    .send<string>()

  const keyMatch = String(html).match(
    /id="publicKey"[\s\S]*?value="([^"]+)"/,
  )
  if (!keyMatch) {
    throw new Error("Failed to parse RSA public key")
  }

  const [n] = keyMatch[1].split("$")
  return { n, e: RSA_E }
}
