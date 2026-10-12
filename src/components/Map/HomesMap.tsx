"use client";

import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import styles from "./HomesMap.module.css";

export type MapPin = { slug: string; label: string; address: string; lat: number; lng: number };

/*
  Map of homes with price pins (Leaflet + OpenStreetMap data, CARTO light tiles).
  Leaflet needs the browser, so it loads after the page renders. Each pin is a
  keyboard-focusable button named with the address and price; Enter opens the home.
  The list of homes stays the main way to browse; the map is extra.
*/
export function HomesMap({ pins, label, zoom }: { pins: MapPin[]; label: string; zoom?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const key = pins.map((p) => p.slug).join(",");

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    let fit: (() => void) | undefined;

    import("leaflet").then((L) => {
      if (cancelled || !ref.current) return;
      map = L.map(ref.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
      // OpenStreetMap's own tiles: free, no key (CARTO's now require one). Fine for a
      // low-traffic demo under OSM's tile policy; switch to a paid tile service for real traffic.
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Position the map first; Leaflet only creates pin elements once it has a view
      const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number]));
      fit = () => {
        if (!map) return;
        if (pins.length === 1) map.setView([pins[0].lat, pins[0].lng], zoom ?? 15);
        else if (pins.length > 1) map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
        else map.setView([30.2747, -97.7404], 12); // Austin
      };
      fit();

      // The map can start hidden (list view on phones); re-measure and re-fit when it's shown or resized
      observer = new ResizeObserver(() => {
        if (!map || !ref.current?.offsetWidth) return;
        map.invalidateSize();
        fit?.();
      });
      observer.observe(ref.current);

      for (const p of pins) {
        const icon = L.divIcon({ className: styles.pinWrap, html: `<span class="${styles.pin}">${p.label}</span>`, iconSize: undefined });
        const marker = L.marker([p.lat, p.lng], { icon, keyboard: true, riseOnHover: true }).addTo(map);
        marker.on("click", () => router.push(`/homes/${p.slug}`));
        const el = marker.getElement();
        el?.setAttribute("aria-label", `${p.address}, ${p.label}`);
        el?.setAttribute("role", "link");
        el?.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            router.push(`/homes/${p.slug}`);
          }
        });
      }
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      map?.remove();
    };
    // re-create the map only when the set of pins changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return <div ref={ref} className={styles.map} role="region" aria-label={label} />;
}
