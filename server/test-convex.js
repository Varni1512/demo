import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import dotenv from "dotenv";
dotenv.config();

const convexUrl = process.env.VITE_CONVEX_URL || "https://original-raven-947.convex.cloud";
console.log("Connecting to", convexUrl);

const convex = new ConvexHttpClient(convexUrl);

async function test() {
  try {
    const articles = await convex.query(api.articles.get);
    console.log(`Found ${articles.length} articles`);
    const art = await convex.query(api.articles.getById, { id: articles[0]?.id || "" });
    console.log("First article title:", art?.title);
  } catch (e) {
    console.error(e);
  }
}
test();
