import styles from "./Logo.module.css";

/* The Haven Lane mark and wordmark, as in the Figma "Logo" component. */
export function Logo({ tone = "brand" }: { tone?: "brand" | "light" }) {
  return (
    <span className={`${styles.logo} ${styles[tone]}`}>
      <svg className={styles.mark} width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" focusable="false">
        <rect width="34" height="34" rx="9" fill="currentColor" />
        <path d="M9.5 17.5 17 11l7.5 6.5M12.5 16v8.5h9V16" fill="none" stroke="var(--logo-roof)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17" cy="20" r="1.8" fill="var(--color-coral)" />
      </svg>
      <span className={styles.word}>Haven Lane</span>
    </span>
  );
}
