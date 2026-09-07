import { ConvexReactClient } from "convex/react";

const convexUrl =
  import.meta.env.VITE_CONVEX_URL || "https://original-raven-947.convex.cloud";

export const convex = new ConvexReactClient(convexUrl);
