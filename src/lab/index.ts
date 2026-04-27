import type { LabToken } from "@/auth/client.js"
import { createRequest } from "@/core/request.js"

const LAB_BASE = "http://10.62.106.112"

export interface Semester {
  xn: number
  xq: number
  id: string
}

export interface LabCourse {
  name: string
  score: string | null
  id: string
}

export interface LabSchedule {
  seat: string
  name: string
  course: string
  teacher: string
  week: number
  day: number
  date_time: string
  place: string
  phone: string | null
  email: string | null
}

export interface LabGradeDetailItem {
  name: string
  score: number | null
}

export interface LabGrade {
  lab_name: string
  score: string
  attendance: string | null
  details: LabGradeDetailItem[]
}

export interface VirtualLabGrade {
  lab_name: string
  score: string | null
}

export async function getSemester(token: LabToken): Promise<Semester[]> {
  const data = await createRequest()
    .url(`${LAB_BASE}/api/semester`)
    .method("GET")
    .header("Cookie", token.headers.Cookie)
    .send<Semester[]>()

  return data
}

export async function getLabCourse(
  semesterId: string,
  token: LabToken,
): Promise<LabCourse[]> {
  const data = await createRequest()
    .url(`${LAB_BASE}/api/course`)
    .method("GET")
    .query({ semester_id: semesterId })
    .header("Cookie", token.headers.Cookie)
    .send<LabCourse[]>()

  return data
}

export async function getLabSchedule(token: LabToken): Promise<LabSchedule[]> {
  const data = await createRequest()
    .url(`${LAB_BASE}/api/schedule`)
    .method("GET")
    .header("Cookie", token.headers.Cookie)
    .send<LabSchedule[]>()

  return data
}

export async function getLabGrade(
  courseId: string,
  semesterId: string,
  token: LabToken,
): Promise<LabGrade[]> {
  const data = await createRequest()
    .url(`${LAB_BASE}/api/grade`)
    .method("GET")
    .query({ course_id: courseId, semester_id: semesterId })
    .header("Cookie", token.headers.Cookie)
    .send<LabGrade[]>()

  return data
}

export async function getVirtualLabGrade(
  token: LabToken,
): Promise<VirtualLabGrade[]> {
  const data = await createRequest()
    .url(`${LAB_BASE}/api/grade/virtual`)
    .method("GET")
    .header("Cookie", token.headers.Cookie)
    .send<VirtualLabGrade[]>()

  return data
}
