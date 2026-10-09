import Image from "next/image";
import type { Photo as PhotoType } from "@/content/types";
import styles from "./Photo.module.css";

/*
  A photo slot. With a src it renders next/image (resized and lazy-loaded);
  without one it shows the placeholder colour from the Figma file, so the
  layout is final before the real photos arrive.
*/
export function Photo({
  photo,
  sizes,
  preload,
  className,
  decorative,
}: {
  photo: PhotoType;
  sizes: string;
  preload?: boolean;
  className?: string;
  /** True when nearby text already says what the photo shows */
  decorative?: boolean;
}) {
  return (
    <div className={`${styles.photo} ${className ?? ""}`} style={{ backgroundColor: photo.tone }}>
      {photo.src ? (
        <Image src={photo.src} alt={decorative ? "" : photo.alt} fill sizes={sizes} preload={preload} className={styles.img} />
      ) : (
        !decorative && <span className="visually-hidden">{photo.alt}</span>
      )}
    </div>
  );
}
