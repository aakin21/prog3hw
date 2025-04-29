import { Pet } from './Pet';

export class Kitten extends Pet {
    constructor(
        id: number,
        name: string,
        hunger: number = 50,
        happiness: number = 50,
        adopted: boolean = false,
        owner: string | null = null
    ) {
        super(id, name, 'kitten', hunger, happiness, adopted, owner);
    }

}
