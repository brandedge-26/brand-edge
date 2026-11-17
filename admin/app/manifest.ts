import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Brand Edge Admin",
    short_name: "BE Admin",
    description: "Brand Edge Admin Dashboard",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0d0d0d",
    theme_color: "#ff6a00",
    icons: [
      { src: "/icons/192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
