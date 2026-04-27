import type { Response } from "undici"
import { fetch } from "undici"
import { AccountIssueError, HnuError } from "@/core/error.js"
import { encryptPassword, getCasToken, getPublicKey } from "./utils.js"

const CAS_BASE = "https://cas.hnu.edu.cn"
const CAS_SERVICE_URL = encodeURIComponent(
  "https://hdjw.hnu.edu.cn/authserver/login?service=https://hdjw.hnu.edu.cn/",
)

function extractCookies(response: Response, existing = ""): string {
  const setCookie = response.headers.getSetCookie?.() ?? []
  const newParts = setCookie.map(c => c.split(";")[0]).filter(Boolean)
  const existingParts = existing.split("; ").filter(
    p => !newParts.some(n => n.startsWith(`${p.split("=")[0]}=`)),
  )
  return [...existingParts, ...newParts].filter(Boolean).join("; ")
}

export interface CasToken {
  cookie: string
  stuId: string
  password: string
}

export interface CreateCasTokenOptions {
  stuId: string
  password: string
}

export async function createCasToken(
  options: CreateCasTokenOptions,
): Promise<CasToken> {
  const { stuId, password } = options

  // Step 1: Get CAS page + public key
  const { lt, execution } = await getCasToken()
  const { n } = await getPublicKey()

  // Step 2: Encrypt password and POST
  const encryptedPassword = encryptPassword(password, n)

  const loginUrl = `${CAS_BASE}/cas/login?service=${CAS_SERVICE_URL}`

  const response = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Referer": loginUrl,
    },
    body: new URLSearchParams({
      username: stuId,
      password: encryptedPassword,
      lt,
      execution,
      _eventId: "submit",
    }).toString(),
    redirect: "manual",
  })

  let cookie = extractCookies(response)

  if (response.status === 303 || response.status === 302) {
    const location = response.headers.get("location") ?? ""
    if (location.includes("error")) {
      throw new AccountIssueError(
        "PASSWORD_ERROR",
        "CAS login failed: invalid credentials",
      )
    }

    // Step 3: Follow redirect to get final cookie
    if (location && location !== loginUrl) {
      const r1 = await fetch(location, {
        headers: { Cookie: cookie },
        redirect: "manual",
      })
      cookie = extractCookies(r1, cookie)
      const redirect2 = r1.headers.get("location")
      if (redirect2) {
        const r2 = await fetch(redirect2, {
          headers: { Cookie: cookie },
          redirect: "manual",
        })
        cookie = extractCookies(r2, cookie)
      }
    }
  }

  if (!cookie) {
    throw new HnuError("CAS login failed: no cookie received")
  }

  return { cookie, stuId, password }
}

export interface CreateCasTokenFromCookieOptions {
  cookie: string
  stuId: string
  password: string
}

export async function createCasTokenFromCookie(
  options: CreateCasTokenFromCookieOptions,
): Promise<CasToken> {
  const response = await fetch(
    "https://hdjw.hnu.edu.cn/authserver/checkNeedAuth.do",
    {
      headers: { Cookie: options.cookie },
      redirect: "manual",
    },
  )

  const text = await response.text()
  if (text.includes("authFailed") || response.status >= 400) {
    return createCasToken({
      stuId: options.stuId,
      password: options.password,
    })
  }

  return {
    cookie: options.cookie,
    stuId: options.stuId,
    password: options.password,
  }
}

export function casTokenToString(token: CasToken): string {
  return token.cookie
}
