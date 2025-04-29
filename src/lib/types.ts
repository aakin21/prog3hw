export interface Pet {
	id: number;
	name: string;
	type: 'puppy' | 'kitten';
	adopted: boolean;
	hunger: number;
	happiness: number;
	owner?: string | null;
}

export interface User {
	id: number;
	name: string;
	passwordHash: string;
	pets: number[];
	budget: number;
	inventory: {
		food: number;
		toy: number;
		treat: number;
	};
	role: string;
}

export type SafeUser = Omit<User, 'passwordHash'>;
