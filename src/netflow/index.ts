import type { NetflowToken } from "@/auth/client.js"
import { createRequest } from "@/core/request.js"

const NETFLOW_BASE = "http://ll.hnu.edu.cn"

export interface ThisMonthInfo {
  total_usage: string
  upload_usage: string
  download_usage: string
  base_package_amount: number
  base_package_usage: number
  base_package_usage_percentage: number
  base_package_surplus: number
  extend_package_amount: number
  extend_package_usage: number
  extend_package_usage_percentage: number
  extend_package_surplus: number
}

export interface DetailItem {
  app: string
  total: number
  download: number
  upload: number
  percentage: number
}

export interface NetflowDetail {
  total: number
  upload: number
  download: number
  items: DetailItem[]
}

export interface OrderItem {
  time: string
  download_usage: number
  upload_usage: number
  over_usage: number
  should_pay: number
  update_time: string
}

export type UnlockStatus = "Locked" | "Unlocked" | "Unknown"

export interface OverduePaymentResponse {
  amount: number
}

export interface UnlockStatusResponse {
  status: UnlockStatus
}

export async function getThisMonthInfo(
  token: NetflowToken,
): Promise<ThisMonthInfo> {
  const data = await createRequest()
    .url(`${NETFLOW_BASE}/api/this-month`)
    .method("GET")
    .header("Cookie", token.headers.Cookie)
    .send<ThisMonthInfo>()

  return data
}

export async function getMonthDetail(
  year: number,
  month: number,
  token: NetflowToken,
): Promise<NetflowDetail> {
  const data = await createRequest()
    .url(`${NETFLOW_BASE}/api/detail/month`)
    .method("GET")
    .query({ year, month })
    .header("Cookie", token.headers.Cookie)
    .send<NetflowDetail>()

  return data
}

export async function getDayDetail(
  year: number,
  month: number,
  day: number,
  token: NetflowToken,
): Promise<NetflowDetail> {
  const data = await createRequest()
    .url(`${NETFLOW_BASE}/api/detail/day`)
    .method("GET")
    .query({ year, month, day })
    .header("Cookie", token.headers.Cookie)
    .send<NetflowDetail>()

  return data
}

export async function getOrder(token: NetflowToken): Promise<OrderItem[]> {
  const data = await createRequest()
    .url(`${NETFLOW_BASE}/api/order`)
    .method("GET")
    .header("Cookie", token.headers.Cookie)
    .send<OrderItem[]>()

  return data
}

export async function getOverduePayment(
  token: NetflowToken,
): Promise<OverduePaymentResponse> {
  const data = await createRequest()
    .url(`${NETFLOW_BASE}/api/pay-info`)
    .method("GET")
    .header("Cookie", token.headers.Cookie)
    .send<OverduePaymentResponse>()

  return data
}

export async function getUnlockStatus(
  token: NetflowToken,
): Promise<UnlockStatusResponse> {
  const data = await createRequest()
    .url(`${NETFLOW_BASE}/api/unlock-status`)
    .method("GET")
    .header("Cookie", token.headers.Cookie)
    .send<UnlockStatusResponse>()

  return data
}
