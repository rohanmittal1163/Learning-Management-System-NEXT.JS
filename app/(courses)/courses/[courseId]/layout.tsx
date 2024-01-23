import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { getProgress } from '@/actions/GET/get-progress';
import { Toaster } from '@/components/ui/toaster';
import CourseSidebar from './_components/course-sidebar';
import CourseNavbar from './_components/course-navbar';

export default async function CourseChapterLayout({
	children,
	params: { courseId, chapterId },
}: {
	children: React.ReactNode;
	params: { courseId: string; chapterId: string };
}) {
	const { userId } = auth();
	if (!userId) {
		redirect('/');
	}
	const course = await db.course.findUnique({
		where: {
			id: courseId,
			isPublished: true,
		},
		include: {
			chapters: {
				where: {
					isPublished: true,
				},
				orderBy: {
					position: 'asc',
				},
				include: {
					userProgress: {
						where: {
							userId,
							chapterId,
						},
					},
				},
			},
		},
	});
	if (!course) {
		return redirect('/');
	}
	const progressCount = await getProgress(courseId, userId);
	return (
		<div className="w-full h-full overflow-hidden flex flex-row gap-0 ">
			<Toaster />
			<div className="w-80 h-screen hidden md:flex">
				<CourseSidebar course={course} progressCount={progressCount} />
			</div>
			<div className="w-full h-full">
				<div className="flex w-full px-3 h-16  border-b-2 border-b-solid border-gray-200 items-center justify-between">
					<CourseNavbar course={course} progressCount={progressCount} />
				</div>
				<div className="w-full h-[calc(100vh-64px)] overflow-auto	">
					{children}
				</div>
			</div>
		</div>
	);
}
