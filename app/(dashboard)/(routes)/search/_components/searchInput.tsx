'use client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
export default function SearchInput() {
	const [text, setText] = useState<string>('');
	const [value] = useDebounce(text, 500);
	const params = useSearchParams();
	const router = useRouter();
	const pathname: string = usePathname();
	useEffect(() => {
		const url: string = queryString.stringifyUrl(
			{
				url: pathname,
				query: {
					title: value,
					categoryId: params.get('categoryId'),
				},
			},
			{ skipNull: true, skipEmptyString: true }
		);
		router.push(url);
	}, [value, params, pathname, router]);
	return (
		<div className=" relative	">
			<Search className=" absolute text-gray-400 top-2 left-2" />
			<Input
				onChange={(e) => {
					setText(e.target.value);
				}}
				value={text}
				placeholder="Search for a course"
				className="rounded-full px-10 focus-visible:ring-transparent"
			/>
		</div>
	);
}
