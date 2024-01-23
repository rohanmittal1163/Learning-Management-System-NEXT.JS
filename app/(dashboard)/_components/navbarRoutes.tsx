import { UserButton } from '@clerk/nextjs';
import { Button } from '../../../components/ui/button';
import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function NavbarRoutes() {
	const pathname = usePathname();
	const isSearchVisible = pathname === '/search';
	const isDashboardVisible = pathname === '/';

	return (
		<div className="flex items-center text-sm gap-4 ml-auto">
			{isDashboardVisible || isSearchVisible ? (
				<Link href="/teacher/courses">
					<Button variant="ghost" size="sm" className="font-bold">
						Teacher Mode
					</Button>
				</Link>
			) : (
				<Link href="/">
					<Button
						variant="ghost"
						size="sm"
						className="flex gap-3 font-bold text-sm"
					>
						<LogOut size="20" />
						Exit
					</Button>
				</Link>
			)}

			<UserButton afterSignOutUrl="/" />
		</div>
	);
}
