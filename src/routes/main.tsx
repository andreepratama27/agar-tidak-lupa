import { createFileRoute } from "@tanstack/react-router";
import { LinkForm } from "@/components/LinkForm";
import { LinkList } from "@/components/LinkList";

export const Route = createFileRoute("/main")({ component: Main });

function Main() {
	return (
		<div className="flex flex-col gap-8">
			<LinkForm />
			<LinkList />
		</div>
	);
}
