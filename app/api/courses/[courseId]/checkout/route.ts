import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { currentUser } from '@clerk/nextjs';
import { Course, Purchase } from '@prisma/client';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CourseParams } from '../route';

export async function GET(
	req: Request,
	{ params: { courseId } }: CourseParams
) {
	try {
		const user = await currentUser();
		const emailAddress = user?.emailAddresses[0].emailAddress;

		if (!user || !user.id || !emailAddress) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const purchase: Purchase | null = await db.purchase.findUnique({
			where: {
				userId_courseId: {
					userId: user.id,
					courseId,
				},
			},
		});

		if (purchase) {
			return new NextResponse('Already Purchased', { status: 400 });
		}

		const course: Course | null = await db.course.findUnique({
			where: {
				id: courseId,
				isPublished: true,
			},
		});

		if (!course) {
			return new NextResponse('Not found', { status: 404 });
		}

		const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
			{
				quantity: 1,
				price_data: {
					currency: 'USD',
					product_data: {
						name: course.title,
						description: course.description!,
					},
					unit_amount: Math.round(course.price! * 100),
				},
			},
		];
		let stripeCustomer: {
			stripeCustomerId: string;
		} | null = await db.stripeCustomer.findUnique({
			where: {
				userId: user.id,
			},
			select: {
				stripeCustomerId: true,
			},
		});

		if (!stripeCustomer) {
			const customer: Stripe.Response<Stripe.Customer> =
				await stripe.customers.create({
					email: emailAddress,
				});
			stripeCustomer = await db.stripeCustomer.create({
				data: {
					userId: user.id,
					stripeCustomerId: customer.id,
				},
				select: {
					stripeCustomerId: true,
				},
			});
		}

		const session: Stripe.Response<Stripe.Checkout.Session> =
			await stripe.checkout.sessions.create({
				customer: stripeCustomer.stripeCustomerId,
				line_items,
				mode: 'payment',
				success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
				cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
				metadata: {
					courseId: course.id,
					userId: user.id,
				},
			});
		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.log('[COURSE_ID_CHECKOUT]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
