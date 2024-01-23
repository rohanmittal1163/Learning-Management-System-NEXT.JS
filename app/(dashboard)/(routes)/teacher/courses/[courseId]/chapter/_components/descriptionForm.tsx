'use client';
import 'react-quill/dist/quill.snow.css';
import { useMemo, useState } from 'react';
import { Pencil } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Chapter } from '@prisma/client';
import { ButtonTitle } from '../../../../../../../../components/button';
import { Button } from '../../../../../../../../components/ui/button';
import dynamic from 'next/dynamic';

export default function DescriptionForm({ chapter }: { chapter: Chapter }) {
	const [isEditting, setEditting] = useState<boolean>(false);
	const [isSubmitting, setSubmitting] = useState<boolean>(false);
	const [value, setValue] = useState<string>('');
	const router = useRouter();
	const ReactQuill = useMemo(
		() => dynamic(() => import('react-quill'), { ssr: false }),
		[]
	);

	async function handleSubmit() {
		try {
			setSubmitting(true);
			await axios.put(
				`/api/courses/${chapter.courseId}/chapters/${chapter.id}`,
				{ description: value }
			);
			toast.success('Chapter description updated');
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			setSubmitting(false);
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
				<p className="font-semibold text-sm">Chapter description</p>
				<ButtonTitle
					data={chapter?.description}
					icon={Pencil}
					isEditting={isEditting}
					label="description"
					toggle={toggle}
				/>
			</div>
			{isEditting ? (
				<>
					<ReactQuill
						theme="snow"
						value={value}
						onChange={setValue}
						className="bg-white "
					/>
					<Button
						className="w-fit px-8  flex items-center gap-3"
						disabled={isSubmitting}
						onClick={handleSubmit}
					>
						{isSubmitting && (
							<p className="animate-spin w-4 aspect-square  rounded-full border-2 border-solid border-white border-r-0 border-t-0"></p>
						)}
						Save
					</Button>
				</>
			) : (
				<p
					className={`font-normal ${!chapter?.description && 'italic'}`}
					dangerouslySetInnerHTML={{
						__html: chapter?.description || 'No description selected',
					}}
				/>
			)}
		</div>
	);
}
