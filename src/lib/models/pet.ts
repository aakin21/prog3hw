import type { Pet as PetType } from '../types';

export class Pet implements PetType {
    id: number;
    name: string;
    type: string;
    adopted: boolean;
    hunger: number;
    happiness: number;
    owner?: string | null;

    constructor(
        id: number,
        name: string,
        type: string,
        hunger: number = 50,
        happiness: number = 50,
        adopted: boolean = false,
        owner: string | null = null
    ) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.hunger = hunger;
        this.happiness = happiness;
        this.adopted = adopted;
        this.owner = owner;
    }

    feed() {
        this.hunger = Math.max(this.hunger - 20, 0);
    }

    play() {
        this.happiness = Math.min(this.happiness + 30, 100);
    }

    giveTreat() {
        this.hunger = Math.max(this.hunger - 10, 0);
        this.happiness = Math.min(this.happiness + 20, 100);
    }

    returnToShelter() {
        this.adopted = false;
        this.owner = null;
    }
}
