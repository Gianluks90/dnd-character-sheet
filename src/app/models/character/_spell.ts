export class Spell {
    icon: string = '';
    level: number = 0;
    name: string = '';
    description: string = '';
    extraDescription: string = '';
    castingTime: string = '';
    duration: string = '';
    components: string = '';
    school: string = '';
    rangeArea: string = '';
    damageFormula: string = '';
    prepared: boolean = false;
    category: SpellCategory = SpellCategory.CANTRIP;
    reference: string = '';

    constructor() {}

    static fromOldData(data: any): Spell {
        const result = new Spell();
        result.icon = data.icon || '';
        result.level = data.livello || 0;
        result.name = data.nome || '';
        result.description = data.descrizione || '';
        result.extraDescription = data.livelloSuperiore || '';
        result.castingTime = data.tempoLancio || '';
        result.duration = data.durata || '';
        result.components = data.componenti || '';
        result.school = data.scuola || '';
        result.rangeArea = data.gittata || '';
        result.damageFormula = data.formula || '';
        result.prepared = data.preparato || false;
        result.reference = data.riferimento || '';
        result.category = data.tipologia.toLowerCase() === 'speciale' ? SpellCategory.SPECIAL : data.tipologia.toLowerCase() === 'incantesimo' ? SpellCategory.SPELL : data.tipologia.toLowerCase() === 'rituale' ? SpellCategory.RITUAL : SpellCategory.CANTRIP;
        return result;
    }
}

export class SpellSlot {
    label: string = '';
    max: number = 0;
    used: boolean[] = [];

    constructor() {}

    static newSpellSlots(): SpellSlot[] {
        return [
            { label: 'level1', max: 0, used: [] },
            { label: 'level2', max: 0, used: [] },
            { label: 'level3', max: 0, used: [] },
            { label: 'level4', max: 0, used: [] },
            { label: 'level5', max: 0, used: [] },
            { label: 'level6', max: 0, used: [] },
            { label: 'level7', max: 0, used: [] },
            { label: 'level8', max: 0, used: [] },
            { label: 'level9', max: 0, used: [] },
        ];
    }
}

enum SpellCategory {
    CANTRIP = 'trucchetto',
    RITUAL = 'rituale',
    SPELL = 'incantesimo',
    SPECIAL = 'speciale',
}