'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ButtonForm, {
	ButtonTitle,
} from '../../../../../../../components/button';
import { CourseProps } from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/page';

const formSchema = z.object({
	description: z.string().min(2, {
		message: 'Description must be at least 2 characters.',
	}),
});

export default function DescriptionForm({ course }: { course: CourseProps }) {
	const [isEditting, setEditting] = useState<boolean>(false);
	const [isSubmitting, setSubmitting] = useState<boolean>(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: course?.description || '',
		},
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setSubmitting(true);
			await axios.put(`/api/courses/${course?.id}`, values);
			toast.success('course description updated');
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
				<p className="font-semibold text-sm">Course description</p>
				<ButtonTitle
					data={course?.description}
					icon={Pencil}
					isEditting={isEditting}
					label="description"
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
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											placeholder="Enter the course Description"
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
				<p className={`font-normal ${!course?.description && 'italic'}`}>
					{course?.description || 'No description selected'}
				</p>
			)}
		</div>
	);
}
