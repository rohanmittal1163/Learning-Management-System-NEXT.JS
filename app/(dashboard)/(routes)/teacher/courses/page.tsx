import { columns } from './columns';
import { DataTable } from './data-table';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Course } from '@prisma/client';

export default async function Courses() {
	const { userId } = auth();
	if (!userId) {
		redirect('/');
	}
	const data: Course[] = await db.course.findMany({
		where: {
			userId,
		},
	});

	return (
		<div className="h-[calc(100vh-64px)] p-4 overflow-y-scroll flex flex-col gap-4">
			<DataTable columns={columns} data={data} />
		</div>
	);
}
