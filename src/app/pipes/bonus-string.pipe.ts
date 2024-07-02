import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bonusString'
})
export class BonusStringPipe implements PipeTransform {

  transform(bonus: any): string {
    return this.getBonusString(bonus);
  }

  private getBonusString(bonus: any): string {
    const bonusValue = bonus.value > 0 ? `+${bonus.value}` : `${bonus.value}`;

    switch (bonus.element) {
      case 'forza':
      case 'destrezza':
      case 'costituzione':
      case 'intelligenza':
      case 'saggezza':
      case 'carisma':
        return `Punteggio di caratteristica (${bonus.element}) ${bonusValue}`;
      case 'CA':
        return `Classe Armatura ${bonusValue}`;
      case 'iniziativa':
        return `Iniziativa ${bonusValue}`;
      case 'velocità':
        return `Velocità ${bonusValue}m (${bonus.value / 1.5} spazio/i)`;
      case 'punti ferita':
        return `Punti Ferita Massimi ${bonusValue}`;
      default:
        return '';
    }
  }

}
