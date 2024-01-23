import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { Course } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		const { title } = await req.json();
		const result: Course = await db.course.create({
			data: {
				title,
				userId,
			},
		});
		return NextResponse.json(result);
	} catch (err: any) {
		console.log('[API_COURSES_POST]', err);
	}
}
