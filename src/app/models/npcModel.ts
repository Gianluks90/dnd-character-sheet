import { FormBuilder, Validators } from "@angular/forms";

export class NPC {
    name: string = '';
    race: string = '';
    category: NPCCategory | null = null;
    alignment: string = '';
    parameterRequired: boolean = false;
    CA: number = 0;
    HPmax: number = 0;
    HP: number = 0;
    tempHPmax: number = 0;
    tempHP: number = 0;
    speed: string = '';
    strength: number = 0;
    strengthMod: number = 0;
    dexterity: number = 0;
    dexterityMod: number = 0;
    constitution: number = 0;
    constitutionMod: number = 0;
    intelligence: number = 0;
    intelligenceMod: number = 0;
    wisdom: number = 0;
    wisdomMod: number = 0;
    charisma: number = 0;
    charismaMod: number = 0;
    saveThrows: string = '';
    vulnerabilities: string = '';
    resistances: string = '';
    immunities: string = '';
    senses: string = '';
    skills: string = '';
    languages: string = '';
    challenge: string = '';
    XP: number = 0;
    traits: any[] = [];
    actions: any[] = [];
    isMerchant: boolean = false;
    isDealer: boolean = false;
    relationship: NPCRelationship = NPCRelationship.NEUTRAL;
    imgUrl: string = '';
    notes: string = '';
    lastPlace: string = '';
    addable: boolean = false;
    reveled: boolean = false;
    filtered: boolean = false;
    visible: boolean = true;

    constructor() {}

    static create(builder: FormBuilder) {
        return {
            name: ['', Validators.required],
            race: ['', Validators.required],
            category: NPCCategory.ALLY,
            alignment: '',
            parameterRequired: false,
            CA: null,
            HPmax: null,
            HP: 0,
            tempHPmax: 0,
            tempHP: 0,
            speed: null,
            strength: null,
            strengthMod: null,
            dexterity: null,
            dexterityMod: null,
            constitution: null,
            constitutionMod: null,
            intelligence: null,
            intelligenceMod: null,
            wisdom: null,
            wisdomMod: null,
            charisma: null,  
            charismaMod: null,
            saveThrows: '',
            vulnerabilities: '',
            resistances: '',
            immunities: '',
            senses: '',
            skills: '',
            languages: '',
            challenge: '',
            traits: builder.array([]),
            actions: builder.array([]),
            isMerchant: false,
            isDealer: false,
            relationship: NPCRelationship.NEUTRAL,
            imgUrl: '',
            imgName: '',
            notes: '',
            lastPlace: '',
            addable: false,
            reveled: false,
            visible: true,
            filtered: false
        }
    }

    static createOrganization(builder: FormBuilder) {
        return {
            name: ['', Validators.required],
            category: NPCCategory.ALLY,
            relationship: NPCRelationship.INDIFFERENT,
            imgUrl: '',
            imgName: '',
            notes: ['', Validators.required],
            lastPlace: '',
            filtered: false,
            visible: true,
            addable: false
        }
    }

    static fromData(data: any): NPC {
        const result = Object.assign(new NPC(), data);
        result.strengthMod = Math.floor((result.strength - 10) / 2);
        result.dexterityMod = Math.floor((result.dexterity - 10) / 2);
        result.constitutionMod = Math.floor((result.constitution - 10) / 2);
        result.intelligenceMod = Math.floor((result.intelligence - 10) / 2);
        result.wisdomMod = Math.floor((result.wisdom - 10) / 2);
        result.charismaMod = Math.floor((result.charisma - 10) / 2);
        return result;
    }
}

export enum NPCRelationship {
    FRIEND = 'Amichevole',
    NEUTRAL = 'Neutrale',
    INDIFFERENT = 'Indifferente',
    OSTILE = 'Ostile'
}

export enum NPCCategory {
    ALLY = 'Alleato',
    ORGANIZATION = 'Organizzazione',
    ENEMY = 'Nemico',
    ADDON = 'Evocazione/Trasformazione/Altro',
}