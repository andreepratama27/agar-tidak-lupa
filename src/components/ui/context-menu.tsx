import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

export function ContextMenuContent({
	children,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
	return (
		<ContextMenuPrimitive.Portal>
			<ContextMenuPrimitive.Content
				{...props}
				className="z-50 min-w-[8rem] border-2 border-black bg-white p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-yellow-300/50 dark:bg-[#0a0a0a] dark:shadow-[4px_4px_0px_0px_rgba(250,204,21,0.28)]"
			>
				{children}
			</ContextMenuPrimitive.Content>
		</ContextMenuPrimitive.Portal>
	);
}

export function ContextMenuItem({
	children,
	className = "",
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item>) {
	return (
		<ContextMenuPrimitive.Item
			{...props}
			className={`flex cursor-pointer select-none items-center px-3 py-1.5 text-sm font-bold text-black outline-none hover:bg-yellow-200 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:text-neutral-100 dark:hover:bg-[#171717] ${className}`}
		>
			{children}
		</ContextMenuPrimitive.Item>
	);
}

export function ContextMenuSeparator(
	props: React.ComponentProps<typeof ContextMenuPrimitive.Separator>,
) {
	return (
		<ContextMenuPrimitive.Separator
			{...props}
			className="my-1 h-px bg-black/20 dark:bg-yellow-300/20"
		/>
	);
}
