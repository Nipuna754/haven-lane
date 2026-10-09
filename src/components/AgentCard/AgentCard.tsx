import Link from "next/link";
import type { CSSProperties } from "react";
import type { Agent } from "@/content/types";
import { Icon } from "../Icon/Icon";
import { Photo } from "../Photo/Photo";
import styles from "./AgentCard.module.css";
import { phoneHref } from "@/content/format";

export function AgentCard({ agent, index = 0, headingLevel = 3 }: { agent: Agent; index?: number; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as const;
  const tel = phoneHref(agent.phone);
  return (
    <article className={styles.card} data-reveal style={{ "--i": index } as CSSProperties}>
      <Photo photo={agent.photo} sizes="(min-width: 64rem) 280px, 60vw" decorative className={styles.photo} />
      <div className={styles.body}>
        <Heading className={styles.name}>
          <Link href={`/agents/${agent.slug}`} className={styles.nameLink}>
            {agent.name}
          </Link>
        </Heading>
        <p className={styles.area}>{agent.area}</p>
        <a className={styles.phone} href={tel}>
          <Icon name="phone" size={16} />
          <span>
            <span className="visually-hidden">Call {agent.name} on </span>
            {agent.phone}
          </span>
        </a>
      </div>
    </article>
  );
}
