import type { HdjwToken } from "@/auth/client.js"
import { TokenExpiredError } from "@/core/error.js"
import { createRequest } from "@/core/request.js"

const HDJW_BASE = "https://hdjw.hnu.edu.cn"

export type RankMethod = "ArithmeticAvg" | "WeightedAvg" | "Gpa"

export interface Rank {
  rank: string | null
  score: string | null
}

export interface GetRankOptions {
  selection: string
  range: string
  rankMethod: RankMethod
  token: HdjwToken
}

export async function getRank(options: GetRankOptions): Promise<Rank> {
  const { selection, range, rankMethod, token } = options
  const data = await createRequest()
    .url(`${HDJW_BASE}/api/rank`)
    .method("GET")
    .query({ selection, range, rank_method: rankMethod })
    .header("Cookie", token.headers.Cookie)
    .send<Rank | { error?: string }>()

  if (data && typeof data === "object" && "error" in data) {
    throw new TokenExpiredError()
  }
  return data as Rank
}
