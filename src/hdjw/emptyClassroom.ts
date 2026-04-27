import type { HdjwToken } from "@/auth/client.js"
import { HnuError, TokenExpiredError } from "@/core/error.js"
import { createRequest } from "@/core/request.js"

const HDJW_BASE = "https://hdjw.hnu.edu.cn"

export interface EmptyClassroom {
  room_name: string
  room_type: string
  seat_count: number
  exam_seat_count: number
}

export interface GetEmptyClassroomOptions {
  buildingId: string
  week: number
  day: number
  time: number[]
  xn: number
  xq: 1 | 2
  token: HdjwToken
}

export async function getEmptyClassroom(
  options: GetEmptyClassroomOptions,
): Promise<EmptyClassroom[]> {
  const { buildingId, week, day, time, xn, xq, token } = options

  if (time.some(t => t < 1 || t > 5)) {
    throw new HnuError("time must be within [1, 5]")
  }

  const data = await createRequest()
    .url(`${HDJW_BASE}/api/empty-classroom`)
    .method("GET")
    .query({ building_id: buildingId, week, day, time: time.join(","), xn, xq })
    .header("Cookie", token.headers.Cookie)
    .send<EmptyClassroom[] | { error?: string }>()

  if (data && typeof data === "object" && "error" in data) {
    if (String(data.error).includes("expire")) {
      throw new TokenExpiredError()
    }
    throw new Error(String(data.error))
  }
  return data as EmptyClassroom[]
}
