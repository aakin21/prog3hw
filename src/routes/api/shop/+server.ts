import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

const usersPath = path.resolve('static/data/users.json');

const prices: Record<string, number> = {
	food: 10,
	toy: 15,
	treat: 30
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { userName, item } = await request.json();

		if (!['food', 'toy', 'treat'].includes(item)) {
			return new Response(JSON.stringify({ error: 'Invalid item' }), { status: 400 });
		}

		const raw = await readFile(usersPath, 'utf-8');
		const users = JSON.parse(raw);

		const user = users.find((u: any) => u.name === userName);

		if (!user) {
			return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
		}

		const price = prices[item];

		if ((user.budget || 0) < price) {
			return new Response(JSON.stringify({ error: 'Insufficient funds' }), { status: 400 });
		}

		user.budget -= price;
		user.inventory[item] = (user.inventory[item] || 0) + 1;

		await writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8');

		return new Response(JSON.stringify({
			message: `Bought 1 ${item}`,
			user: {
				name: user.name,
				budget: user.budget,
				inventory: user.inventory
			}
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Shop error' }), { status: 500 });
	}
};
