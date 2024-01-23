'use client';
import { UploadDropzone } from '@/lib/uploadthing';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { LucideUploadCloud, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ButtonTitle } from '../../../../../../../../components/button';
import { Chapter } from '@prisma/client';
import Video from 'next-video';

export default function VideoForm({ chapter }: { chapter: Chapter }) {
	const [isEditting, setEditting] = useState<boolean>(false);
	const router = useRouter();

	const formSchema = z.object({
		videoUrl: z.string().min(2, {
			message: `Video is required`,
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			videoUrl: chapter.videoUrl || '',
		},
	});
	async function onSubmit(videoUrl: string) {
		try {
			await axios.put(
				`/api/courses/${chapter.courseId}/chapters/${chapter.id}`,
				{ videoUrl }
			);
			toast.success('Video file updated');
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			toggle();
			router.refresh();
		}
	}
	const toggle = () => {
		setEditting((prev: boolean) => !prev);
	};

	return (
		<div className=" bg-sky-50 text-sm flex flex-col gap-2 p-4 rounded-md">
			<div className="flex items-center justify-between ">
				<p className="font-semibold text-sm">Chapter video</p>
				<ButtonTitle
					data={chapter.videoUrl}
					icon={PlusCircle}
					isEditting={isEditting}
					label="video"
					toggle={toggle}
				/>
			</div>
			{isEditting ? (
				<UploadDropzone
					className="h-80"
					endpoint="chapterVideo"
					onClientUploadComplete={(res) => {
						onSubmit(res[0].url);
					}}
					onUploadError={(error: Error) => {
						toast.error(error.message);
					}}
				/>
			) : chapter.videoUrl ? (
				<Video src={chapter.videoUrl} />
			) : (
				<>
					<div className="bg-gray-400/10 h-80 flex flex-col items-center justify-center">
						<LucideUploadCloud size={40} />
						<p>No video selected</p>
					</div>
				</>
			)}
		</div>
	);
}
