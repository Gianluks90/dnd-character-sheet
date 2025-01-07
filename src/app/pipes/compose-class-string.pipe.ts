import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'composeClassString',
    standalone: false
})
export class ComposeClassStringPipe implements PipeTransform {

  transform(value: unknown): unknown {
    return this.composeClassString(value);
  }

  private composeClassString(classe: any): string {
    const result: string = '';
    return classe.nome + (classe.sottoclasse !== '' ? ` (${classe.sottoclasse})` : '') + ' di ' + classe.livello + '° livello';
  }

}
