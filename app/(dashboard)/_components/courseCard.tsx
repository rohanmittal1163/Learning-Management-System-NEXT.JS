'use client';
import { Book } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CourseCard({
	url,
	title,
	catName,
	chLength,
	progress,
	price,
	courseId: id,
	chapterId: chId,
}: {
	url: string | null;
	title: string;
	catName: string | undefined;
	chLength: number;
	progress: null | number;
	price: number | null;
	courseId: string;
	chapterId: string;
}) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}
	return (
		<Link href={`/courses/${id}/chapters/${chId}`}>
			<div className="flex flex-col gap-2 rounded-md shadow-md bg-white p-3 pb-2 h-auto justify-center">
				<div>
					<Image
						src={url || ''}
						width={10000}
						height={1000}
						className="w-full h-40 rounded-md"
						alt="error loading image"
					/>
				</div>
				<div className="flex flex-col gap-0">
					<p className="font-bold capitalize">{title}</p>
					<p className="text-slate-400 text-sm  -mt-1">{catName}</p>
				</div>
				<div className="flex items-center gap-2">
					<Book
						className="text-sky-500 rounded-full bg-sky-200 p-2"
						size={30}
					/>
					<p className="text-slate-400 text-sm ">
						{chLength} {chLength > 1 ? 'Chapters' : 'Chapter'}
					</p>
				</div>
				<div className="flex flex-col gap-2">
					{progress == null ? (
						<p className="flex items-center gap-1 font-semibold">
							<span>$</span>
							<p>{price?.toFixed(2)}</p>
						</p>
					) : (
						<>
							<Progress
								value={progress}
								className="w-full h-2 bg-white/40 border-[1px] border-solid border-slate-300 "
								indicatorColor={'bg-emerald-500'}
							/>
							<p
								className={`text-emerald-500 text-xs font-semibold	`}
							>{`${progress.toFixed(2)}% Complete`}</p>
						</>
					)}
				</div>
			</div>
		</Link>
	);
}
