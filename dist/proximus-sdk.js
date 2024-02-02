"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProximusSMSOutbound = void 0;
const axios_1 = __importDefault(require("axios"));
class ProximusSMSOutbound {
    clientId;
    clientSecret;
    baseUrl;
    accessToken = null;
    tokenExpiresAt = null;
    constructor(options) {
        this.clientId = options.clientId;
        this.clientSecret = options.clientSecret;
        this.baseUrl = 'https://api.enco.io';
    }
    async getEncoToken() {
        const response = await (0, axios_1.default)({
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
        });
        if (response.status !== 200) {
            throw new Error('Error getting access token');
        }
        this.accessToken = response.data.access_token;
        this.tokenExpiresAt = new Date(Date.now() + response.data.expires_in);
        return response.data;
    }
    async send(options) {
        const response = await this.sendSMSRequest('/outboundmessages', options);
        return response.data;
    }
    async length(options) {
        const response = await this.sendSMSRequest('/outboundmessages/length', options);
        return response.data;
    }
    async deliveryInfo(messageId) {
        const response = await this.sendSMSRequest(`/outboundmessages/delivery-info/${messageId}`);
        return response.data;
    }
    async sendAddress(options) {
        const response = await this.sendSMSRequest('/outboundmessages/address', options);
        return response.data;
    }
    async sendSMSRequest(url, options) {
        if (this.tokenExpiresAt < new Date()) {
            await this.getEncoToken();
        }
        const response = await (0, axios_1.default)({
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
        });
        if (response.status !== 201)
            throw new Error(`Return status ${response.status}, response: ${response.data}`);
        return response.data;
    }
}
exports.ProximusSMSOutbound = ProximusSMSOutbound;
