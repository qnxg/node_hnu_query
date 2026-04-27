import type { PtToken } from "@/auth/client.js"
import { createRequest } from "@/core/request.js"

const PT_BASE = "https://pt.hnu.edu.cn"

export interface CardInfo {
  id: number
  balance: number
}

export type CardHistoryType = "Consumption" | "Recharge"

export interface CardHistoryItem {
  date_time: string
  journal_time: string
  status: string
  id: number
  now_balance: number
  amount: number
  location: string | null
  name: string
}

export interface CardHistory {
  total: number
  count: number
  items: CardHistoryItem[]
}

export interface UnreadEmailCountResponse {
  count: number | null
}

export async function getCardInfo(token: PtToken): Promise<CardInfo> {
  const data = await createRequest()
    .url(`${PT_BASE}/api/card`)
    .method("GET")
    .header("Cookie", token.headers.Cookie)
    .send<CardInfo>()

  return data
}

export interface GetCardHistoryOptions {
  year: number
  month: number
  historyType: CardHistoryType
  token: PtToken
}

export async function getCardHistory(
  options: GetCardHistoryOptions,
): Promise<CardHistory> {
  const { year, month, historyType, token } = options
  const data = await createRequest()
    .url(`${PT_BASE}/api/card/history`)
    .method("GET")
    .query({ year, month, history_type: historyType })
    .header("Cookie", token.headers.Cookie)
    .send<CardHistory>()

  return data
}

export async function getUnreadEmailCount(
  token: PtToken,
): Promise<UnreadEmailCountResponse> {
  const data = await createRequest()
    .url(`${PT_BASE}/api/email/unread-count`)
    .method("GET")
    .header("Cookie", token.headers.Cookie)
    .send<UnreadEmailCountResponse>()

  return data
}
