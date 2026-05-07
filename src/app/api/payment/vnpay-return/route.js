import { NextResponse } from "next/server";

export async function GET(request) {
  const incomingUrl = new URL(request.url);
  const returnUrl = new URL("/page/payment/return", incomingUrl.origin);

  // Forward all VNPAY query params to the frontend payment return page.
  incomingUrl.searchParams.forEach((value, key) => {
    returnUrl.searchParams.set(key, value);
  });

  return NextResponse.redirect(returnUrl);
}
