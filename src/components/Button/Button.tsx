import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "accent" | "light";
type Common = { variant?: Variant; full?: boolean; className?: string; children: ReactNode };

type AsLink = Common & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

/* Buttons from the Figma components: primary (navy), secondary (outline), accent (coral). */
export function Button({ variant = "primary", full, className, children, ...rest }: AsLink | AsButton) {
  const cls = [styles.button, styles[variant], full && styles.full, className].filter(Boolean).join(" ");

  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link {...(rest as Omit<AsLink, keyof Common>)} className={cls}>
        {children}
      </Link>
    );
  }
  const buttonProps = rest as Omit<AsButton, keyof Common>;
  return (
    <button type="button" {...buttonProps} className={cls}>
      {children}
    </button>
  );
}
