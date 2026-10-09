import "../globals.css";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { SiteNav } from "@/components/SiteNav/SiteNav";
import { getSite } from "@/content/data";

/* Menu bar and footer for every public page. */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const site = await getSite();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteNav phone={site.phone} />
      {children}
      <SiteFooter />
    </>
  );
}
