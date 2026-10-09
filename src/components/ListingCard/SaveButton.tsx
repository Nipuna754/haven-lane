"use client";

import { useState } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./ListingCard.module.css";

/* Heart toggle. Saved state is local for now; it can be stored per visitor later. */
export function SaveButton({ address }: { address: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      type="button"
      className={styles.save}
      aria-pressed={saved}
      aria-label={`Save ${address}`}
      onClick={() => setSaved((s) => !s)}
    >
      <Icon name="heart" size={18} />
    </button>
  );
}
