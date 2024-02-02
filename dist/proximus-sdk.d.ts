import { OutboundMessagePayload } from "./types/payloads/outbound-message-payload.type";
import { OutboundMessageResponse } from './types/responses/outbound-message-response.type';
import { OutboundMessageLengthResponse } from './types/responses/outbound-message-length-response.type';
interface ProximusSMSOutboundInterface {
    send(options: OutboundMessagePayload): Promise<OutboundMessageResponse>;
    length(options: OutboundMessagePayload): Promise<OutboundMessageLengthResponse>;
    deliveryInfo(messageId: string): Promise<OutboundMessageResponse>;
    sendAddress(options: OutboundMessagePayload): Promise<OutboundMessageResponse>;
}
export declare class ProximusSMSOutbound implements ProximusSMSOutboundInterface {
    protected readonly clientId: string;
    protected readonly clientSecret: string;
    protected readonly baseUrl: string;
    protected accessToken: string | null;
    protected tokenExpiresAt: Date | null;
    constructor(options: {
        clientId: string;
        clientSecret: string;
    });
    private getEncoToken;
    send(options: OutboundMessagePayload): Promise<OutboundMessageResponse>;
    length(options: OutboundMessagePayload): Promise<OutboundMessageLengthResponse>;
    deliveryInfo(messageId: string): Promise<OutboundMessageResponse>;
    sendAddress(options: OutboundMessagePayload): Promise<OutboundMessageResponse>;
    private sendSMSRequest;
}
export {};
