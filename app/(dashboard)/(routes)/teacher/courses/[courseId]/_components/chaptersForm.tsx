'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Draggable } from 'react-drag-reorder';
import { useEffect, useState } from 'react';
import { Edit2Icon, GripVertical, PlusCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ButtonForm from '../../../../../../../components/button';
import { Button } from '../../../../../../../components/ui/button';
import { Input } from '../../../../../../../components/ui/input';
import { Chapter } from '@prisma/client';
import { Badge } from '../../../../../../../components/ui/badge';
import Link from 'next/link';
import { CourseProps } from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/page';

const formSchema = z.object({
	title: z.string().min(2, {
		message: 'Title must be at least 2 characters.',
	}),
});

export default function ChaptersForm({ course }: { course: CourseProps }) {
	const [isEditting, setEditting] = useState<boolean>(false);
	const [isSubmitting, setSubmitting] = useState<boolean>(false);
	const [isOrdering, setOrdering] = useState<boolean>(false);
	const [courseCh, setCourseCh] = useState<Chapter[] | []>([]);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
		},
	});

	useEffect(() => {
		if (!course.chapters) {
			return;
		}
		setCourseCh(course.chapters);
	}, [course.chapters]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setSubmitting(true);
			const { data } = await axios.post(
				`/api/courses/${course?.id}/chapters`,
				values
			);
			const newch = [...courseCh, data];
			setCourseCh(newch);
			toast.success('Chapter created');
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			setSubmitting(false);
			toggle();
			router.refresh();
		}
	}
	const toggle = () => {
		setEditting((prev) => !prev);
	};
	async function handlePosChange(startIndex: number, endIndex: number) {
		if (startIndex == endIndex) {
			return;
		}
		if (!course.chapters) {
			return;
		}
		const data = course.chapters;
		const rem = data?.splice(startIndex, 1);
		data?.splice(endIndex, 0, rem![0]);
		try {
			setOrdering(true);
			await axios.put(`/api/courses/${course?.id}/chapters`, data);
			toast.success('Chapters Reordered');
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			setOrdering(false);
			router.refresh();
		}
	}
	return (
		<div className=" bg-sky-50 text-sm flex flex-col gap-2 p-4 rounded-md relative ">
			<div className="flex items-center justify-between ">
				<p className="font-semibold text-sm">Course chapters</p>
				<Button
					variant="link"
					className="flex items-center text-sm gap-2"
					onClick={toggle}
				>
					{isEditting ? (
						<p className="font-semibold">Cancel</p>
					) : (
						<>
							<PlusCircle size={15} />
							<p className="font-semibold">Add a chapter</p>
						</>
					)}
				</Button>
			</div>
			{isEditting ? (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-2"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Enter the chapter title"
											{...field}
											className="focus-visible:ring-transparent"
											disabled={isSubmitting}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<ButtonForm isSubmitting={isSubmitting} />
					</form>
				</Form>
			) : courseCh.length > 0 ? (
				<>
					<Draggable
						onPosChange={(currentPos, newPos) => {
							handlePosChange(currentPos, newPos);
						}}
					>
						{courseCh?.map((chapter: Chapter, idx: number) => {
							return (
								<div
									key={idx}
									id="chapter"
									className={`flex  overflow-x-scroll flex-row  md:flex-row justify-between ${
										chapter.isPublished ? 'bg-sky-600/10' : 'bg-zinc-600/10'
									}  rounded-md`}
								>
									<div className="flex items-center gap-2 w-full ">
										<GripVertical
											size={40}
											className="border-r-2 h-full px-2 border-r-solid border-slate-300 hover:bg-white/40"
										/>
										<p className="text-sm py-3 font-semibold bg-gray-90 text-ellipsis overflow-hidden ">
											{chapter.title}
										</p>
									</div>
									<div className="flex items-center gap-2">
										{chapter.isFree && <Badge>Free</Badge>}
										{chapter.isPublished ? (
											<Badge className="bg-sky-600 hover:bg-sky-500 ">
												Published
											</Badge>
										) : (
											<Badge className="bg-gray-400 hover:bg-gray-500">
												Draft
											</Badge>
										)}
										<Link
											href={`/teacher/courses/${course.id}/chapter/${chapter.id}`}
										>
											<Button variant="ghost" size="sm">
												<Edit2Icon size={15} />
											</Button>
										</Link>
									</div>
								</div>
							);
						})}
					</Draggable>

					<div className="text-sm italic text-gray-400">
						<p>Drag and drop to reorder the chapters</p>
					</div>
				</>
			) : (
				<div className="text-sm italic text-gray-400 flex flex-col gap-3">
					<p>No chapters</p>
					<p>Drag and drop to reorder the chapters</p>
				</div>
			)}
			{isOrdering && (
				<div className="bg-sky-700/30 absolute h-full w-full -top-0.5 -left-0.5 rounded-md flex flex-col items-center justify-center">
					<p className="animate-spin w-6 aspect-square  rounded-full border-2 border-solid border-black border-r-0 border-t-0"></p>
				</div>
			)}
		</div>
	);
}
