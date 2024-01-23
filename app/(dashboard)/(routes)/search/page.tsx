import { getDetails } from '@/actions/GET/get-search';
import Categories from '@/app/(dashboard)/(routes)/search/_components/categories';
import CoursesList from '@/app/(dashboard)/_components/coursesList';
import SearchInput from '@/app/(dashboard)/(routes)/search/_components/searchInput';
import { Category, Chapter, Course, Purchase } from '@prisma/client';
import { db } from '@/lib/db';

export default async function Search({
	searchParams: { categoryId, title },
}: {
	searchParams: { categoryId: string; title: string };
}) {
	const categories: Category[] = await db.category.findMany({});
	const items: (Course & { chapters: Chapter[] } & {
		category: Category | null;
	} & {
		purchases: Purchase[];
	} & { progress: null | number })[] = await getDetails(categoryId, title);

	return (
		<div className="w-full p-5 h-[calc(100vh-64px)] overflow-y-auto flex flex-col gap-3 ">
			<div className=" hidden md:flex absolute -top-[52px] left-2">
				<SearchInput />
			</div>
			<Categories items={categories} />
			<CoursesList items={items} />
		</div>
	);
}
