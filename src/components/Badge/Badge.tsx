import styles from "./Badge.module.css";

/* Listing status label. The word carries the meaning, so colour is never the only signal. */
export function Badge({ children, tone = "light" }: { children: string; tone?: "light" | "tint" }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
