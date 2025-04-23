import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

const usersPath = path.resolve('static/data/users.json');
const petsPath = path.resolve('static/data/pets.json');
const logPath = path.resolve('static/data/log.json');

export const POST: RequestHandler = async ({ request }) => {
	const { name, petId, action } = await request.json();

	try {
		const usersRaw = await readFile(usersPath, 'utf-8');
		const petsRaw = await readFile(petsPath, 'utf-8');
		const logsRaw = await readFile(logPath, 'utf-8');

		const users = JSON.parse(usersRaw);
		const pets = JSON.parse(petsRaw);
		const logs = JSON.parse(logsRaw);

		const user = users.find((u: any) => u.name === name);
		const pet = pets.find((p: any) => p.id === petId);

		if (!user || !pet || !user.pets.includes(pet.id)) {
			return new Response(JSON.stringify({ error: 'Invalid user or pet' }), { status: 400 });
		}

		let cost = 0;
		let logMessage = '';

		if (action === 'feed') {
			cost = 5;
			pet.hunger = Math.max(pet.hunger - 20, 0);
			logMessage = `${user.name} fed ${pet.name} (-$${cost})`;
		} else if (action === 'toy') {
			cost = 10;
			pet.happiness = Math.min(pet.happiness + 30, 100);
			logMessage = `${user.name} played with ${pet.name} (-$${cost})`;
		} else if (action === 'return') {
			cost = 20;
			user.pets = user.pets.filter((id: number) => id !== pet.id);
			pet.adopted = false;
			logMessage = `${user.name} returned ${pet.name} (-$${cost})`;
		} else {
			return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
		}

		user.budget -= cost;
		logs.push(logMessage);

		await writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8');
		await writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8');
		await writeFile(logPath, JSON.stringify(logs, null, 2), 'utf-8');

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (e) {
		return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
	}
};
