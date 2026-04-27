export class HnuError extends Error {
  override name = "HnuError"
  cause?: unknown
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message)
  }
}

export class NetworkError extends HnuError {
  override name = "NetworkError"
  constructor(message: string, cause?: unknown) {
    super(message)
    this.cause = cause
  }
}

export class ParseError extends HnuError {
  override name = "ParseError"
  constructor(message: string, cause?: unknown) {
    super(message)
    this.cause = cause
  }
}

export class UnexpectedError extends HnuError {
  override name = "UnexpectedError"
  constructor(message: string, cause?: unknown) {
    super(message)
    this.cause = cause
  }
}

export class AccountIssueError extends HnuError {
  override name = "AccountIssueError"
  constructor(
    public readonly code:
      | "PASSWORD_ERROR"
      | "PASSWORD_SHOULD_CHANGE"
      | "ACCOUNT_LOCKED",
    message: string,
  ) {
    super(message, code)
  }
}

export class TokenExpiredError extends HnuError {
  override name = "TokenExpiredError"
  constructor(message = "Token expired or invalid") {
    super(message, "TOKEN_EXPIRED")
  }
}

export class LabLoginIssueError extends HnuError {
  override name = "LabLoginIssueError"
  constructor(
    public readonly code: "PASSWORD_ERROR" | "CAPTCHA_ERROR" | "OTHER_ERROR",
    message: string,
  ) {
    super(message, code)
  }
}
