import Navbar from '@/app/(dashboard)/_components/navbar';
import Sidebar from '@/app/(dashboard)/_components/sidebar';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="h-full flex gap-0 ">
			<Toaster />
			<div className="hidden md:flex flex-col gap-3 border-r-2 border-r-solid border-gray-200 bg-white w-[300px] h-full overflow-x-hidden">
				<Sidebar />
			</div>
			<div className="flex flex-col w-full">
				<div className="flex w-full px-3 h-16  border-b-2 border-b-solid border-gray-200 items-center justify-between ">
					<Navbar />
				</div>
				<div className="relative">{children}</div>
			</div>
		</div>
	);
}
