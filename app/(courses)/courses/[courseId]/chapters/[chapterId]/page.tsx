import { redirect } from 'next/navigation';
import { Banner } from '@/components/banner';
import Video from 'next-video';
import { Lock, StickyNote } from 'lucide-react';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import CourseEnrollButton from './_components/course-enroll-button';
import CourseProgressButton from './_components/course-progress-button';
import {
	Attachment,
	Chapter,
	Course,
	Purchase,
	UserProgress,
} from '@prisma/client';

export default async function ChaptersPage({
	params: { courseId, chapterId },
}: {
	params: { courseId: string; chapterId: string };
}) {
	const { userId } = auth();
	if (!userId) {
		return redirect('/');
	}

	const purchase: Purchase | null = await db.purchase.findUnique({
		where: {
			userId_courseId: {
				userId,
				courseId,
			},
		},
	});

	const chapter: (Chapter & { userProgress: UserProgress[] }) | null =
		await db.chapter.findUnique({
			where: {
				id: chapterId,
				isPublished: true,
			},
			include: {
				userProgress: {
					where: {
						userId,
					},
				},
			},
		});

	const course: (Course & { attachments: Attachment[] }) | null =
		await db.course.findUnique({
			where: {
				id: courseId,
				isPublished: true,
			},
			include: {
				attachments: true,
			},
		});

	return (
		<>
			{!chapter?.isFree && !purchase && (
				<Banner
					label="You need to purchase this course to watch this chapter."
					variant={'warning'}
				/>
			)}

			{chapter?.userProgress?.[0]?.isCompleted && (
				<Banner
					label="You already completed this chapter."
					variant={'success'}
				/>
			)}

			<div className="flex flex-col gap-2 mx-auto w-4/5 justify-center  mt-3">
				{purchase || chapter?.isFree ? (
					<Video src={chapter?.videoUrl as string} className="w-1/2" />
				) : (
					<div className="w-full aspect-video bg-slate-600 text-white flex items-center justify-center">
						<Lock size={30} />
					</div>
				)}

				<div className="flex flex-col w-full  md:flex-row items-center justify-between border-b-[1px] border-b-solid capitalize border-b-slate-400/60 py-4">
					<p className="text-xl font-bold">{chapter?.title}</p>
					<div>
						{purchase ? (
							<CourseProgressButton
								isCompleted={chapter?.userProgress?.[0]?.isCompleted}
								courseId={courseId}
								chapterId={chapterId}
								position={chapter?.position}
							/>
						) : (
							<CourseEnrollButton courseId={courseId} price={course?.price} />
						)}
					</div>
				</div>

				<div className="flex flex-col gap-1 font-semibold border-b-[1px] border-b-solid border-b-slate-400/60 pb-4">
					<p>Objectives: </p>
					<p
						className="text-justify font-normal text-sm"
						dangerouslySetInnerHTML={{
							__html: chapter?.description || 'No description selected',
						}}
					/>
				</div>

				{purchase &&
					course?.attachments.map((attach: Attachment, idx: number) => {
						return (
							<div
								key={idx}
								className="flex items-center gap-2 bg-sky-200 text-sky-600 text-sm p-3 rounded-md "
							>
								<StickyNote size={15} />
								<a
									target="_blank"
									href={attach.url}
									className="hover:underline"
								>
									{attach.name}
								</a>
							</div>
						);
					})}
			</div>
		</>
	);
}
