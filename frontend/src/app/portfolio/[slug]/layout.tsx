import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { ALL_PROJECTS } from "@/lib/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = ALL_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return pageMetadata({
      title: "Project Not Found",
      description: "This case study could not be found.",
      path: `/portfolio/${slug}`,
    });
  }

  return pageMetadata({
    title: project.title,
    description: project.overview.length > 160 ? `${project.overview.slice(0, 157)}...` : project.overview,
    path: `/portfolio/${project.slug}`,
    image: project.image,
  });
}

export function generateStaticParams() {
  return ALL_PROJECTS.map((p) => ({ slug: p.slug }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
