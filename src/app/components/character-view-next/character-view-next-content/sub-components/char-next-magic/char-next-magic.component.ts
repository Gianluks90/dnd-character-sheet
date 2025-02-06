import { Component, Input } from '@angular/core';
import { Spell } from 'src/app/models/spell';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-char-next-magic',
  standalone: false,

  templateUrl: './char-next-magic.component.html',
  styleUrl: './char-next-magic.component.scss'
})
export class CharNextMagicComponent {

  constructor(private charService: CharacterService) { }
  public _char: any;
  @Input() set char(char: any) {
    this._char = char;
    if (!this._char) return;
    this.initSpells();
    this.initMagicPrivileges();
  }

  public _edit: boolean;
  @Input() set edit(edit: boolean) {
    this._edit = edit;
  }

  public catnips: Spell[] = [];
  public alwaysReady: Spell[] = [];
  public ready: Spell[] = [];
  public others: Spell[] = [];

  private initSpells() {
    const spells = this._char.magia.trucchettiIncantesimi;
    this.catnips = spells.filter(spell => spell.tipologia === 'trucchetto').sort();
    this.alwaysReady = spells.filter(spell => spell.semprePreparato).sort();
    this.ready = spells.filter(spell => !spell.semprePreparato && spell.tipologia !== 'trucchetto' && spell.preparato).sort();
    this.others = spells.filter(spell => !spell.semprePreparato && spell.tipologia !== 'trucchetto' && !spell.preparato).sort();
  }

  public slotAction(action: 'add' | 'remove', index: number) {
    const slot = this._char.magia.slotIncantesimi[index];
    if (action === 'add') {
      slot.value + 1 > slot.max ? slot.value = slot.max : slot.value +=1;
    } else {
      slot.value - 1 < 0 ? slot.value = 0 : slot.value -=1;
    }
    this.charService.updateSlotIncantesimi(this._char.id, this._char.magia.slotIncantesimi);
  }

  public magicPrivileges: any[] = [];
  private initMagicPrivileges() {
    this.magicPrivileges = this._char.privilegiTratti.filter(privilege => privilege.showInMagicTab);
  }
}
