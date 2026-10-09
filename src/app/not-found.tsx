import "./globals.css";
import { NotFound } from "@/components/NotFound/NotFound";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { SiteNav } from "@/components/SiteNav/SiteNav";
import { getSite } from "@/content/data";

/* Addresses that match no page at all. Same look as the site's other pages. */
export default async function RootNotFound() {
  const site = await getSite();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteNav phone={site.phone} />
      <NotFound />
      <SiteFooter />
    </>
  );
}
