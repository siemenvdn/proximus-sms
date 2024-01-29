export interface OutboundMessagePayload {
    body: {
        message: string
        binary: boolean
        destinations: string[]
        callbackUrl: string
    },
    forceCharacterLimit?: boolean
}
