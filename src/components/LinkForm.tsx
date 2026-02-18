import { useAction, useMutation, useQuery } from "convex/react";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";

const COLOR_OPTIONS = [
	{ value: "bg-blue-200", label: "Blue" },
	{ value: "bg-red-200", label: "Red" },
	{ value: "bg-green-200", label: "Green" },
	{ value: "bg-purple-200", label: "Purple" },
	{ value: "bg-pink-200", label: "Pink" },
	{ value: "bg-yellow-200", label: "Yellow" },
	{ value: "bg-orange-200", label: "Orange" },
	{ value: "bg-teal-200", label: "Teal" },
	{ value: "bg-gray-200", label: "Gray" },
];

export function LinkForm() {
	const [url, setUrl] = useState("");
	const [label, setLabel] = useState("");
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [newLabelName, setNewLabelName] = useState("");
	const [newLabelColor, setNewLabelColor] = useState(COLOR_OPTIONS[0].value);

	const labels = useQuery(api.labels.list);
	const seedLabels = useMutation(api.labels.seed);
	const addLabel = useMutation(api.labels.add);
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

	const handleCreateLabel = async (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = newLabelName.trim();
		if (!trimmed) return;

		await addLabel({ name: trimmed, color: newLabelColor });
		setLabel(trimmed);
		setNewLabelName("");
		setNewLabelColor(COLOR_OPTIONS[0].value);
		setShowModal(false);
	};

	return (
		<>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					type="url"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="Paste a link..."
					required
					className="w-full border-2 border-black bg-white px-4 py-3 text-lg font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 dark:border-white/30 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-white/40"
				/>
				<div className="flex flex-wrap gap-2">
					{labels?.map((l) => (
						<button
							key={l._id}
							type="button"
							onClick={() => setLabel(l.name)}
							className={`border-2 px-3 py-1 text-sm font-bold transition-all ${
								label === l.name
									? "border-black bg-yellow-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white/60 dark:bg-white/15 dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
									: "border-black bg-white text-black hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
							}`}
						>
							{l.name}
						</button>
					))}
					<button
						type="button"
						onClick={() => setShowModal(true)}
						className="border-2 border-dashed border-black bg-white px-3 py-1 text-sm font-bold text-black transition-all hover:border-solid hover:bg-yellow-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-white/40 dark:hover:bg-gray-700"
					>
						<Plus size={14} className="inline -mt-0.5" />
					</button>
				</div>
				<button
					type="submit"
					disabled={loading || !url.trim()}
					className="border-2 border-black bg-black px-6 py-3 text-lg font-extrabold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white/30 dark:bg-white dark:text-gray-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
				>
					{loading ? "Saving..." : "Save"}
				</button>
			</form>

			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div
						className="absolute inset-0 bg-black/40"
						onClick={() => setShowModal(false)}
						onKeyDown={() => {}}
					/>
					<div className="relative mx-4 w-full max-w-sm border-4 border-black bg-amber-50 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white/30 dark:bg-gray-900 dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)]">
						<button
							type="button"
							onClick={() => setShowModal(false)}
							className="absolute top-3 right-3 border-2 border-black bg-red-200 p-1 font-extrabold transition-colors hover:bg-red-400 dark:border-red-400 dark:bg-red-900 dark:hover:bg-red-700"
						>
							<X size={16} />
						</button>

						<h2 className="mb-4 text-xl font-extrabold text-black dark:text-gray-100">
							New Label
						</h2>

						<form onSubmit={handleCreateLabel} className="flex flex-col gap-4">
							<div>
								<label className="mb-1 block text-sm font-extrabold text-black dark:text-gray-200">
									Name
								</label>
								<input
									type="text"
									value={newLabelName}
									onChange={(e) => setNewLabelName(e.target.value)}
									placeholder="e.g. Tutorial"
									required
									autoFocus
									className="w-full border-2 border-black bg-white px-3 py-2 text-base font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 dark:border-white/30 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-white/40"
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-extrabold text-black dark:text-gray-200">
									Color
								</label>
								<div className="flex flex-wrap gap-2">
									{COLOR_OPTIONS.map((c) => (
										<button
											key={c.value}
											type="button"
											onClick={() => setNewLabelColor(c.value)}
											className={`${c.value} h-8 w-8 border-2 transition-all ${
												newLabelColor === c.value
													? "scale-110 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]"
													: "border-gray-400 hover:border-black dark:border-gray-600 dark:hover:border-white/60"
											}`}
											title={c.label}
										/>
									))}
								</div>
							</div>

							<button
								type="submit"
								disabled={!newLabelName.trim()}
								className="border-2 border-black bg-yellow-300 px-4 py-2 text-base font-extrabold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/30 dark:bg-white dark:text-gray-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
							>
								Create Label
							</button>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
