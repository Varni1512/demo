import { mutation } from "./_generated/server";

// Generate an upload URL for client to directly upload media/images to Convex storage
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
