export class Skill {
    name: string = '';
    label: string = '';
    ability: string = '';
    proficent: boolean = false;
    mastery: boolean = false;

    constructor() {}

    static newBasicSkills(): Skill[] {
        return [
            { name: 'acrobatics', label: 'Acrobazia', ability: 'dexterity', proficent: false, mastery: false },
            { name: 'animalHandling', label: 'Addestrare animali', ability: 'wisdom', proficent: false, mastery: false },
            { name: 'arcana', label: 'Arcano', ability: 'intelligence', proficent: false, mastery: false },
            { name: 'athletics', label: 'Atletica', ability: 'strength', proficent: false, mastery: false },
            { name: 'deception', label: 'Inganno', ability: 'charisma', proficent: false, mastery: false },
            { name: 'history', label: 'Storia', ability: 'intelligence', proficent: false, mastery: false },
            { name: 'insight', label: 'Intuizione', ability: 'wisdom', proficent: false, mastery: false },
            { name: 'intimidation', label: 'Intimidire', ability: 'charisma', proficent: false, mastery: false },
            { name: 'investigation', label: 'Indagare', ability: 'intelligence', proficent: false, mastery: false },
            { name: 'medicine', label: 'Medicina', ability: 'wisdom', proficent: false, mastery: false },
            { name: 'nature', label: 'Natura', ability: 'intelligence', proficent: false, mastery: false },
            { name: 'perception', label: 'Percezione', ability: 'wisdom', proficent: false, mastery: false },
            { name: 'performance', label: 'Intrattenere', ability: 'charisma', proficent: false, mastery: false },
            { name: 'persuasion', label: 'Persuasione', ability: 'charisma', proficent: false, mastery: false },
            { name: 'religion', label: 'Religione', ability: 'intelligence', proficent: false, mastery: false },
            { name: 'sleightOfHand', label: 'Destrezza di mano', ability: 'dexterity', proficent: false, mastery: false },
            { name: 'stealth', label: 'Furtività', ability: 'dexterity', proficent: false, mastery: false },
            { name: 'survival', label: 'Sopravvivenza', ability: 'wisdom', proficent: false, mastery: false},
        ];
    }
}