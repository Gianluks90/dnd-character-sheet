import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { ResourcesService } from 'src/app/components/resources-page/resources.service';
import { AddItemDialogComponent } from 'src/app/components/utilities/inventory/add-item-dialog/add-item-dialog.component';
import { AddResourceItemDialogComponent } from 'src/app/components/utilities/inventory/add-resource-item-dialog/add-resource-item-dialog.component';
import { EditMoneyControllerDialogComponent } from 'src/app/components/utilities/money-controller/edit-money-controller-dialog/edit-money-controller-dialog.component';
import { Item } from 'src/app/models/item';
import { CharacterService } from 'src/app/services/character.service';

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
  constructor(
    private matDialog: MatDialog,
    private charService: CharacterService,
    private resService: ResourcesService
  ) {
    this.resService.getResourcesByUserId(getAuth().currentUser.uid).then((resources: any) => {
      if (resources) {
        this.resourcesReady = true;
        this.itemResources = resources.items.sort((a: Item, b: Item) => a.name.localeCompare(b.name));
      } else {
        this.resourcesReady = false;
      }
    });
  }

  public resourcesReady: boolean = false;
  public itemResources: Item[] = [];

  public _char: any;
  @Input() set char(char: any) {
    this._char = char;
    if (!this._char) return;
    // this.selectedItem = this._char.equipaggiamento[9];
    this.initMoney();
    this.initItemRarity();
    this.sortInventory();
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
        return '#000000'
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

  public openAddItemDialog() {
    this.matDialog.open(AddItemDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: { inventory: this._char.equipaggiamento }
    }).afterClosed().subscribe((result: any) => {
      if (result.status === 'success') {
        this.charService.addItemInventory(window.location.href.split('/').pop(), result.item);
        this.sortInventory();
      }
    })
  }

    openEditDialog(item: Item) {
      this.matDialog.open(AddItemDialogComponent, {
        width: window.innerWidth < 768 ? '90%' : '50%',
        autoFocus: false,
        disableClose: true,
        backdropClass: 'as-dialog-backdrop',
        data: { inventory: [], item: item }
      }).afterClosed().subscribe((result: any) => {
        if (!result) return;
        this.onItemDetailAction(result);
      });
    }

    public openResourcesDialog() {
      this.matDialog.open(AddResourceItemDialogComponent, {
        width: window.innerWidth < 768 ? '90%' : '50%',
        autoFocus: false,
        disableClose: true,
        backdropClass: 'as-dialog-backdrop',
        data: { items: this.itemResources }
      }).afterClosed().subscribe((result: any) => {
        if (result) {
          if (result.items.length > 0) {
            result.items.forEach((item) => {
              item.quantity = 1;
              if (!this._char.equipaggiamento.find((i) => i.id === item.id)) this._char.equipaggiamento.push(item);
            });
            this.charService.updateInventory(this._char.id, this._char.equipaggiamento);
            this.sortInventory();
          }
        }
      });
    }

  private sortInventory() {
    this._char.equipaggiamento.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  public onItemDetailAction(result: any) {
    const { status, item } = result;
    const { id, equipaggiamento } = this._char;

    switch (status) {
      case 'edited':
        this._char.equipaggiamento = equipaggiamento.map((invItem: Item) => invItem.id === item.id ? item : invItem);
        this.selectedItem = item;
        break;
      case 'deleted':
        this._char.equipaggiamento = equipaggiamento.filter((invItem: Item) => invItem.id !== item.id);
        break;
      case 'duplicate':
        this.charService.addItemInventory(id, {
          ...item,
          name: `${item.name} (Copia)`,
          id: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
          quantity: 1
        });
        return;
      // case 'consumed':
      //   this._char.equipaggiamento = equipaggiamento.map((invItem: Item) => {
      //     if (invItem.id === item.id) {
      //       invItem.quantity -= 1;
      //     }
      //     return invItem;
      //   });
      //   break;
    }
    this.charService.updateInventory(id, this._char.equipaggiamento);
  }

  public consumeItem(item: Item) {
    this._char.equipaggiamento = this._char.equipaggiamento.map((invItem: Item) => {
      if (invItem.id === item.id) {
        invItem.quantity -= 1;
      }
      return invItem;
    });
    this.charService.updateInventory(this._char.id, this._char.equipaggiamento);
  }

  public searchItem(word: any) {
    console.log(word);
    
    this._char.equipaggiamento.map((item: Item) => {
      item.filtered = !item.name.toLowerCase().includes(word.toLowerCase());
    });
    
  }
}
