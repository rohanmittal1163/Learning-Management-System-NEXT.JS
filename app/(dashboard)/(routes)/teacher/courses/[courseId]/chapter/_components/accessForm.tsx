'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Chapter } from '@prisma/client';
import ButtonForm, {
	ButtonTitle,
} from '../../../../../../../../components/button';
import { Checkbox } from '../../../../../../../../components/ui/checkbox';

export default function AccessForm({ chapter }: { chapter: Chapter }) {
	const [isEditting, setEditting] = useState<boolean>(false);
	const [isSubmitting, setSubmitting] = useState<boolean>(false);
	const router = useRouter();

	const formSchema = z.object({
		isFree: z.boolean().default(false).optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			isFree: false,
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
			toast.success('Access setting updated');
		}
	}
	const toggle = () => {
		setEditting((prev: boolean) => !prev);
	};

	return (
		<div className=" bg-sky-50 text-sm flex flex-col gap-2 p-4 rounded-md">
			<div className="flex items-center justify-between ">
				<p className="font-semibold text-sm capitalize">Free preview chapter</p>
				<ButtonTitle
					data={chapter?.title}
					icon={Pencil}
					isEditting={isEditting}
					label="access setting"
					toggle={toggle}
				/>
			</div>
			{isEditting ? (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-3"
					>
						<FormField
							control={form.control}
							name="isFree"
							render={({ field }) => (
								<FormItem className="flex gap-2 items-center flex-row">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>
										<p className="-mt-2">
											Check this box if you want to make this chapter free for
											preview.
										</p>
									</FormLabel>
								</FormItem>
							)}
						/>
						<ButtonForm isSubmitting={isSubmitting} />
					</form>
				</Form>
			) : (
				<p className={`font-normal ${!chapter.isFree && 'italic'}`}>
					{chapter.isFree
						? 'This chapter is free for preview'
						: 'This chapter is not free'}
				</p>
			)}
		</div>
	);
}
