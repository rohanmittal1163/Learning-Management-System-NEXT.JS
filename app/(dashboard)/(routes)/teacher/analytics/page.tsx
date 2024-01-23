import { cn } from '@/lib/utils';
import InfoCard from './_components/infoCard';
import { AnalyticsChart } from './_components/analyticsChart';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Course, Purchase } from '@prisma/client';

export default async function Analytics() {
	const { userId } = auth();
	if (!userId) {
		redirect('/');
	}
	const data: (Course & { purchases: Purchase[] })[] = await db.course.findMany(
		{
			where: {
				userId,
				isPublished: true,
			},
			orderBy: {
				created_at: 'asc',
			},
			include: {
				purchases: true,
			},
		}
	);
	const totalRevenue = data.reduce(
		(a: number, b: Course & { purchases: Purchase[] }) => {
			return a + (b.price ?? 0) * b.purchases.length;
		},
		0
	);
	const totalSales = data.filter((val) => val.purchases.length).length;
	return (
		<div
			className={cn(
				'flex flex-col gap-3 p-6 h-[calc(100vh-64px)] w-full overflow-y-auto '
			)}
		>
			<div className={cn('flex gap-3 items-center flex-row')}>
				<InfoCard label="total revenue" revenue={totalRevenue} />
				<InfoCard label="total sales" sales={totalSales} />
			</div>
			<AnalyticsChart
				labels={data.map(
					(val: Course & { purchases: Purchase[] }) => val.title
				)}
				data={data.map(
					(val: Course & { purchases: Purchase[] }) =>
						(val.price ?? 0) * val.purchases.length
				)}
			/>
		</div>
	);
}
