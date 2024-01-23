export default function InfoCard({
	label,
	revenue,
	sales,
}: {
	label: string;
	revenue?: number;
	sales?: number;
}) {
	return (
		<div className="w-full rounded-md p-4 border-2 border-solid border-slate-300/30 flex flex-col gap-1">
			<p className="font-bold text-sm capitalize ">{label}</p>
			<p className="font-bold text-2xl">
				{revenue != undefined ? `$${revenue.toFixed(2)}` : sales}
			</p>
		</div>
	);
}
