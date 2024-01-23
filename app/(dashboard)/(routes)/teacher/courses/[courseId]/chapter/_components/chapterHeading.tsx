'use client';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../../../../../../../../components/ui/button';
import { Chapter } from '@prisma/client';
import ReactConfetti from 'react-confetti';
import { useConfettiStore } from '@/hooks/use-confetti-store';

export default function Heading({ chapter }: { chapter: Chapter }) {
	const initialData = [chapter.title, chapter.description, chapter.videoUrl];

	const completedFields: number = initialData.filter(
		(val) => !!val == true
	).length;

	const totalFields: number = initialData.length;
	const progress: string = `${completedFields}/${totalFields}`;
	const router = useRouter();
	const [isSubmitting, setSubmitting] = useState<boolean>(false);

	useEffect(() => {
		confetti.onClose();
	}, []);
	const handleDelete = async () => {
		try {
			setSubmitting(true);
			await axios.delete(
				`/api/courses/${chapter.courseId}/chapters/${chapter.id}`
			);
			toast.success('Chapter Deleted');
			router.push(`/teacher/courses/${chapter.courseId}`);
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			setSubmitting(false);
			router.refresh();
		}
	};

	const handlePublish = async () => {
		try {
			await axios.put(
				`/api/courses/${chapter.courseId}/chapters/${chapter.id}`,
				{
					isPublished: !chapter.isPublished,
				}
			);
			if (chapter.isPublished) {
				confetti.onClose();
			} else {
				confetti.onOpen();
			}
			toast.success(
				`Chapter ${chapter.isPublished ? 'unpublished' : 'published'}`
			);
			router.refresh();
		} catch (err: any) {
			toast.error(err.message);
		}
	};
	const confetti = useConfettiStore();

	return (
		<div className="flex items-center justify-between ">
			{confetti.isOpen && (
				<ReactConfetti
					recycle={false}
					gravity={1}
					className="w-full h-[calc(100vh-64px)]"
				/>
			)}
			<div className="flex flex-col gap-1">
				<p className="text-2xl font-semibold">Chapter creation</p>
				<p className="text-sm text-gray-400 capitalize">
					complete all fields
					<span className="font-semibold"> ({progress})</span>
				</p>
			</div>

			<div className="flex items-center justify-center gap-2">
				<Button
					variant="ghost"
					className="capitalize"
					disabled={completedFields !== totalFields}
					onClick={handlePublish}
				>
					{chapter.isPublished ? 'Unpublish' : 'Publish'}
				</Button>
				<Button size="sm" disabled={isSubmitting}>
					<Trash onClick={handleDelete} />
				</Button>
			</div>
		</div>
	);
}
