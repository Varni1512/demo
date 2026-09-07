import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query all advertisements
export const get = query({
  args: {},
  handler: async (ctx) => {
    const ads = await ctx.db.query("advertisements").order("desc").collect();
    return await Promise.all(
      ads.map(async (ad) => {
        let imageUrl = ad.image;
        if (ad.storageId) {
          const url = await ctx.storage.getUrl(ad.storageId);
          if (url) imageUrl = url;
        }
        return {
          ...ad,
          id: ad.customId || ad._id,
          _id: ad._id,
          image: imageUrl,
        };
      })
    );
  },
});

// Mutation: Save or Update Advertisement
export const save = mutation({
  args: {
    title: v.string(),
    sponsor: v.optional(v.string()),
    tagline: v.optional(v.string()),
    position: v.string(),
    image: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    link: v.optional(v.string()),
    status: v.string(),
    clicks: v.optional(v.number()),
    impressions: v.optional(v.number()),
    customId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const customId = args.customId || `ad-${Date.now()}`;
    const updatedAt = new Date().toISOString();

    const all = await ctx.db.query("advertisements").collect();
    const existing = all.find((a) => a.customId === customId || String(a._id) === customId);

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        customId,
        clicks: args.clicks ?? existing.clicks ?? 0,
        impressions: args.impressions ?? existing.impressions ?? 0,
        updatedAt,
      });
      return { success: true, id: customId, _id: existing._id, action: "update" };
    }

    const newId = await ctx.db.insert("advertisements", {
      ...args,
      customId,
      clicks: args.clicks ?? 0,
      impressions: args.impressions ?? 0,
      updatedAt,
    });

    return { success: true, id: customId, _id: newId, action: "create" };
  },
});

// Mutation: Delete Advertisement
export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const cleanId = args.id.trim();
    const all = await ctx.db.query("advertisements").collect();
    const found = all.find((a) => a.customId === cleanId || String(a._id) === cleanId);

    if (found) {
      if (found.storageId) {
        await ctx.storage.delete(found.storageId).catch(() => {});
      }
      await ctx.db.delete(found._id);
      return { success: true, deletedId: cleanId };
    }

    return { success: false, error: "Ad not found" };
  },
});

// Mutation: Toggle Active/Paused status
export const toggleStatus = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const cleanId = args.id.trim();
    const all = await ctx.db.query("advertisements").collect();
    const found = all.find((a) => a.customId === cleanId || String(a._id) === cleanId);

    if (found) {
      const newStatus = found.status === "Active" ? "Paused" : "Active";
      await ctx.db.patch(found._id, { status: newStatus });
      return { success: true, status: newStatus };
    }
    return { success: false, error: "Ad not found" };
  },
});

// Mutation: Record Ad Click
export const recordClick = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const cleanId = args.id.trim();
    const all = await ctx.db.query("advertisements").collect();
    const found = all.find((a) => a.customId === cleanId || String(a._id) === cleanId);

    if (found) {
      const newClicks = (found.clicks || 0) + 1;
      await ctx.db.patch(found._id, { clicks: newClicks });
      return { success: true, clicks: newClicks };
    }
    return { success: false };
  },
});
