import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import path from 'path';
import { readFile } from 'fs/promises';
const usersPath = path.resolve('static/data/users.json');
export const POST: RequestHandler = async ({ request }) => {
	const { name, password } = await request.json();
	try {
		const data = await readFile(usersPath, 'utf-8');
		const users = JSON.parse(data);
		const user = users.find((u: any) => u.name === name);
		if (!user) {
			return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
		}
		const passwordMatch = await bcrypt.compare(password, user.passwordHash);

		if (!passwordMatch) {
			return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
		}
		const { passwordHash: _, ...userData } = user;
		return new Response(JSON.stringify(userData), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		return new Response(JSON.stringify({ error: 'Login failed' }), { status: 500 });
	}
};
