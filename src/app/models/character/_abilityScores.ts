export class AbilityScores {
    [key: string]: Ability;

    strength: Ability = new Ability(AbilityEnum.STRENGTH, AbilityLabel.STRENGTH, 10, false);
    dexterity: Ability = new Ability(AbilityEnum.DEXTERITY, AbilityLabel.DEXTERITY, 10, false);
    constitution: Ability = new Ability(AbilityEnum.CONSTITUTION, AbilityLabel.CONSTITUTION, 10, false);
    intelligence: Ability = new Ability(AbilityEnum.INTELLIGENCE, AbilityLabel.INTELLIGENCE, 10, false);
    wisdom: Ability = new Ability(AbilityEnum.WISDOM, AbilityLabel.WISDOM, 10, false);
    charisma: Ability = new Ability(AbilityEnum.CHARISMA, AbilityLabel.CHARISMA, 10, false);

    constructor() {}
}

export class Ability {
    name: string = '';
    label: string = '';
    score: number = 0;
    modifier: number = 0;
    modifierLabel: string = '';
    saveThrow: boolean = false;

    constructor(name: string, label: string, score: number, saveThrow: boolean) {
        this.name = name;
        this.label = label;
        this.score = score;
        this.modifier = Ability.calculateModifier(score);
        this.modifierLabel = this.modifier >= 0 ? `+${this.modifier}` : `${this.modifier}`;
        this.saveThrow = saveThrow;
    }

    static calculateModifier(score: number): number {
        return Math.floor((score - 10) / 2);
    }
}

export enum AbilityEnum {
    STRENGTH = 'strength',
    DEXTERITY = 'dexterity',
    CONSTITUTION = 'constitution',
    INTELLIGENCE = 'intelligence',
    WISDOM = 'wisdom',
    CHARISMA = 'charisma',
}

export enum AbilityLabel {
    STRENGTH = 'forza',
    DEXTERITY = 'destrezza',
    CONSTITUTION = 'costituzione',
    INTELLIGENCE = 'intelligenza',
    WISDOM = 'saggezza',
    CHARISMA = 'carisma',
}