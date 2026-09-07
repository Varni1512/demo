import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query admin user authentication
export const login = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanUser = args.username.trim();
    const cleanPass = args.password.trim();

    // Default built-in credentials check or DB lookup
    const users = await ctx.db.query("adminUsers").collect();
    
    // Seed default admin if table is empty
    if (users.length === 0) {
      await ctx.db.insert("adminUsers", {
        username: "admin",
        password: "password123",
        role: "Super Admin",
        lastLogin: new Date().toISOString(),
      });
    }

    const admin = users.find(
      (u) => u.username.toLowerCase() === cleanUser.toLowerCase()
    );

    // Check credentials against DB or default fallbacks
    const isValid =
      (admin && admin.password === cleanPass) ||
      (cleanUser === "admin" && cleanPass === "password123") ||
      (cleanUser === "editor" && cleanPass === "editor123");

    if (isValid) {
      if (admin) {
        await ctx.db.patch(admin._id, { lastLogin: new Date().toISOString() });
      }
      return {
        success: true,
        user: {
          username: cleanUser,
          role: admin?.role || (cleanUser === "admin" ? "Super Admin" : "Editor"),
          token: `convex-auth-${Date.now()}`,
        },
      };
    }

    return {
      success: false,
      error: "अमान्य यूज़रनेम या पासवर्ड (Invalid credentials)",
    };
  },
});

// Query get admin profile
export const getAdminProfile = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("adminUsers").collect();
    const user = users.find(
      (u) => u.username.toLowerCase() === args.username.toLowerCase()
    );
    if (user) {
      return {
        username: user.username,
        role: user.role,
        lastLogin: user.lastLogin,
      };
    }
    return null;
  },
});
