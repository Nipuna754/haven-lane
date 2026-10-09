import { Fragment, type CSSProperties } from "react";
import { pexelsSrc } from "@/content/photos";
import { HeroMedia } from "./HeroMedia";
import { SearchPanel } from "./SearchPanel";
import styles from "./home.module.css";

// The last two words are picked out in coral
const headline = "Find the home that fits the way you live.".split(" ");
const EMPHASIS_FROM = headline.length - 2;

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.heroInner}`}>
        <p className={styles.heroKicker}>Austin estate agents since 2009</p>
        <h1 id="hero-title" className={styles.heroTitle}>
          {headline.map((word, i) => {
            const span = (
              <span className={styles.word} style={{ "--w": i } as CSSProperties}>
                {word}
              </span>
            );
            return (
              <Fragment key={i}>
                {i >= EMPHASIS_FROM ? <em>{span}</em> : span}
                {i < headline.length - 1 && " "}
              </Fragment>
            );
          })}
        </h1>
        <p className={styles.heroText}>Homes for sale and rent across Austin, from Hyde Park bungalows to East Side lofts.</p>
        <SearchPanel />
      </div>
      <div className={`container ${styles.heroFrame}`}>
        <HeroMedia still={{ src: pexelsSrc("hero"), alt: "", tone: "#a9c3df" }} />
      </div>
    </section>
  );
}
