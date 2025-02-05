import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentDialogComponent } from 'src/app/components/utilities/inventory/item-info-sheet/document-dialog/document-dialog.component';
import { Damage, Item } from 'src/app/models/item';

@Component({
  selector: 'app-item-detail',
  standalone: false,

  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss'
})
export class ItemDetailComponent {
  constructor(private matDialog: MatDialog) { }

  public _item: Item;
  @Input() set item(item: Item) {
    this._item = item;
    if (!this._item) return;
    this.fullFormula = this.getFullFormula(this._item);
    this.initTags();
  }

  public openDocumentDialog() {
    this.matDialog.open(DocumentDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: { item: this._item }
    })
  }

  public getDamagesString(formula, extraDamages?: Damage[]) {
    if (!formula) {
      return 'error';
    }
    const termini = formula.replace(/\s/g, '').split('+');

    let minimo = 0;
    let massimo = 0;

    termini.forEach(termine => {
      if (termine.includes('d')) {
        const [numDadi, numFacce] = termine.split('d').map(Number);
        minimo += numDadi;
        massimo += numDadi * numFacce;
      } else {
        const costante = parseInt(termine);
        minimo += costante;
        massimo += costante;
      }
    });

    if (extraDamages && extraDamages.length > 0) {
      extraDamages.forEach((extraDamage) => {
        let extraMin = 0;
        let extraMax = 0;
        const extraTermini = extraDamage.formula.replace(/\s/g, '').split('+');
        extraTermini.forEach(termine => {
          if (termine.includes('d')) {
            const [numDadi, numFacce] = termine.split('d').map(Number);
            extraMin += numDadi;
            extraMax += numDadi * numFacce;
          } else {
            const costante = parseInt(termine);
            extraMin += costante;
            extraMax += costante;
          }
        });
        minimo += extraMin;
        massimo += extraMax;
      });
    }

    if (minimo === massimo) return `${minimo}`;
    return `${minimo}-${massimo}`;
  }

  public fullFormula: string = '';
  public getFullFormula(item: Item): string {
    let formula: string = item.damageFormula;
    if (item.versatileDice) {
      formula += `/${item.versatileDice}`;
    }
    formula += ` ${item.damageType}`;
    item.extraDamages.forEach((extraDamage) => {
      formula += ` +${extraDamage.formula} ${extraDamage.type}`;
    });
    return formula;
  }

  public itemTags: string[] = [];
  private initTags(): void {
    this.itemTags = [];
    Object.keys(this._item).forEach((key) => {
      if (!key || !this._item[key]) return;
      switch (key) {
        case 'isDocument':
          this.itemTags.push('Documento');
          break;
        case 'cursed':
          this.itemTags.push('Maledetto');
          break;
        case 'magicItem':
          this.itemTags.push('Oggetto Magico');
          break;
        case 'artifact':
          this.itemTags.push('Artefatto');
          break;
        case 'focus':
          this.itemTags.push('Focus arcano');
          break;
        case 'weared':
          this.itemTags.push('Equipaggiato');
          break;
        case 'attunementRequired':
          this.itemTags.push('Richiede sintonia');
          break;
      }
    });
    this.itemTags.sort();
  }
}
