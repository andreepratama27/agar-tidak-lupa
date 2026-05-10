import { describe, expect, it } from "vitest";
import { decodeHtmlEntities } from "./htmlEntities";

describe("decodeHtmlEntities", () => {
	it("decodes numeric and common named entities", () => {
		expect(
			decodeHtmlEntities(
				"Tom &amp; Jerry&rsquo;s &#x27;Guide&#x27; &lt;2026&gt;",
			),
		).toBe("Tom & Jerry's 'Guide' <2026>");
	});

	it("leaves unknown entities untouched", () => {
		expect(decodeHtmlEntities("A &madeup; title &#99999999;")).toBe(
			"A &madeup; title &#99999999;",
		);
	});
});
