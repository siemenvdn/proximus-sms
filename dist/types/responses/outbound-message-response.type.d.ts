import { DeliveryStatus } from '../../enums/delivery-status.enum';
export interface OutboundMessageResponse {
    resourceURL: string;
    deliveryInfo: {
        address: string;
        deliveryStatus: DeliveryStatus;
    };
}
