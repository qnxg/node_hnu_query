import type { Response, RequestInit as UndiciRequestInit } from "undici"
import { fetch } from "undici"
import { NetworkError, UnexpectedError } from "./error.js"

export interface RequestOptions {
  query?: Record<string, string | number | boolean | undefined>
  cookies?: string
  headers?: Record<string, string>
}

export class RequestBuilder {
  private _url = ""
  private _query: Record<string, string | number | boolean | undefined> = {}
  private _method = "GET"
  private _headers: Record<string, string> = {}
  private _cookies: string = ""
  private _body?: unknown

  url(url: string): this {
    this._url = url
    return this
  }

  method(method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"): this {
    this._method = method
    return this
  }

  query(params: Record<string, string | number | boolean | undefined>): this {
    this._query = { ...this._query, ...params }
    return this
  }

  header(key: string, value: string): this {
    this._headers[key] = value
    return this
  }

  cookie(cookie: string): this {
    this._cookies = cookie
    return this
  }

  json(body: unknown): this {
    this._body = body
    this._headers["Content-Type"] = "application/json"
    this._headers.Accept = "application/json"
    return this
  }

  build(): { url: string, options: UndiciRequestInit } {
    const url = new URL(this._url)
    for (const [k, v] of Object.entries(this._query)) {
      if (v !== undefined)
        url.searchParams.set(k, String(v))
    }
    const headers: Record<string, string> = { ...this._headers }
    if (this._cookies)
      headers.Cookie = this._cookies

    const options: UndiciRequestInit = {
      method: this._method as UndiciRequestInit["method"],
      headers,
    }
    if (this._body !== undefined) {
      options.body = JSON.stringify(this._body)
    }
    return { url: url.toString(), options }
  }

  async send<T = unknown>(): Promise<T> {
    const { url, options } = this.build()
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new NetworkError(
        `HTTP ${response.status}: ${response.statusText}`,
        { url, status: response.status },
      )
    }
    try {
      return (await response.json()) as T
    }
    catch {
      const text = await response.text()
      try {
        return JSON.parse(text) as T
      }
      catch {
        throw new UnexpectedError(`Failed to parse response from ${url}`)
      }
    }
  }
}

export function createRequest(): RequestBuilder {
  return new RequestBuilder()
}

export async function getCookiesFromResponse(
  response: Response,
  existingCookie = "",
): Promise<string> {
  const setCookie = response.headers.getSetCookie?.() ?? []
  const parsed = setCookie.map(c => c.split(";")[0]).join("; ")
  if (existingCookie) {
    const parts = existingCookie.split("; ").filter(
      p => !setCookie.some(s => s.startsWith(`${p.split("=")[0]}=`)),
    )
    return [...parts, parsed].filter(Boolean).join("; ")
  }
  return parsed
}
