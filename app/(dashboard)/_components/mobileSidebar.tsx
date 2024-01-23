import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetTrigger,
} from '@/components/ui/sheet';
import Sidebar from './sidebar';
import { MenuIcon } from 'lucide-react';
import SearchInput from '../(routes)/search/_components/searchInput';
export default function MobileSidebar() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<MenuIcon className="md:hidden" />
			</SheetTrigger>
			<SheetContent className="p-0 m-0" side="left">
				<Sidebar />
				<SheetFooter className="pt-5">
					<SearchInput />
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
