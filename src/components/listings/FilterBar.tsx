"use client";

import Form from "next/form";
import { useRef, useState, type ChangeEvent } from "react";
import { formatShortPrice, priceOptions, type Filters } from "@/content/filters";
import type { Neighbourhood } from "@/content/types";
import { Icon } from "../Icon/Icon";
import styles from "./listings.module.css";

/*
  The filters are a GET form to /homes. Without JavaScript the Update button
  submits it; with JavaScript, changing any filter updates the results
  straight away (client-side, without jumping to the top of the page).
*/
export function FilterBar({ filters, areas, activeCount }: { filters: Filters; areas: Neighbourhood[]; activeCount: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  const onChange = (e: ChangeEvent<HTMLFormElement>) => {
    const target = e.target as unknown as HTMLInputElement | HTMLSelectElement;
    // Sale prices and rents use different ranges, so clear the price when switching
    if (target.name === "status") {
      const max = formRef.current?.elements.namedItem("max") as HTMLSelectElement | null;
      if (max) max.value = "";
    }
    formRef.current?.requestSubmit();
  };

  const prices = priceOptions[filters.status];

  return (
    <div className={styles.filterBar}>
      <Form ref={formRef} action="/homes" scroll={false} onChange={onChange} className={`container ${styles.filterForm}`} aria-label="Filter homes">
        <fieldset className={styles.segmented}>
          <legend className="visually-hidden">Show homes</legend>
          {[
            ["sale", "Buy"],
            ["rent", "Rent"],
            ["sold", "Sold"],
          ].map(([value, label]) => (
            <label key={value}>
              <input type="radio" name="status" value={value} defaultChecked={filters.status === value} />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>

        <button
          type="button"
          className={styles.filtersToggle}
          aria-expanded={open}
          aria-controls="more-filters"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name="sliders" size={16} />
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>

        <div id="more-filters" className={styles.selects} data-open={open}>
          <label className={styles.select}>
            <span className="visually-hidden">Neighbourhood</span>
            <select name="area" defaultValue={filters.area ?? ""}>
              <option value="">All areas</option>
              {areas.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.name}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={16} />
          </label>

          <label className={styles.select}>
            <span className="visually-hidden">Maximum price</span>
            <select name="max" defaultValue={filters.max ?? ""} key={filters.status}>
              <option value="">Any price</option>
              {prices.map((p) => (
                <option key={p} value={p}>
                  Up to {formatShortPrice(p)}
                  {filters.status === "rent" ? " / mo" : ""}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={16} />
          </label>

          <label className={styles.select}>
            <span className="visually-hidden">Bedrooms</span>
            <select name="beds" defaultValue={filters.beds ?? ""}>
              <option value="">Any beds</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}+ beds
                </option>
              ))}
            </select>
            <Icon name="chevron" size={16} />
          </label>

          <label className={styles.select}>
            <span className="visually-hidden">Property type</span>
            <select name="type" defaultValue={filters.type ?? ""}>
              <option value="">Any type</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>
            <Icon name="chevron" size={16} />
          </label>
        </div>

        <label className={`${styles.select} ${styles.sort}`}>
          <span className={styles.sortLabel}>Sort</span>
          <select name="sort" defaultValue={filters.sort}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
          <Icon name="chevron" size={16} />
        </label>

        {filters.view === "map" && <input type="hidden" name="view" value="map" />}
        {/* Only needed when JavaScript is off; otherwise results update on change */}
        <noscript>
          <button type="submit" className={styles.update}>
            Update results
          </button>
        </noscript>
      </Form>
    </div>
  );
}
