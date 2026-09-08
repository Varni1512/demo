import { ConvexReactClient } from "convex/react";
import { ConvexHttpClient } from "convex/browser";

const convexUrl =
  import.meta.env.VITE_CONVEX_URL || "https://original-raven-947.convex.cloud";

export const convex = new ConvexReactClient(convexUrl);
export const convexHttp = new ConvexHttpClient(convexUrl);
