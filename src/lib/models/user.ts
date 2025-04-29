import type { User as UserType } from '../types';

export class User implements Omit<UserType, 'passwordHash'> {
    id: number;
    name: string;
    pets: number[];
    budget: number;
    inventory: {
        food: number;
        toy: number;
        treat: number;
    };
    role: string;

    constructor(
        id: number,
        name: string,
        budget: number = 100,
        pets: number[] = [],
        inventory = { food: 0, toy: 0, treat: 0 },
        role: string = 'user'
    ) {
        this.id = id;
        this.name = name;
        this.pets = pets;
        this.budget = budget;
        this.inventory = inventory;
        this.role = role;
    }

    spend(amount: number) {
        if (this.budget >= amount) {
            this.budget -= amount;
            return true;
        }
        return false;
    }

    addPet(petId: number) {
        this.pets.push(petId);
    }

    removePet(petId: number) {
        this.pets = this.pets.filter(id => id !== petId);
    }

    addItem(item: 'food' | 'toy' | 'treat', amount = 1) {
        if (this.inventory[item] !== undefined) {
            this.inventory[item] += amount;
        }
    }

    useItem(item: 'food' | 'toy' | 'treat') {
        if ((this.inventory[item] || 0) > 0) {
            this.inventory[item] -= 1;
            return true;
        }
        return false;
    }
}
