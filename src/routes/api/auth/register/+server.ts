import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	const { name, password } = await request.json();

	try {
		const data = await readFile(usersPath, 'utf-8');
		const users = JSON.parse(data);

		const existingUser = users.find((u: any) => u.name === name);
		if (existingUser) {
			return new Response(JSON.stringify({ error: 'Username already exists' }), { status: 400 });
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const newUser = {
			id: Date.now(),
			name,
			passwordHash,
			pets: [],
			budget: 100,
			inventory: {
				food: 0,
				toy: 0,
				treat: 0
			},
			role: 'user'
		};

		users.push(newUser);
		await writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8');

		const { passwordHash: _, ...safeUser } = newUser;

		return new Response(JSON.stringify(safeUser), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		return new Response(JSON.stringify({ error: 'Registration failed' }), { status: 500 });
	}
};
