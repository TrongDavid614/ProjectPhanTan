import { NextResponse } from "next/server";

export function getOrigin(request) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost =
    request.headers.get("x-forwarded-host") || request.headers.get("host");

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return new URL(request.url).origin;
}

export function createPaymentReturnResponse(request) {
  const origin = getOrigin(request);
  const returnUrl = new URL("/page/payment/return", origin);

  for (const [key, value] of request.nextUrl.searchParams.entries()) {
    returnUrl.searchParams.set(key, value);
  }

  return NextResponse.redirect(returnUrl);
}
