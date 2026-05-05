import { connectDB } from "@/app/lib/mongodb";
import Order from "@/models/Order";
import { pickOrderFields } from "@/app/lib/orderSanitize";

export async function GET() {
  await connectDB();
  return Response.json(await Order.find());
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const sanitized = pickOrderFields(body);
  return Response.json(await Order.create(sanitized));
}
