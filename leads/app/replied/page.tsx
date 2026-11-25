"use client";

import LeadsTable from "@/components/LeadsTable";

export default function RepliedPage() {
  return (
    <main style={{ padding: "32px 28px", minHeight: "calc(100vh - 56px)", background: "var(--bg)" }}>
      <LeadsTable repliedOnly />
    </main>
  );
}
