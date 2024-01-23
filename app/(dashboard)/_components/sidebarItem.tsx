'use client';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarItem({
	href,
	icon: Icon,
	label,
}: {
	href: string;
	label: string;
	icon: LucideIcon;
}) {
	const pathname = usePathname();
	const isActive = pathname === href;
	return (
		<Link
			href={href}
			className={`flex hover:bg-sky-200/20 transition-all flex-row items-center gap-2 text-sm px-5 py-4 text-gray-600 ${
				isActive &&
				'bg-sky-500/10 font-bold border-r-4 border-r-solid border-sky-500 text-sky-500'
			}`}
		>
			<Icon />
			<p>{label}</p>
		</Link>
	);
}
