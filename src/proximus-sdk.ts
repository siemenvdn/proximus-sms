import { Axios } from 'axios'
import { OutboundMessagePayload } from "./types/payloads/outbound-message-payload.type";
import { OutboundMessageResponse } from './types/responses/outbound-message-response.type'
import { OutboundMessageLengthResponse } from './types/responses/outbound-message-length-response.type'

interface ProximusSMSOutboundInterface {
    send(options: OutboundMessagePayload): Promise<OutboundMessageResponse>;
    length(options: OutboundMessagePayload): Promise<OutboundMessageLengthResponse>;
    deliveryInfo(messageId: string): Promise<OutboundMessageResponse>;
    sendAddress(options: OutboundMessagePayload): Promise<OutboundMessageResponse>;
}

export class ProximusSMSOutbound implements ProximusSMSOutboundInterface {
    protected readonly clientId: string
    protected readonly clientSecret: string
    protected accessToken: string | null = null
    protected readonly client: Axios

    constructor (options: { clientId: string, clientSecret: string }) {
        this.clientId = options.clientId
        this.clientSecret = options.clientSecret
        this.client = new Axios({ baseURL: 'https://api.enco.io', timeout: 5000 })
    }

    private async getAccessToken (): Promise<string> {
        if (this.accessToken == null) {
            const response = await this.client.post('/token', {
                grant_type: 'client_credentials',
                scope: 'openid',
                client_id: this.clientId,
                client_secret: this.clientSecret,
            }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' } })
            this.accessToken = response['access_token']
        }
        return this.accessToken
    }

    private async getAxiosConfig (): Promise<{headers: {Authorization: string}}> {
        const accessToken = await this.getAccessToken()
        return { headers: { Authorization: `Bearer ${accessToken}` } }
    }

    public async send (options: OutboundMessagePayload): Promise<OutboundMessageResponse> {
        const response = await this.sendSMSRequest('/outbound-messages', options)
        return response.data
    }

    public async length (options: OutboundMessagePayload): Promise<OutboundMessageLengthResponse> {
        const response = await this.sendSMSRequest('/outbound-messages/length', options)
        return response.data
    }

    public async deliveryInfo (messageId: string): Promise<OutboundMessageResponse> {
        const response = await this.sendSMSRequest(`/outbound-messages/delivery-info/${messageId}`)
        return response.data as OutboundMessageResponse
    }

    public async sendAddress (options: OutboundMessagePayload): Promise<OutboundMessageResponse> {
        const response = await this.sendSMSRequest('/outbound-messages/address', options)
        return response.data
    }

    private async sendSMSRequest(baseUrl: string, options?: OutboundMessagePayload): Promise<any> {
        const url = `${baseUrl}` + (options.forceCharacterLimit ? `?forceCharacterLimit=${options.forceCharacterLimit}` : '')
        const config = await this.getAxiosConfig()
        const response = await this.client.post('/sms/1.0.0' + url, options.body, config)
        if(response.status !== 200) throw new Error(`Return status ${response.status}, response: ${response.data}`)
        return response.data
    }
}
