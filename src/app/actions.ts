"use server";

import { getSite } from "@/content/data";
import { saveEnquiry } from "@/supabase/enquiries";

/*
  Viewing and contact requests. The input is checked here on the server, so
  the rules hold even if someone skips the browser checks, then saved to the
  Supabase "enquiries" table (see supabase/enquiries.sql).
*/

type Field = "name" | "email" | "phone" | "message";

export type EnquiryState = {
  status: "idle" | "error" | "sent";
  errors?: Partial<Record<Field, string>>;
  /** A problem with the whole form, e.g. the database couldn't be reached */
  formError?: string;
  values?: Record<string, string>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SLUG = /^[a-z0-9-]{1,120}$/;
const WHEN: Record<string, "weekdays" | "weekends" | "any"> = { Weekdays: "weekdays", Weekends: "weekends", "Any time": "any" };

export async function sendEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  const text = (key: string, max: number) => String(form.get(key) ?? "").trim().slice(0, max);
  const values = {
    name: text("name", 120),
    email: text("email", 254),
    phone: text("phone", 40),
    message: String(form.get("message") ?? "").trim(),
    when: text("when", 20),
    home: text("home", 120),
    agent: text("agent", 120),
  };

  // Bots fill in the hidden "company" field. Act as if it worked and save nothing.
  if (text("company", 200)) return { status: "sent" };

  const errors: EnquiryState["errors"] = {};
  if (values.name.length < 2) errors.name = "Enter your name.";
  if (!EMAIL.test(values.email)) errors.email = "Enter an email address like jamie@example.com.";
  if (values.phone && values.phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a phone number with at least 7 digits, or leave it empty.";
  if (values.message.length > 2000) errors.message = "Keep your message under 2,000 characters.";
  if (Object.keys(errors).length > 0) return { status: "error", errors, values };

  const result = await saveEnquiry({
    name: values.name,
    email: values.email,
    phone: values.phone || null,
    message: values.message || null,
    when_suits: WHEN[values.when] ?? "any",
    home_slug: SLUG.test(values.home) ? values.home : null,
    agent_slug: SLUG.test(values.agent) ? values.agent : null,
  });

  if (!result.ok) {
    const site = await getSite();
    return {
      status: "error",
      formError: `Sorry, your message didn’t send. Please try again, or call us on ${site.phone}.`,
      values,
    };
  }
  return { status: "sent" };
}
