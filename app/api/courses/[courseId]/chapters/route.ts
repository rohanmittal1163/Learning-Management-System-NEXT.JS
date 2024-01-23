import { auth } from '@clerk/nextjs';
import { Chapter } from '@prisma/client';
import { NextResponse } from 'next/server';
import { CourseParams } from '../route';
import { db } from '@/lib/db';

export async function POST(
	req: Request,
	{ params: { courseId } }: CourseParams
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		const { title } = await req.json();

		const lastIndex: Chapter | null = await db.chapter.findFirst({
			where: {
				courseId,
			},
			orderBy: {
				position: 'desc',
			},
		});
		const result: Chapter = await db.chapter.create({
			data: {
				title,
				courseId,
				position: lastIndex?.position ? lastIndex?.position + 1 : 1,
			},
		});

		return NextResponse.json(result);
	} catch (err: any) {
		console.log('[API_COURSES_COURSEID_CHAPTERS_CHAPTERID_POST]', err);
	}
}

export async function PUT(req: Request) {
	const { userId } = auth();
	if (!userId) {
		return new NextResponse('Unauthorized', { status: 401 });
	}
	try {
		const values: Chapter[] = await req.json();
		values.forEach(async (ele: Chapter, idx: number) => {
			await db.chapter.update({
				where: {
					id: ele.id,
				},
				data: {
					position: idx + 1,
				},
			});
		});
		return new NextResponse('done', { status: 200 });
	} catch (err: any) {
		return new NextResponse(err);
	}
}
