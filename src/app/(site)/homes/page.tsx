import type { Metadata } from "next";
import Link from "next/link";
import { ListingCard } from "@/components/ListingCard/ListingCard";
import { FilterBar } from "@/components/listings/FilterBar";
import { HomesMap } from "@/components/Map/HomesMap";
import { Icon } from "@/components/Icon/Icon";
import styles from "@/components/listings/listings.module.css";
import { applyFilters, filtersToHref, formatShortPrice, parseFilters, type Filters } from "@/content/filters";
import { getHomes, getNeighbourhoods } from "@/content/data";
import type { Neighbourhood } from "@/content/types";

const titles = { sale: "Homes for sale", rent: "Homes to rent", sold: "Recently sold" };

export async function generateMetadata(props: PageProps<"/homes">): Promise<Metadata> {
  const f = parseFilters(await props.searchParams);
  const area = f.area ? (await getNeighbourhoods()).find((n) => n.slug === f.area)?.name : undefined;
  return {
    title: `${titles[f.status]} in ${area ?? "Austin"}`,
    description: `Browse ${titles[f.status].toLowerCase()} in ${area ?? "Austin"} with Haven Lane Realty.`,
  };
}

/* Each active filter becomes a removable chip */
function activeChips(f: Filters, areas: Neighbourhood[]) {
  const chips: { label: string; href: string }[] = [];
  const without = (patch: Partial<Filters>) => filtersToHref({ ...f, ...patch });
  if (f.area) chips.push({ label: areas.find((n) => n.slug === f.area)?.name ?? f.area, href: without({ area: undefined }) });
  if (f.max) chips.push({ label: `Up to ${formatShortPrice(f.max)}${f.status === "rent" ? " / mo" : ""}`, href: without({ max: undefined }) });
  if (f.beds) chips.push({ label: `${f.beds}+ beds`, href: without({ beds: undefined }) });
  if (f.baths) chips.push({ label: `${f.baths}+ baths`, href: without({ baths: undefined }) });
  if (f.type) chips.push({ label: f.type[0].toUpperCase() + f.type.slice(1), href: without({ type: undefined }) });
  return chips;
}

export default async function HomesPage(props: PageProps<"/homes">) {
  const filters = parseFilters(await props.searchParams);
  const [homes, neighbourhoods] = await Promise.all([getHomes(), getNeighbourhoods()]);
  const results = applyFilters(homes, filters);
  const chips = activeChips(filters, neighbourhoods);
  const area = filters.area ? neighbourhoods.find((n) => n.slug === filters.area)?.name : undefined;
  const heading = `${titles[filters.status]} in ${area ?? "Austin"}`;
  const crumb = { sale: "Buy", rent: "Rent", sold: "Sold" }[filters.status];
  const pins = results.map((h) => ({
    slug: h.slug,
    address: h.address,
    label: formatShortPrice(h.price) + (h.status === "rent" ? "/mo" : ""),
    lat: h.location.lat,
    lng: h.location.lng,
  }));
  const isMap = filters.view === "map";

  return (
    <main id="main" className={styles.page}>
      <div className={`container ${styles.head}`}>
        <nav aria-label="Breadcrumb">
          <ol className={styles.breadcrumb} role="list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-current="page">{crumb}</li>
          </ol>
        </nav>
        <h1>{heading}</h1>
        <p className={styles.count} role="status">
          {results.length} {results.length === 1 ? "home" : "homes"}
          {chips.length > 0 ? " match your filters" : ""}
        </p>
      </div>

      <FilterBar key={filtersToHref(filters)} filters={filters} areas={neighbourhoods} activeCount={chips.length} />

      {chips.length > 0 && (
        <div className={`container ${styles.chips}`}>
          <ul role="list" aria-label="Active filters">
            {chips.map((c) => (
              <li key={c.label}>
                <Link href={c.href} scroll={false} className={styles.chip} aria-label={`Remove filter: ${c.label}`}>
                  {c.label}
                  <Icon name="close" size={14} />
                </Link>
              </li>
            ))}
          </ul>
          <Link href={filtersToHref({ status: filters.status, sort: filters.sort, view: filters.view })} scroll={false} className={styles.clear}>
            Clear all
          </Link>
        </div>
      )}

      <div className={`container ${styles.results}`} data-view={filters.view}>
        <section className={styles.list} aria-label="Results">
          {results.length > 0 ? (
            <ul className={styles.grid} role="list">
              {results.map((h, i) => (
                <li key={h.slug}>
                  <ListingCard home={h} index={i % 2} headingLevel={2} sizes="(min-width: 64rem) 370px, (min-width: 40rem) 50vw, 100vw" />
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <h2>No homes match these filters</h2>
              <p>Try a wider price range or another neighbourhood.</p>
              <Link href={filtersToHref({ status: filters.status })} className={styles.emptyLink}>
                Clear all filters
              </Link>
            </div>
          )}
        </section>

        <div className={styles.mapPanel}>
          <HomesMap pins={pins} label={`Map of ${results.length} ${heading.toLowerCase()}`} />
        </div>
      </div>

      {/* Phones: switch between the list and the map */}
      <Link href={filtersToHref({ ...filters, view: isMap ? "grid" : "map" })} scroll={false} className={styles.viewSwitch}>
        <Icon name={isMap ? "grid" : "map"} size={18} />
        {isMap ? "Show list" : "Show map"}
      </Link>
    </main>
  );
}
