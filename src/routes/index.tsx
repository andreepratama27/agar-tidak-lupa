import { createFileRoute } from "@tanstack/react-router";
import { LinkForm } from "@/components/LinkForm";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="flex flex-col gap-8">
			<LinkForm />
		</div>
	);
}
