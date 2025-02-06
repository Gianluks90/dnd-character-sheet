import { Component, Input } from '@angular/core';
import { Spell } from 'src/app/models/spell';

@Component({
  selector: 'app-char-next-magic',
  standalone: false,
  
  templateUrl: './char-next-magic.component.html',
  styleUrl: './char-next-magic.component.scss'
})
export class CharNextMagicComponent {
public _char: any;
  @Input() set char(char: any) {
    this._char = char;
    if (!this._char) return;
    this.initSpells();
  }

  public _edit: boolean;
  @Input() set edit(edit: boolean) {
    this._edit = edit;
  }

  public catnips: Spell[] = [];
  public alwaysReady: Spell[] = [];
  public spells: Spell[] = [];

  private initSpells() {
    const spells = this._char.magia.trucchettiIncantesimi;
    this.catnips = spells.filter(spell => spell.tipologia === 'trucchetto');
    this.alwaysReady = spells.filter(spell => spell.semprePreparato);
    this.spells = spells.filter(spell => !spell.semprePreparato && spell.tipologia !== 'trucchetto');
  }
}
