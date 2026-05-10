import { describe, expect, it } from "vitest"
import {
	extractTitle,
	fallbackTitleForUrl,
	isGenericXTitle,
	titleFromXEmbedHtml,
} from "./metadata"

describe("metadata helpers", () => {
	it("prefers decoded og title", () => {
		expect(
			extractTitle(
				'<html><head><title>x.com</title><meta property="og:title" content="Tom &amp; Jerry"></head></html>',
				"x.com",
			),
		).toBe("Tom & Jerry")
	})

	it("builds useful fallback titles for X posts", () => {
		expect(fallbackTitleForUrl("https://x.com/rauchg/status/123", "x.com")).toBe(
			"Post by @rauchg on X",
		)
		expect(fallbackTitleForUrl("https://x.com/rauchg", "x.com")).toBe(
			"@rauchg on X",
		)
	})

	it("detects generic X titles", () => {
		expect(isGenericXTitle("x.com", "x.com")).toBe(true)
		expect(isGenericXTitle("A real post title", "x.com")).toBe(false)
	})

	it("extracts readable title from X oembed html", () => {
		expect(
			titleFromXEmbedHtml(
				'<blockquote class="twitter-tweet"><p lang="en">Ship small &amp; often</p>&mdash; Guillermo Rauch <a href="https://twitter.com/rauchg/status/123">May 1</a></blockquote>',
				"Guillermo Rauch",
			),
		).toBe("Ship small & often - Guillermo Rauch on X")
	})
})
