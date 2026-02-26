import { useMutation, useQuery } from "convex/react";
import { LayoutGrid, LayoutList, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "./ui/context-menu";

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

export function LinkList() {
	const links = useQuery(api.links.list);
	const labels = useQuery(api.labels.list);
	const removeLink = useMutation(api.links.remove);
	const addLabel = useMutation(api.labels.add);
	const renameLabel = useMutation(api.labels.rename);
	const removeLabel = useMutation(api.labels.remove);

	const [, setLabel] = useState("");
	const [filterLabel, setFilterLabel] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [newLabelName, setNewLabelName] = useState("");
	const [newLabelColor, setNewLabelColor] = useState(COLOR_OPTIONS[0].value);

	const [layout, setLayout] = useState<"list" | "grid">(
		() => (localStorage.getItem("link-layout") as "list" | "grid") ?? "list",
	);

	const [renamingLabel, setRenamingLabel] = useState<Doc<"labels"> | null>(
		null,
	);
	const [renameValue, setRenameValue] = useState("");

	useEffect(() => {
		localStorage.setItem("link-layout", layout);
	}, [layout]);

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

	const handleRenameSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!renamingLabel) return;
		const trimmed = renameValue.trim();
		if (!trimmed) return;

		if (filterLabel === renamingLabel.name) {
			setFilterLabel(trimmed);
		}
		await renameLabel({ id: renamingLabel._id, name: trimmed });
		setRenamingLabel(null);
		setRenameValue("");
	};

	const handleDeleteLabel = async (label: Doc<"labels">) => {
		if (filterLabel === label.name) {
			setFilterLabel("");
		}
		await removeLabel({ id: label._id });
	};

	const labelColors: Record<string, string> = {};
	if (labels) {
		for (const l of labels) {
			labelColors[l.name] = l.color;
		}
	}

	if (links === undefined) {
		return (
			<p className="text-lg font-bold text-gray-500 dark:text-gray-400">
				Loading links...
			</p>
		);
	}

	const filteredLinks = filterLabel
		? links.filter((link) => link.label === filterLabel)
		: links;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-wrap gap-2">
					{labels && labels.length > 0 && (
						<>
							<button
								type="button"
								onClick={() => setFilterLabel("")}
								className={`border-2 px-3 py-1 text-sm font-bold transition-all ${
									filterLabel === ""
										? "border-black bg-yellow-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white/60 dark:bg-white/15 dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
										: "border-black bg-white text-black hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
								}`}
							>
								All
							</button>
							{labels.map((l) => (
								<ContextMenu key={l._id}>
									<ContextMenuTrigger asChild>
										<button
											type="button"
											onClick={() =>
												setFilterLabel(filterLabel === l.name ? "" : l.name)
											}
											className={`border-2 px-3 py-1 text-sm font-bold transition-all ${
												filterLabel === l.name
													? "border-black bg-yellow-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white/60 dark:bg-white/15 dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
													: "border-black bg-white text-black hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
											}`}
										>
											{l.name}
										</button>
									</ContextMenuTrigger>
									<ContextMenuContent>
										<ContextMenuItem
											onSelect={() => {
												setRenamingLabel(l);
												setRenameValue(l.name);
											}}
										>
											Rename
										</ContextMenuItem>
										<ContextMenuSeparator />
										<ContextMenuItem
											className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
											onSelect={() => handleDeleteLabel(l)}
										>
											Delete
										</ContextMenuItem>
									</ContextMenuContent>
								</ContextMenu>
							))}
							<button
								type="button"
								onClick={() => setShowModal(true)}
								className="border-2 border-dashed border-black bg-white px-3 py-1 text-sm font-bold text-black transition-all hover:border-solid hover:bg-yellow-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-white/40 dark:hover:bg-gray-700"
							>
								<Plus size={14} className="inline -mt-0.5" />
							</button>
						</>
					)}
				</div>
				<div className="flex shrink-0 gap-1">
					<button
						type="button"
						onClick={() => setLayout("list")}
						title="List view"
						className={`border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-white/60 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] ${
							layout === "list"
								? "bg-black text-white dark:bg-white dark:text-black"
								: "bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
						}`}
					>
						<LayoutList size={16} />
					</button>
					<button
						type="button"
						onClick={() => setLayout("grid")}
						title="Grid view"
						className={`border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-white/60 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] ${
							layout === "grid"
								? "bg-black text-white dark:bg-white dark:text-black"
								: "bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
						}`}
					>
						<LayoutGrid size={16} />
					</button>
				</div>
			</div>
			{filteredLinks.length === 0 ? (
				<p className="text-lg font-bold text-gray-500 dark:text-gray-400">
					No links saved yet. Paste one above!
				</p>
			) : layout === "list" ? (
				<div className="flex flex-col gap-3">
					{filteredLinks.map((link: Doc<"links">) => (
						<div
							key={link._id}
							className="flex items-center gap-4 border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white/30 dark:bg-gray-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]"
						>
							{link.favicon && (
								<img
									src={link.favicon}
									alt=""
									width={16}
									height={16}
									className="shrink-0"
								/>
							)}
							<div className="min-w-0 flex-1">
								<a
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									className="block truncate text-lg font-extrabold text-black underline decoration-2 hover:text-yellow-600 dark:text-gray-100 dark:hover:text-white"
								>
									{link.title}
								</a>
								<p className="truncate text-sm font-bold text-gray-500 dark:text-gray-400">
									{link.url}
								</p>
							</div>
							<span
								className={`shrink-0 border-2 border-black px-3 py-1 text-xs font-extrabold dark:border-gray-600 ${labelColors[link.label] ?? "bg-gray-200"}`}
							>
								{link.label}
							</span>
							<button
								type="button"
								onClick={() => removeLink({ id: link._id })}
								className="shrink-0 border-2 border-black bg-red-200 p-2 font-extrabold hover:bg-red-400 dark:border-red-400 dark:bg-red-900 dark:hover:bg-red-700"
							>
								<Trash2 size={16} />
							</button>
						</div>
					))}
				</div>
			) : (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{filteredLinks.map((link: Doc<"links">) => (
						<a
							key={link._id}
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className="flex flex-col border-4 border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:border-white/30 dark:bg-gray-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]"
						>
							<div className="mb-2 flex items-start justify-between gap-1">
								{link.favicon ? (
									<img
										src={link.favicon}
										alt=""
										width={16}
										height={16}
										className="mt-0.5 shrink-0"
									/>
								) : (
									<span />
								)}
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										removeLink({ id: link._id });
									}}
									className="shrink-0 border-2 border-black bg-red-200 p-1 font-extrabold hover:bg-red-400 dark:border-red-400 dark:bg-red-900 dark:hover:bg-red-700"
								>
									<Trash2 size={12} />
								</button>
							</div>
							<p className="mb-2 line-clamp-2 flex-1 text-sm font-extrabold text-black dark:text-gray-100">
								{link.title}
							</p>
							<p className="mb-2 truncate text-xs font-bold text-gray-500 dark:text-gray-400">
								{(() => {
									try {
										return new URL(link.url).hostname;
									} catch {
										return link.url;
									}
								})()}
							</p>
							<span
								className={`self-start border-2 border-black px-2 py-0.5 text-xs font-extrabold dark:border-gray-600 ${labelColors[link.label] ?? "bg-gray-200"}`}
							>
								{link.label}
							</span>
						</a>
					))}
				</div>
			)}

			{/* New Label Modal */}
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

			{/* Rename Label Modal */}
			{renamingLabel && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div
						className="absolute inset-0 bg-black/40"
						onClick={() => setRenamingLabel(null)}
						onKeyDown={() => {}}
					/>
					<div className="relative mx-4 w-full max-w-sm border-4 border-black bg-amber-50 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white/30 dark:bg-gray-900 dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)]">
						<button
							type="button"
							onClick={() => setRenamingLabel(null)}
							className="absolute top-3 right-3 border-2 border-black bg-red-200 p-1 font-extrabold transition-colors hover:bg-red-400 dark:border-red-400 dark:bg-red-900 dark:hover:bg-red-700"
						>
							<X size={16} />
						</button>

						<h2 className="mb-4 text-xl font-extrabold text-black dark:text-gray-100">
							Rename Label
						</h2>

						<form onSubmit={handleRenameSubmit} className="flex flex-col gap-4">
							<div>
								<label className="mb-1 block text-sm font-extrabold text-black dark:text-gray-200">
									Name
								</label>
								<input
									type="text"
									value={renameValue}
									onChange={(e) => setRenameValue(e.target.value)}
									required
									autoFocus
									className="w-full border-2 border-black bg-white px-3 py-2 text-base font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 dark:border-white/30 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-white/40"
								/>
							</div>

							<button
								type="submit"
								disabled={
									!renameValue.trim() ||
									renameValue.trim() === renamingLabel.name
								}
								className="border-2 border-black bg-yellow-300 px-4 py-2 text-base font-extrabold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/30 dark:bg-white dark:text-gray-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
							>
								Save
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
