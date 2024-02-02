export interface OutboundMessagePayload {
    body: {
        message: string;
        destinations: string[];
    };
    forceCharacterLimit?: boolean;
}
