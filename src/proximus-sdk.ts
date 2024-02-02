import axios from 'axios'
import { OutboundMessagePayload } from "./types/payloads/outbound-message-payload.type";
import { OutboundMessageResponse } from './types/responses/outbound-message-response.type'
import { OutboundMessageLengthResponse } from './types/responses/outbound-message-length-response.type'
import { ProximusEncoTokenType, TokenResponse } from './types/responses/token-response.type'

interface ProximusSMSOutboundInterface {
    send(options: OutboundMessagePayload): Promise<OutboundMessageResponse>;
    length(options: OutboundMessagePayload): Promise<OutboundMessageLengthResponse>;
    deliveryInfo(messageId: string): Promise<OutboundMessageResponse>;
    sendAddress(options: OutboundMessagePayload): Promise<OutboundMessageResponse>;
}

export class ProximusSMSOutbound implements ProximusSMSOutboundInterface {
    protected readonly clientId: string
    protected readonly clientSecret: string
    protected readonly baseUrl: string

    protected accessToken: string | null = null
    protected tokenExpiresAt: Date | null = null

    constructor (options: { clientId: string, clientSecret: string }) {
        this.clientId = options.clientId
        this.clientSecret = options.clientSecret
        this.baseUrl = 'https://api.enco.io'
    }

    private async getEncoToken (): Promise<ProximusEncoTokenType> {
        const response: TokenResponse = await axios(
          {
              method: 'post',
              url: this.baseUrl + '/token',
              params: {
                  grant_type: 'client_credentials',
                  scope: 'openid',
                  client_id: this.clientId,
                  client_secret: this.clientSecret,
                  Accept: 'application/json'
              },
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              }
          }
        )

        if (response.status !== 200) {
            throw new Error('Error getting access token')
        }

        this.accessToken = response.data.access_token
        this.tokenExpiresAt = new Date(Date.now() + response.data.expires_in)

        return response.data
    }

    public async send (options: OutboundMessagePayload): Promise<OutboundMessageResponse> {
        const response = await this.sendSMSRequest('/outboundmessages', options)
        return response.data
    }

    public async length (options: OutboundMessagePayload): Promise<OutboundMessageLengthResponse> {
        const response = await this.sendSMSRequest('/outboundmessages/length', options)
        return response.data
    }

    public async deliveryInfo (messageId: string): Promise<OutboundMessageResponse> {
        const response = await this.sendSMSRequest(`/outboundmessages/delivery-info/${messageId}`)
        return response.data as OutboundMessageResponse
    }

    public async sendAddress (options: OutboundMessagePayload): Promise<OutboundMessageResponse> {
        const response = await this.sendSMSRequest('/outboundmessages/address', options)
        return response.data
    }

    private async sendSMSRequest(url: string, options?: OutboundMessagePayload): Promise<any> {
        if(this.tokenExpiresAt < new Date()) {
            await this.getEncoToken()
        }

        const response = await axios(
          {
              method: 'post',
              url: this.baseUrl + '/sms/1.0.0/sms' + url,
              data: {
                  message: options.body.message,
                  destinations: options.body.destinations
              },
              params: {
                  forceCharacterLimit: false
              },
              headers: {
                  Authorization: `Bearer ${this.accessToken}`,
                  'Content-Type': 'application/json',
                  Accept: 'application/json'
              }
          }
        )

        if(response.status !== 201) throw new Error(`Return status ${response.status}, response: ${response.data}`)
        return response.data
    }
}
