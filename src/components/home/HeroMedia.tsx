"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import type { Photo as PhotoType } from "@/content/types";
import { Icon } from "../Icon/Icon";
import { Photo } from "../Photo/Photo";
import styles from "./home.module.css";

/*
  Hero background. Shows the still photo first; when a video is supplied it
  plays muted on top, with a Pause button (moving content needs a way to stop
  it). Visitors who prefer reduced motion get the still photo only.
*/
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

export function HeroMedia({ still, videoSrc }: { still: PhotoType; videoSrc?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // false on the server, so the still photo is always the first thing painted
  const allowMotion = useSyncExternalStore(subscribe, () => window.matchMedia(MOTION_QUERY).matches, () => false);

  const showVideo = Boolean(videoSrc) && allowMotion;

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  return (
    <div className={styles.heroMedia}>
      <Photo photo={still} sizes="100vw" preload decorative className={styles.heroStill} />
      {showVideo && (
        <>
          <video
            ref={ref}
            className={styles.heroVideo}
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
          <button type="button" className={styles.videoControl} onClick={toggle}>
            <Icon name={playing ? "pause" : "play"} size={16} />
            {playing ? "Pause video" : "Play video"}
          </button>
        </>
      )}
    </div>
  );
}
