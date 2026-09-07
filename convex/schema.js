import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  articles: defineTable({
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
    updatedAt: v.optional(v.string()),
  })
    .index("by_category", ["category"])
    .index("by_district", ["district"])
    .index("by_customId", ["customId"]),

  advertisements: defineTable({
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
    updatedAt: v.optional(v.string()),
  })
    .index("by_position", ["position"])
    .index("by_status", ["status"]),

  subscribers: defineTable({
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    subscribedAt: v.optional(v.string()),
    status: v.optional(v.string()),
    customId: v.optional(v.string()),
  }),

  notifications: defineTable({
    title: v.string(),
    message: v.string(),
    type: v.optional(v.string()),
    target: v.optional(v.string()),
    createdAt: v.optional(v.string()),
    isRead: v.optional(v.boolean()),
    customId: v.optional(v.string()),
  }),

  adminUsers: defineTable({
    username: v.string(),
    password: v.string(),
    role: v.string(),
    lastLogin: v.optional(v.string()),
  }).index("by_username", ["username"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    password: v.optional(v.string()),
    avatar: v.optional(v.string()),
    role: v.string(),
    createdAt: v.string(),
    lastLogin: v.optional(v.string()),
    savedArticles: v.optional(v.array(v.string())),
    customId: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_phone", ["phone"]),
});
