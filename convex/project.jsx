import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const create = mutation({
  args: {
    title: v.string(),
    originalImageUrl: v.optional(v.string()),
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    width: v.number(),
    height: v.number(),
    canvasState: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
     // ✅ Check authentication
    if (!user) {
      throw new Error("You must be signed in to create a project.");
    }
    if (user.plan === "free") {
      const projectCount = await ctx.db
        .query("projects")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
      if (projectCount.length >= 3) {
        throw new Error(
          "Free plan users can only have 3 projects. Please upgrade to a paid plan to create more projects."
        );
      }
    }
    const projectId = await ctx.db.insert("projects", {
      title: args.title,
      originalImageUrl: args.originalImageUrl,
      currentImageUrl: args.currentImageUrl,
      thumbnailUrl: args.thumbnailUrl,
      width: args.width,
      height: args.height,
      canvasState: args.canvasState,
      userId: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    // Updating user's project count
    await ctx.db.patch(user._id, {
      projectsUsed: user.projectsUsed + 1,
      lastActiveAt: Date.now(),
    });
    return projectId;
  },
});
// Get all projects for the current user
export const getUserProjects = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    // Get user's projects, ordered by most recently updated
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user_updated", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return projects;
  },
});
export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (!user || project.userId !== user._id) {
      throw new Error("Access denied");
    }

    // Delete the project
    await ctx.db.delete(args.projectId);

    // Update user's project count
    await ctx.db.patch(user._id, {
      projectsUsed: Math.max(0, user.projectsUsed - 1),
      lastActiveAt: Date.now(),
    });

    return { success: true };
  },
});

export const getProject=query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (!user || project.userId !== user._id) {
      throw new Error("Access denied");
    }

    return project;
  },
});
export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    canvasState: v.optional(v.any()),
    activeTransformation: v.optional(v.string()),
    backgroundRemoved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (!user || project.userId !== user._id) {
      throw new Error("Access denied");
    }

    const updatedData = {
      updatedAt: Date.now(),
    };
    if (args.canvasState !== undefined) {
      updatedData.canvasState = args.canvasState;}
    if (args.currentImageUrl !== undefined) {
      updatedData.currentImageUrl = args.currentImageUrl;
    }
    if (args.thumbnailUrl !== undefined) {
      updatedData.thumbnailUrl = args.thumbnailUrl;
    }
    if (args.width !== undefined) {
      updatedData.width = args.width;
    }
    if (args.height !== undefined) {
      updatedData.height = args.height;
    }
    if (args.activeTransformation !== undefined) {
      updatedData.activeTransformation = args.activeTransformation;
    }
    if (args.backgroundRemoved !== undefined) {
      updatedData.backgroundRemoved = args.backgroundRemoved;
    }

    await ctx.db.patch(args.projectId, updatedData);
    return args.projectId ;
  },
});