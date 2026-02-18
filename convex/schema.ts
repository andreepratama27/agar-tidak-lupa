import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
	links: defineTable({
		url: v.string(),
		title: v.string(),
		favicon: v.optional(v.string()),
		label: v.string(),
		savedAt: v.number(),
	}),
})
