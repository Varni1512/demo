import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query all articles
export const get = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").order("desc").collect();
    // Resolve storage image URLs if storageId is set
    return await Promise.all(
      articles.map(async (art) => {
        let imageUrl = art.image;
        if (art.storageId) {
          const url = await ctx.storage.getUrl(art.storageId);
          if (url) imageUrl = url;
        }
        return {
          ...art,
          id: art.customId || art._id,
          _id: art._id,
          image: imageUrl,
        };
      })
    );
  },
});

// Query single article by customId or slug or _id
export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const cleanId = args.id.trim();

    // 1. Try search by customId
    const byCustomId = await ctx.db
      .query("articles")
      .withIndex("by_customId", (q) => q.eq("customId", cleanId))
      .first();
    if (byCustomId) {
      let imageUrl = byCustomId.image;
      if (byCustomId.storageId) {
        const url = await ctx.storage.getUrl(byCustomId.storageId);
        if (url) imageUrl = url;
      }
      return {
        ...byCustomId,
        id: byCustomId.customId || byCustomId._id,
        image: imageUrl,
      };
    }

    // 2. Try match by slug or search all
    const all = await ctx.db.query("articles").collect();
    const found = all.find(
      (a) =>
        String(a._id) === cleanId ||
        a.customId === cleanId ||
        (a.slug && a.slug.toLowerCase() === cleanId.toLowerCase())
    );

    if (found) {
      let imageUrl = found.image;
      if (found.storageId) {
        const url = await ctx.storage.getUrl(found.storageId);
        if (url) imageUrl = url;
      }
      return {
        ...found,
        id: found.customId || found._id,
        image: imageUrl,
      };
    }

    return null;
  },
});

// Query articles by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();

    return await Promise.all(
      articles.map(async (art) => {
        let imageUrl = art.image;
        if (art.storageId) {
          const url = await ctx.storage.getUrl(art.storageId);
          if (url) imageUrl = url;
        }
        return {
          ...art,
          id: art.customId || art._id,
          image: imageUrl,
        };
      })
    );
  },
});

// Query articles by district
export const getByDistrict = query({
  args: { district: v.string() },
  handler: async (ctx, args) => {
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_district", (q) => q.eq("district", args.district))
      .order("desc")
      .collect();

    return await Promise.all(
      articles.map(async (art) => {
        let imageUrl = art.image;
        if (art.storageId) {
          const url = await ctx.storage.getUrl(art.storageId);
          if (url) imageUrl = url;
        }
        return {
          ...art,
          id: art.customId || art._id,
          image: imageUrl,
        };
      })
    );
  },
});

// Mutation: Save or Update Article
export const save = mutation({
  args: {
    title: v.string(),
    slug: v.optional(v.string()),
    category: v.string(),
    district: v.optional(v.string()),
    subDistrict: v.optional(v.string()),
    reporter: v.optional(v.string()),
    author: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    image: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    date: v.optional(v.string()),
    readTime: v.optional(v.string()),
    customId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const customId = args.customId || `art-${Date.now()}`;
    const updatedAt = new Date().toISOString();

    // Check if article with customId already exists
    const existing = await ctx.db
      .query("articles")
      .withIndex("by_customId", (q) => q.eq("customId", customId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        customId,
        updatedAt,
      });
      return { success: true, id: customId, _id: existing._id, action: "update" };
    }

    const newId = await ctx.db.insert("articles", {
      ...args,
      customId,
      updatedAt,
    });

    return { success: true, id: customId, _id: newId, action: "create" };
  },
});

// Mutation: Delete Article
export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const cleanId = args.id.trim();

    // Find by customId
    const byCustomId = await ctx.db
      .query("articles")
      .withIndex("by_customId", (q) => q.eq("customId", cleanId))
      .first();

    if (byCustomId) {
      if (byCustomId.storageId) {
        await ctx.storage.delete(byCustomId.storageId).catch(() => {});
      }
      await ctx.db.delete(byCustomId._id);
      return { success: true, deletedId: cleanId };
    }

    // Try find by _id
    const all = await ctx.db.query("articles").collect();
    const found = all.find((a) => String(a._id) === cleanId || a.customId === cleanId);
    if (found) {
      if (found.storageId) {
        await ctx.storage.delete(found.storageId).catch(() => {});
      }
      await ctx.db.delete(found._id);
      return { success: true, deletedId: cleanId };
    }

    return { success: false, error: "Article not found" };
  },
});
