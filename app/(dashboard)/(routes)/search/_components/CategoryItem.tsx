import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IconType } from 'react-icons';
import queryString from 'query-string';

export default function CategoryItem({
	id,
	name,
	icon: Icon,
}: {
	id: string;
	name: string;
	icon: IconType | undefined;
}) {
	const router = useRouter();
	const params = useSearchParams();
	const pathname: string = usePathname();
	const isActive: boolean = params.get('categoryId') == id;
	function handleCategory() {
		const url: string = queryString.stringifyUrl({
			url: pathname,
			query: {
				categoryId: id,
				title: params.get('title'),
			},
		});
		router.push(url);
		if (isActive) {
			router.push('/search');
		}
	}
	return (
		<button
			onClick={handleCategory}
			className={`${
				isActive && 'bg-sky-100 border-sky-700/70 text-sky-700'
			} flex border-2 text-nowrap hover:border-sky-700/70 transition-all text-sm border-solid border-slate-100/40 gap-2 rounded-full px-3 py-1 items-center`}
		>
			{Icon && <Icon size={20} />}
			<p>{name}</p>
		</button>
	);
}
