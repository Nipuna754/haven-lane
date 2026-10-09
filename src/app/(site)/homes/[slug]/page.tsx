import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge/Badge";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { ListingCard } from "@/components/ListingCard/ListingCard";
import { HomesMap } from "@/components/Map/HomesMap";
import { Photo } from "@/components/Photo/Photo";
import { EnquiryForm } from "@/components/property/EnquiryForm";
import { Gallery } from "@/components/property/Gallery";
import { StickyBar } from "@/components/property/StickyBar";
import styles from "@/components/property/property.module.css";
import { formatShortPrice } from "@/content/filters";
import { getAgent, getAgents, getHome, getHomes, getNeighbourhoods } from "@/content/data";
import { formatPrice, phoneHref, statusLabel } from "@/content/format";

// Listings that exist at build time are pre-rendered; ones added in Sanity
// later are rendered on first visit. Unknown addresses show the 404 page.
export async function generateStaticParams() {
  return (await getHomes()).map((h) => ({ slug: h.slug }));
}

export async function generateMetadata(props: PageProps<"/homes/[slug]">): Promise<Metadata> {
  const home = await getHome((await props.params).slug);
  if (!home) return {};
  return {
    title: `${home.address}, ${home.areaName}`,
    description: `${statusLabel(home)}: ${formatPrice(home)}. ${home.beds} beds, ${home.baths} baths, ${home.sqft.toLocaleString("en-US")} sq ft. ${home.summary}`,
  };
}

/* Rough monthly cost for a purchase: 20% down, 6.5% fixed over 30 years, plus tax and insurance */
function monthlyEstimate(price: number) {
  const loan = price * 0.8;
  const r = 0.065 / 12;
  const n = 360;
  const principalAndInterest = (loan * r) / (1 - Math.pow(1 + r, -n));
  const taxAndInsurance = (price * 0.018) / 12 + 150;
  return Math.round((principalAndInterest + taxAndInsurance) / 10) * 10;
}

export default async function PropertyPage(props: PageProps<"/homes/[slug]">) {
  const home = await getHome((await props.params).slug);
  if (!home) notFound();

  const [homes, neighbourhoods] = await Promise.all([getHomes(), getNeighbourhoods()]);
  const area = neighbourhoods.find((n) => n.slug === home.neighbourhood);
  // Fall back to the first agent if the listing's agent was removed
  const agent = (await getAgent(home.agent)) ?? (await getAgents())[0];
  if (!agent) notFound();
  const firstName = agent.name.split(" ")[0];
  const crumb = { sale: "Buy", rent: "Rent", sold: "Sold" }[home.status];
  const crumbHref = { sale: "/homes", rent: "/homes?status=rent", sold: "/homes?status=sold" }[home.status];

  const facts: [IconName, string, string][] = [
    ["bed", String(home.beds), home.beds === 1 ? "Bedroom" : "Bedrooms"],
    ["bath", String(home.baths), home.baths === 1 ? "Bathroom" : "Bathrooms"],
    ["area", `${home.sqft.toLocaleString("en-US")} sq ft`, "Living area"],
  ];
  if (home.lotSqft) facts.push(["lot", `${home.lotSqft.toLocaleString("en-US")} sq ft`, "Lot size"]);
  if (home.yearBuilt) facts.push(["calendar", String(home.yearBuilt), "Year built"]);

  const similar = homes
    .filter((h) => h.slug !== home.slug && h.status === home.status)
    .sort((a, b) => Number(b.neighbourhood === home.neighbourhood) - Number(a.neighbourhood === home.neighbourhood))
    .slice(0, 3);

  return (
    <main id="main" className={styles.page}>
      <div className={`container ${styles.top}`}>
        <nav aria-label="Breadcrumb">
          <ol className={styles.breadcrumb} role="list">
            <li>
              <Link href={crumbHref}>{crumb}</Link>
            </li>
            <li>
              <Link href={`/homes?${home.status !== "sale" ? `status=${home.status}&` : ""}area=${home.neighbourhood}`}>{home.areaName}</Link>
            </li>
            <li aria-current="page">{home.address}</li>
          </ol>
        </nav>
        <Gallery photos={home.photos} title={home.address} />
      </div>

      <div className={`container ${styles.titleRow}`}>
        <div className={styles.titleBlock}>
          <Badge tone="tint">{statusLabel(home)}</Badge>
          <h1>{home.address}</h1>
          <p className={styles.address}>
            <Icon name="pin" size={18} />
            {home.areaName}, Austin, TX
          </p>
        </div>
        <div className={styles.priceBlock}>
          <p className={styles.price}>{formatPrice(home)}</p>
          {home.status === "sale" && (
            <p className={styles.estimate}>
              Est. ${monthlyEstimate(home.price).toLocaleString("en-US")} / month
              <span className="visually-hidden">: </span>
              <span className={styles.estimateNote}>20% down, 6.5% fixed for 30 years, with tax and insurance</span>
            </p>
          )}
        </div>
      </div>

      <div className="container">
        <dl className={styles.facts}>
          {facts.map(([icon, value, label]) => (
            <div key={label} className={styles.fact}>
              <span className={styles.factIcon} aria-hidden="true">
                <Icon name={icon} size={22} />
              </span>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={`container ${styles.details}`}>
        <div className={styles.mainCol}>
          <section aria-labelledby="about-title" className={styles.block}>
            <h2 id="about-title">About this home</h2>
            {home.description.map((p) => (
              <p key={p.slice(0, 20)} className={styles.body}>
                {p}
              </p>
            ))}
          </section>

          <section aria-labelledby="features-title" className={styles.block}>
            <h2 id="features-title">Features</h2>
            <ul className={styles.features} role="list">
              {home.features.map((f) => (
                <li key={f}>
                  <Icon name="check" size={18} />
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="location-title" className={styles.block}>
            <h2 id="location-title">Location</h2>
            <p className={styles.body}>
              {home.areaName}
              {area?.blurb ? `: ${area.blurb}` : ""}
            </p>
            <div className={styles.mapBox}>
              <HomesMap
                pins={[{ slug: home.slug, address: home.address, label: formatShortPrice(home.price) + (home.status === "rent" ? "/mo" : ""), lat: home.location.lat, lng: home.location.lng }]}
                label={`Map showing ${home.address}`}
                zoom={15}
              />
            </div>
          </section>
        </div>

        <aside id="enquiry" className={styles.side} aria-label={`Contact ${agent.name}`}>
          <div className={styles.enquiry}>
            <div className={styles.agent}>
              <Photo photo={agent.photo} sizes="64px" decorative className={styles.avatar} />
              <div>
                <p className={styles.agentName}>
                  <Link href={`/agents/${agent.slug}`}>{agent.name}</Link>
                </p>
                <p className={styles.agentRole}>
                  Listing agent ·{" "}
                  <a href={phoneHref(agent.phone)}>{agent.phone}</a>
                </p>
              </div>
            </div>
            <EnquiryForm
              homeSlug={home.slug}
              agentSlug={agent.slug}
              agentFirstName={firstName}
              heading={home.status === "sold" ? "Ask about similar homes" : "Request a viewing"}
            />
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className={styles.similar} aria-labelledby="similar-title">
          <div className="container">
            <h2 id="similar-title">Similar homes nearby</h2>
            <ul className={styles.similarGrid} role="list">
              {similar.map((h, i) => (
                <li key={h.slug}>
                  <ListingCard home={h} index={i} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <StickyBar phone={agent.phone} agentName={agent.name} />
    </main>
  );
}
