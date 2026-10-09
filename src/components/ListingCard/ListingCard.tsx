import Link from "next/link";
import type { CSSProperties } from "react";
import { formatPrice, statusLabel } from "@/content/format";
import type { Home } from "@/content/types";
import { Badge } from "../Badge/Badge";
import { Icon } from "../Icon/Icon";
import { Photo } from "../Photo/Photo";
import { SaveButton } from "./SaveButton";
import styles from "./ListingCard.module.css";

/*
  Listing card from the Figma component. The address is the link; it
  stretches over the whole card, so the card is one click target while the
  save button stays separately clickable.
*/
export function ListingCard({
  home,
  index = 0,
  headingLevel = 3,
  sizes = "(min-width: 64rem) 380px, (min-width: 40rem) 50vw, 100vw",
}: {
  home: Home;
  index?: number;
  headingLevel?: 2 | 3;
  sizes?: string;
}) {
  const Heading = `h${headingLevel}` as const;
  const area = home.areaName;
  const baths = `${home.baths} ${home.baths === 1 ? "bath" : "baths"}`;

  return (
    <article className={styles.card} data-reveal style={{ "--i": index % 3 } as CSSProperties}>
      <div className={styles.media}>
        <Photo photo={home.photos[0]} sizes={sizes} decorative className={styles.photo} />
        <span className={styles.badge}>
          <Badge>{statusLabel(home)}</Badge>
        </span>
        <SaveButton address={home.address} />
      </div>
      <div className={styles.body}>
        <Heading className={styles.address}>
          <Link href={`/homes/${home.slug}`} className={styles.link}>
            {home.address}
          </Link>
        </Heading>
        <p className={styles.price}>{formatPrice(home)}</p>
        <p className={styles.area}>{area}, Austin</p>
        <ul className={styles.facts} role="list">
          <li>
            <Icon name="bed" size={18} />
            {home.beds} {home.beds === 1 ? "bed" : "beds"}
          </li>
          <li>
            <Icon name="bath" size={18} />
            {baths}
          </li>
          <li>
            <Icon name="area" size={18} />
            {home.sqft.toLocaleString("en-US")} sq ft
          </li>
        </ul>
      </div>
    </article>
  );
}
