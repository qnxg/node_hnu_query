import type { CasToken } from "@/cas/login.js"
import { fetch } from "undici"
import { AccountIssueError, HnuError, LabLoginIssueError } from "@/core/error.js"

// region Shared

async function deriveToken(
  casToken: CasToken,
  loginUrl: string,
  checkUrl: string,
): Promise<string> {
  const response = await fetch(loginUrl, {
    headers: {
      Cookie: casToken.cookie,
      Referer: loginUrl,
    },
    redirect: "manual",
  })

  const setCookie = response.headers.getSetCookie?.() ?? []
  const cookie = setCookie
    .map(c => c.split(";")[0])
    .filter(Boolean)
    .join("; ")

  if (!cookie) {
    throw new AccountIssueError(
      "PASSWORD_ERROR",
      "Failed to derive subsystem token",
    )
  }

  const verify = await fetch(checkUrl, {
    headers: { Cookie: cookie },
    redirect: "manual",
  })
  if (verify.status >= 400) {
    throw new AccountIssueError(
      "PASSWORD_ERROR",
      "Derived token rejected by subsystem",
    )
  }

  return cookie
}

// endregion

// region HDJW

export interface HdjwToken {
  headers: Record<string, string>
}

const HDJW_LOGIN_URL
  = "https://hdjw.hnu.edu.cn/authserver/login?service=https://hdjw.hnu.edu.cn/"
const HDJW_CHECK_URL = "https://hdjw.hnu.edu.cn/"

export async function acquireHdjwToken(casToken: CasToken): Promise<HdjwToken> {
  const cookie = await deriveToken(casToken, HDJW_LOGIN_URL, HDJW_CHECK_URL)
  return { headers: { Cookie: cookie } }
}

export async function acquireHdjwTokenFromHeaders(
  headers: Record<string, string>,
): Promise<HdjwToken> {
  const cookie = headers.Cookie
  if (!cookie)
    throw new HnuError("Missing Cookie in headers")
  const verify = await fetch(HDJW_CHECK_URL, {
    headers: { Cookie: cookie },
    redirect: "manual",
  })
  if (verify.status >= 400) {
    throw new HnuError("HDJW token invalid")
  }
  return { headers: { Cookie: cookie } }
}

// endregion

// region GYM

export interface GymToken {
  headers: Record<string, string>
}

const GYM_BASE = "http://gymos.hnu.edu.cn"
const GYM_CAS_LOGIN_URL = `${GYM_BASE}/cas/`
const GYM_CHECK_URL = `${GYM_BASE}/`
const GYM_DIRECT_LOGIN_URL = `${GYM_BASE}/`

export async function acquireGymTokenByCas(
  casToken: CasToken,
): Promise<GymToken> {
  const response = await fetch(GYM_CAS_LOGIN_URL, {
    headers: { Cookie: casToken.cookie, Referer: GYM_CAS_LOGIN_URL },
    redirect: "manual",
  })
  const setCookie = response.headers.getSetCookie?.() ?? []
  const cookie = setCookie.map(c => c.split(";")[0]).filter(Boolean).join("; ")
  if (!cookie)
    throw new AccountIssueError("PASSWORD_ERROR", "GYM CAS login failed")
  return { headers: { Cookie: cookie } }
}

export interface DirectLoginOptions {
  stuId: string
  password: string
}

export async function acquireGymTokenByDirect(
  options: DirectLoginOptions,
): Promise<GymToken> {
  const { stuId, password } = options
  const response = await fetch(GYM_DIRECT_LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ username: stuId, password }),
  })
  const data = await response.json() as { headers?: Record<string, string>, error?: string }
  if (data.error) {
    throw new AccountIssueError("PASSWORD_ERROR", data.error)
  }
  return { headers: data.headers ?? {} }
}

