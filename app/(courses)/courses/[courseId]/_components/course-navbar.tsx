import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { LogOut, MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import CourseSidebar from './course-sidebar';
import { Chapter, Course, UserProgress } from '@prisma/client';

export default function CourseNavbar({
	course,
	progressCount,
}: {
	course: Course & {
		chapters: (Chapter & {
			userProgress: UserProgress[] | null;
		})[];
	};
	progressCount: number;
}) {
	return (
		<>
			<Sheet>
				<SheetTrigger>
					<MenuIcon className="md:hidden" />
				</SheetTrigger>
				<SheetContent side={'left'} className="p-0 m-0">
					<CourseSidebar course={course} progressCount={progressCount} />
				</SheetContent>
			</Sheet>

			<div className="flex items-center ml-auto gap-2">
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

				<UserButton afterSignOutUrl="/" />
			</div>
		</>
	);
}
