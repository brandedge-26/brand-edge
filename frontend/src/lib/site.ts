import type { Metadata } from "next";

export const SITE_URL = "https://brandedgecreations.pk";
export const SITE_NAME = "Brand Edge Creations";
export const DEFAULT_OG_IMAGE = "/og-image.png";

/**
 * Builds a complete per-page Metadata object (title, description, canonical,
 * Open Graph, Twitter) so every route stays consistent without repeating
 * boilerplate. Every page here is nested under at least one intermediate
 * layout (e.g. services/layout.tsx), and Next.js only carries a title
 * template through segments that re-declare it — so we set `title.absolute`
 * to the fully-suffixed title to sidestep that chain entirely, rather than
 * relying on the root layout's template reaching this deep.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_PK",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
