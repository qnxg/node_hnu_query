import type { CaToken } from "@/auth/client.js"
import { createRequest } from "@/core/request.js"

const CA_BASE = "https://ca.hnu.edu.cn"

export interface CaRank {
  all_gpa: string
  all_gpa_rank: string
  all_weighted: string
  all_weighted_rank: string
  all_arithmetic: string
  all_arithmetic_rank: string
  must_gpa: string
  must_weighted: string
  must_arithmetic: string
  core_gpa_rank: string
  core_weighted_rank: string
  core_arithmetic_rank: string
}

export async function getGradeRank(token: CaToken): Promise<CaRank> {
  const data = await createRequest()
    .url(`${CA_BASE}/api/grade-rank`)
    .method("GET")
    .header("Cookie", token.headers.Cookie)
    .send<CaRank>()

  return data
}
