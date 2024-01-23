import {
	BadgeDollarSign,
	Layers3,
	LayoutDashboard,
	ListChecksIcon,
} from 'lucide-react';
import TitleForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/titleForm';
import Heading from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/heading';
import SubHeading from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/subHeading';
import AmountForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/amountForm';
import ImageForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/imageForm';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import DescriptionForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/descriptionForm';
import CategoryForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/categoryForm';
import AttachmentForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/attachmentForm';
import ChaptersForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/chaptersForm';
import { Banner } from '@/components/banner';
import { CourseParams } from '@/app/api/courses/[courseId]/route';
import { Attachment, Category, Chapter, Course } from '@prisma/client';
import { db } from '@/lib/db';

export interface CourseProps extends Course {
	category: Category | null;
	attachments: Attachment[] | null;
	chapters: Chapter[] | null;
}

export default async function CourseIdPage({
	params: { courseId },
}: CourseParams) {
	const { userId } = auth();
	if (!userId) {
		redirect('/');
	}
	const course:
		| (Course & {
				category: Category | null;
				attachments: Attachment[];
				chapters: Chapter[];
		  })
		| null = await db.course.findUnique({
		where: {
			id: courseId,
			userId,
		},
		include: {
			category: true,
			attachments: {
				orderBy: {
					createdAt: 'asc',
				},
			},
			chapters: {
				orderBy: {
					position: 'asc',
				},
			},
		},
	});
	const categories: Category[] = await db.category.findMany({});

	if (!course) {
		redirect('/teacher/create');
	}

	return (
		<div className="h-[calc(100vh-64px)] overflow-y-scroll">
			{!course.isPublished && (
				<Banner
					label="This course is unpublished. It will not be visible students"
					variant={'warning'}
				/>
			)}
			<div className="p-6 flex flex-col gap-10 ">
				<Heading course={course} />

				<div className="flex items-start flex-col md:flex-row gap-6 w-full">
					<div className="flex flex-col gap-5 w-full">
						<SubHeading label="Customize your course" ico={LayoutDashboard} />
						<TitleForm course={course} />
						<DescriptionForm course={course} />
						<ImageForm course={course} />
						<CategoryForm course={course} categories={categories} />
					</div>
					<div className="flex flex-col gap-5 w-full">
						<div className="flex flex-col gap-5 w-full">
							<SubHeading label="Course chapters" ico={ListChecksIcon} />
							<ChaptersForm course={course} />
						</div>
						<div className="flex flex-col gap-5 w-full">
							<SubHeading label="Sell your course" ico={BadgeDollarSign} />
							<AmountForm course={course} />
							<SubHeading label="Resources and Attachments" ico={Layers3} />
							<AttachmentForm course={course} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
