import { AbilityScores } from "./_abilityScores";
import { Background } from "./_background";
import { Feat } from "./_feat";
import { Skill } from "./_skill";
import { VitalParameters } from "./_vitalParameters";

export class NPC {

    type: 'NPC' | 'Companion' | 'Creature' = 'NPC';
    name: string;
    species: string;
    imgURL: string;
    alignment: string;
    abilityScores: AbilityScores = new AbilityScores();
    vitalParameters: VitalParameters = new VitalParameters();
    skills: Skill[] = [];
    background: Background = new Background();
    feats: Feat[] = [];
    baseParameters: BaseParameters = new BaseParameters();
    calculatedParameters: CalculatedParameters = new CalculatedParameters(this.abilityScores);

    relationships: Relationship[] = [];

    addable: boolean = false;
    revaled: boolean = false;
    visible: boolean = false;
    filtered: boolean = false;

    constructor() {}
}

class BaseParameters {
    proficiencyBonus: number = 0;
    speed: number = 0;
}

class CalculatedParameters {
    initiative: number = 0;
    baseAC: number = 0;
    overridenAC: number = 0;
    
    constructor(abilityScore: AbilityScores, overridenAC?: number) {
        this.initiative = CalculatedParameters.calculateModifier(abilityScore.dexterity.score);
        this.baseAC = overridenAC || 10 + CalculatedParameters.calculateModifier(abilityScore.dexterity.score);
    }

    static calculateModifier(score: number): number {
        return Math.floor((score - 10) / 2);
    }
}

class Relationship {
    characterName: string;
    characterImgURL: string;
    type: 'Friend' | 'Neutral' | 'Ostile' | 'Enemy' = 'Neutral';
    value?: number; // Optional for games based on relationship value (-100 to 100)
}