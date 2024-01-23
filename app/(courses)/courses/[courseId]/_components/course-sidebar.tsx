import { Progress } from '@/components/ui/progress';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { Chapter, Course, UserProgress } from '@prisma/client';
import { redirect } from 'next/navigation';
import CourseSidebarItem from './course-sidebarItem';

interface CourseSidebarProps {
	course: Course & {
		chapters: (Chapter & {
			userProgress: UserProgress[] | null;
		})[];
	};
	progressCount: number;
}

export default async function CourseSidebar({
	course,
	progressCount,
}: CourseSidebarProps) {
	const { userId } = auth();
	if (!userId) {
		redirect('/');
	}
	const purchase = await db.purchase.findUnique({
		where: {
			userId_courseId: {
				userId,
				courseId: course.id,
			},
		},
	});
	return (
		<div className="flex flex-col gap-0 border-r-solid border-r-2 border-slate-300/30 w-full">
			<div className="h-16  flex w-full  items-center justify-center  font-bold border-b-2 border-b-solid border-slate-100 capitalize">
				<p className="line-clamp-1">{course.title}</p>
			</div>

			{purchase && (
				<div className="flex flex-col gap-1 p-5 text-xs text-emerald-600 font-normal tracking-wide w-full  ">
					<Progress
						value={progressCount}
						className="w-full  h-2 bg-white/40 border-[1px] border-solid border-slate-300 "
						indicatorColor="bg-green-400"
					/>
					<p>{progressCount}% Complete</p>
				</div>
			)}

			<div className="flex flex-col gap-0 justify-center w-full">
				{course.chapters.map(
					(
						chapter: Chapter & {
							userProgress: UserProgress[] | null;
						},
						idx: number
					) => {
						return (
							<CourseSidebarItem
								key={idx}
								title={chapter.title}
								courseId={course.id}
								chapterId={chapter.id}
								isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
								isPurchased={!!purchase}
								isFree={chapter.isFree}
							/>
						);
					}
				)}
			</div>
		</div>
	);
}
