import React from 'react';
import { Button } from './ui/button';
import { LucideIcon } from 'lucide-react';

export default function ButtonForm({
	isSubmitting,
}: {
	isSubmitting: boolean;
}) {
	return (
		<Button
			type="submit"
			className="w-fit px-8  flex items-center gap-3"
			disabled={isSubmitting}
		>
			{isSubmitting && (
				<p className="animate-spin w-4 aspect-square  rounded-full border-2 border-solid border-white border-r-0 border-t-0"></p>
			)}
			Save
		</Button>
	);
}
export interface ButtonTitleProps {
	toggle: () => void;
	isEditting: boolean;
	data: number | null | undefined | string;
	label: string;
	icon: LucideIcon;
}

export function ButtonTitle({
	toggle,
	isEditting,
	data,
	label,
	icon: Icon,
}: ButtonTitleProps) {
	return (
		<Button
			variant="link"
			className="flex items-center text-sm gap-2"
			onClick={toggle}
		>
			{!isEditting && <Icon size={15} />}
			<p className="font-semibold">
				{isEditting ? 'Cancel' : data ? `Edit ${label}` : `Add a ${label}`}
			</p>
		</Button>
	);
}
