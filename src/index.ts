export {
  acquireCaToken,
  acquireCaTokenFromHeaders,
  acquireGymTokenByCas,
  acquireGymTokenByDirect,
  acquireGymTokenFromHeaders,
  acquireHdjwToken,
  acquireHdjwTokenFromHeaders,
  acquireLabToken,
  acquireLabTokenFromHeaders,
  AcquireLabTokenOptions,
  acquireNetflowToken,
  acquireNetflowTokenFromHeaders,
  acquirePtToken,
  acquirePtTokenFromHeaders,
  acquireXgxtToken,
  acquireXgxtTokenFromHeaders,
  type CaToken,
  DirectLoginOptions,
  type GymToken,
  type HdjwToken,
  type LabToken,
  type NetflowToken,
  type PtToken,
  type XgxtToken,
} from "./auth/client.js"

// region CA
export { type CaRank, getGradeRank } from "./ca/index.js"
// region Auth
export {
  casTokenToString,
  createCasToken,
  createCasTokenFromCookie,
} from "./cas/login.js"
// endregion

// region Core
export * from "./core/index.js"
// region GYM
export {
  type Appointment,
  type EyeGrade,
  getAppointment,
  getGymGrade,
  GetGymGradeOptions,
  type GradeItem,
  type GradeItemColor,
  type GymGrade,
} from "./gym/index.js"
export {
  type Course,
  type CourseSchedule,
  type ExtraCourse,
  getClassTable,
  getClassTableExtra,
  GetClassTableOptions,
} from "./hdjw/classTable.js"
export {
  type EmptyClassroom,
  getEmptyClassroom,
  GetEmptyClassroomOptions,
} from "./hdjw/emptyClassroom.js"
export {
  type ExamSchedule,
  getExamSchedule,
  GetExamScheduleOptions,
} from "./hdjw/examSchedule.js"
// endregion

// region HDJW
export {
  getGrade,
  getGradeDetail,
  GetGradeOptions,
  type Grade,
  type GradeDetailItem,
} from "./hdjw/grade.js"
// endregion

export {
  getRank,
  GetRankOptions,
  type Rank,
  type RankMethod,
} from "./hdjw/rank.js"
// endregion

// region LAB
export {
  getLabCourse,
  getLabGrade,
  getLabSchedule,
  getSemester,
  getVirtualLabGrade,
  type LabCourse,
  type LabGrade,
  type LabGradeDetailItem,
  type LabSchedule,
  type Semester,
  type VirtualLabGrade,
} from "./lab/index.js"
// endregion

// region NETFLOW
export {
  type DetailItem,
  getDayDetail,
  getMonthDetail,
  getOrder,
  getOverduePayment,
  getThisMonthInfo,
  getUnlockStatus,
  type NetflowDetail,
  type OrderItem,
  type OverduePaymentResponse,
  type ThisMonthInfo,
  type UnlockStatus,
  type UnlockStatusResponse,
} from "./netflow/index.js"
// endregion

// region PT
export {
  type CardHistory,
  type CardHistoryItem,
  type CardHistoryType,
  type CardInfo,
  getCardHistory,
  GetCardHistoryOptions,
  getCardInfo,
  getUnreadEmailCount,
  type UnreadEmailCountResponse,
} from "./pt/index.js"
// endregion

// region WXPAY
export {
  type ElectricityResponse,
  getElectricity,
  GetElectricityOptions,
} from "./wxpay/index.js"
// endregion

// region XGXT
export {
  type Dormitory,
  type Gender,
  getPersonalInfo,
  type Level,
  type PersonalInfo,
  successfullyParsed,
} from "./xgxt/index.js"
// endregion
