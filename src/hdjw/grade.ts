import type { HdjwToken } from "@/auth/client.js"
import { TokenExpiredError } from "@/core/error.js"
import { createRequest } from "@/core/request.js"

const HDJW_BASE = "https://hdjw.hnu.edu.cn"

export interface Grade {
  course_id: string
  course_name: string
  credit: number
  course_type1: string | null
  course_type2: string
  gpa: number
  score: number
  grade_tag: string | null
  grade_type: string
  jx0404id: string | null
}

export interface GradeDetailItem {
  name: string
  score: string
  percentage: string
}

export interface GetGradeOptions {
  xn: number
  xq: 1 | 2
  token: HdjwToken
}

export async function getGrade(options: GetGradeOptions): Promise<Grade[]> {
  const { xn, xq, token } = options
  const data = await createRequest()
    .url(`${HDJW_BASE}/api/grade`)
    .method("GET")
    .query({ xn, xq })
    .header("Cookie", token.headers.Cookie)
    .send<Grade[] | { error?: string }>()

  if (data && typeof data === "object" && "error" in data) {
    if (String(data.error).includes("expire")) {
      throw new TokenExpiredError()
    }
    throw new Error(String(data.error))
  }
  return data as Grade[]
}

export async function getGradeDetail(
  jx0404id: string,
  token: HdjwToken,
): Promise<GradeDetailItem[]> {
  const data = await createRequest()
    .url(`${HDJW_BASE}/api/grade/${jx0404id}/detail`)
    .method("GET")
    .header("Cookie", token.headers.Cookie)
    .send<GradeDetailItem[] | { error?: string }>()

  if (data && typeof data === "object" && "error" in data) {
    throw new TokenExpiredError()
  }
  return data as GradeDetailItem[]
}
