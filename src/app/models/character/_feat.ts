export class Feat {
    id: string = '';
    name: string = '';
    description: string = '';
    type: FEATTYPE = FEATTYPE.FEAT;
    tag: string = '';
    bonuses: Bonus[] = [];
    ref: string = '';

    constructor() {}

    static randomId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    static newFeat(): Feat {
        const feat = new Feat();
        feat.id = this.randomId();
        return feat;
    }
}

export class Bonus {
    value: number = 0;
    element: string = '';
}

enum FEATTYPE {
    FEAT = 'Tratto',
    PRIVILEGE = 'Privilegio',
    TALENT = 'Talento',
}