'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Chapter } from '@prisma/client';
import ButtonForm, {
	ButtonTitle,
} from '../../../../../../../../components/button';

export default function TitleForm({ chapter }: { chapter: Chapter }) {
	const [isEditting, setEditting] = useState<boolean>(false);
	const [isSubmitting, setSubmitting] = useState<boolean>(false);
	const router = useRouter();

	const formSchema = z.object({
		title: z.string().min(2, {
			message: `Title must be at least 2 characters.`,
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: chapter?.title || '',
		},
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setSubmitting(true);
			await axios.put(
				`/api/courses/${chapter.courseId}/chapters/${chapter.id}`,
				values
			);
			router.refresh();
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			setSubmitting(false);
			toggle();
			toast.success('Course Title updated');
		}
	}
	const toggle = () => {
		setEditting((prev: boolean) => !prev);
	};

	return (
		<div className=" bg-sky-50 text-sm flex flex-col gap-2 p-4 rounded-md">
			<div className="flex items-center justify-between ">
				<p className="font-semibold text-sm">Chapter title</p>
				<ButtonTitle
					data={chapter?.title}
					icon={Pencil}
					isEditting={isEditting}
					label="title"
					toggle={toggle}
				/>
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
			) : (
				<p className="font-normal ">
					{chapter?.title || 'No title selected yet'}
				</p>
			)}
		</div>
	);
}
