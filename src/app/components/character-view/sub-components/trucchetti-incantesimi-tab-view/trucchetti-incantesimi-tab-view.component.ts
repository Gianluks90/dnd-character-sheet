import { Component, Input } from '@angular/core';
import { AddSpellDialogComponent } from './add-spell-dialog/add-spell-dialog.component';
import { CharacterService } from 'src/app/services/character.service';
import { MatDialog } from '@angular/material/dialog';
import { Spell } from 'src/app/models/spell';
import { NotificationService } from 'src/app/services/notification.service';
import { ResourcesService } from 'src/app/components/resources-page/resources.service';
import { getAuth } from 'firebase/auth';
import { AddResourceSpellDialogComponent } from './add-resource-spell-dialog/add-resource-spell-dialog.component';

@Component({
    selector: 'app-trucchetti-incantesimi-tab-view',
    templateUrl: './trucchetti-incantesimi-tab-view.component.html',
    styleUrls: ['./trucchetti-incantesimi-tab-view.component.scss'],
    standalone: false
})
export class TrucchettiIncantesimiTabViewComponent {

  public lista: any[];
  public classeIncantatore: string;
  public caratteristicaIncantatore: string;
  public bonusAttaccoIncantesimi: number;
  public CDTiroSalvezza: number;
  public slotIncantesimi: any;
  public isCampaign: boolean = false;

  // @Input() set trucchettiIncantesimi(data: any) {
  //   // this.lista = data.lista;
  //   // this.sortSpells();
  //   // this.classeIncantatore = data.classeIncantatore;
  //   // this.caratteristicaIncantatore = data.caratteristicaIncantatore;
  //   // this.bonusAttaccoIncantesimi = data.bonusAttaccoIncantesimi;
  //   // this.CDTiroSalvezza = data.CD;
  //   // this.slotIncantesimi = data.slotIncantesimi;
  // }

  public charData: any;
  @Input() set character(character: any) {
    if (!character) return;
    this.charData = character;
    this.lista = character.magia.trucchettiIncantesimi;
    this.sortSpells();
    this.classeIncantatore = character.magia.classeIncantatore;
    this.caratteristicaIncantatore = character.magia.caratteristicaIncantatore;

    this.bonusAttaccoIncantesimi = character.tiriSalvezza.bonusCompetenza + Math.floor((character.caratteristiche[character.magia.caratteristicaIncantatore.toLowerCase()] -10) / 2);
    this.CDTiroSalvezza = 8 + character.tiriSalvezza.bonusCompetenza + Math.floor((character.caratteristiche[character.magia.caratteristicaIncantatore.toLowerCase()] -10) / 2);
    this.slotIncantesimi = character.magia.slotIncantesimi;
    
    // this.lista = character.
  }

  constructor(
    private characterService: CharacterService, 
    private dialog: MatDialog, 
    private notification: NotificationService,
    private resService: ResourcesService) {
    this.isCampaign = window.location.href.includes('campaign-view');

    const userId = getAuth().currentUser.uid;
    this.resService.getResourcesByUserId(userId).then((res) => {
      if (res) {
        this.isResources = true;
        this.spellsResources = res.spells;
      } else {
        this.isResources = false;
      }
    });
  }

  public isResources: boolean = false;
  public spellsResources: Spell[] = [];

  useSlot(levelIndex: number, index: number): void {
    const spellLevel = this.slotIncantesimi[levelIndex];
    let message = '';

    // Se lo slot cliccato è falso, porta a true l'elemento più verso il fondo che è false
    if (!spellLevel.used[index]) {
      const lastFalseIndex = spellLevel.used.lastIndexOf(false);
      if (lastFalseIndex !== -1) {
        spellLevel.used[lastFalseIndex] = true;
        message = 'Slot incantesimo utilizzato.';
      }
    } else {
      // Se lo slot cliccato è true, porta a false l'elemento più in alto che è true
      const firstTrueIndex = spellLevel.used.indexOf(true);
      if (firstTrueIndex !== -1) {
        spellLevel.used[firstTrueIndex] = false;
        message = 'Slot incantesimo ripristinato.';
      }
    }
    this.characterService.updateSlotIncantesimi(window.location.href.split('/').pop(), this.slotIncantesimi).then(() => {
      // this.notification.openSnackBar(message, 'check', 1000, "limegreen");
    });

    // Aggiorna il tuo HTML o fai altre azioni necessarie per riflettere il cambiamento
  }

  filterSearch(event: any) {
    const filter = event.target.value.toLowerCase().trim();
    this.lista = this.lista.map((item) => {
      return {
        ...item, filtered: !item.nome.toLowerCase().includes(filter)
      }
    })
  }

  openAddSpellDialog(spell?: Spell, index?: number) {
    this.dialog.open(AddSpellDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { spells: this.lista, spell: spell }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          this.characterService.addSpell(window.location.href.split('/').pop(), result.spell).then(() => {
            // this.lista.push(result.spell);
            this.sortSpells();
          });
          break;
        case 'edited':
          this.lista[index] = result.spell;
          this.characterService.updateSpells(window.location.href.split('/').pop(), this.lista);
          break;
        case 'deleted':
          this.lista.splice(index, 1);
          this.characterService.updateSpells(window.location.href.split('/').pop(), this.lista);
          break;
      }
    })
  }

  public openResourcesDialog() {
    this.dialog.open(AddResourceSpellDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { spells: this.spellsResources }
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.spells.length > 0) {
          result.spells.forEach((spell) => {
            spell.preparato = false;
            if (!this.lista.find((s) => s.nome === spell.nome)) this.lista.push(spell);
          });
          this.characterService.updateSpells(window.location.href.split('/').pop(), this.lista);
          this.sortSpells();
        }
      }
    });
  }

  private sortSpells() {
    this.lista.sort((a, b) => {
      if (a.nome < b.nome) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortSpellsBy(sortString: string, order: string) {
    this.lista.sort((a, b) => {
      if (a[sortString] < b[sortString]) {
        return order === 'crescente' ? -1 : 1;
      } else {
        return order === 'crescente' ? 1 : -1;
      }
    });
  }

  public showLevel(level: number): string {
    switch (level) {
      case 0:
        return 'T';
      case 1:
        return 'I';
      case 2:
        return 'II';
      case 3:
        return 'III';
      case 4:
        return 'IV';
      case 5:
        return 'V';
      case 6:
        return 'VI';
      case 7:
        return 'VII';
      case 8:
        return 'VIII';
      case 9:
        return 'IX';
      default:
        return '';
    }
  }

  public checkPreparedSpell(): number {
    const preparedSpells = this.lista.filter((spell) => spell.preparato && spell.livello > 0 && !spell.semprePreparato);
    return preparedSpells.length;
  }

  public prepareToggle(spell: Spell): void {
    spell.preparato = !spell.preparato;
    this.characterService.updateSpells(window.location.href.split('/').pop(), this.lista);
  }

  public collapseAll() {
    const details: NodeListOf<HTMLDetailsElement> = document.querySelectorAll('details');
    details.forEach((detail: HTMLDetailsElement) => {
      if (detail.id !== 'details-m') return;
      detail.open = false;
    });
  }

}
