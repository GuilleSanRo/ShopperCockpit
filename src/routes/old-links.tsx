import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/old-links")({
  beforeLoad: () => {
    throw redirect({
      to: "/other-links",
    });
  },
});
