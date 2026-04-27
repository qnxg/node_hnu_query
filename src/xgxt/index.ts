import type { XgxtToken } from "@/auth/client.js"
import { createRequest } from "@/core/request.js"

const XGXT_BASE = "http://xgxt.hnu.edu.cn"

export type Gender = "Male" | "Female"
export type Level = "Undergraduate" | "Postgraduate" | "Doctoral"

export interface Dormitory {
  park: string | null
  build: string | null
  room: string
  raw_dormitory: string
}

export interface PersonalInfo {
  name: string
  enter_year: number
  xz: number | null
  stu_id: string
  gender: Gender
  level: Level
  academy: string
  major: string
  class: string
  dormitory: Dormitory
  politic: string | null
  race: string | null
  hometown: string | null
  phone: string | null
  wechat: string | null
  qq: string | null
  email: string | null
}

export function successfullyParsed(dormitory: Dormitory): boolean {
  return dormitory.park !== null && dormitory.build !== null
}

export async function getPersonalInfo(token: XgxtToken): Promise<PersonalInfo> {
  const data = await createRequest()
    .url(`${XGXT_BASE}/api/personal-info`)
    .method("GET")
    .header("Cookie", token.headers.Cookie)
    .send<PersonalInfo>()

  return data
}