export async function acquireGymTokenFromHeaders(
  headers: Record<string, string>,
): Promise<GymToken> {
  const cookie = headers.Cookie
  if (!cookie)
    throw new HnuError("Missing Cookie in headers")
  const verify = await fetch(GYM_CHECK_URL, {
    headers: { Cookie: cookie },
    redirect: "manual",
  })
  if (verify.status >= 400)
    throw new HnuError("GYM token invalid")
  return { headers: { Cookie: cookie } }
}

// endregion

// region LAB

export interface LabToken {
  headers: Record<string, string>
  stuId: string
}

const LAB_BASE = "http://10.62.106.112"
const LAB_LOGIN_URL = `${LAB_BASE}/cas/`
const LAB_CAPTCHA_URL = `${LAB_BASE}/captcha`
const LAB_CHECK_URL = `${LAB_BASE}/`

export interface AcquireLabTokenOptions {
  stuId: string
  password: string
  captchaImage: Buffer
  maxTried?: number
}

export async function acquireLabToken(
  options: AcquireLabTokenOptions,
): Promise<LabToken> {
  const { stuId, password, captchaImage, maxTried = 5 } = options

  for (let i = 0; i < maxTried; i++) {
    await fetch(LAB_CAPTCHA_URL, { method: "GET" })

    const captcha = captchaImage.toString("utf8").trim()

    const response = await fetch(LAB_LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ username: stuId, password, captcha }),
    })
    const data = await response.json() as { headers?: Record<string, string>, error?: string }

    if (data.error === "CAPTCHA_ERROR" || data.error === "验证码错误") {
      continue
    }
    if (data.error) {
      throw new LabLoginIssueError("PASSWORD_ERROR", data.error)
    }
    return { headers: data.headers ?? {}, stuId }
  }

  throw new LabLoginIssueError(
    "CAPTCHA_ERROR",
    "Captcha recognition failed after max retries",
  )
}

export async function acquireLabTokenFromHeaders(
  headers: Record<string, string>,
  stuId: string,
): Promise<LabToken> {
  const cookie = headers.Cookie
  if (!cookie)
    throw new HnuError("Missing Cookie in headers")
  const verify = await fetch(LAB_CHECK_URL, {
    headers: { Cookie: cookie },
    redirect: "manual",
  })
  if (verify.status >= 400)
    throw new HnuError("LAB token invalid")
  return { headers: { Cookie: cookie }, stuId }
}

// endregion

// region NETFLOW

export interface NetflowToken {
  headers: Record<string, string>
}

const NETFLOW_BASE = "http://ll.hnu.edu.cn"
const NETFLOW_LOGIN_URL = `${NETFLOW_BASE}/cas/`
const NETFLOW_CHECK_URL = `${NETFLOW_BASE}/`

export async function acquireNetflowToken(
  casToken: CasToken,
): Promise<NetflowToken> {
  const response = await fetch(NETFLOW_LOGIN_URL, {
    headers: { Cookie: casToken.cookie, Referer: NETFLOW_LOGIN_URL },
    redirect: "manual",
  })
  const setCookie = response.headers.getSetCookie?.() ?? []
  const cookie = setCookie.map(c => c.split(";")[0]).filter(Boolean).join("; ")
  if (!cookie)
    throw new AccountIssueError("PASSWORD_ERROR", "NETFLOW CAS login failed")
  return { headers: { Cookie: cookie } }
}

export async function acquireNetflowTokenFromHeaders(
  headers: Record<string, string>,
): Promise<NetflowToken> {
  const cookie = headers.Cookie
  if (!cookie)
    throw new HnuError("Missing Cookie in headers")
  const verify = await fetch(NETFLOW_CHECK_URL, {
    headers: { Cookie: cookie },
    redirect: "manual",
  })
  if (verify.status >= 400)
    throw new HnuError("NETFLOW token invalid")
  return { headers: { Cookie: cookie } }
}

// endregion

// region PT

export interface PtToken {
  headers: Record<string, string>
}

const PT_BASE = "https://pt.hnu.edu.cn"
const PT_LOGIN_URL = `${PT_BASE}/authserver/`
const PT_CHECK_URL = `${PT_BASE}/`

