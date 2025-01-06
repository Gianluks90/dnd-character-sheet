import { Platform } from '@angular/cdk/platform';
import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Damage, Item } from 'src/app/models/item';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { DocumentDialogComponent } from './document-dialog/document-dialog.component';
import { CampaignService } from 'src/app/services/campaign.service';

@Component({
  selector: 'app-item-info-sheet',
  templateUrl: './item-info-sheet.component.html',
  styleUrl: './item-info-sheet.component.scss',
})
export class ItemInfoSheetComponent {

  public maxMinDamage: string;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { item: Item, isOwner: boolean, fromEquip: boolean, reclame: boolean, edit: boolean },
    private sheetRef: MatBottomSheetRef<ItemInfoSheetComponent>,
    private dialog: MatDialog,
    private campService: CampaignService) {
    this.isCampaign = window.location.href.includes('campaign-view');
  }

  ngOnInit() {
    if (this.data.item.damageFormula && this.data.item.damageFormula !== '') {
      this.maxMinDamage = this.calcolaMinMax(this.data.item.damageFormula, this.data.item.extraDamages.length > 0 ? this.data.item.extraDamages : []).minimo + ' - ' + this.calcolaMinMax(this.data.item.damageFormula, this.data.item.extraDamages.length > 0 ? this.data.item.extraDamages : []).massimo;
    }
  }

  public isCampaign: boolean = false;

  openEditDialog(item: Item) {
    this.dialog.open(AddItemDialogComponent, {
      width: window.innerWidth < 500 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { inventory: [], item: item }
    }).afterClosed().subscribe((result: any) => {
      if (result.status === 'edited') {
        this.sheetRef.dismiss({ status: 'edited', item: result.item });
      }
      if (result.status === 'deleted') {
        this.sheetRef.dismiss({ status: 'deleted', item: result.item });
      }
      if (result.status === 'duplicate') {
        this.sheetRef.dismiss({ status: 'duplicate', item: result.item });
      }
    })
  }

  public openDocumentDialog(item: Item) {
    this.dialog.open(DocumentDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      data: { item: item }
    }).afterClosed().subscribe((result: any) => {
      if (result && result.message === 'notes') {
        const campId = window.location.href.split('/').pop();
        this.campService.addEntry(campId, result.entry);
      }
    });
  }

  public reclameItem(item: Item, quantity: number) {
    this.sheetRef.dismiss({ status: 'reclamed', item: item, quantity: quantity });
  }

  public consumeSingleItem() {
    this.sheetRef.dismiss({ status: 'consumed', quantity: 1 });
  }

  public equipItemToggle() {
    this.sheetRef.dismiss({ status: 'equipped' });
  }

  public calcolaMinMax(formula, extraDamages?: Damage[]) {
    if (!formula) {
      return { minimo: 'error', massimo: 'error' };
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

    if (minimo === massimo) {
      return { minimo: '1', massimo: '' };
    }
    return { minimo, massimo };
  }

  public getDamagesString(item: Item, formula: string): string {
    if (!formula || formula === '') return '';
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

    let extraString = '';
    if(item.extraDamages.length > 0) {
      item.extraDamages.forEach((extraDamage) => {
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
        if (extraMin === extraMax) extraString += `${extraMin} ${extraDamage.type}, `;
        else extraString += `${extraMin}-${extraMax} ${extraDamage.type} + `;
      });
    }
    
    extraString = extraString.slice(0, -2);
    if (minimo === massimo) return `${minimo} ${item.damageType}` + (item.extraDamages.length > 0 ? ' + ' + extraString : '');
    return `${minimo}-${massimo} ${item.damageType}` + (item.extraDamages.length > 0 ? ' + ' + extraString : '');

    // if (minimo === massimo) return `${minimo} danno/i (${item.damageType})`;
    // return `${minimo}-${massimo}` + ' danni (' + item.damageType + ')';
  }

  public getInfoString(item: Item): string {
    const result = [];
    if (item.consumable) result.push('Uso singolo');
    if (item.focus) result.push('Focus arcano');

    return result.join(', ');
  }

  setColor(rarity: string): string {
    switch (rarity) {
      case 'Comune':
        return '#212121'
        break;
      case 'Non comune':
        return '#00ff01'
        break;
      case 'Raro':
        return '#6d9eeb'
        break;
      case 'Molto raro':
        return '#9a00ff'
        break;
      case 'Leggendario':
        return '#e29138'
        break;
      case 'Unico':
        return '#e06467'
        break;
      case 'Oggetto chiave':
        return '#DDD605'
        break;
      default:
        return '#212121'
        break;
    }
  }

}
