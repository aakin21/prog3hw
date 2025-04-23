export interface Pet {
	id: number;
	name: string;
	type: 'puppy' | 'kitten';
	adopted: boolean;
	hunger: number;
	happiness: number;
}

export interface User {
	id: number;
	name: string;
	passwordHash: string;
}

export type SafeUser = Omit<User, 'passwordHash'>;
