import type { Metadata } from "next";
import { Icon } from "@/components/Icon/Icon";
import { EnquiryForm } from "@/components/property/EnquiryForm";
import { getSite } from "@/content/data";
import { phoneHref } from "@/content/format";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, email or visit the Haven Lane office in East Austin, or send us a message.",
};

export default async function ContactPage() {
  const site = await getSite();
  return (
    <main id="main" className={`container ${styles.page}`}>
      <div className={styles.details}>
        <h1>Talk to an agent</h1>
        <p className={styles.lead}>Call, email or drop in. We reply to every message within one working day.</p>
        <ul className={styles.list} role="list">
          <li>
            <Icon name="phone" />
            <a href={phoneHref(site.phone)}>{site.phone}</a>
          </li>
          <li>
            <Icon name="mail" />
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            <Icon name="pin" />
            <span>{site.address}</span>
          </li>
          <li>
            <Icon name="calendar" />
            <span>{site.hours}</span>
          </li>
        </ul>
      </div>
      <div className={styles.formCard}>
        <EnquiryForm agentFirstName="our team" heading="Send us a message" headingLevel={2} submitLabel="Send message" />
      </div>
    </main>
  );
}
