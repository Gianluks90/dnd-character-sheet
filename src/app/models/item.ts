import { FormBuilder, Validators } from "@angular/forms";

export class Item {
    id: string = '';
    name: string = '';
    icon: string = '';
    filtered: boolean = false;
    quantity: number = 0;
    rarity: string = '';
    rarityColor?: string;
    category: string = '';
    description: string = '';
    isDocument: boolean = false;
    documentTitle: string = '';
    documentDescription: string = '';
    value: number = 0;
    weight: number = 0;
    advanced: boolean = false;
    type: ItemCategory = ItemCategory.NULL;
    cursed: boolean = false;
    cursedDescription: string = '';
    magicItem: boolean = false;
    artifact: boolean = false;
    weared: boolean = false;
    CA: number = 0;
    plusDexterity: boolean = false;
    minStrength: number = 0;
    shield: boolean = false;
    stealthDisadvantage: boolean = false;
    damageFormula: string = '';
    damageType: string = '';
    extraDamages: Damage[] = [];
    weaponProperties: any[] = [];
    range: string = '';
    versatileDice: string = '';
    traits: Trait[] = [];
    focus: boolean = false;
    attunementRequired: boolean = false;
    attuned: boolean = false;
    artifactProperties: Trait[] = [];
    reference: string = '';
    consumable: boolean = false;
    visible: boolean = false;
    notEditable: boolean = false;
    createdBy: string = '';
    previousOwner: any = null;

    constructor() {}

    private static randomUID() {
        return Math.random().toString(36).substring(2);
    }

    static create(builder: FormBuilder) {
        return {
            id: Item.randomUID(),
            name: ['', Validators.required],
            icon: ['', Validators.required],
            filtered: false,
            quantity: [1, [Validators.required, Validators.min(0)]],
            rarity: ['', Validators.required],
            category: ['', Validators.required],
            description: ['', Validators.required],
            isDocument: false,
            documentTitle: '',
            documentDescription: '',
            value: 0,
            weight: 0,
            advanced: false,
            type: ItemCategory.NULL,
            cursed: false,
            cursedDescription: '',
            traits: builder.array([]),
            focus: false,
            attunementRequired: false,
            attuned: false,
            artifactProperties: builder.array([]),
            reference: '',
            magicItem: false,
            artifact: false,
            weared: false,
            CA: 0,
            plusDexterity: false,
            minStrength: 0,
            shield: false,
            stealthDisadvantage: false,
            damageFormula: '',
            damageType: '',
            extraDamages: builder.array([]),
            weaponProperties: [],
            range: '',
            versatileDice: '',
            consumable: false,
            visible: false,
            notEditable: false,
            createdBy: '',
            previousOwner: null,
        }
    }
}

export class Trait {
    title: string;
    description: string;

    static create(builder: FormBuilder) {
        return {
            title: ['', Validators.required],
            description: ['', Validators.required],
        }

    }
}

export class Damage {
    formula: string;
    type: string;

    static create(builder: FormBuilder) {
        return {
            formula: ['', Validators.required],
            type: ['', Validators.required],
        }
    }
}

export enum ItemCategory {
    ARMOR = "armatura",
    WEAPON = "arma",
    NULL = "null"
}

// export class Armor extends Item {
//     CA: number;
//     stelthDisadvantage: boolean;

//     constructor(name: string, icon: string, filtered: boolean, quantity: number, rarity: string, category: string, description?: string, value?: string, weight?: number, cursed?: boolean, cursedDescription?: string, traits?: Trait[], attunementRequired?: boolean, attuned?: boolean, artifactProperties?: string[], reference?: string, CA?: number, stelthDisadvantage?: boolean) {
//         super(name, icon, filtered, quantity, rarity, category, description, value, weight, cursed, cursedDescription, traits, attunementRequired, attuned, artifactProperties, reference);
//         this.CA = CA;
//         this.stelthDisadvantage = stelthDisadvantage;
//     }
// }

// export class Weapon extends Item {
//     damageFormula: string;
//     damageType: string;
//     weaponProperties: string[];

//     constructor(name: string, icon: string, filtered: boolean, quantity: number, rarity: string, category: string, description?: string, value?: string, weight?: number, cursed?: boolean, cursedDescription?: string, traits?: Trait[], attunementRequired?: boolean, attuned?: boolean, artifactProperties?: string[], reference?: string, damageFormula?: string, damageType?: string, weaponProperties?: string[]) {
//         super(name, icon, filtered, quantity, rarity, category, description, value, weight, cursed, cursedDescription, traits, attunementRequired, attuned, artifactProperties, reference);
//         this.damageFormula = damageFormula;
//         this.damageType = damageType;
//         this.weaponProperties = weaponProperties;
//     }
// }