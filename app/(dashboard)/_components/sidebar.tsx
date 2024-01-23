'use client';
import React from 'react';
import { TeacherRoutes, guestRoutes } from '@/constants';
import { usePathname } from 'next/navigation';
import SidebarRoutes from './sidebarRoutes';
import Logo from './logo';

export default function Sidebar() {
	const pathname = usePathname();
	const isTeacher = pathname.startsWith('/teacher');
	return (
		<>
			<Logo />
			{isTeacher ? (
				<SidebarRoutes routes={TeacherRoutes} />
			) : (
				<SidebarRoutes routes={guestRoutes} />
			)}
		</>
	);
}
