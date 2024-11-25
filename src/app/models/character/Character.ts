import { NPC } from "../npcModel";
import { Ability, AbilityEnum, AbilityLabel, AbilityScores } from "./_abilityScores";
import { Background } from "./_background";
import { Bonus, Feat } from "./_feat";
import { Organization } from "./_organization";
import { Skill } from "./_skill";
import { Spell, SpellSlot } from "./_spell";
import { VitalParameters } from "./_vitalParameters";

export class Character {
    id: string = '';
    info: Info = new Info();
    appearance: Appearance = new Appearance();
    experience: Experience = new Experience();
    abilityScores: AbilityScores = new AbilityScores();
    vitalParameters: VitalParameters = new VitalParameters();
    skills: Skill[] = [];
    proficiencies: Proficiencies = new Proficiencies();
    background: Background = new Background();
    feats: Feat[] = [];
    baseParameters: BaseParameters = new BaseParameters();
    magicParameters: MagicParameters = new MagicParameters();
    equipment: Equipment = new Equipment(); // TODO
    campaignInfo: CampaignInfo = new CampaignInfo();
    reltionships: { npcs: NPC[]; organizations: Organization[]; } = { npcs: [], organizations: [] };
    calculatedParameters: CalculatedParameters = new CalculatedParameters(this.abilityScores);
    status: Status = new Status();

    constructor() { }

    public static fromDataOld(data: any): Character {
        console.log(data);

        const char = new Character;
        char.id = data.id;
        const info = data.informazioniBase;
        char.info.playerName = info.nomeGiocatore;
        char.info.name = info.nomePersonaggio;
        char.info.nameExtended = info.nomePersonaggioEsteso;
        char.info.imgUrl = info.urlImmaginePersonaggio;
        char.info.genre = info.genere;
        char.info.pronouns = info.pronomi;
        char.info.species = info.razza;
        char.info.customSpecies = info.razzaPersonalizzata;
        char.info.subspecies = info.sottorazza;
        char.info.customSubspecies = info.sottorazzaPersonalizzata;
        char.info.alignment = info.allineamento;

        const fisico = data.caratteristicheFisiche;
        char.appearance.height = fisico.altezza;
        char.appearance.weigth = fisico.peso;
        char.appearance.age = fisico.eta;
        char.appearance.eyes = fisico.occhi;
        char.appearance.skin = fisico.carnagione;
        char.appearance.hair = fisico.capelli;

        char.experience.level = info.livello;
        char.experience.list = info.classi.map((c: any) => {
            const charClass = new CharClass();
            charClass.classLevel = c.livello;
            charClass.className = c.nome;
            charClass.customClassName = c.classePersonalizzata;
            charClass.subclassName = c.sottoclasse;
            charClass.customSubclassName = c.sottoclassePersonalizzata;
            return charClass;
        });

        char.abilityScores.strength = new Ability(AbilityEnum.STRENGTH, AbilityLabel.STRENGTH, data.caratteristiche.forza, data.tiriSalvezza['forza']);
        char.abilityScores.dexterity = new Ability(AbilityEnum.DEXTERITY, AbilityLabel.DEXTERITY, data.caratteristiche.destrezza, data.tiriSalvezza['destrezza']);
        char.abilityScores.constitution = new Ability(AbilityEnum.CONSTITUTION, AbilityLabel.CONSTITUTION, data.caratteristiche.costituzione, data.tiriSalvezza['costituzione']);
        char.abilityScores.intelligence = new Ability(AbilityEnum.INTELLIGENCE, AbilityLabel.INTELLIGENCE, data.caratteristiche.intelligenza, data.tiriSalvezza['intelligenza']);
        char.abilityScores.wisdom = new Ability(AbilityEnum.WISDOM, AbilityLabel.WISDOM, data.caratteristiche.saggezza, data.tiriSalvezza['saggezza']);
        char.abilityScores.charisma = new Ability(AbilityEnum.CHARISMA, AbilityLabel.CHARISMA, data.caratteristiche.carisma, data.tiriSalvezza['carisma']);

        char.skills = Skill.newBasicSkills();
        char.skills = this.fromOldSkillModel(char.skills, data);

        const altreCompetenze = data.altreCompetenze;
        char.proficiencies = {
            armors: altreCompetenze.armature || [],
            weapons: altreCompetenze.armi || [],
            tools: altreCompetenze.strumenti || [],
            languages: altreCompetenze.linguaggi || []
        }

        char.background.name = info.background;
        char.background.detail = info.dettaglioBackground;
        char.background.history = data.storiaPersonaggio;

        const privilegiTratti = data.privilegiTratti;
        char.feats = privilegiTratti.map((f: any) => {
            const feat = new Feat();
            feat.id = f.id || Feat.randomId();
            feat.name = f.nome;
            feat.description = f.descrizione;
            feat.type = f.tipologia;
            feat.tag = f.tag;
            if (f.bonuses && f.bonuses.length > 0) {
                feat.bonuses = f.bonuses.map((b: any) => {
                    const bonus = new Bonus();
                    bonus.value = b.value;
                    bonus.element = b.element;
                    return bonus;
                });
            } else {
                f.bonuses = [];
            }
            feat.ref = f.riferimento;
            return feat;
        });

        char.baseParameters = {
            speed: data.velocita,
            proficiencyBonus: data.tiriSalvezza.bonusCompetenza
        }

        const magia = data.magia;
        char.magicParameters = new MagicParameters();
        char.magicParameters.spellClass = magia.classeIncantatore.toLowerCase();
        char.magicParameters.spells = magia.trucchettiIncantesimi.map((s: any) => {
            return Spell.fromOldData(s);
        });
        char.magicParameters.spellSlots = magia.slotIncantesimi.map((s: any) => {
            const slot = new SpellSlot();
            slot.label = s.levelLabel;
            slot.max = s.max;
            slot.used = s.used;
            return slot;
        });

        const reverseAbilityLabel: { [key: string]: string } = {
            'forza': 'strength',
            'destrezza': 'dexterity',
            'costituzione': 'constitution',
            'intelligenza': 'intelligence',
            'saggezza': 'wisdom',
            'carisma': 'charisma'
        };

        if (reverseAbilityLabel[magia.caratteristicaIncantatore.toLowerCase()]) {
            char.magicParameters.spellcastingAbility = reverseAbilityLabel[magia.caratteristicaIncantatore.toLowerCase()];
            char.magicParameters.spellSaveDC = 8 + this.calculateModifier(char.abilityScores[char.magicParameters.spellcastingAbility].score) + char.baseParameters.proficiencyBonus;
            char.magicParameters.spellAttackBonus = this.calculateModifier(char.abilityScores[char.magicParameters.spellcastingAbility].score) + char.baseParameters.proficiencyBonus;
            char.magicParameters.maxPreparableSpells = parseInt(magia.incantesimiPreparabili);
            char.calculatedParameters = new CalculatedParameters(char.abilityScores);
        }

        char.campaignInfo.id = data.campaignId;

        const status = data.status;
        char.status.userId = status.userId;
        char.status.creationDate = status.creationDate;
        char.status.lastUpdateDate = status.lastUpdateDate;
        char.status.statusCode = status.statusCode === 0 ? STATUSCODE.NEW : status.statusCode === 1 ? STATUSCODE.DRAFT : STATUSCODE.COMPLETE;
        char.status.options.sheetColor = status.sheetColor;
        char.status.options.sheetTitleColor = status.sheetTitleColor;
        char.status.options.prideFlag = status.prideFlag;
        return char;
    }

