"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendEnquiry, type EnquiryState } from "@/app/actions";
import { Icon } from "../Icon/Icon";
import styles from "./property.module.css";

type Props = {
  homeSlug?: string;
  agentSlug?: string;
  /** Who replies, e.g. "Maya" or "our team" */
  agentFirstName: string;
  heading: string;
  idPrefix?: string;
  headingLevel?: 2 | 3;
  submitLabel?: string;
};

/*
  Viewing request form. Errors are listed at the top (and focused) and
  shown under each field, linked with aria-describedby so screen readers
  read them with the field. Saved to Supabase by sendEnquiry.
*/
export function EnquiryForm({ homeSlug, agentSlug, agentFirstName, heading, idPrefix = "enq", headingLevel = 3, submitLabel = "Request a viewing" }: Props) {
  const H = `h${headingLevel}` as "h2" | "h3";
  const [state, action, pending] = useActionState<EnquiryState, FormData>(sendEnquiry, { status: "idle" });
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const id = (f: string) => `${idPrefix}-${f}`;
  const err = state.status === "error" ? state.errors ?? {} : {};
  const v = state.values ?? {};

  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
    if (state.status === "sent") doneRef.current?.focus();
  }, [state]);

  if (state.status === "sent") {
    return (
      <div ref={doneRef} tabIndex={-1} className={styles.sent} role="status">
        <span className={styles.sentIcon}>
          <Icon name="check" size={22} />
        </span>
        <H>Request sent</H>
        <p>
          Thanks. {agentFirstName[0].toUpperCase() + agentFirstName.slice(1)} will reply within one working day{homeSlug ? " to arrange a time" : ""}.
        </p>
      </div>
    );
  }

  const describedBy = (f: keyof NonNullable<EnquiryState["errors"]>, hint?: string) =>
    [hint, err[f] ? id(`${f}-error`) : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <form action={action} className={styles.form} noValidate aria-labelledby={id("title")}>
      <H id={id("title")} className={styles.formTitle}>
        {heading}
      </H>

      {state.status === "error" && (
        <div ref={summaryRef} tabIndex={-1} className={styles.summary} role="alert">
          <p>{state.formError ?? "Please check the highlighted fields."}</p>
        </div>
      )}

      {homeSlug && <input type="hidden" name="home" value={homeSlug} />}
      {agentSlug && <input type="hidden" name="agent" value={agentSlug} />}

      {/* Spam trap: hidden from people, but simple bots fill it in */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor={id("company")}>Company</label>
        <input id={id("company")} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className={styles.when}>
        <legend>When suits you?</legend>
        {["Weekdays", "Weekends", "Any time"].map((w, i) => (
          <label key={w}>
            <input type="radio" name="when" value={w} defaultChecked={v.when ? v.when === w : i === 2} />
            <span>{w}</span>
          </label>
        ))}
      </fieldset>

      <div className={styles.field}>
        <label htmlFor={id("name")}>Full name</label>
        <input id={id("name")} name="name" autoComplete="name" defaultValue={v.name} aria-invalid={!!err.name} aria-describedby={describedBy("name")} required />
        {err.name && <p id={id("name-error")} className={styles.error}>{err.name}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor={id("email")}>Email</label>
        <input id={id("email")} name="email" type="email" autoComplete="email" defaultValue={v.email} aria-invalid={!!err.email} aria-describedby={describedBy("email")} required />
        {err.email && <p id={id("email-error")} className={styles.error}>{err.email}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor={id("phone")}>
          Phone <span className={styles.optional}>(optional)</span>
        </label>
        <input id={id("phone")} name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} aria-invalid={!!err.phone} aria-describedby={describedBy("phone")} />
        {err.phone && <p id={id("phone-error")} className={styles.error}>{err.phone}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor={id("message")}>
          Message <span className={styles.optional}>(optional)</span>
        </label>
        <textarea id={id("message")} name="message" rows={4} defaultValue={v.message} aria-invalid={!!err.message} aria-describedby={describedBy("message")} />
        {err.message && <p id={id("message-error")} className={styles.error}>{err.message}</p>}
      </div>

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Sending…" : submitLabel}
      </button>
      <p className={styles.note}>We reply within one working day. Your details go only to {agentFirstName}.</p>
    </form>
  );
}
