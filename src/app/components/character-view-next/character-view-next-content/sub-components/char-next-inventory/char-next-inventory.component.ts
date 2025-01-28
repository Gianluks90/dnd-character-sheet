import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MoneyDialogComponent } from 'src/app/components/character-view/sub-components/equipaggiamento-tab-view/money-dialog/money-dialog.component';
import { EditMoneyControllerDialogComponent } from 'src/app/components/utilities/money-controller/edit-money-controller-dialog/edit-money-controller-dialog.component';
import { Item } from 'src/app/models/item';

interface Moneys {
  copper: {
    amount: number;
    icon: string;
  },
  silver: {
    amount: number;
    icon: string;
  },
  electrum: {
    amount: number;
    icon: string;
  },
  gold: {
    amount: number;
    icon: string;
  },
  platinum: {
    amount: number;
    icon: string;
  }
}

@Component({
  selector: 'app-char-next-inventory',
  standalone: false,

  templateUrl: './char-next-inventory.component.html',
  styleUrl: './char-next-inventory.component.scss'
})
export class CharNextInventoryComponent {
  constructor(private matDialog: MatDialog) { }

  public _char: any;
  @Input() set char(char: any) {
    this._char = char;
    if (!this._char) return;
    this.initMoney();
    this.initItemRarity();
  }

  public _edit: boolean;
  @Input() set edit(edit: boolean) {
    this._edit = edit;
  }

  public moneys: any[] = [];
  private initMoney(): void {
    const denaro: any = this._char.denaro;
    this.moneys = [
      { amount: denaro.MR, icon: './assets/coins/copper.svg' },
      { amount: denaro.MA, icon: './assets/coins/silver.svg' },
      { amount: denaro.ME, icon: './assets/coins/electrum.svg' },
      { amount: denaro.MO, icon: './assets/coins/gold.svg' },
      { amount: denaro.MP, icon: './assets/coins/platinum.svg' }
    ];
  }

  private initItemRarity(): void {
    this._char.equipaggiamento.map((item: Item) => {
      return item.rarityColor = this.setColor(item.rarity);
    });
  }

  private setColor(rarity: string): string {
    switch (rarity) {
      case 'Comune':
        return '#000000'
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
        return '#000000'
        break;
    }
  }

  public openEditMoneyDialog(): void {
    this.matDialog.open(EditMoneyControllerDialogComponent, {
      width: innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: {
        charId: this._char.id,
        denaro: this._char.denaro
      }
    })
  }

  public selectedItem: Item | null = null;
  public selectItem(item: Item): void {
    this.selectedItem = item;
  }
}
