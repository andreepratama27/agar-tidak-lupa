import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("links").order("desc").collect()
	},
})

export const add = mutation({
	args: {
		url: v.string(),
		title: v.string(),
		favicon: v.optional(v.string()),
		label: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("links", {
			url: args.url,
			title: args.title,
			favicon: args.favicon,
			label: args.label,
			savedAt: Date.now(),
		})
	},
})

export const remove = mutation({
	args: {
		id: v.id("links"),
	},
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id)
	},
})
