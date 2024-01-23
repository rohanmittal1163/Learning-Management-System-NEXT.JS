'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ButtonForm from '@/components/button';

const formSchema = z.object({
	title: z.string().min(2, {
		message: 'Title must be at least 2 characters.',
	}),
});

export default function Create() {
	const router = useRouter();
	const [isLoading, setLoading] = useState<boolean>(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
		},
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setLoading(true);
			const response = await axios.post('/api/courses', values);
			if (response.status == 200) {
				router.push(`/teacher/courses/${response.data.id}`);
				toast.success('course created');
			}
		} catch (err: any) {
			toast.error('Something went wrong');
			console.log('[COURSE_CREATE]', err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="bg-white flex items-center justify-center h-[calc(100vh-64px)]">
			<div className="w-3/4 lg:w-1/2 p-5 flex flex-col gap-5 shadow-md rounded-md">
				<Form {...form}>
					<div className="flex flex-col gap-0">
						<p className="text-2xl font-semibold">Name your course</p>
						<p className="text-sm text-gray-700">
							What would you like to name your course. Don&apos;t worry you can
							always change this later
						</p>
					</div>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-0">
									<FormLabel className="font-bold capitalize">
										Course Title
									</FormLabel>
									<FormControl>
										<Input
											placeholder="eg: 'Advanced Web development'"
											{...field}
											className="focus-within:ring-transparent focus-visible:ring-transparent"
											disabled={isLoading}
										/>
									</FormControl>
									<FormDescription>
										What will you teach in this course?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex gap-3">
							<ButtonForm isSubmitting={isLoading} />
							<Link href="/teacher/courses">
								<Button variant="ghost">Cancel</Button>
							</Link>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
