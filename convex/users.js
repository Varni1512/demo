import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query all users (readers/registered members)
export const get = query({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("users").order("desc").collect();
    return list.map((u) => ({
      ...u,
      id: u.customId || u._id,
      _id: u._id,
    }));
  },
});

// Query user profile by email or ID
export const getProfile = query({
  args: { emailOrId: v.string() },
  handler: async (ctx, args) => {
    const key = args.emailOrId.trim().toLowerCase();
    const all = await ctx.db.query("users").collect();
    const user = all.find(
      (u) =>
        u.email.toLowerCase() === key ||
        String(u._id) === key ||
        u.customId === key ||
        (u.phone && u.phone === key)
    );
    if (!user) return null;
    return {
      id: user.customId || user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      avatar: user.avatar || "",
      role: user.role || "user",
      createdAt: user.createdAt,
      lastLogin: user.lastLogin || "",
      savedArticles: user.savedArticles || [],
    };
  },
});

// Mutation: Register a new regular user
export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    phone: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    const cleanPhone = args.phone?.trim() || "";

    if (!args.name.trim()) {
      return { success: false, message: "कृपया अपना नाम दर्ज करें।" };
    }
    if (!cleanEmail) {
      return { success: false, message: "कृपया वैध ईमेल आईडी दर्ज करें।" };
    }

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      return { success: false, message: "यह ईमेल आईडी पहले से पंजीकृत है। कृपया लॉगिन करें।" };
    }

    const customId = `usr-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const newId = await ctx.db.insert("users", {
      name: args.name.trim(),
      email: cleanEmail,
      password: args.password.trim(),
      phone: cleanPhone,
      avatar: args.avatar || "",
      role: "user",
      createdAt,
      lastLogin: createdAt,
      savedArticles: [],
      customId,
    });

    const userObj = {
      id: customId,
      _id: newId,
      name: args.name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      avatar: args.avatar || "",
      role: "user",
      createdAt,
    };

    return {
      success: true,
      message: "सफलतापूर्वक खाता बनाया गया! (Account created successfully)",
      user: userObj,
      token: `user-token-${Date.now()}`,
    };
  },
});

// Mutation: Login regular user
export const login = mutation({
  args: {
    emailOrPhone: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanInput = args.emailOrPhone.trim().toLowerCase();
    const cleanPass = args.password.trim();

    const all = await ctx.db.query("users").collect();
    const user = all.find(
      (u) =>
        u.email.toLowerCase() === cleanInput ||
        (u.phone && u.phone === cleanInput)
    );

    if (!user) {
      return { success: false, message: "उपयोगकर्ता नहीं मिला। कृपया पहले साइन अप करें।" };
    }

    if (user.password && user.password !== cleanPass) {
      return { success: false, message: "अमान्य पासवर्ड (Incorrect Password)" };
    }

    const lastLogin = new Date().toISOString();
    await ctx.db.patch(user._id, { lastLogin });

    const userObj = {
      id: user.customId || user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      avatar: user.avatar || "",
      role: user.role || "user",
      savedArticles: user.savedArticles || [],
      createdAt: user.createdAt,
      lastLogin,
    };

    return {
      success: true,
      message: `स्वागत है, ${user.name}!`,
      user: userObj,
      token: `user-token-${Date.now()}`,
    };
  },
});

// Mutation: Update User Profile
export const updateProfile = mutation({
  args: {
    id: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanId = args.id.trim();
    const all = await ctx.db.query("users").collect();
    const user = all.find((u) => u.customId === cleanId || String(u._id) === cleanId);

    if (!user) return { success: false, message: "User not found" };

    const updates = {};
    if (args.name) updates.name = args.name.trim();
    if (args.phone !== undefined) updates.phone = args.phone.trim();
    if (args.avatar !== undefined) updates.avatar = args.avatar;

    await ctx.db.patch(user._id, updates);
    return { success: true, user: { ...user, ...updates } };
  },
});

// Mutation: Bookmark / Save article toggle
export const toggleSaveArticle = mutation({
  args: {
    userId: v.string(),
    articleId: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanUserId = args.userId.trim();
    const cleanArticleId = args.articleId.trim();

    const all = await ctx.db.query("users").collect();
    const user = all.find((u) => u.customId === cleanUserId || String(u._id) === cleanUserId);

    if (!user) return { success: false, message: "User not found" };

    const saved = user.savedArticles || [];
    const exists = saved.includes(cleanArticleId);
    const newSaved = exists
      ? saved.filter((id) => id !== cleanArticleId)
      : [...saved, cleanArticleId];

    await ctx.db.patch(user._id, { savedArticles: newSaved });
    return { success: true, savedArticles: newSaved, isSaved: !exists };
  },
});

// Mutation: Delete user
export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const cleanId = args.id.trim();
    const all = await ctx.db.query("users").collect();
    const user = all.find((u) => u.customId === cleanId || String(u._id) === cleanId);

    if (user) {
      await ctx.db.delete(user._id);
      return { success: true, deletedId: cleanId };
    }
    return { success: false };
  },
});
