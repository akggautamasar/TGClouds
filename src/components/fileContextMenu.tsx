import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger
} from '@/components/ui/context-menu';
import React, { SVGProps, type JSX } from 'react';

function FileContextMenu({
	children,
	fileContextMenuActions
}: {
	children: React.ReactNode;
	fileContextMenuActions: {
		actionName: string;
		onClick: () => Promise<void>;
		Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
		className: string;
	}[];
}) {
	return (
		<ContextMenu>
			<ContextMenuTrigger>{children}</ContextMenuTrigger>
			<ContextMenuContent className="w-64 rounded-md shadow-lg">
				{fileContextMenuActions.map(({ actionName, onClick, Icon, className }) => {
					return (
						<ContextMenuItem role="button" onClick={onClick} key={actionName} className={className}>
							<Icon className="w-4 h-4" />
							<span>{actionName}</span>
						</ContextMenuItem>
					);
				})}
			</ContextMenuContent>
		</ContextMenu>
	);
}

export default FileContextMenu;
