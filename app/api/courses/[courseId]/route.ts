import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { Course } from '@prisma/client';
import { NextResponse } from 'next/server';

export interface CourseParams {
	params: {
		courseId: string;
	};
}

export async function PUT(
	req: Request,
	{ params: { courseId } }: CourseParams
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		const values: any = await req.json();
		const result: Course = await db.course.update({
			where: {
				id: courseId,
			},
			data: {
				...values,
			},
		});
		return NextResponse.json(result);
	} catch (err: any) {
		console.log('[API_COURSES_COURSEID_PUT]', err);
	}
}

export async function DELETE(
	req: Request,
	{ params: { courseId } }: CourseParams
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		const result: Course = await db.course.delete({
			where: {
				id: courseId,
			},
		});
		return NextResponse.json(result);
	} catch (err: any) {
		console.log('[API_COURSES_COURSEID_DELETE]', err);
	}
}
