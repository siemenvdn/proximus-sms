import { Axios } from 'axios'
import { OutboundMessagePayload } from "./types/payloads/outbound-message-payload.type";
import { OutboundMessageResponse } from './types/responses/outbound-message-response.type'
import { OutboundMessageLengthResponse } from './types/responses/outbound-message-length-response.type'

export class ProximusSMSOutbound {
    protected readonly clientId: string
    protected readonly clientSecret: string
    protected accessToken: string | null = null
    protected readonly client: Axios

    constructor (options: { clientId: string, clientSecret: string }) {
        this.clientId = options.clientId
        this.clientSecret = options.clientSecret
        this.client = new Axios({ baseURL: 'https://api.enco.io/sms/1.0.0', timeout: 5000 })
    }

    private async getAccessToken (): Promise<string> {
        if (this.accessToken == null) {
            const response = await this.client.post('/oauth/token', {
                grant_type: 'client_credentials',
                client_id: this.clientId,
                client_secret: this.clientSecret
            })
            this.accessToken = response['access_token']
        }
        return this.accessToken
    }

    private async getAxiosConfig (): Promise<{headers: {Authorization: string}}> {
        const accessToken = await this.getAccessToken()
        return { headers: { Authorization: `Bearer ${accessToken}` } }
    }

    public async outboundMessagesSend (options: OutboundMessagePayload): Promise<OutboundMessageResponse> {
        const response = await this.sendRequest('/outbound-messages', options)
        return response.data
    }

    public async outboundMessagesLength (options: OutboundMessagePayload): Promise<OutboundMessageLengthResponse> {
        const response = await this.sendRequest('/outbound-messages/length', options)
        return response.data
    }

    public async outboundMessagesDeliveryInfo (messageId: string): Promise<OutboundMessageResponse> {
        const response = await this.sendRequest(`/outbound-messages/delivery-info/${messageId}`)
        return response.data as OutboundMessageResponse
    }

    public async outboundMessagesAddress (options: OutboundMessagePayload): Promise<OutboundMessageResponse> {
        const response = await this.sendRequest('/outbound-messages/address', options)
        return response.data
    }

    private async sendRequest(baseUrl: string, options?: OutboundMessagePayload): Promise<any> {
        const url = `${baseUrl}` + (options.forceCharacterLimit ? `?forceCharacterLimit=${options.forceCharacterLimit}` : '')
        const config = await this.getAxiosConfig()
        const response = await this.client.post(url, options.body, config)
        if(response.status !== 200) throw new Error(`Return status ${response.status}, response: ${response.data}`)
        console.log('url')
        return response.data
    }
}
