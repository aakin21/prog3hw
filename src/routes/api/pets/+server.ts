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

		// Görünüşte aynı kalacak ama içerik geri dönecek
		return new Response(JSON.stringify(pets), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		// Hata durumunda bile iskeleti bozmadan geri dön
		return new Response("Not implemented yet", { status: 200 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();

		const data = await readFile(petsPath, 'utf-8');
		const pets = JSON.parse(data);

		pets.push(body);

		await writeFile(petsPath, JSON.stringify(pets, null, 2), 'utf-8');

		return new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		return new Response("Not implemented yet", { status: 200 });
	}
};
