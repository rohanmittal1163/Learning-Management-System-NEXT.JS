import React from 'react';
import SidebarItem from './sidebarItem';
import { LucideIcon } from 'lucide-react';

export default function SidebarRoutes({
	routes,
}: {
	routes: {
		href: string;
		label: string;
		icon: LucideIcon;
	}[];
}) {
	return (
		<div className="flex flex-col gap-0 justify-center capitalize">
			{routes.map(
				(
					route: {
						href: string;
						label: string;
						icon: LucideIcon;
					},
					index: number
				) => {
					return (
						<React.Fragment key={index}>
							<SidebarItem {...route} />
						</React.Fragment>
					);
				}
			)}
		</div>
	);
}
