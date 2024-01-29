export interface ErrorResponse {
  fault: {
    message: string
    description: string
    code: number
    info: string
    details: {
      type: string
      identifier: string
      message: string
      description: string
      value: any
    }
  }
}
