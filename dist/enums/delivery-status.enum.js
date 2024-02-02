"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryStatus = void 0;
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["DELIVERED_TO_TERMINAL"] = "DeliveredToTerminal";
    DeliveryStatus["DELIVERY_UNCERTAIN"] = "DeliveryUncertain";
    DeliveryStatus["DELIVERY_IMPOSSIBLE"] = "DeliveryImpossible";
    DeliveryStatus["MESSAGE_WAITING"] = "MessageWaiting";
    DeliveryStatus["DELIVERED_TO_NETWORK"] = "DeliveredToNetwork";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
