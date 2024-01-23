import { LucideIcon } from 'lucide-react';

export default function SubHeading({
	label,
	ico: Icon,
}: {
	label: string;
	ico: LucideIcon;
}) {
	return (
		<div className="flex items-center gap-3">
			<Icon className="text-sky-600 bg-sky-200 rounded-md p-1 w-8 h-8 " />
			<p className="text-lg font-semibold ">{label}</p>
		</div>
	);
}
