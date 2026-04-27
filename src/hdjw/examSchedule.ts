import type { HdjwToken } from "@/auth/client.js"
import { TokenExpiredError } from "@/core/error.js"
import { createRequest } from "@/core/request.js"

const HDJW_BASE = "https://hdjw.hnu.edu.cn"

export interface ExamSchedule {
  course_id: string
  course_name: string
  area: string | null
  classroom: string | null
  date: string | null
  time: string | null
  seat: string | null
}

export interface GetExamScheduleOptions {
  xn: number
  xq: 1 | 2
  token: HdjwToken
}

export async function getExamSchedule(
  options: GetExamScheduleOptions,
): Promise<ExamSchedule[]> {
  const { xn, xq, token } = options
  const data = await createRequest()
    .url(`${HDJW_BASE}/api/exam-schedule`)
    .method("GET")
    .query({ xn, xq })
    .header("Cookie", token.headers.Cookie)
    .send<ExamSchedule[] | { error?: string }>()

  if (data && typeof data === "object" && "error" in data) {
    throw new TokenExpiredError()
  }
  return data as ExamSchedule[]
}
