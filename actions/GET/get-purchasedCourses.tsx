import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { getProgress } from './get-progress';
import { Category, Chapter, Course, Purchase } from '@prisma/client';
export const getPurchasedCourses = async (
	courseId = ''
): Promise<
	(Purchase & {
		course: Course & {
			category: Category | null;
			chapters: Chapter[];
		};
		progress: number;
		isCompleted: boolean;
	})[]
> => {
	const { userId } = auth();
	if (!userId) {
		return [];
	}
	const items: (Purchase & {
		course: Course & { category: Category | null; chapters: Chapter[] };
	})[] = await db.purchase.findMany({
		where: {
			userId,
			courseId: {
				contains: courseId,
			},
		},
		include: {
			course: {
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
				},
			},
		},
	});
	const data: Promise<
		(Purchase & {
			course: Course & {
				category: Category | null;
				chapters: Chapter[];
			};
			progress: number;
			isCompleted: boolean;
		})[]
	> = Promise.all(
		items.map(
			async (
				item: Purchase & {
					course: Course & { category: Category | null; chapters: Chapter[] };
				}
			) => {
				const progress: number = await getProgress(item.courseId, userId);

				return {
					...item,
					isCompleted: progress === 100,
					progress,
				};
			}
		)
	);
	return data;
};
