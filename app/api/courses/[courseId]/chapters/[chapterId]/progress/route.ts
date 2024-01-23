import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ChapterIdParams } from '../route';

export async function POST(
	req: Request,
	{ params: { chapterId } }: ChapterIdParams
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		const { isCompleted, position } = await req.json();
		await db.userProgress.upsert({
			where: {
				userId_chapterId: {
					userId,
					chapterId,
				},
			},
			update: {
				isCompleted,
			},
			create: {
				userId,
				chapterId,
				isCompleted,
			},
		});

		const url: { id: string } | null = await db.chapter.findFirst({
			where: {
				position: position + 1,
			},
			select: {
				id: true,
			},
		});
		return NextResponse.json(url);
	} catch (err: any) {
		return new NextResponse(err);
	}
}
