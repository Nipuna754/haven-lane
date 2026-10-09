import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { SANITY_TAG } from "@/sanity/client";

/*
  Sanity calls this after anyone publishes a change (set up in
  sanity.io/manage → API → Webhooks). It refreshes the cached content, so
  edits show on the live site within seconds instead of within the hour.
  The shared secret proves the call really came from Sanity.
*/
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ message: "Webhook secret not set" }, { status: 500 });

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    // expire: 0 so the very next visit shows the change (a price cut or a
    // "Sold" badge shouldn't wait for a second page load)
    revalidateTag(SANITY_TAG, { expire: 0 });
    return NextResponse.json({ revalidated: true, type: body?._type ?? null });
  } catch (err) {
    console.error("Revalidate webhook failed:", err);
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }
}
