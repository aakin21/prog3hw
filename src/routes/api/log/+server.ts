import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const logPath = path.resolve('static/data/log.json');

export const GET: RequestHandler = async () => {
	try {
		const logs: string[] = JSON.parse(await fs.readFile(logPath, 'utf-8'));

		return new Response(JSON.stringify(logs), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Failed to read logs.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
