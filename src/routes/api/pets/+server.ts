import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

const petsPath = path.resolve('static/data/pets.json');

export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');

	try {
		const data = await readFile(petsPath, 'utf-8');
		let pets = JSON.parse(data);

		if (type) {
			pets = pets.filter((pet: any) => pet.type === type);
		}

		return new Response(JSON.stringify(pets), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Could not load pets' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, type, hunger, happiness } = await request.json();

		const data = await readFile(petsPath, 'utf-8');
		const pets = JSON.parse(data);

		const newPet = {
			id: Date.now(),
			name,
			type,
			hunger,
			happiness,
			adopted: false
		};

		pets.push(newPet);

		await writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8');

		return new Response(JSON.stringify(newPet), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Could not save pet' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
