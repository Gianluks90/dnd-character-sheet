import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDialogComponent } from 'src/app/components/utilities/inventory/add-item-dialog/add-item-dialog.component';
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
    // let skillMod: number = Math.floor((this._char.caratteristiche[skill] - 10) / 2) || 0;

    if (!formula) {
      return 'error';
    }
    // Rimuovi gli spazi bianchi e separa la formula in termini
    const termini = formula.replace(/\s/g, '').split('+');

    let minimo = 0;
    let massimo = 0;

    // Calcola il minimo e il massimo per ogni termine
    termini.forEach(termine => {
      if (termine.includes('d')) {
        // Se il termine contiene 'd', è un termine dei dadi
        const [numDadi, numFacce] = termine.split('d').map(Number);
        minimo += numDadi;
        massimo += numDadi * numFacce;
      } else {
        // Altrimenti, è un termine costante
        const costante = parseInt(termine);
        minimo += costante;
        massimo += costante;
      }
    });

    // Calcola il danno aggiuntivo, se presente
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
}
