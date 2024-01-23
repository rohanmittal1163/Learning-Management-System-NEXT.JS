'use client';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { redirect } from 'next/navigation';

export default function CourseEnrollButton({
	price,
	courseId,
}: {
	price: number | null | undefined;
	courseId: string;
}) {
	if (!price) {
		return redirect('/');
	}
	const handleCheckout = async () => {
		const {
			data: { url },
		} = await axios.get(`/api/courses/${courseId}/checkout`);
		window.location.assign(url);
	};
	return (
		<>
			<Button variant={'primary'} onClick={handleCheckout}>
				Enroll for {`$ ${price.toFixed(2)}`}{' '}
			</Button>
		</>
	);
}
