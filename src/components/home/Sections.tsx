import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { getAgents, getHomes, getNeighbourhoods } from "@/content/data";
import { AgentCard } from "../AgentCard/AgentCard";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { ListingCard } from "../ListingCard/ListingCard";
import { Photo } from "../Photo/Photo";
import styles from "./home.module.css";

function SectionHead({ id, kicker, title, intro, action }: { id: string; kicker?: string; title: string; intro?: string; action?: ReactNode }) {
  return (
    <div className={styles.sectionHead}>
      <div className={styles.headText}>
        {kicker && <p className={styles.kicker}>{kicker}</p>}
        <h2 id={id} className={styles.unmask}>
          {title}
        </h2>
        {intro && <p className={styles.intro}>{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stats() {
  const stats = [
    ["Since 2009", "Selling homes in Austin"],
    ["14 local agents", "Each one lives where they sell"],
    ["6 neighbourhoods", "From Hyde Park to Mueller"],
    ["One flat fee", "2.5%, agreed before we start"],
  ];
  return (
    <section className={styles.stats} aria-label="Haven Lane at a glance">
      <ul className={`container ${styles.statsList}`} role="list">
        {stats.map(([n, l]) => (
          <li key={n}>
            <p className={styles.statNumber}>{n}</p>
            <p className={styles.statLabel}>{l}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function Featured() {
  // Homes marked "Show on the home page" first, topped up with the newest listings
  const homes = (await getHomes()).filter((h) => h.status !== "sold");
  const featured = [...homes.filter((h) => h.featured), ...homes.filter((h) => !h.featured)].slice(0, 3);
  return (
    <section className={styles.section} aria-labelledby="featured-title">
      <div className="container">
        <SectionHead
          id="featured-title"
          kicker="New this week"
          title="Featured homes"
          action={
            <Button href="/homes" variant="secondary" className={styles.headAction}>
              View all homes
            </Button>
          }
        />
        <ul className={styles.cardGrid} role="list">
          {featured.map((h, i) => (
            <li key={h.slug}>
              <ListingCard home={h} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function Neighbourhoods() {
  const neighbourhoods = await getNeighbourhoods();
  return (
    <section id="neighbourhoods" className={`${styles.section} ${styles.white}`} aria-labelledby="areas-title">
      <div className="container">
        <SectionHead id="areas-title" title="Browse by neighbourhood" intro="The Austin neighbourhoods our agents know street by street." />
      </div>
      <ul className={`container ${styles.tiles}`} role="list">
        {neighbourhoods.slice(0, 4).map((n, i) => (
          <li key={n.slug} data-reveal style={{ "--i": i } as CSSProperties}>
            <Link href={`/homes?area=${n.slug}`} className={styles.tile}>
              <Photo photo={n.photo} sizes="(min-width: 64rem) 285px, 70vw" decorative className={styles.tilePhoto} />
              <span className={styles.tileText}>
                <span className={styles.tileName}>{n.name}</span>
                <span className={styles.tileBlurb}>{n.blurb}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Why() {
  const points = [
    ["Local knowledge", "Every agent lives in the neighbourhoods they sell, so they know the schools, the traffic and which streets flood."],
    ["Clear pricing", "One flat fee of 2.5%, agreed in writing before we list your home. No surprises at closing."],
    ["One agent, start to finish", "The person who shows you round is the person who negotiates and hands you the keys."],
  ];
  return (
    <section className={styles.section} aria-labelledby="why-title">
      <div className={`container ${styles.why}`}>
        <Photo photo={{ alt: "A Haven Lane agent showing a couple round a sunny kitchen", tone: "#bfd3e8" }} sizes="(min-width: 64rem) 560px, 100vw" className={styles.whyPhoto} />
        <div className={styles.whyCopy}>
          <h2 id="why-title" className={styles.unmask}>
            An agent who knows the street, not just the postcode.
          </h2>
          <ul className={styles.points} role="list">
            {points.map(([h, b], i) => (
              <li key={h} className={styles.point} data-reveal style={{ "--i": i } as CSSProperties}>
                <span className={styles.pointIcon}>
                  <Icon name="check" size={18} />
                </span>
                <span>
                  <strong className={styles.pointTitle}>{h}</strong>
                  <span className={styles.pointText}>{b}</span>
                </span>
              </li>
            ))}
          </ul>
          <Button href="/agents">Meet the team</Button>
        </div>
      </div>
    </section>
  );
}

export async function Agents() {
  const agents = await getAgents();
  return (
    <section id="agents" className={`${styles.section} ${styles.white}`} aria-labelledby="agents-title">
      <div className="container">
        <SectionHead id="agents-title" title="Meet our agents" />
      </div>
      <ul className={`container ${styles.agentRow}`} role="list">
        {agents.map((a, i) => (
          <li key={a.slug}>
            <AgentCard agent={a} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Reviews() {
  const reviews = [
    ["Maya found us a house in Hyde Park two weeks before it went on the market. She knew the street because she lives on it.", "Buyers in Hyde Park"],
    ["We sold in nine days for more than the asking price, and the fee was exactly what we agreed at the start.", "Sellers in Travis Heights"],
  ];
  return (
    <section className={styles.section} aria-labelledby="reviews-title">
      <div className="container">
        <SectionHead id="reviews-title" title="What clients say" intro="Example reviews written for this demo site." />
        <ul className={styles.quotes} role="list">
          {reviews.map(([q, who], i) => (
            <li key={who} data-reveal style={{ "--i": i } as CSSProperties}>
              <figure className={styles.quote}>
                <blockquote>
                  <p>“{q}”</p>
                </blockquote>
                <figcaption>Example review · {who}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ValuationCta() {
  return (
    <section id="sell" className={styles.ctaSection} aria-labelledby="sell-title">
      <div className="container">
        <div className={styles.cta} data-reveal>
          <div className={styles.ctaText}>
            <h2 id="sell-title">Thinking of selling?</h2>
            <p>Get a free, no-obligation valuation from an agent who knows your street.</p>
          </div>
          <div className={styles.ctaButtons}>
            <Button href="/contact?topic=valuation" variant="accent">
              Get a free valuation
            </Button>
            <Button href="/contact" variant="secondary">
              Talk to an agent
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
