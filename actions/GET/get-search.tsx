import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { getProgress } from './get-progress';
import { Category, Chapter, Course, Purchase } from '@prisma/client';

export const getDetails = async (
	categoryId: string,
	title: string
): Promise<
	(Course & { chapters: Chapter[] } & {
		category: Category | null;
	} & {
		purchases: Purchase[];
	} & { progress: null | number })[]
> => {
	const { userId } = auth();
	if (!userId) {
		return [];
	}
	const items: (Course & { chapters: Chapter[] } & {
		category: Category | null;
	} & {
		purchases: Purchase[];
	})[] = await db.course.findMany({
		where: {
			isPublished: true,
			title: {
				contains: title,
			},
			categoryId,
		},
		include: {
			category: true,
			chapters: {
				where: {
					isPublished: true,
				},
				orderBy: {
					position: 'asc',
				},
			},
			purchases: {
				where: {
					userId,
				},
			},
		},
		orderBy: {
			created_at: 'asc',
		},
	});
	const data: (Course & { chapters: Chapter[] } & {
		category: Category | null;
	} & {
		purchases: Purchase[];
	} & { progress: null | number })[] = await Promise.all(
		items.map(async (item) => {
			if (item.purchases.length == 0) {
				return {
					...item,
					progress: null,
				};
			}
			return {
				...item,
				progress: await getProgress(item.id, userId),
			};
		})
	);
	return data;
};
