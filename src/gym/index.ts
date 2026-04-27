import type { GymToken } from "@/auth/client.js"
import { TokenExpiredError } from "@/core/error.js"
import { createRequest } from "@/core/request.js"

const GYM_BASE = "http://gymos.hnu.edu.cn"

export interface Appointment {
  name: string
  desc: string
  show_date: string
  date: string
  time: string
  test_type: number
  status: number
}

export type GradeItemColor = "Green" | "Red"

export interface EyeGrade {
  eyesight_right: string
  eyesight_left: string
  eyesight_right_detail: string
  eyesight_left_detail: string
  eye_mirror_right: string
  eye_mirror_right_detail: string
  eye_mirror_left: string
  eye_mirror_left_detail: string
  eye_ametropia_right: string
  eye_ametropia_right_detail: string
  eye_ametropia_left: string
  eye_ametropia_left_detail: string
}

export interface GradeItem {
  color: GradeItemColor
  rank: string
  grade: string
  score: number
}

export interface GymGrade {
  name: string
  stu_id: string
  grade: string
  score: number
  report_desc: string
  report_status: string
  report_type: string
  eye: EyeGrade
  short_run: GradeItem
  bmi: GradeItem
  jump: GradeItem
  pull_and_sit: GradeItem
  run: GradeItem
  sit_and_reach: GradeItem
  vc: GradeItem
}

export async function getAppointment(token: GymToken): Promise<Appointment[]> {
  const data = await createRequest()
    .url(`${GYM_BASE}/api/appointment`)
    .method("GET")
    .header("Cookie", token.headers.Cookie)
    .send<Appointment[] | { error?: string }>()

  if (data && typeof data === "object" && "error" in data) {
    throw new TokenExpiredError("体测系统令牌过期")
  }
  return data as Appointment[]
}

export interface GetGymGradeOptions {
  xn: number
  token: GymToken
}

export async function getGymGrade(
  options: GetGymGradeOptions,
): Promise<GymGrade> {
  const { xn, token } = options
  const data = await createRequest()
    .url(`${GYM_BASE}/api/grade`)
    .method("GET")
    .query({ xn })
    .header("Cookie", token.headers.Cookie)
    .send<GymGrade | { error?: string }>()

  if (data && typeof data === "object" && "error" in data) {
    throw new TokenExpiredError("体测系统令牌过期")
  }
  return data as GymGrade
}
