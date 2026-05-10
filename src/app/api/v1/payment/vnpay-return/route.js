import { createPaymentReturnResponse } from "../../../payment/vnpay-return/handler";

export async function GET(request) {
  return createPaymentReturnResponse(request);
}
