import { FormBuilder, Validators } from "@angular/forms";

export class Spell {
    id: string = '';
    tipologia: string = '';
    nome: string = '';
    scuola: string = '';
    scuolaPersonalizzata: string = '';
    livello: number = 0;
    tempoLancio: string = '';
    gittata: string = '';
    componenti: string = '';
    formula?: string = '';
    durata: string = '';
    descrizione: string = '';
    livelloSuperiore?: string = '';
    riferimento?: string = '';
    preparato: boolean = false;
    semprePreparato: boolean = false;
    icon: string = '';
    rituale: boolean = false;
    filtered: boolean = false;

    constructor() {}

    static create(builder: FormBuilder) {
        return {
            id: '',
            tipologia: ['trucchetto', Validators.required],
            nome: ['', Validators.required],
            scuola: ['', Validators.required],
            scuolaPersonalizzata: '',
            livello: [0, [Validators.required, Validators.min(0), Validators.max(9)]],
            tempoLancio: ['', Validators.required],
            gittata: ['', Validators.required],
            componenti: ['', Validators.required],
            formula: '',
            durata: ['', Validators.required],
            descrizione: ['', Validators.required],
            livelloSuperiore: '',
            riferimento: '',
            preparato: false,
            semprePreparato: false,
            icon: '',
            rituale: false,
            filtered: false,
        }
    }
}