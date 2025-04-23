import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

const petsPath = path.resolve('static/data/pets.json');
const usersPath = path.resolve('static/data/users.json');
const logPath = path.resolve('static/data/log.json');

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { petId, userName } = await request.json();

		const petsRaw = await readFile(petsPath, 'utf-8');
		const pets = JSON.parse(petsRaw);
		const pet = pets.find((p: any) => p.id === petId);

		if (!pet || pet.adopted) {
			return new Response(JSON.stringify({ error: 'Pet not available' }), { status: 400 });
		}

		pet.adopted = true;

		const usersRaw = await readFile(usersPath, 'utf-8');
		const users = JSON.parse(usersRaw);
		const user = users.find((u: any) => u.name === userName);

		if (!user) {
			return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
		}

		user.pets = user.pets || [];
		user.pets.push(pet.id);
		user.budget = (user.budget || 0) - 20;

		await writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8');
		await writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8');

		const logsRaw = await readFile(logPath, 'utf-8');
		const logs = JSON.parse(logsRaw);
		logs.push(`${user.name} adopted ${pet.name} (-$20)`);

		await writeFile(logPath, JSON.stringify(logs, null, 2), 'utf-8');

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (e) {
		return new Response(JSON.stringify({ error: 'Unexpected server error' }), { status: 500 });
	}
};
