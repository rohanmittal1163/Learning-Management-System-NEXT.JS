import {
	BarChart,
	Compass,
	Layout,
	List,
	LucideIcon,
	PlusCircle,
} from 'lucide-react';

export const guestRoutes: {
	href: string;
	label: string;
	icon: LucideIcon;
}[] = [
	{
		href: '/',
		label: 'dashboard',
		icon: Layout,
	},
	{
		href: '/search',
		label: 'browse',
		icon: Compass,
	},
];

export const TeacherRoutes: {
	href: string;
	label: string;
	icon: LucideIcon;
}[] = [
	{
		href: '/teacher/courses',
		label: 'Courses',
		icon: List,
	},
	{
		href: '/teacher/analytics',
		label: 'analytics',
		icon: BarChart,
	},
	{
		href: '/teacher/create',
		label: 'create',
		icon: PlusCircle,
	},
];

//#chapter scrollbar
//schema prisma update
