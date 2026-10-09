"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { phoneHref } from "@/content/format";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { Logo } from "../Logo/Logo";
import styles from "./SiteNav.module.css";

const links = [
  { href: "/homes", label: "Buy" },
  { href: "/homes?status=rent", label: "Rent" },
  { href: "/#sell", label: "Sell" },
  { href: "/#neighbourhoods", label: "Neighbourhoods" },
  { href: "/agents", label: "Agents" },
];

/* Sticky menu bar. On small screens the links fold behind a Menu button. */
export function SiteNav({ phone }: { phone: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Close the menu on Escape (links close it on click)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={styles.header}>
      <nav className={`container ${styles.nav}`} aria-label="Main">
        <Link href="/" className={styles.brand} onClick={close}>
          <Logo />
          <span className="visually-hidden">, home</span>
        </Link>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} size={18} />
          {open ? "Close" : "Menu"}
        </button>

        <div id="site-menu" className={styles.menu} data-open={open}>
          <ul className={styles.links} role="list">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={styles.link} onClick={close}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            <a className={styles.phone} href={phoneHref(phone)}>
              <Icon name="phone" size={16} />
              {phone}
            </a>
            <Button href="/contact" onClick={close}>
              Book a viewing
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
