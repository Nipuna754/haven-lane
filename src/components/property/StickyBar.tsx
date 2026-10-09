import { Icon } from "../Icon/Icon";
import styles from "./property.module.css";
import { phoneHref } from "@/content/format";

/* Phones: call and request buttons stay at the bottom of the screen. */
export function StickyBar({ phone, agentName }: { phone: string; agentName: string }) {
  return (
    <div className={styles.sticky}>
      <a className={styles.call} href={phoneHref(phone)} aria-label={`Call ${agentName}`}>
        <Icon name="phone" size={20} />
      </a>
      <a className={styles.stickyCta} href="#enquiry">
        Request a viewing
      </a>
    </div>
  );
}
