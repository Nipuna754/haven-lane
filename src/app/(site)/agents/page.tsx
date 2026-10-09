import type { Metadata } from "next";
import { AgentCard } from "@/components/AgentCard/AgentCard";
import styles from "@/components/agents/agents.module.css";
import { getAgents } from "@/content/data";

export const metadata: Metadata = {
  title: "Our agents",
  description: "Meet the Haven Lane agents. Each one lives in the Austin neighbourhoods they sell.",
};

export default async function AgentsPage() {
  const agents = await getAgents();
  return (
    <main id="main" className={`container ${styles.page}`}>
      <div className={styles.head}>
        <h1>Our agents</h1>
        <p className={styles.lead}>Every Haven Lane agent lives in the neighbourhoods they sell, and stays with you from the first viewing to the keys.</p>
      </div>
      <ul className={styles.grid} role="list">
        {agents.map((a, i) => (
          <li key={a.slug}>
            <AgentCard agent={a} index={i} headingLevel={2} />
          </li>
        ))}
      </ul>
    </main>
  );
}
