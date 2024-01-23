'use client';
import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactConfetti from 'react-confetti';

export default function CourseProgressButton({
	isCompleted,
	courseId,
	chapterId,
	position,
}: {
	isCompleted: boolean | undefined;
	courseId: string;
	chapterId: string;
	position: number | undefined;
}) {
	const router = useRouter();
	const confetti = useConfettiStore();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	useEffect(() => {
		confetti.onClose();
	}, []);
	const handleSubmit = async () => {
		try {
			const res = await axios.post(
				`/api/courses/${courseId}/chapters/${chapterId}/progress`,
				{ isCompleted: !isCompleted, position }
			);

			if (!isCompleted && res.data == null) {
				confetti.onOpen();
			}

			if (!isCompleted && res.data.id) {
				router.push(`/courses/${courseId}/chapters/${res.data.id}`);
			}
			router.refresh();
		} catch (err: any) {
			toast.error(err.message);
		}
	};
	const Icon = isCompleted ? XCircle : CheckCircle;
	return (
		<>
			{confetti.isOpen && (
				<ReactConfetti
					recycle={false}
					gravity={1}
					className="w-full h-[calc(100vh-64px)]"
				/>
			)}
			<Button
				variant={isCompleted ? 'outline' : 'success'}
				onClick={handleSubmit}
			>
				{isCompleted ? 'Not completed' : 'mark as completed'}
				<Icon size={20} />
			</Button>
		</>
	);
}
