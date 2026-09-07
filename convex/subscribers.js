import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query all subscribers
export const get = query({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("subscribers").order("desc").collect();
    return list.map((s) => ({
      ...s,
      id: s.customId || s._id,
      _id: s._id,
    }));
  },
});

// Mutation: Add Subscriber
export const subscribe = mutation({
  args: {
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanPhone = args.phone?.trim();
    const cleanEmail = args.email?.trim().toLowerCase();

    if (!cleanPhone && !cleanEmail) {
      return { success: false, message: "फोन नंबर या ईमेल दर्ज करें।" };
    }

    const all = await ctx.db.query("subscribers").collect();
    const exists = all.some(
      (s) =>
        (cleanPhone && s.phone === cleanPhone) ||
        (cleanEmail && s.email && s.email.toLowerCase() === cleanEmail)
    );

    if (exists) {
      return { success: false, message: "यह ईमेल या मोबाइल नंबर पहले से सब्सक्राइब है।" };
    }

    const customId = `sub-${Date.now()}`;
    const newId = await ctx.db.insert("subscribers", {
      phone: cleanPhone || "",
      email: cleanEmail || "",
      subscribedAt: new Date().toLocaleString("en-IN"),
      status: "Active",
      customId,
    });

    return {
      success: true,
      message: "सफलतापूर्वक सब्सक्राइब किया गया!",
      subscriber: {
        id: customId,
        _id: newId,
        phone: cleanPhone || "",
        email: cleanEmail || "",
        status: "Active",
      },
    };
  },
});

// Mutation: Delete Subscriber
export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const cleanId = args.id.trim();
    const all = await ctx.db.query("subscribers").collect();
    const found = all.find(
      (s) => s.customId === cleanId || String(s._id) === cleanId || s.phone === cleanId || s.email === cleanId
    );

    if (found) {
      await ctx.db.delete(found._id);
      return { success: true, deletedId: cleanId };
    }
    return { success: false, error: "Subscriber not found" };
  },
});
