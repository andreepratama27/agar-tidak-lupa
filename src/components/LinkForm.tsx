import { useAction, useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";

export function LinkForm() {
	const [url, setUrl] = useState("");
	const [label, setLabel] = useState("");
	const [loading, setLoading] = useState(false);

	const labels = useQuery(api.labels.list);
	const seedLabels = useMutation(api.labels.seed);
	const fetchMetadata = useAction(api.links.fetchMetadata);
	const addLink = useMutation(api.links.add);

	useEffect(() => {
		seedLabels();
	}, [seedLabels]);

	useEffect(() => {
		if (labels && labels.length > 0 && !label) {
			setLabel(labels[0].name);
		}
	}, [labels, label]);

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

	const hasUrl = url.trim() !== "";

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<input
				type="url"
				value={url}
				onChange={(e) => {
					setUrl(e.target.value);
					if (!e.target.value.trim() && labels?.[0]) {
						setLabel(labels[0].name);
					}
				}}
				placeholder="Paste a link..."
				required
				className="w-full border-2 border-black bg-white px-4 py-3 text-lg font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 dark:border-white/30 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-white/40"
			/>
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out ${
					hasUrl ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="flex flex-wrap gap-2 border-t-2 border-black pt-3 dark:border-white/30">
					<span className="font-extrabold text-sm self-center">Label:</span>
					{labels?.map((l) => (
						<button
							key={l._id}
							type="button"
							onClick={() => setLabel(l.name)}
							className={`border-2 border-black px-3 py-1 text-sm font-extrabold transition-all
									${
										label === l.name
											? "bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
											: "bg-white hover:bg-yellow-100 dark:bg-gray-900 dark:text-gray-100"
									}
									dark:border-white/30`}
						>
							{l.name}
						</button>
					))}
				</div>
				<div className="flex justify-end pt-3">
					<button
						type="submit"
						disabled={loading || !url.trim()}
						className="border-2 border-black bg-black px-6 py-3 text-lg font-extrabold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white/30 dark:bg-white dark:text-gray-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
					>
						{loading ? "Saving..." : "Save"}
					</button>
				</div>
			</div>
		</form>
	);
}
