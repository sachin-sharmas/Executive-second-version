import { createFileRoute } from "@tanstack/react-router";
import { Deck } from "@/deck/deck";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EMEA Strategy Review | Averon" },
      {
        name: "description",
        content:
          "Interactive EMEA Strategy Review: right-sizing the Averon EMEA organization, break-even analysis, pricing and FTE scenarios.",
      },
      { property: "og:title", content: "EMEA Strategy Review | Averon" },
      {
        property: "og:description",
        content:
          "Interactive EMEA Strategy Review: right-sizing the Averon EMEA organization, break-even analysis, pricing and FTE scenarios.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Deck,
});
