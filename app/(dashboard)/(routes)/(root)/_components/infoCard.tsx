import { LucideIcon } from 'lucide-react';

export default function InfoCard({
	title,
	icon: Icon,
	textColor,
	bgColor,
	val,
}: {
	title: string;
	icon: LucideIcon;
	textColor: string;
	bgColor: string;
	val: number;
}) {
	return (
		<div className="w-full flex flex-row items-center gap-2 shadow-sm rounded-full">
			<div>
				<Icon
					className={`${textColor} ${bgColor} p-2 rounded-full `}
					size={50}
				/>
			</div>
			<div className="font-semibold capitalize justify-center flex flex-col ">
				<p>{title}</p>
				<p className="text-sm text-gray-400">
					{val} {val < 2 ? 'course' : 'courses'}
				</p>
			</div>
		</div>
	);
}
