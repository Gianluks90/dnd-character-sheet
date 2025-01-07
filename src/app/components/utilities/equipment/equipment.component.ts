import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Damage, Item } from 'src/app/models/item';
import { ManageEquipDialogComponent } from './manage-equip-dialog/manage-equip-dialog.component';
import { CharacterService } from 'src/app/services/character.service';
import { ItemInfoSheetComponent } from '../inventory/item-info-sheet/item-info-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DiceRollerComponent } from '../dice-roller/dice-roller.component';

@Component({
    selector: 'app-equipment',
    templateUrl: './equipment.component.html',
    styleUrl: './equipment.component.scss',
    standalone: false
})
export class EquipmentComponent {

  constructor(private matDialog: MatDialog, private charService: CharacterService, private bottomSheet: MatBottomSheet) { 
    this.isCampaign = window.location.href.includes('campaign-view');
  }

  public charData: any;
  private bonuses: any[] = [];
  private inventoryData: Item[] = [];
  public setsData: any[] = [];
  public setIndex: number = 0;
  public wearedItems: Item[] = [];
  public CA: string = '';
  public initiative: string = '';
  public ammo: any;
  public ammoCounter: number = 0;
  public isCampaign: boolean = false;

  @Input() set character(character: any) {
    this.charData = character;
    this.bonuses = this.charData.privilegiTratti.flatMap((privilegioTratto: any) => privilegioTratto.bonuses).filter((bonus: any) => bonus !== undefined);
    this.inventoryData = character.equipaggiamento;
    this.setsData = character.sets || [];
    this.calculateCA();
    this.calculateInitiative();
    this.setAmmo();
    this.checkWeared();
  }

  public editModeData: boolean = false;
  @Input() set editMode(editMode: boolean) {
    this.editModeData = editMode;
  }

  public showMoreInfo(event: Event): void {
    // Da implementare
  }

  public checkWeared(): void {
    // this.wearedItems = this.inventoryData.filter(item => item.weared === true);
    // this.wearedItems = this.wearedItems.sort((a, b) => a.name.localeCompare(b.name));

    if (this.inventoryData.length < 0) return;
    this.wearedItems = [];
    const weared: Item[] = [];
    this.inventoryData.forEach(item => {
      if (item.weared) {
        weared.push(item);
      }
    });

    const armor = weared.find(item => item.CA > 0 && !item.shield);
    if (armor) {
      this.wearedItems.push(armor);
    }
    const ammo = weared.find(item => item.category.toLowerCase() === 'munizioni');
    if (ammo) {
      this.wearedItems.push(ammo);
    }

    if (this.setsData.length > 0) {
      let actualSet = this.setsData[this.setIndex];
      if (actualSet.mainHand) {
        this.wearedItems.push(actualSet.mainHand);
      }
      if (actualSet.offHand) {
        this.wearedItems.push(actualSet.offHand);
      }
    }

    weared.forEach(item => {
      if (item.type.toLowerCase() !== 'armatura' && item.category.toLowerCase() !== 'munizioni' && item.type.toLowerCase() !== 'arma' && !item.shield) {
        this.wearedItems.push(item);
      }
    });

    this.wearedItems.forEach(item => {
      item.weared = true;
    });
   
    this.calculateCA();
    this.setAmmo();
  }

