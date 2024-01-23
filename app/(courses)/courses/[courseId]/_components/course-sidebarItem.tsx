'use client';
import { cn } from '@/lib/utils';
import { CheckCircle, Lock, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CourseSidebarItem({
	title,
	courseId,
	chapterId,
	isCompleted,
	isPurchased,
	isFree,
}: {
	title: string;
	courseId: string;
	chapterId: string;
	isCompleted: boolean;
	isPurchased: boolean;
	isFree: boolean;
}) {
	const pathname = usePathname();
	const isActive = pathname.includes(chapterId);
	const Icon = isPurchased
		? isCompleted
			? CheckCircle
			: PlayCircle
		: isFree
		? PlayCircle
		: Lock;
	return (
		<>
			<Link href={`/courses/${courseId}/chapters/${chapterId}`}>
				<div
					className={cn(
						'flex flex-row items-center gap-2 capitalize text-slate-500 text-sm font-[500] transition-all hover:text-slate-600 hover:bg-slate-300/20 p-5',
						isActive &&
							'text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700',
						isCompleted && 'text-emerald-700 hover:text-emerald-700',
						isCompleted && isActive && 'bg-emerald-200/20'
					)}
				>
					<Icon size={20} />
					<p>{title}</p>
				</div>
			</Link>
		</>
	);
}
