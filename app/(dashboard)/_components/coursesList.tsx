import { Category, Chapter, Course, Purchase } from '@prisma/client';
import React from 'react';
import CourseCard from './courseCard';

export default async function CoursesList({
	items,
}: {
	items: (Course & { chapters: Chapter[] } & {
		category: Category | null;
	} & {
		purchases: Purchase[];
	} & { progress: null | number })[];
}) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-5 ">
			{items.map(
				(
					val: Course & { chapters: Chapter[] } & {
						category: Category | null;
					} & {
						purchases: Purchase[];
					} & { progress: null | number },
					idx: number
				) => {
					return (
						<CourseCard
							key={idx}
							url={val.imageUrl}
							title={val.title}
							catName={val.category?.name}
							chLength={val.chapters?.length}
							progress={val.progress}
							price={val.price}
							courseId={val.id}
							chapterId={val.chapters[0].id}
						/>
					);
				}
			)}
		</div>
	);
}
