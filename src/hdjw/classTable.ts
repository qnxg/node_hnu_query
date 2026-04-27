import type { HdjwToken } from "@/auth/client.js"
import { TokenExpiredError } from "@/core/error.js"
import { createRequest } from "@/core/request.js"

const HDJW_BASE = "https://hdjw.hnu.edu.cn"

export interface CourseSchedule {
  week: number
  day: number
  place: string
  time: number[]
}

export interface Course {
  course_name: string
  course_id: string
  course_type: string
  class_name: string
  area: string
  teacher: string
  credit: number
  extra: string | null
  people: number
  schedule: CourseSchedule[]
}

export interface ExtraCourse {
  course_name: string
  course_id: string
  course_type: string
  class_name: string
  area: string
  teacher: string
  credit: number
  extra: string | null
  people: number
}

export interface GetClassTableOptions {
  xn: number
  xq: 1 | 2
  token: HdjwToken
}

export async function getClassTable(
  options: GetClassTableOptions,
): Promise<Course[]> {
  const { xn, xq, token } = options
  const data = await createRequest()
    .url(`${HDJW_BASE}/api/class-table`)
    .method("GET")
    .query({ xn, xq })
    .header("Cookie", token.headers.Cookie)
    .send<Course[] | { error?: string }>()

  if (data && typeof data === "object" && "error" in data) {
    throw new TokenExpiredError()
  }
  return data as Course[]
}

export async function getClassTableExtra(
  options: GetClassTableOptions,
): Promise<ExtraCourse[]> {
  const { xn, xq, token } = options
  const data = await createRequest()
    .url(`${HDJW_BASE}/api/class-table/extra`)
    .method("GET")
    .query({ xn, xq })
    .header("Cookie", token.headers.Cookie)
    .send<ExtraCourse[] | { error?: string }>()

  if (data && typeof data === "object" && "error" in data) {
    throw new TokenExpiredError()
  }
  return data as ExtraCourse[]
}
