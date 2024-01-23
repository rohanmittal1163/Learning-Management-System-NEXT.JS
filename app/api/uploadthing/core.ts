import { auth } from '@clerk/nextjs';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const handleAuth = () => {
	const { userId } = auth();
	if (!userId) throw new Error('Unauthorized');
	return { userId };
};
const f = createUploadthing();

export const ourFileRouter = {
	courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(handleAuth)
		.onUploadComplete(() => {}),
	courseAttachments: f({
		pdf: { maxFileCount: 1, maxFileSize: '4MB' },
		text: { maxFileCount: 1, maxFileSize: '4MB' },
	})
		.middleware(handleAuth)
		.onUploadComplete(() => {}),
	chapterVideo: f({ video: { maxFileSize: '512GB', maxFileCount: 1 } })
		.middleware(handleAuth)
		.onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
