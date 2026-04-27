import type { XgxtToken } from "@/auth/client.js"
import { HnuError } from "@/core/error.js"
import { createRequest } from "@/core/request.js"

const WXPAY_BASE = "https://wxpay.hnu.edu.cn"

export interface ElectricityResponse {
  electricity: string
}

export interface GetElectricityOptions {
  park: string
  build: string
  room: string
  token: XgxtToken
}

export async function getElectricity(
  options: GetElectricityOptions,
): Promise<ElectricityResponse> {
  const { park, build, room, token } = options

  const data = await createRequest()
    .url(`${WXPAY_BASE}/api/electricity`)
    .method("GET")
    .query({ park, build, room })
    .header("Cookie", token.headers.Cookie)
    .send<ElectricityResponse | { error?: string }>()

  if (data && typeof data === "object" && "error" in data) {
    throw new HnuError(String(data.error))
  }
  return data as ElectricityResponse
}
