import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function CoursePage({
	params: { courseId },
}: {
	params: { courseId: string };
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
			},
		},
	});
	if (!course) {
		return redirect('/');
	}
	return redirect(`/courses/${courseId}/chapters/${course.chapters[0].id}`);
}
