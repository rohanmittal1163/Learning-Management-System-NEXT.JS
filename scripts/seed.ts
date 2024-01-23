const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
	await db.category.createMany({
		data: [
			{ name: 'Computer Science' },
			{ name: 'Music' },
			{ name: 'Fitness' },
			{ name: 'Photography' },
			{ name: 'Accounting' },
			{ name: 'Engineering' },
			{ name: 'Filming' },
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
