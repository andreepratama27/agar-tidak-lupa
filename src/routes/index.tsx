import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<div className="min-h-screen">
			<p className="text-4xl font-bold">Agar Tidak Lupa</p>
		</div>
	);
}
