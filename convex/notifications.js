import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query all notifications
export const get = query({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("notifications").order("desc").collect();
    return list.map((n) => ({
      ...n,
      id: n.customId || n._id,
      _id: n._id,
    }));
  },
});

// Mutation: Send Notification
export const send = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    type: v.optional(v.string()),
    target: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const customId = `notif-${Date.now()}`;
    const newId = await ctx.db.insert("notifications", {
      title: args.title,
      message: args.message,
      type: args.type || "Breaking",
      target: args.target || "all",
      createdAt: new Date().toISOString(),
      isRead: false,
      customId,
    });

    return {
      success: true,
      notification: {
        id: customId,
        _id: newId,
        ...args,
        createdAt: new Date().toISOString(),
      },
    };
  },
});

// Mutation: Delete Notification
export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const cleanId = args.id.trim();
    const all = await ctx.db.query("notifications").collect();
    const found = all.find((n) => n.customId === cleanId || String(n._id) === cleanId);

    if (found) {
      await ctx.db.delete(found._id);
      return { success: true, deletedId: cleanId };
    }
    return { success: false };
  },
});

// Mutation: Mark Notification Read
export const markRead = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const cleanId = args.id.trim();
    const all = await ctx.db.query("notifications").collect();
    const found = all.find((n) => n.customId === cleanId || String(n._id) === cleanId);

    if (found) {
      await ctx.db.patch(found._id, { isRead: true });
      return { success: true };
    }
    return { success: false };
  },
});
