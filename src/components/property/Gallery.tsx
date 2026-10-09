"use client";

import { useEffect, useRef, useState } from "react";
import type { Photo as PhotoType } from "@/content/types";
import { Icon } from "../Icon/Icon";
import { Photo } from "../Photo/Photo";
import styles from "./property.module.css";

/*
  Desktop: one large photo and four small ones. Phones: swipe through, with a
  counter. Any photo opens the viewer (a native <dialog>): arrow keys move
  between photos, Escape closes it, and focus returns to where it was.
*/
export function Gallery({ photos, title }: { photos: PhotoType[]; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stripRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [stripIndex, setStripIndex] = useState(0);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const step = (d: number) => setIndex((i) => (i + d + photos.length) % photos.length);

  // Track which photo is showing in the phone swipe strip
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const onScroll = () => setStripIndex(Math.round(strip.scrollLeft / Math.max(strip.clientWidth, 1)));
    strip.addEventListener("scroll", onScroll, { passive: true });
    return () => strip.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.gallery}>
      {/* Desktop grid */}
      <div className={styles.grid}>
        {photos.slice(0, 5).map((p, i) => (
          <button key={i} type="button" className={i === 0 ? styles.main : styles.thumb} onClick={() => open(i)} aria-label={`View photo ${i + 1} of ${photos.length}: ${p.alt}`}>
            <Photo photo={p} sizes={i === 0 ? "(min-width: 64rem) 790px, 100vw" : "200px"} preload={i === 0} decorative />
          </button>
        ))}
        <button type="button" className={styles.allPhotos} onClick={() => open(0)}>
          <Icon name="images" size={16} />
          All {photos.length} photos
        </button>
      </div>

      {/* Phone swipe strip */}
      <div className={styles.stripWrap}>
        <ul ref={stripRef} className={styles.strip} role="list" aria-label={`Photos of ${title}`}>
          {photos.map((p, i) => (
            <li key={i}>
              <button type="button" onClick={() => open(i)} aria-label={`View photo ${i + 1} of ${photos.length}: ${p.alt}`}>
                <Photo photo={p} sizes="100vw" preload={i === 0} decorative />
              </button>
            </li>
          ))}
        </ul>
        <span className={styles.counter} aria-hidden="true">
          {stripIndex + 1} / {photos.length}
        </span>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.viewer}
        aria-label={`Photos of ${title}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close(); // click on the backdrop
        }}
      >
        <div className={styles.viewerInner}>
          <div className={styles.viewerBar}>
            <p aria-live="polite">
              Photo {index + 1} of {photos.length}
              <span className={styles.viewerCaption}>{photos[index].alt}</span>
            </p>
            <button type="button" className={styles.viewerClose} onClick={() => dialogRef.current?.close()} autoFocus>
              <Icon name="close" size={18} />
              Close
            </button>
          </div>
          <div className={styles.viewerStage}>
            <Photo photo={photos[index]} sizes="90vw" className={styles.viewerPhoto} />
            <button type="button" className={`${styles.viewerNav} ${styles.prev}`} onClick={() => step(-1)} aria-label="Previous photo">
              <Icon name="back" size={22} />
            </button>
            <button type="button" className={`${styles.viewerNav} ${styles.next}`} onClick={() => step(1)} aria-label="Next photo">
              <Icon name="back" size={22} className={styles.flip} />
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
