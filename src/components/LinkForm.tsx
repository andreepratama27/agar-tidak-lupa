import { useAction, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

const LABELS = [
	"Article",
	"Video",
	"Tool",
	"Reference",
	"Inspiration",
	"Other",
] as const;

export function LinkForm() {
	const [url, setUrl] = useState("");
	const [label, setLabel] = useState<string>(LABELS[0]);
	const [loading, setLoading] = useState(false);

	const fetchMetadata = useAction(api.links.fetchMetadata);
	const addLink = useMutation(api.links.add);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = url.trim();
		if (!trimmed) return;

		setLoading(true);
		try {
			const metadata = await fetchMetadata({ url: trimmed });
			await addLink({
				url: trimmed,
				title: metadata.title,
				favicon: metadata.favicon ?? undefined,
				label,
			});
			setUrl("");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<input
				type="url"
				value={url}
				onChange={(e) => setUrl(e.target.value)}
				placeholder="Paste a link..."
				required
				className="w-full border-2 border-black bg-white px-4 py-3 text-lg font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
			/>
			<div className="flex flex-wrap gap-2">
				{LABELS.map((l) => (
					<button
						key={l}
						type="button"
						onClick={() => setLabel(l)}
						className={`border-2 border-black px-3 py-1 text-sm font-bold ${
							label === l
								? "bg-yellow-300 text-black"
								: "bg-white text-black hover:bg-gray-100"
						}`}
					>
						{l}
					</button>
				))}
			</div>
			<button
				type="submit"
				disabled={loading || !url.trim()}
				className="border-2 border-black bg-black px-6 py-3 text-lg font-extrabold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
			>
				{loading ? "Saving..." : "Save"}
			</button>
		</form>
	);
}
