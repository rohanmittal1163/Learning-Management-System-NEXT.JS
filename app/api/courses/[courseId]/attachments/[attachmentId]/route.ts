import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { Attachment } from '@prisma/client';
import { NextResponse } from 'next/server';

interface AttachmentIdParams {
	params: {
		attachmentId: string;
	};
}

export async function DELETE(
	req: Request,
	{ params: { attachmentId } }: AttachmentIdParams
) {
	const { userId } = auth();
	if (!userId) {
		return new NextResponse('Unauthorized', { status: 401 });
	}

	const result: Attachment = await db.attachment.delete({
		where: {
			id: attachmentId,
		},
	});

	return NextResponse.json(result);
}
