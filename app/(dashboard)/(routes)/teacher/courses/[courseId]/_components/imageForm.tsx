'use client';
import { UploadDropzone } from '@/lib/uploadthing';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { LucideUploadCloud, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ButtonTitle } from '../../../../../../../components/button';
import { CourseProps } from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/page';

export default function ImageForm({ course }: { course: CourseProps }) {
	const [isEditting, setEditting] = useState<boolean>(false);
	const router = useRouter();

	const formSchema = z.object({
		imageURL: z.string().min(2, {
			message: `Image is required`,
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			imageURL: course?.imageUrl || '',
		},
	});
	async function onSubmit(imageUrl: string) {
		try {
			await axios.put(`/api/courses/${course?.id}`, { imageUrl });
			toast.success('Image file updated');
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
				<p className="font-semibold text-sm">Course image</p>
				<ButtonTitle
					data={course?.imageUrl}
					icon={PlusCircle}
					isEditting={isEditting}
					label="image"
					toggle={toggle}
				/>
			</div>
			{isEditting ? (
				<UploadDropzone
					className="h-80"
					endpoint="courseImage"
					onClientUploadComplete={(res) => {
						onSubmit(res[0].url);
					}}
					onUploadError={(error: Error) => {
						toast.error(error.message);
					}}
				/>
			) : course?.imageUrl ? (
				<Image
					width={1000}
					height={200}
					className="w-full h-80 "
					alt="image"
					src={course.imageUrl}
				/>
			) : (
				<>
					<div className="bg-gray-400/10 h-80 flex flex-col items-center justify-center">
						<LucideUploadCloud size={40} />
						<p>No image selected</p>
					</div>
				</>
			)}
		</div>
	);
}
