import { auth } from '@clerk/nextjs';
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
		const { name, url, size }: { name: string; url: string; size: number } =
			await req.json();
		const result = await db.attachment.create({
			data: {
				name,
				url,
				courseId,
				size,
			},
		});
		return NextResponse.json(result);
	} catch (err: any) {
		console.log('[API_COURSES_COURSEID_ATTACHMENTS_ATTACHMENTID_POST', err);
	}
}

export async function GET(
	req: Request,
	{ params: { courseId } }: CourseParams
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const result: { id: string; name: string; url: string }[] =
			await db.attachment.findMany({
				where: {
					courseId,
				},
				select: {
					id: true,
					name: true,
					url: true,
				},
			});
		return NextResponse.json(result);
	} catch (err: any) {
		console.log('[API_COURSES_COURSEID_ATTACHMENTS_ATTACHMENTID_GET', err);
	}
}
