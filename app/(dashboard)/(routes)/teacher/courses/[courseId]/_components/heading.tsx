'use client';
import { Trash } from 'lucide-react';
import { Button } from '../../../../../../../components/ui/button';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Chapter } from '@prisma/client';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import ReactConfetti from 'react-confetti';
import { CourseProps } from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/page';

export default function Heading({ course }: { course: CourseProps }) {
	const initialData = [
		course?.title,
		course?.description,
		course?.price,
		course?.imageUrl,
		course?.categoryId,
		course.chapters?.some((val: Chapter) => val.isPublished === true),
	];

	const completedFields: number = initialData.filter(
		(val) => !!val == true
	).length;
	const totalFields: number = initialData.length;
	const progress: string = `${completedFields}/${totalFields}`;
	const router = useRouter();
	const [isSubmitting, setSubmitting] = useState<boolean>(false);
	const handleDelete = async (): Promise<void> => {
		try {
			setSubmitting(true);
			await axios.delete(`/api/courses/${course?.id}`);
			toast.success('Course Deleted');
			router.push('/teacher/create');
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			setSubmitting(false);
		}
	};
	useEffect(() => {
		confetti.onClose();
	}, []);

	useEffect(() => {
		if (completedFields != totalFields) {
			unPublish();
		}
	}, [completedFields, totalFields]);

	const unPublish = async () => {
		await axios.put(`/api/courses/${course.id}`, {
			isPublished: false,
		});
		router.refresh();
	};

	const handlePublish = async () => {
		try {
			await axios.put(`/api/courses/${course.id}`, {
				isPublished: !course.isPublished,
			});
			toast.success(
				`Chapter ${course.isPublished ? 'unpublished' : 'published'}`
			);
			if (course.isPublished) {
				confetti.onClose();
			} else {
				confetti.onOpen();
			}
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
				<p className="text-2xl font-semibold">Course setup</p>
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
					{course.isPublished ? 'Unpublish' : 'Publish'}
				</Button>
				<Button size="sm" disabled={isSubmitting}>
					<Trash onClick={handleDelete} />
				</Button>
			</div>
		</div>
	);
}