export async function acquirePtToken(casToken: CasToken): Promise<PtToken> {
  const response = await fetch(PT_LOGIN_URL, {
    headers: { Cookie: casToken.cookie, Referer: PT_LOGIN_URL },
    redirect: "manual",
  })
  const setCookie = response.headers.getSetCookie?.() ?? []
  const cookie = setCookie.map(c => c.split(";")[0]).filter(Boolean).join("; ")
  if (!cookie)
    throw new AccountIssueError("PASSWORD_ERROR", "PT CAS login failed")
  return { headers: { Cookie: cookie } }
}

export async function acquirePtTokenFromHeaders(
  headers: Record<string, string>,
): Promise<PtToken> {
  const cookie = headers.Cookie
  if (!cookie)
    throw new HnuError("Missing Cookie in headers")
  const verify = await fetch(PT_CHECK_URL, {
    headers: { Cookie: cookie },
    redirect: "manual",
  })
  if (verify.status >= 400)
    throw new HnuError("PT token invalid")
  return { headers: { Cookie: cookie } }
}

// endregion

// region XGXT

export interface XgxtToken {
  headers: Record<string, string>
}

const XGXT_BASE = "http://xgxt.hnu.edu.cn"
const XGXT_LOGIN_URL = `${XGXT_BASE}/cas/`
const XGXT_CHECK_URL = `${XGXT_BASE}/`

export async function acquireXgxtToken(
  casToken: CasToken,
): Promise<XgxtToken> {
  const response = await fetch(XGXT_LOGIN_URL, {
    headers: { Cookie: casToken.cookie, Referer: XGXT_LOGIN_URL },
    redirect: "manual",
  })
  const setCookie = response.headers.getSetCookie?.() ?? []
  const cookie = setCookie.map(c => c.split(";")[0]).filter(Boolean).join("; ")
  if (!cookie)
    throw new AccountIssueError("PASSWORD_ERROR", "XGXT CAS login failed")
  return { headers: { Cookie: cookie } }
}

export async function acquireXgxtTokenFromHeaders(
  headers: Record<string, string>,
): Promise<XgxtToken> {
  const cookie = headers.Cookie
  if (!cookie)
    throw new HnuError("Missing Cookie in headers")
  const verify = await fetch(XGXT_CHECK_URL, {
    headers: { Cookie: cookie },
    redirect: "manual",
  })
  if (verify.status >= 400)
    throw new HnuError("XGXT token invalid")
  return { headers: { Cookie: cookie } }
}

// endregion

// region CA

export interface CaToken {
  headers: Record<string, string>
}

const CA_BASE = "https://ca.hnu.edu.cn"
const CA_LOGIN_URL = `${CA_BASE}/cas/`
const CA_CHECK_URL = `${CA_BASE}/`

export async function acquireCaToken(casToken: CasToken): Promise<CaToken> {
  const response = await fetch(CA_LOGIN_URL, {
    headers: { Cookie: casToken.cookie, Referer: CA_LOGIN_URL },
    redirect: "manual",
  })
  const setCookie = response.headers.getSetCookie?.() ?? []
  const cookie = setCookie.map(c => c.split(";")[0]).filter(Boolean).join("; ")
  if (!cookie)
    throw new AccountIssueError("PASSWORD_ERROR", "CA CAS login failed")
  return { headers: { Cookie: cookie } }
}

export async function acquireCaTokenFromHeaders(
  headers: Record<string, string>,
): Promise<CaToken> {
  const cookie = headers.Cookie
  if (!cookie)
    throw new HnuError("Missing Cookie in headers")
  const verify = await fetch(CA_CHECK_URL, {
    headers: { Cookie: cookie },
    redirect: "manual",
  })
  if (verify.status >= 400)
    throw new HnuError("CA token invalid")
  return { headers: { Cookie: cookie } }
}

// endregion
