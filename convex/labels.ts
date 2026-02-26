import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

const DEFAULT_LABELS = [
	{ name: "Article", color: "bg-blue-200" },
	{ name: "Video", color: "bg-red-200" },
	{ name: "Tool", color: "bg-green-200" },
	{ name: "Reference", color: "bg-purple-200" },
	{ name: "Inspiration", color: "bg-pink-200" },
	{ name: "Other", color: "bg-gray-200" },
]

export const list = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("labels").collect()
	},
})

export const seed = mutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query("labels").collect()
		if (existing.length > 0) return
		for (const label of DEFAULT_LABELS) {
			await ctx.db.insert("labels", label)
		}
	},
})

export const add = mutation({
	args: {
		name: v.string(),
		color: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("labels", {
			name: args.name,
			color: args.color,
		})
	},
})

export const rename = mutation({
	args: {
		id: v.id("labels"),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const label = await ctx.db.get(args.id)
		if (!label) return
		const oldName = label.name
		await ctx.db.patch(args.id, { name: args.name })
		const links = await ctx.db.query("links").collect()
		for (const link of links) {
			if (link.label === oldName) {
				await ctx.db.patch(link._id, { label: args.name })
			}
		}
	},
})

export const remove = mutation({
	args: {
		id: v.id("labels"),
	},
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id)
	},
})
