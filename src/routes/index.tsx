import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<p className="text-lg text-black">
			Your personal link saver. Paste a link above to get started.
		</p>
	);
}
