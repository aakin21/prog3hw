import { Pet } from './Pet';

export class Puppy extends Pet {
    constructor(
        id: number,
        name: string,
        hunger: number = 50,
        happiness: number = 50,
        adopted: boolean = false,
        owner: string | null = null
    ) {
        super(id, name, 'puppy', hunger, happiness, adopted, owner);
    }
}
