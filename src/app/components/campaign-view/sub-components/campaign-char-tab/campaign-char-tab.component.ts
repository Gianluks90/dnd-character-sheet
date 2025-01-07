import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiceRollerComponent } from 'src/app/components/utilities/dice-roller/dice-roller.component';

@Component({
    selector: 'app-campaign-char-tab',
    templateUrl: './campaign-char-tab.component.html',
    styleUrl: './campaign-char-tab.component.scss',
    standalone: false
})
export class CampaignCharTabComponent {

  constructor(private matDialog: MatDialog) {}

  public charData: any;
  @Input() set character(character: any) {
    if (!character) return;
    this.charData = character;
    this.initMaestrieArray(character.competenzaAbilita);
    this.initMod(this.abilitaData, this.maestrieData, this.charData.tiriSalvezza.bonusCompetenza);
    this.abilitaData.sort((a, b) => a.name.localeCompare(b.name));
  }

  public isOwnerData: boolean = false;
  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }

  public abilitaData: any[] = [];
  public maestrieData: any[] = [];

  public calcModifier(value: number): string {
    return Math.floor((value - 10) / 2) >= 0 ? '+' + Math.floor((value - 10) / 2) : Math.floor((value - 10) / 2).toString();
  }

  public calcSaveThrow(value: number, skill: string): string {
    const mod = Math.floor((value - 10) / 2);
    return this.charData.tiriSalvezza[skill] ? (mod + this.charData.tiriSalvezza.bonusCompetenza) > 0 ? '+' + (mod + this.charData.tiriSalvezza.bonusCompetenza) : (mod + this.charData.tiriSalvezza.bonusCompetenza).toString() : mod > 0 ? '+' + mod : mod.toString();
  }

  private initMaestrieArray(abilita: any) {
    this.maestrieData = [];
    this.abilitaData = [];
    Object.keys(abilita).forEach((key) => {
      if (key.includes('maestria')) {
        this.maestrieData.push({ name: key.slice(8, 30), value: abilita[key] });
      } else {
        this.abilitaData.push({ name: key, value: abilita[key] });
      }
    });

    this.maestrieData.forEach((maestria) => {
      if (maestria.value) {
        this.abilitaData.find((abilita) => {
          if (abilita.name.toLowerCase() === maestria.name.toLowerCase()) {
            abilita.maestria = true;
          } else {
            abilita.maestria = false;
          }
        });
      }
    });
  }

  private initMod(abilita: any[], maestrie: any[], bonusCompetenza: number) {
    this.abilitaData.forEach((abilita) => {

      abilita.mod = abilita.value ? bonusCompetenza : 0;
      abilita.caratteristica = '';

      switch (abilita.name) {
        case 'acrobazia': case 'furtivita': case 'rapiditaDiMano':
          abilita.caratteristica = 'destrezza';
          abilita.short = 'Des';
          abilita.mod += Math.floor((this.charData.caratteristiche.destrezza - 10) / 2);
          break;

        case 'addestrareAnimali': case 'intuizione': case 'medicina': case 'percezione': case 'sopravvivenza':
          abilita.caratteristica = 'saggezza';
          abilita.short = 'Sag';
          abilita.mod += Math.floor((this.charData.caratteristiche.saggezza - 10) / 2);
          break;

        case 'arcano': case 'storia': case 'indagare': case 'natura': case 'religione':
          abilita.caratteristica = 'intelligenza';
          abilita.short = 'Int';
          abilita.mod += Math.floor((this.charData.caratteristiche.intelligenza - 10) / 2);
          break;

        case 'inganno': case 'intimidire': case 'intrattenere': case 'persuasione':
          abilita.caratteristica = 'carisma';
          abilita.short = 'Car';
          abilita.mod += Math.floor((this.charData.caratteristiche.carisma - 10) / 2);
          break;

        case 'atletica':
          abilita.caratteristica = 'forza';
          abilita.short = 'For';
          abilita.mod += Math.floor((this.charData.caratteristiche.forza - 10) / 2);
          break;
      }

      switch (abilita.name) {
        case 'rapiditaDiMano':
          abilita.name = 'rapidità di mano';
          break;

        case 'addestrareAnimali':
          abilita.name = 'addestrare animali';
          break;
      }

      abilita.maestria ? abilita.mod += bonusCompetenza : +0;
      abilita.mod > 0 ? abilita.mod = '+' + abilita.mod : abilita.mod = abilita.mod + '';
    });
  }

  public navigateToChar(charId: string): void {
    window.open(`https://adventurer-studio.web.app/#/view/${charId}`, '_blank');
  }

  public getEvenLine(index: number): boolean {
    if(window.innerWidth < 1500) {
      return index % 2 === 0;
    } else {
      const columnsIndex: number[] = [0, 3, 4, 7, 8, 11, 12, 15, 16];
      return columnsIndex.includes(index);
    }
  }
  
  public collapseAll() {
    const details = document.querySelectorAll('details');
    details.forEach((detail: any) => {
      detail.open = false;
    });
  }

  public rollFromSheet(formula: string, extra: string) {
    if (!this.isOwnerData) {
      this.matDialog.open(DiceRollerComponent, {
        width: window.innerWidth < 768 ? '90%' : '500px',
        autoFocus: false,
        disableClose: true,
        data: {
          char: this.charData,
          formula: formula,
          extra: extra
        }
      });
    }
  }
}
