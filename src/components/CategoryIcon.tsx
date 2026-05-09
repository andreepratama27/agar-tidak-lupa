const CATEGORY_ICON_PATHS: Record<string, string> = {
	Article: "/images/categories/article.png",
	Video: "/images/categories/video.png",
	Tool: "/images/categories/tool.png",
	Reference: "/images/categories/reference.png",
	Inspiration: "/images/categories/inspiration.png",
	Other: "/images/categories/other.png",
};

export function CategoryIcon({
	label,
	className = "h-5 w-5",
}: {
	label: string;
	className?: string;
}) {
	return (
		<img
			src={CATEGORY_ICON_PATHS[label] ?? CATEGORY_ICON_PATHS.Other}
			alt=""
			className={`${className} shrink-0 border border-black bg-amber-50 object-cover dark:border-yellow-300/45`}
			aria-hidden="true"
		/>
	);
}
