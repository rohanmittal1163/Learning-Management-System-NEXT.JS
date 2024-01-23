'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ButtonForm, { ButtonTitle } from '../../../../../../../components/button';
import { CourseProps } from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/page';

export default function AmountForm({ course }: { course: CourseProps }) {
	const [isEditting, setEditting] = useState<boolean>(false);
	const [isSubmitting, setSubmitting] = useState<boolean>(false);
	const router = useRouter();

	const formSchema = z.object({
		price: z.coerce.number(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			price: course?.price || 0,
		},
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setSubmitting(true);
			await axios.put(`/api/courses/${course?.id}`, values);
			toast.success('course amount updated');
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

	return (
		<div className=" bg-sky-50 text-sm flex flex-col gap-2 p-4 rounded-md">
			<div className="flex items-center justify-between ">
				<p className="font-semibold text-sm">Course price</p>

				<ButtonTitle
					icon={Pencil}
					isEditting={isEditting}
					label="price"
					toggle={toggle}
					data={course?.price}
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
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Enter the course amount"
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
				<p className={`font-normal ${!course?.price && 'italic'}`}>
					{course?.price ? `$${course.price.toFixed(2)}` : 'No amount selected'}
				</p>
			)}
		</div>
	);
}
