import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { AddResourceSpellDialogComponent } from 'src/app/components/character-view/sub-components/trucchetti-incantesimi-tab-view/add-resource-spell-dialog/add-resource-spell-dialog.component';
import { AddSpellDialogComponent } from 'src/app/components/character-view/sub-components/trucchetti-incantesimi-tab-view/add-spell-dialog/add-spell-dialog.component';
import { ResourcesService } from 'src/app/components/resources-page/resources.service';
import { Spell } from 'src/app/models/spell';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-char-next-magic',
  standalone: false,

  templateUrl: './char-next-magic.component.html',
  styleUrl: './char-next-magic.component.scss'
})
export class CharNextMagicComponent {

  public resourcesReady: boolean = false;
  constructor(
    private charService: CharacterService,
    private matDialog: MatDialog,
    private resService: ResourcesService) {
    this.resService.getResourcesByUserId(getAuth().currentUser.uid).then((resources: any) => {
      if (resources) {
        this.resourcesReady = true;
        this.spellsResources = resources.spells.sort((a: Spell, b: Spell) => a.nome.localeCompare(b.nome));
      } else {
        this.resourcesReady = false;
      }
    });
  }
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
      slot.value + 1 > slot.max ? slot.value = slot.max : slot.value += 1;
    } else {
      slot.value - 1 < 0 ? slot.value = 0 : slot.value -= 1;
    }
    this.charService.updateSlotIncantesimi(this._char.id, this._char.magia.slotIncantesimi);
  }

  public magicPrivileges: any[] = [];
  private initMagicPrivileges() {
    this.magicPrivileges = this._char.privilegiTratti.filter(privilege => privilege.showInMagicTab);
  }

  public openAddSpellDialog(spell?: Spell) {
    this.matDialog.open(AddSpellDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: { spells: this._char.magia.trucchettiIncantesimi, spell: spell }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          this.charService.addSpell(window.location.href.split('/').pop(), result.spell)
          break;
        case 'edited':
          this._char.magia.trucchettiIncantesimi = this._char.magia.trucchettiIncantesimi.map((s) => s.id === result.spell.id ? result.spell : s);
          this.charService.updateSpells(window.location.href.split('/').pop(), this._char.magia.trucchettiIncantesimi);
          break;
        case 'deleted':
          this._char.magia.trucchettiIncantesimi = this._char.magia.trucchettiIncantesimi.filter((s) => s.id !== result.spell.id);
          this.charService.updateSpells(window.location.href.split('/').pop(), this._char.magia.trucchettiIncantesimi);
          break;
      }
    })
  }

  public spellsResources: Spell[] = [];
  public openResourcesDialog() {
    this.matDialog.open(AddResourceSpellDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: { spells: this.spellsResources }
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.spells.length > 0) {
          result.spells.forEach((spell) => {
            spell.preparato = false;
            if (!this._char.magia.trucchettiIncantesimi.find((s) => s.nome === spell.nome)) this._char.magia.trucchettiIncantesimi.push(spell);
          });
          this.charService.updateSpells(window.location.href.split('/').pop(), this._char.magia.trucchettiIncantesimi);
        }
      }
    });
  }

  public toggleReady(spell: Spell) {
    this.collapseAll();
    this._char.magia.trucchettiIncantesimi = this._char.magia.trucchettiIncantesimi.map((s) => s.id === spell.id ? { ...s, preparato: !s.preparato } : s);
    this.charService.updateSpells(window.location.href.split('/').pop(), this._char.magia.trucchettiIncantesimi);
  }

  private collapseAll() {
    const details = document.querySelectorAll('details');
    details.forEach((detail: any) => {
      detail.open = false;
    });
  }
  
  public searchMagic(word: any) {
    this.catnips.map((spell: Spell) => {
      spell.filtered = !spell.nome.toLowerCase().includes(word.toLowerCase());
    });
    this.alwaysReady.map((spell: Spell) => {
      spell.filtered = !spell.nome.toLowerCase().includes(word.toLowerCase());
    });
    this.ready.map((spell: Spell) => {
      spell.filtered = !spell.nome.toLowerCase().includes(word.toLowerCase());
    });
    this.others.map((spell: Spell) => {
      spell.filtered = !spell.nome.toLowerCase().includes(word.toLowerCase());
    });
  }
}
