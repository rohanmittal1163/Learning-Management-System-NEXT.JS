'use client';

import React from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export function AnalyticsChart({
	labels,
	data,
}: {
	labels: string[];
	data: number[];
}) {
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
		},
	};

	const items = {
		labels,
		datasets: [
			{
				label: 'Revenue and sales',
				data,
				backgroundColor: '#0284c7',
			},
		],
	};

	return <Bar options={options} data={items} />;
}