    static calculateModifier(score: number): number {
        return Math.floor((score - 10) / 2);
    }

    static fromOldSkillModel(skills: Skill[], data: any): Skill[] {
        const skillMapping: { [key: string]: string } = {
            maestriaNatura: "nature",
            indagare: "investigation",
            addestrareAnimali: "animalHandling",
            intuizione: "insight",
            storia: "history",
            religione: "religion",
            sopravvivenza: "survival",
            arcana: "arcana",
            medicina: "medicine",
            percezione: "perception",
            furtivita: "stealth",
            rapiditaDiMano: "sleightOfHand",
            acrobazia: "acrobatics",
            atletica: "athletics",
            intimidire: "intimidation",
            persuasione: "persuasion",
            intrattenere: "performance",
            inganno: "deception",
        };

        return skills.map(skill => {
            const oldPropertyName = Object.keys(skillMapping).find(key => skillMapping[key] === skill.name);
            if (oldPropertyName) {
                return {
                    ...skill,
                    mastery: data[`maestria${skill.label}`] || false,
                    proficent: data[oldPropertyName] || false
                };
            } else {
                return skill;
            }
        });
    }
}

// Subclasses

class Info {
    playerName: string = '';
    name: string = '';
    nameExtended: string = '';
    imgUrl: string = '';
    genre: string = '';
    pronouns: string = '';
    species: string = '';
    customSpecies: string = '';
    subspecies: string = '';
    customSubspecies: string = '';
    alignment: string = '';

    constructor() { }
}

class Appearance {
    height: string = '';
    weigth: string = '';
    age: string = '';
    eyes: string = '';
    skin: string = '';
    hair: string = '';

    constructor() { }
}

class Experience {
    level: number = 0;
    cumulatedExperience: number = 0;
    list: CharClass[] = [];
}

class Proficiencies {
    armors: string[] = [];
    weapons: string[] = [];
    tools: string[] = [];
    languages: string[] = [];

    constructor() { }
}

class CharClass {
    classLevel: number = 0;
    className: string = '';
    customClassName: string = '';
    subclassName: string = '';
    customSubclassName: string = '';
}

class BaseParameters {
    proficiencyBonus: number = 0;
    speed: number = 0;
}

class MagicParameters {
    spells: Spell[] = [];
    spellSlots: SpellSlot[] = SpellSlot.newSpellSlots();
    spellClass: string = '';
    spellcastingAbility: string = '';
    spellSaveDC: number = 0;
    spellAttackBonus: number = 0;
    preparableFormula: string = '';
    maxPreparableSpells: number = 0;

    constructor() { }

    static calculatedMagicParameters(abilityScore: AbilityScores, spellcastingAbility: string) {
        const spellSaveDC = 8 + CalculatedParameters.calculateModifier(abilityScore[spellcastingAbility].score);
        const spellAttackBonus = CalculatedParameters.calculateModifier(abilityScore[spellcastingAbility].score);
        return { spellSaveDC, spellAttackBonus };
    }
}

class Equipment {}

class CampaignInfo {
    id: string = '';
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

class Status {
    userId: string = '';
    creationDate: Date | null = null;
    lastUpdateDate: Date | null = null;
    statusCode: STATUSCODE = STATUSCODE.NEW;
    options: Option = new Option();

    constructor() { }
}

enum STATUSCODE {
    NEW = 'new',
    DRAFT = 'draft',
    COMPLETE = 'complete'
}

class Option {
    sheetColor: string = '';
    sheetTitleColor: string = '';
    prideFlag: string = '';
    usePrideRule: boolean = false;
    useOpacityInventoryRule: boolean = false;
    useWeightRule: boolean = false;
}