import { getPurchasedCourses } from '@/actions/GET/get-purchasedCourses';
import CourseCard from '@/app/(dashboard)/_components/courseCard';
import InfoCard from '@/app/(dashboard)/(routes)/(root)/_components/infoCard';
import { Category, Chapter, Course, Purchase } from '@prisma/client';
import { CheckCircle2, Clock } from 'lucide-react';

export default async function Root() {
	const items: (Purchase & {
		course: Course & {
			category: Category | null;
			chapters: Chapter[];
		};
		progress: number;
		isCompleted: boolean;
	})[] = await getPurchasedCourses();
	const completedFields: number = items.filter((item) => {
		return item.isCompleted;
	}).length;
	const progressCourses: number = items.length - completedFields;

	return (
		<div className="px-5 py-5 flex flex-col gap-7 h-[calc(100vh-64px)] overflow-y-auto">
			<div className="flex flex-col md:flex-row items-center justify-center gap-4">
				<InfoCard
					title="in progress"
					icon={Clock}
					textColor="text-sky-700"
					bgColor="bg-sky-200"
					val={progressCourses}
				/>
				<InfoCard
					title="completed"
					icon={CheckCircle2}
					textColor="text-emerald-700"
					bgColor="bg-emerald-200"
					val={completedFields}
				/>
			</div>
			<div className="grid grid-cols-4 gap-5">
				{items.map(
					(
						item: Purchase & {
							course: Course & {
								category: Category | null;
								chapters: Chapter[];
							};
							progress: number;
							isCompleted: boolean;
						},
						idx: number
					) => {
						return (
							<CourseCard
								key={idx}
								url={item.course.imageUrl}
								title={item.course.title}
								catName={item.course.category?.name}
								chLength={item.course.chapters.length}
								price={item.course.price}
								progress={item.progress}
								courseId={item.courseId}
								chapterId={item.course.chapters[0].id}
							/>
						);
					}
				)}
			</div>
		</div>
	);
}
