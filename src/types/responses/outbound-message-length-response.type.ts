export interface OutboundMessageLengthResponse {
  numberOfChars: number,
  numberOfParts: number,
  charLimitPerPart: number,
  numberOfRemainingCharsInPart: number,
  numberOfRemainingParts: number
}
