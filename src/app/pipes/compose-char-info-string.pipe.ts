import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'composeCharInfoString'
})
export class ComposeCharInfoStringPipe implements PipeTransform {

  transform(value: unknown): unknown {
    return this.composeCharInfoString(value);
  }

  private composeCharInfoString(char: any): string {
    const infos: string[] = [];
    const info = char.informazioniBase;
    info.razzaPersonalizzata !== '' ? infos.push(info.razzaPersonalizzata + (info.sottorazza !== '' ? '(' + info.sottorazza + ')' : '')) : infos.push(info.razza + (info.sottorazza !== '' ? ' (' + info.sottorazza + ')' : ''));
    info.genere !== '' ? infos.push(info.genere) : null;
    info.pronomi !== '' ? infos.push(info.pronomi) : null;
    info.allineamento !== '' ? infos.push(info.allineamento) : null;
    info.background !== '' ? infos.push(info.background + (info.dettaglioBackground !== '' ? ' (' + info.dettaglioBackground + ')' : '')) : null;
  
    infos.forEach((item, index) => {
      if (!item) {
        infos.splice(index, 1);
      }
    });

    let result = infos.join(', ');
    return result;
  }

}
