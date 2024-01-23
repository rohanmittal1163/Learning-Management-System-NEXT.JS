'use client';

import { Category } from '@prisma/client';
import {
	FcEngineering,
	FcFilmReel,
	FcMultipleDevices,
	FcMusic,
	FcOldTimeCamera,
	FcSalesPerformance,
	FcSportsMode,
} from 'react-icons/fc';
import { IconType } from 'react-icons';
import CategoryItem from './CategoryItem';

export default function Categories({ items }: { items: Category[] }) {
	const iconMap: Record<Category['name'], IconType> = {
		Music: FcMusic,
		Photography: FcOldTimeCamera,
		Fitness: FcSportsMode,
		Accounting: FcSalesPerformance,
		'Computer Science': FcMultipleDevices,
		Filming: FcFilmReel,
		Engineering: FcEngineering,
	};
	return (
		<div className="flex flex-row gap-3 w-full flex-wrap pb-2">
			{items.map((category: Category, idx: number) => {
				return (
					<CategoryItem
						key={idx}
						id={category.id}
						name={category.name}
						icon={iconMap[category.name]}
					/>
				);
			})}
		</div>
	);
}
