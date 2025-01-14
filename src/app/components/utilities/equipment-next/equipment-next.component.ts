import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, Injector, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Damage, Item } from 'src/app/models/item';
import { CharacterService } from 'src/app/services/character.service';
import { ManageEquipDialogComponent } from '../equipment/manage-equip-dialog/manage-equip-dialog.component';
import { DiceRollerComponent } from '../dice-roller/dice-roller.component';
import { SkillTooltipComponent } from '../skill-tooltip/skill-tooltip.component';
import { ItemTooltipComponent } from '../item-tooltip/item-tooltip.component';
import { ItemInfoSheetComponent } from '../inventory/item-info-sheet/item-info-sheet.component';

@Component({
  selector: 'app-equipment-next',
  standalone: false,
  templateUrl: './equipment-next.component.html',
  styleUrl: './equipment-next.component.scss'
})
export class EquipmentNextComponent {
  constructor(
    private matDialog: MatDialog,
    private charService: CharacterService,
    private bottomSheet: MatBottomSheet,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  private tooltipRef: ComponentRef<ItemTooltipComponent> | null = null;


  public _char: any;
  public inventory: Item[] = [];
  public wearedItems: Item[] = [];
  public sets: any[] = [];
  public setIndex: number = 0;
  public ammos: Item[] = [];
  public moreInfo: boolean = false;
  public totalCA: number = 0;

  @Input() set char(char: any) {
    setTimeout(() => {
      this._char = char;
      this.inventory = this._char.equipaggiamento;
      this.sets = this._char.sets || [];
      this.totalCA = this._char.CA + parseInt(this._char.CAShield || '0');
      this.setAmmo();
      this.checkWeared();
    }, 100);
  }

  public _edit: boolean = false;
  @Input() set edit(edit: boolean) {
    this._edit = edit;
  }

  public toggleMoreInfo(): void {
    this.moreInfo = !this.moreInfo;
  }

  public changeSet(): void {
    this.setIndex = this.setIndex + 1 > this.sets.length - 1 ? 0 : this.setIndex + 1;

    const previousSet = this.sets[(this.setIndex === 0 ? this.sets.length - 1 : this.setIndex - 1)];
    if (previousSet.mainHand) {
      this.wearedItems = this.wearedItems.filter(item => item.id !== previousSet.mainHand.id);
    }
    if (previousSet.offHand) {
      this.wearedItems = this.wearedItems.filter(item => item.id !== previousSet.offHand.id);
    }

    const newSet = this.sets[this.setIndex];
    if (newSet.mainHand) {
      this.wearedItems.push(newSet.mainHand);
    }
    if (newSet.offHand) {
      this.wearedItems.push(newSet.offHand);
    }

    this.inventory.forEach(item => {
      item.weared = false;
      this.wearedItems.forEach(wearedItem => {
        if (item.id === wearedItem.id) {
          item.weared = true;
        }
      });
    });
    this.checkWeared();
  }

  public openManageDialog(): void {
    this.matDialog.open(ManageEquipDialogComponent, {
      width: window.innerWidth < 768 ? '90%%' : '60%',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: { inventory: this.inventory, sets: this.sets }
    }).afterClosed().subscribe((result: any) => {
      // console.log(result);

      if (result && result.status === 'success') {
        this.wearedItems = [...new Set(result.weared)] as Item[];
        if (result.sets && result.sets.length > 0) {
          this.wearedItems.push(result.sets[0].mainHand);
          this.wearedItems.push(result.sets[0].offHand);
        }
        this.charService.updateSets(this._char.id, result.sets || []);

        this.inventory.forEach(item => {
          item.weared = false;
          this.wearedItems.forEach(wearedItem => {
            if (item.id === wearedItem.id) {
              item.weared = true;
            }
          });
        });
        this.checkWeared();
        this.charService.updateInventory(this._char.id, this.inventory).then(() => {
          this.setIndex = 0;
        });
      }
    });
  }

  private checkWeared(): void {
    if (this.inventory.length < 0) return;
    this.wearedItems = [];
    const weared: Item[] = [];
    this.inventory.forEach(item => {
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

    if (this.sets.length > 0) {
      let actualSet = this.sets[this.setIndex];
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

    this.charService.updateInventory(this._char.id, this.inventory);

    this.setAmmo();
  }

  private setAmmo(): void {
    const ammo = this.inventory.filter(item => item.category.toLowerCase() === 'munizioni');
    if (ammo) {
      this.ammos = ammo;
    }
  }

  public ammoAction(action: string, itemId: string): void {
    const ammo = this.inventory.find(item => item.id === itemId);
    switch (action) {
      case 'add':
        ammo.quantity += 1;
        break;
      case 'remove':
        ammo.quantity -= 1;
        break;
    }
    this.charService.updateInventory(this._char.id, this.inventory);
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
    let skillMod: number = Math.floor((this._char.caratteristiche[skill] - 10) / 2) || 0;

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
    const skillMod: number = Math.floor((this._char.caratteristiche[skill] - 10) / 2) || 0;
    let resultFormula = formula;

    if (extraDamages && extraDamages.length > 0) {
      extraDamages.forEach((extraDamage) => {
        resultFormula += ` + ${extraDamage.formula}`;
      });
    }
    return resultFormula + (skillMod > 0 ? `+${skillMod}` : '');
  }

  public getHitCheckString(index: number): string {
    const set = this.sets[index];
    const skillMod = Math.floor((this._char.caratteristiche[set.skill] - 10) / 2);
    const bonusProficiency = this._char.tiriSalvezza.bonusCompetenza;
    return `1d20${skillMod + bonusProficiency > 0 ? `+${skillMod + bonusProficiency}` : ''}`;
  }

  public rollFromSheet(formula: string, extra: string) {
    this.matDialog.open(DiceRollerComponent, {
      width: window.innerWidth < 768 ? '90%' : '500px',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: {
        char: this._char,
        formula: formula,
        extra: extra
      }
    });
  }

  public currentTooltipItem: any;
  public showItemTooltip: boolean = false;
  public tooltipPosition: { top: number | string, left: number | string } = { top: 0, left: 0 };

  public showTooltip(event: MouseEvent, item: any) {
    if (window.innerWidth < 768) return;
    this.removeTooltip();
    const factory = this.componentFactoryResolver.resolveComponentFactory(ItemTooltipComponent);
    this.tooltipRef = factory.create(this.injector);
    const tooltipElement = this.tooltipRef.location.nativeElement;
    tooltipElement.classList.add('dynamic-tooltip');
    this.tooltipRef.instance.item = item;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const tooltipPosition = {
      top: event.clientY + rect.height > window.innerHeight
        ? window.innerHeight - rect.height - 10
        : event.clientY,
      left: event.clientX + 200,
    };
    tooltipElement.style.top = `${tooltipPosition.top}px`;
    tooltipElement.style.left = `${tooltipPosition.left}px`;
    this.appRef.attachView(this.tooltipRef.hostView);
    const domElem = (this.tooltipRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  }

  public hideTooltip() {
    this.removeTooltip();
  }

  private removeTooltip() {
    if (this.tooltipRef) {
      this.appRef.detachView(this.tooltipRef.hostView);
      this.tooltipRef.destroy();
      this.tooltipRef = null;
    }
  }

  public openInfoSheet(item: Item, index: number) {
    this.removeTooltip();
    this.bottomSheet.open(ItemInfoSheetComponent, {
      panelClass: 'item-info-sheet',
      autoFocus: false,
      backdropClass: 'as-dialog-backdrop',
      data: { item: item, isOwner: false, fromEquip: true, reclame: false, edit: false }
    });
  }
}
