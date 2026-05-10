import { describe, expect, it } from "vitest";
import { displayLinkTitle } from "./linkTitle";

describe("displayLinkTitle", () => {
	it("replaces generic X titles with post fallback", () => {
		expect(
			displayLinkTitle({
				title: "x.com",
				url: "https://x.com/addyosmani/status/2053231239721885918",
			}),
		).toBe("Post by @addyosmani on X");
	});

	it("keeps non-generic titles", () => {
		expect(
			displayLinkTitle({
				title: "A real post title",
				url: "https://x.com/addyosmani/status/2053231239721885918",
			}),
		).toBe("A real post title");
	});
});
