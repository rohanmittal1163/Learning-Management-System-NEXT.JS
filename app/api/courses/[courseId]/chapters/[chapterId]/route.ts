import { auth } from '@clerk/nextjs';
import { Chapter, UserProgress } from '@prisma/client';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export interface ChapterIdParams {
	params: {
		chapterId: string;
	};
}

export async function DELETE(
	req: Request,
	{ params: { chapterId } }: ChapterIdParams
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const result: Chapter = await db.chapter.delete({
			where: {
				id: chapterId,
			},
		});
		return NextResponse.json(result);
	} catch (err: any) {
		console.log('[API_COURSES_COURSEID_CHAPTERS_CHAPTERID_DELETE]', err);
	}
}

export async function PUT(
	req: Request,
	{ params: { chapterId } }: ChapterIdParams
) {
	const { userId } = auth();
	if (!userId) {
		return new NextResponse('Unauthorized', { status: 401 });
	}
	try {
		const values: any = await req.json();
		const result: Chapter = await db.chapter.update({
			where: {
				id: chapterId,
			},
			data: {
				...values,
			},
		});
		return NextResponse.json(result);
	} catch (err: any) {
		return new NextResponse(err);
	}
}

export async function POST(
	req: Request,
	{ params: { chapterId } }: ChapterIdParams
): Promise<NextResponse<UserProgress>> {
	const { userId } = auth();
	if (!userId) {
		return new NextResponse('Unauthorized', { status: 401 });
	}
	try {
		const { isCompleted } = await req.json();
		const result: UserProgress = await db.userProgress.create({
			data: {
				userId,
				isCompleted,
				chapterId,
			},
		});
		return NextResponse.json(result);
	} catch (err: any) {
		return new NextResponse(err);
	}
}
