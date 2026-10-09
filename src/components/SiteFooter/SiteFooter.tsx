import Link from "next/link";
import { getSite } from "@/content/data";
import { phoneHref } from "@/content/format";
import styles from "./SiteFooter.module.css";

const columns = [
  { title: "Homes", links: [["Buy", "/homes"], ["Rent", "/homes?status=rent"], ["Sold", "/homes?status=sold"]] },
  { title: "Company", links: [["Our agents", "/agents"], ["Sell with us", "/#sell"], ["Neighbourhoods", "/#neighbourhoods"]] },
];

export async function SiteFooter() {
  const site = await getSite();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.name}>Haven Lane</p>
            <p className={styles.text}>
              Homes for sale and rent across Austin.
              <br />
              {site.address}
            </p>
          </div>
          <div className={styles.columns}>
            {columns.map((c) => (
              <div key={c.title} className={styles.column}>
                <h2 className={styles.title}>{c.title}</h2>
                <ul role="list">
                  {c.links.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className={styles.link}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className={styles.column}>
              <h2 className={styles.title}>Contact</h2>
              <ul role="list">
                <li>
                  <a href={phoneHref(site.phone)} className={styles.link}>{site.phone}</a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className={styles.link}>{site.email}</a>
                </li>
                <li className={styles.text}>{site.hours}</li>
              </ul>
            </div>
          </div>
        </div>
        <p className={styles.small}>
          Haven Lane Realty is a fictional agency for a portfolio project. Photos from Pexels. © 2026
        </p>
      </div>
    </footer>
  );
}
