import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon/Icon";
import { ListingCard } from "@/components/ListingCard/ListingCard";
import { Photo } from "@/components/Photo/Photo";
import { EnquiryForm } from "@/components/property/EnquiryForm";
import styles from "@/components/agents/agents.module.css";
import { getAgent, getAgents, getHomes } from "@/content/data";
import { phoneHref } from "@/content/format";

export async function generateStaticParams() {
  return (await getAgents()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/agents/[slug]">): Promise<Metadata> {
  const agent = await getAgent((await props.params).slug);
  return agent ? { title: agent.name, description: `${agent.name}, Haven Lane agent for ${agent.area}.` } : {};
}

export default async function AgentPage(props: PageProps<"/agents/[slug]">) {
  const agent = await getAgent((await props.params).slug);
  if (!agent) notFound();
  const listings = (await getHomes()).filter((h) => h.agent === agent.slug && h.status !== "sold");
  const first = agent.name.split(" ")[0];

  return (
    <main id="main">
      <div className={`container ${styles.profile}`}>
        <nav aria-label="Breadcrumb">
          <ol className={styles.breadcrumb} role="list">
            <li>
              <Link href="/agents">Agents</Link>
            </li>
            <li aria-current="page">{agent.name}</li>
          </ol>
        </nav>
        <div className={styles.intro}>
          <Photo photo={agent.photo} sizes="(min-width: 64rem) 360px, 100vw" className={styles.portrait} />
          <div className={styles.introText}>
            <h1>{agent.name}</h1>
            <p className={styles.area}>{agent.area}</p>
            <p className={styles.bio}>{agent.bio}</p>
            <ul className={styles.contact} role="list">
              <li>
                <Icon name="phone" size={18} />
                <a href={phoneHref(agent.phone)}>{agent.phone}</a>
              </li>
              <li>
                <Icon name="mail" size={18} />
                <a href={`mailto:${agent.email}`}>{agent.email}</a>
              </li>
            </ul>
          </div>
          <div className={styles.formCard}>
            <EnquiryForm agentSlug={agent.slug} agentFirstName={first} heading={`Message ${first}`} headingLevel={2} />
          </div>
        </div>
      </div>

      {listings.length > 0 && (
        <section className={styles.listings} aria-labelledby="listings-title">
          <div className="container">
            <h2 id="listings-title">{first}’s homes</h2>
            <ul className={styles.listingGrid} role="list">
              {listings.map((h, i) => (
                <li key={h.slug}>
                  <ListingCard home={h} index={i} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
