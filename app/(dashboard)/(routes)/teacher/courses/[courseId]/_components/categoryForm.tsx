'use client';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ButtonForm, {
	ButtonTitle,
} from '../../../../../../../components/button';
import { Category } from '@prisma/client';
import { CourseProps } from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/page';

const FormSchema = z.object({
	categoryId: z.string({
		required_error: 'Please select a language.',
	}),
});

export default function CategoryForm({
	course,
	categories,
}: {
	course: CourseProps;
	categories: Category[];
}) {
	const [isEditting, setEditting] = useState<boolean>(false);
	const [isSubmitting, setSubmitting] = useState<boolean>(false);
	const router = useRouter();

	const toggle = () => {
		setEditting((prev) => !prev);
	};

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		try {
			setSubmitting(true);
			await axios.put(`/api/courses/${course.id}`, data);
			toast.success('course category updated');
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			setSubmitting(false);
			router.refresh();
			toggle();
		}
	}

	return (
		<div className=" bg-sky-50 text-sm flex flex-col gap-2 p-4 rounded-md">
			<div className="flex items-center justify-between ">
				<p className="font-semibold text-sm">Course title</p>
				<ButtonTitle
					data={course?.categoryId}
					icon={Pencil}
					isEditting={isEditting}
					label="category"
					toggle={toggle}
				/>
			</div>
			{isEditting ? (
				<>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-2"
						>
							<FormField
								control={form.control}
								name="categoryId"
								render={({ field }) => (
									<FormItem className="flex flex-col ">
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															'w-full justify-between',
															!field.value && 'text-muted-foreground'
														)}
													>
														{field.value
															? categories.find(
																	(category) => category.id === field.value
															  )?.name
															: 'Select category'}
														<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-full p-0">
												<Command>
													<CommandInput
														placeholder="Search category..."
														className="h-9"
													/>
													<CommandEmpty>No category found.</CommandEmpty>
													<CommandGroup>
														{categories.map((category) => (
															<CommandItem
																value={category.name}
																key={category.id}
																onSelect={() => {
																	form.setValue('categoryId', category.id);
																}}
															>
																{category.name}
																<CheckIcon
																	className={cn(
																		'ml-auto h-4 w-4',
																		category.id === field.value
																			? 'opacity-100'
																			: 'opacity-0'
																	)}
																/>
															</CommandItem>
														))}
													</CommandGroup>
												</Command>
											</PopoverContent>
										</Popover>

										<FormMessage />
									</FormItem>
								)}
							/>
							<ButtonForm isSubmitting={isSubmitting} />
						</form>
					</Form>
				</>
			) : (
				<p className={`font-normal ${!course?.categoryId && 'italic'}`}>
					{course?.category?.name || 'No category selected yet'}
				</p>
			)}
		</div>
	);
}
