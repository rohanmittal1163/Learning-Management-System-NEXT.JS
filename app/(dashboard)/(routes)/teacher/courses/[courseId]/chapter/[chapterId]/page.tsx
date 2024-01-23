import { ArrowLeft, Eye, LayoutDashboard, VideoIcon } from 'lucide-react';
import SubHeading from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/subHeading';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

import { Banner } from '@/components/banner';
import { Chapter } from '@prisma/client';
import Heading from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapter/_components/chapterHeading';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DescriptionForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapter/_components/descriptionForm';
import TitleForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapter/_components/titleForm';
import AccessForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapter/_components/accessForm';
import VideoForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapter/_components/videoForm';

interface CourseChapterParams {
	params: {
		chapterId: string;
		courseId: string;
	};
}

export default async function ChapterIdPage({
	params: { courseId, chapterId },
}: CourseChapterParams) {
	const { userId } = auth();
	if (!userId) {
		redirect('/');
	}
	const chapter: Chapter | null = await db.chapter.findUnique({
		where: {
			id: chapterId,
			courseId,
		},
	});

	if (!chapter) {
		redirect('/teacher/create');
	}

	return (
		<div className="h-[calc(100vh-64px)] overflow-y-scroll 	">
			{!chapter.isPublished && (
				<Banner
					label="This chapter is unpublished. It will not be visible students"
					variant={'warning'}
				/>
			)}
			<div className="p-6 py-4 flex flex-col gap-6 ">
				<Link href={`/teacher/courses/${chapter.courseId}`} className="w-fit">
					<Button
						variant="link"
						className="text-sm flex items-center gap-2 p-0  w-fit hover:animate-bounce "
					>
						<ArrowLeft size={15} />
						<p>Back to course setup</p>
					</Button>
				</Link>
				<Heading chapter={chapter} />

				<div className="flex items-start flex-col md:flex-row gap-6 w-full">
					<div className="flex flex-col gap-5 w-full">
						<SubHeading label="Customize your chapter" ico={LayoutDashboard} />
						<TitleForm chapter={chapter} />
						<DescriptionForm chapter={chapter} />
						<SubHeading label="Access settings" ico={Eye} />
						<AccessForm chapter={chapter} />
					</div>
					<div className="flex flex-col gap-5 w-full">
						<div className="flex flex-col gap-5 w-full">
							<SubHeading label="Add a video" ico={VideoIcon} />
							<VideoForm chapter={chapter} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
