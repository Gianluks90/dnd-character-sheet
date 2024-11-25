export class VitalParameters {
    HPmax: number = 0;
    HP: number = 0;
    tempHPmax: number = 0;
    tempHP: number = 0;
    lifeDices: LifeDice[] = [];
    conditions: string[] = [];
}

class LifeDice {
    diceType: 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' = 'd4';
    quantity: number = 0;
}