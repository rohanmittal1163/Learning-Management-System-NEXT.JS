'use client';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { PlusCircle, Trash } from 'lucide-react';
import axios from 'axios';
import { Attachment } from '@prisma/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { UploadButton } from '@/lib/uploadthing';
import { CourseProps } from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/page';

export interface UploadThingProps {
	key: string;
	name: string;
	size: number;
	url: string;
	serverData: null;
}
export default function AttachmentForm({ course }: { course: CourseProps }) {
	const [isEditting, setEditting] = useState<boolean>(false);
	const router = useRouter();
	const handleSubmit = async (data: UploadThingProps) => {
		try {
			await axios.post(`/api/courses/${course?.id}/attachments`, data);
			toast.success('Course attachment updated');
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			toggle();
			router.refresh();
		}
	};
	const toggle = () => {
		setEditting((prev: boolean) => !prev);
	};
	const handleDelete = async (id: string) => {
		try {
			await axios.delete(`/api/courses/${course?.id}/attachments/${id}`);
			toast.success('Attachment deleted');
		} catch (err: any) {
			toast.error(err.message);
			console.log(err);
		} finally {
			router.refresh();
		}
	};

	return (
		<div className=" bg-sky-50 text-sm flex flex-col gap-2 p-4 rounded-md">
			<div className="flex items-center justify-between ">
				<p className="font-semibold text-sm">Course attachments</p>
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
							<p className="font-semibold">Add a file</p>
						</>
					)}
				</Button>
			</div>
			{isEditting ? (
				<UploadButton
					endpoint="courseAttachments"
					onClientUploadComplete={(res) => {
						handleSubmit(res[0]);
					}}
					onUploadError={(error: Error) => {
						toast.error(error.message);
					}}
				/>
			) : course?.attachments?.length ? (
				course?.attachments.map((val: Attachment, index: number) => {
					return (
						<React.Fragment key={index}>
							<div className="flex flex-row items-center p-1.5 justify-between bg-sky-300/20 rounded-sm">
								<a
									href={val.url}
									target="_blank"
									className=" w-80 px-4 hover:underline text-ellipsis text-nowrap overflow-hidden"
								>
									{val.name}
								</a>
								<Trash
									size={35}
									className="hover:bg-cyan-200/90 p-2 cursor-pointer rounded-full "
									onClick={() => handleDelete(val.id)}
								/>
							</div>
						</React.Fragment>
					);
				})
			) : (
				<p className="font-normal italic ">No attachments yet</p>
			)}
		</div>
	);
}
