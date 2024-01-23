import { db } from '@/lib/db';

export const getProgress = async (id: string, uId: string) => {
	const items = await db.chapter.findMany({
		where: {
			isPublished: true,
			courseId: id,
		},
		select: {
			id: true,
		},
	});

	const chapterIds = items.map((item) => item.id);
	const totalChapters = items?.length;

	const data = await db.userProgress.findMany({
		where: {
			isCompleted: true,
			userId: uId,
			chapterId: {
				in: chapterIds,
			},
		},
	});
	return (data.length / totalChapters) * 100;
};
