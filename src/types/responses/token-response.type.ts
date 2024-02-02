export interface TokenResponse {
  status: number
  data: ProximusEncoTokenType
}

export interface ProximusEncoTokenType {
  access_token: string
  scope: string
  id_token: string
  token_type: string
  expires_in: number
}
