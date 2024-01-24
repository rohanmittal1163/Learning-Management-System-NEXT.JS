const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
	// await db.category.createMany({
	// 	data: [
	// 		{ name: 'Computer Science' },
	// 		{ name: 'Music' },
	// 		{ name: 'Fitness' },
	// 		{ name: 'Photography' },
	// 		{ name: 'Accounting' },
	// 		{ name: 'Engineering' },
	// 		{ name: 'Filming' },
	// 	],
	// });
	await db.attachment.createMany({
		data: [
			{
				name: 'Graph Fundamentals',
				url: 'https://utfs.io/f/6c8ebc58-5270-4e7f-b75c-6dae898a95bf-1ucenl.pdf',
				size: 1410000,
				courseId: '0e3f347c-7e40-45e8-b855-beb3221d6788', // Introduction to Algorithms
			},
			{
				name: 'DP Fundamentals',
				url: 'https://utfs.io/f/390bd720-8692-4e93-b2c8-7826925cc501-z0psfo.pdf',
				size: 700550,
				courseId: 'f6c73504-5cd5-4cb2-97b5-b655124a9493', // Introduction to Programming in Python
			},

			{
				name: 'Graph Fundamentals',
				url: 'https://utfs.io/f/6c8ebc58-5270-4e7f-b75c-6dae898a95bf-1ucenl.pdf',
				size: 1410000,
				courseId: 'ba931a59-8ad7-42c4-a7e8-864e99f8115f', // Cinematography Masterclass
			},
			{
				name: 'DP Fundamentals',
				url: 'https://utfs.io/f/390bd720-8692-4e93-b2c8-7826925cc501-z0psfo.pdf',
				size: 700550,
				courseId: 'bc3098f5-c584-4731-808f-e64b4e1f80b6', // Film Production Basics
			},
			{
				name: 'Graph Fundamentals',
				url: 'https://utfs.io/f/6c8ebc58-5270-4e7f-b75c-6dae898a95bf-1ucenl.pdf',
				size: 1410000,
				courseId: '4d3ab744-e678-4068-84d2-09e6ee219b33', // Mechanical Engineering Fundamentals
			},

			{
				name: 'Graph Fundamentals',
				url: 'https://utfs.io/f/6c8ebc58-5270-4e7f-b75c-6dae898a95bf-1ucenl.pdf',
				size: 1410000,
				courseId: 'f6c73504-5cd5-4cb2-97b5-b655124a9493', // Introduction to Programming in Python
			},
			{
				name: 'DP Fundamentals',
				url: 'https://utfs.io/f/390bd720-8692-4e93-b2c8-7826925cc501-z0psfo.pdf',
				size: 700550,
				courseId: 'ba931a59-8ad7-42c4-a7e8-864e99f8115f', // Cinematography Masterclass
			},

			{
				name: 'DP Fundamentals',
				url: 'https://utfs.io/f/390bd720-8692-4e93-b2c8-7826925cc501-z0psfo.pdf',
				size: 700550,
				courseId: '1f00b8c0-77cc-4250-99b4-74d3469862c8', // Guitar Fundamentals
			},
		],
	});
}

main()
	.then(async () => {
		await db.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await db.$disconnect();
		process.exit(1);
	});