  public changeSet(): void {
    // Aumenta l'indice del set attuale
    this.setIndex = this.setIndex + 1 > this.setsData.length - 1 ? 0 : this.setIndex + 1;

    // Filtra gli oggetti del set precedente e rimuovili da wearedItems
    const previousSet = this.setsData[(this.setIndex === 0 ? this.setsData.length - 1 : this.setIndex - 1)];
    if (previousSet.mainHand) {
      this.wearedItems = this.wearedItems.filter(item => item.id !== previousSet.mainHand.id);
    }
    if (previousSet.offHand) {
      this.wearedItems = this.wearedItems.filter(item => item.id !== previousSet.offHand.id);
    }

    // Aggiungi gli oggetti del nuovo set a wearedItems
    const newSet = this.setsData[this.setIndex];
    if (newSet.mainHand) {
      this.wearedItems.push(newSet.mainHand);
    }
    if (newSet.offHand) {
      this.wearedItems.push(newSet.offHand);
    }

    this.inventoryData.forEach(item => {
      item.weared = false;
      this.wearedItems.forEach(wearedItem => {
        if (item.id === wearedItem.id) {
          item.weared = true;
        }
      });
    });
    this.checkWeared();
  }

  private calculateCA(): void {
    // Trova gli oggetti indossati con CA > 0
    let equippedItems: Item[] = [];
    if (this.wearedItems.length > 0) {
      equippedItems = this.wearedItems.filter(item => item.weared && item.CA > 0) || [];
    }
    // Se non ci sono oggetti indossati con CA > 0
    if (equippedItems.length === 0) {
      // Calcola la CA basata sul modificatore di destrezza
      const dexModifier = Math.floor((this.charData.caratteristiche.destrezza - 10) / 2);
      this.CA = (10 + dexModifier).toString();
    } else {
          // Se ci sono oggetti indossati con CA > 0
    let baseCA = 10; // Valore base della CA
    let shieldBonus = ''; // Bonus aggiuntivo dalla presenza dello scudo

    equippedItems.forEach(item => {      
      // Se l'oggetto è uno scudo, aggiungi il suo valore alla stringa shieldBonus
      if (item.shield) {
        shieldBonus += `+${item.CA}`;
      } else {
        // Altrimenti, se è un'armatura, aggiorna il valore base della CA
        if (item.plusDexterity) {
          const dexModifier = Math.floor((this.charData.caratteristiche.destrezza - 10) / 2);
          baseCA = item.CA + dexModifier;
        } else {
          baseCA = item.CA;
        }
        // baseCA = item.CA;
      }
    });

    // Costruisci la stringa per il bonus dello scudo solo se è diverso da zero
    const shieldBonusString = parseInt(shieldBonus) !== 0 ? `${shieldBonus}` : '';

    this.bonuses.forEach((bonus: any) => {
      if (bonus.element === 'CA') {
        baseCA += bonus.value;
      }
    });
    // Aggiorna la CA con la stringa composta dal valore base e dal bonus dello scudo
    this.CA = `${baseCA}${shieldBonusString !== '' ? shieldBonusString : ''}`;
    }
  }

  private calculateInitiative(): void {
    let dexModifier = Math.floor((this.charData.caratteristiche.destrezza - 10) / 2);
    this.bonuses.forEach((bonus: any) => {
      if (bonus.element === 'iniziativa') {
        dexModifier += bonus.value;
      }
    });
    this.initiative = dexModifier > 0 ? `+${dexModifier}` : `${dexModifier}`;
  }

  private setAmmo(): void {
    const ammo = this.inventoryData.find(item => item.category.toLowerCase() === 'munizioni' && item.weared);
    if (ammo) {
      this.ammo = ammo;
    }
  }

  public ammoAction(action: string): void {
    const ammo = this.inventoryData.find(item => item.category.toLowerCase() === 'munizioni' && item.weared);
    switch (action) {
      case 'add':
        ammo.quantity += 1;
        this.ammoCounter = 0;
        break;
      case 'remove':
        ammo.quantity -= 1;
        this.ammoCounter += 1;
        break;
    }
    this.charService.updateInventory(this.charData.id, this.inventoryData);
  }

