import { connectDB } from "@/app/lib/mongodb";
import Ticket from "@/models/Ticket";
import { pickTicketFields } from "@/app/lib/ticketSanitize";

export async function GET() {
  await connectDB();
  return Response.json(await Ticket.find());
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const ticketPayload = pickTicketFields(body);
  await Ticket.db.collection("Tickets").insertOne(ticketPayload);
  return Response.json(ticketPayload);
}