  public openManageDialog(): void {
    this.matDialog.open(ManageEquipDialogComponent, {
      width: window.innerWidth < 768 ? '90%%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { inventory: this.inventoryData, sets: this.setsData }
    }).afterClosed().subscribe((result: any) => {
      // console.log(result);

      if (result && result.status === 'success') {
        this.wearedItems = [...new Set(result.weared)] as Item[];
        if (result.sets && result.sets.length > 0) {
          this.wearedItems.push(result.sets[0].mainHand);
          this.wearedItems.push(result.sets[0].offHand);
        }
        this.charService.updateSets(this.charData.id, result.sets || []);

        this.inventoryData.forEach(item => {
          item.weared = false;
          this.wearedItems.forEach(wearedItem => {
            if (item.id === wearedItem.id) {
              item.weared = true;
            }
          });
        });
        this.checkWeared();
        this.charService.updateInventory(this.charData.id, this.inventoryData).then(() => {
          this.setIndex = 0;
        });
      }
    });
  }

  setColor(rarity: string): string {
    switch (rarity) {
      case 'Comune':
        // return '#212121'
        return '000000'
      case 'Non comune':
        return '#00ff01'
      case 'Raro':
        return '#6d9eeb'
      case 'Molto raro':
        return '#9a00ff'
      case 'Leggendario':
        return '#e29138'
      case 'Unico':
        return '#e06467'
      case 'Oggetto chiave':
        return '#DDD605'
      default:
        return '#212121'
    }
  }

  public getDamagesString(formula, skill: string, extraDamages?: Damage[]) {
    let skillMod: number = Math.floor((this.charData.caratteristiche[skill] - 10) / 2) || 0;

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

    if (minimo === massimo) return `${minimo}`;
    return `${minimo + skillMod}-${massimo + skillMod}`;
  }

  public getDiceFormula(formula, skill: string, extraDamages?: Damage[]): string {
    const skillMod: number = Math.floor((this.charData.caratteristiche[skill] - 10) / 2) || 0;
    let resultFormula = formula;

    if (extraDamages && extraDamages.length > 0) {
      extraDamages.forEach((extraDamage) => {
        resultFormula += ` + ${extraDamage.formula}`;
      });
    }
    return resultFormula + (skillMod > 0 ? `+${skillMod}` : '');
  }

  public openInfoSheet(item: Item, index: number) {
    this.bottomSheet.open(ItemInfoSheetComponent, {
      // disableClose: true,
      panelClass: 'item-info-sheet',
      autoFocus: false,
      data: { item: item, isOwner: false, fromEquip: true, reclame: false, edit: false }
    });
  }

  // TOOLTIP

  public currentTooltipItem: any;
  public showItemTooltip: boolean = false;
  public tooltipPosition: { top: number | string, left: number | string } = { top: 0, left: 0 };

  public showTooltip(event: MouseEvent, item: any) {
    if (window.innerWidth < 768) return;
    this.currentTooltipItem = item;
    this.showItemTooltip = true;
    setTimeout(() => {
      const tooltip = document.getElementById('item-tooltip-equip') as HTMLElement;
      if (!tooltip) return;
      const rect = tooltip.getBoundingClientRect();
      if (event.clientY + rect.height > window.innerHeight) {
        // this.tooltipPosition.top = window.innerHeight - rect.height - 10;
        this.tooltipPosition = { top: window.innerHeight + 50 - rect.height, left: event.clientX + 175 };
      } else {
        this.tooltipPosition = { top: event.clientY, left: event.clientX + 175 };
      }
    }, 1);
    // this.tooltipPosition = { top: event.clientY, left: event.clientX-175};
  }

  public hideTooltip() {
    this.showItemTooltip = false;
  }

  public getHitCheckString(index: number): string {
    const set = this.setsData[index];
    const skillMod = Math.floor((this.charData.caratteristiche[set.skill] - 10) / 2);
    const bonusProficiency = this.charData.tiriSalvezza.bonusCompetenza;
    return `1d20${skillMod + bonusProficiency > 0 ? `+${skillMod + bonusProficiency}` : ''}`;
  }

  public rollFromSheet(formula: string, extra: string) {
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
