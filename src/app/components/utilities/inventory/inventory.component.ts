import { Component, Input } from '@angular/core';
import { Item } from 'src/app/models/item';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';
import { CharacterService } from 'src/app/services/character.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ItemInfoSheetComponent } from './item-info-sheet/item-info-sheet.component';
import { CampaignService } from 'src/app/services/campaign.service';
import { ResourcesService } from '../../resources-page/resources.service';
import { getAuth } from 'firebase/auth';
import { AddResourceItemDialogComponent } from './add-resource-item-dialog/add-resource-item-dialog.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {

  public inventoryData: Item[] = [];
  @Input() set inventory(inventory: Item[]) {
    this.inventoryData = inventory;
    this.sortInventory();
  }

  public isOwnerData: boolean = false;
  @Input() set isCampaignOwner(isCampaignOwner: boolean) {
    this.isOwnerData = isCampaignOwner;
  }

  public selectedCharData: any;
  @Input() set selectedChar(selectedChar: string) {
    if (!selectedChar) return;
    this.selectedCharData = selectedChar;
  }

  public isCampaign: boolean = false;
  public isResources: boolean = false;
  public itemResources: any[] = [];

  constructor(
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private characterService: CharacterService,
    private campaignService: CampaignService,
    private resService: ResourcesService) {
    this.isCampaign = window.location.href.includes('campaign-view');

    const userId = getAuth().currentUser.uid;
    this.resService.getResourcesByUserId(userId).then((res) => {
      if (res) {
        this.isResources = true;
        this.itemResources = res.items;
      } else {
        this.isResources = false;
      }
    });
  }

  public openAddItemDialog() {
    this.dialog.open(AddItemDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { inventory: this.inventoryData, isOwner: this.isOwnerData, createdBy: this.selectedCharData?.id || '' }
    }).afterClosed().subscribe((result: any) => {
      if (result.status === 'success') {
        this.characterService.addItemInventory(window.location.href.split('/').pop(), result.item);
        this.sortInventory();
      }
    })
  }

  public openResourcesDialog() {
    this.dialog.open(AddResourceItemDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { items: this.itemResources }
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.items.length > 0) {
          result.items.forEach((item) => {
            item.quantity = 1;
            if (!this.inventoryData.find((i) => i.id === item.id)) this.inventoryData.push(item);
          });
          this.characterService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
          this.sortInventory();
        }
      }
    });
  }

  filterSearch(event: any) {
    const filter = event.target.value.toLowerCase().trim();
    this.inventoryData = this.inventoryData.map((item) => {
      return {
        ...item, filtered: !item.name.toLowerCase().includes(filter)
      }
    })
  }

  public openInfoSheet(item: Item, index: number) {
    this.bottomSheet.open(ItemInfoSheetComponent, {
      // disableClose: true,
      panelClass: 'item-info-sheet',
      autoFocus: false,
      data: { item: item, isOwner: this.isOwnerData, fromEquip: false, reclame: false, edit: true }
    }).afterDismissed().subscribe((result: any) => {
      if (result && result.status === 'edited') {
        this.inventoryData[index] = result.item;
        // if (!this.isCampaign) {
        this.updateCharSets(result.item, 'edited');
        this.characterService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
        // } else {
        //   this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
        // }
      }
      if (result && result.status === 'deleted') {
        this.inventoryData.splice(index, 1);
        // if (!this.isCampaign) {
        // this.updateCharSets(this.inventoryData[index], 'deleted');
        this.characterService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
        // } else {
        //   this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
        // }
      }
      // if (result && result.status === 'reclamed' && this.selectedCharData) {
      //   const itemExists = this.selectedCharData.equipaggiamento.find((item) => item.name === result.item.name);
      //   if (itemExists) {
      //     this.selectedCharData.equipaggiamento.find((item) => item.name === result.item.name).quantity += result.quantity;
      //     this.characterService.updateInventory(this.selectedCharData.id, this.selectedCharData.equipaggiamento).then(() => {
      //       this.inventoryData[index].quantity -= result.quantity;
      //       this.inventoryData[index].visible = this.inventoryData[index].quantity > 0;
      //       this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
      //     });
      //   } else {
      //     const resultItem = { ...result.item };
      //     resultItem.quantity = result.quantity;
      //     this.characterService.addItemInventory(this.selectedCharData.id, resultItem).then(() => {
      //       this.inventoryData[index].quantity -= result.quantity;
      //       this.inventoryData[index].visible = this.inventoryData[index].quantity > 0;
      //       this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
      //     });
      //   }
      // }
      if (result && result.status === 'consumed') {
        this.inventoryData[index].quantity--;
        this.characterService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
      }
      // if (result && result.status === 'equipped') {
      //   // Se è uno scudo
      //   if (this.inventoryData[index].shield) {
      //     this.inventoryData.forEach((item) => {
      //       if (item.shield && item.name !== this.inventoryData[index].name) {
      //         item.weared = false;
      //       }
      //     });
      //     this.inventoryData[index].weared = !this.inventoryData[index].weared;
      //   }

      //   // Se è un'armatura
      //   if (this.inventoryData[index].category.includes('Armatura')) {
      //     this.inventoryData.forEach((item) => {
      //       if (item.name !== this.inventoryData[index].name && item.category.includes('Armatura')) {
      //         item.weared = false;
      //       }
      //     });
      //     this.inventoryData[index].weared = !this.inventoryData[index].weared;
      //   }

      //   this.characterService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
      // }
    });
  }

  private updateCharSets(item: Item, action: string) {
    let sets = [...this.selectedCharData.sets]; // Copia dell'array sets
    switch (action) {
      case 'edited':
        sets.forEach((set) => {
          if (set.mainHand && set.mainHand.id === item.id) {
            set.mainHand = item;
          }
          if (set.offHand && set.offHand.id === item.id) {
            set.offHand = item;
          }
        });
        break;

      case 'deleted':
        // Trova gli indici dei set che contengono l'oggetto nell'offHand o nel mainHand
        const setIndexesToDelete: number[] = [];
        sets.forEach((set, index) => {
          if (set.mainHand && set.mainHand.id === item.id) {
            setIndexesToDelete.push(index);
          }
          if (set.offHand && set.offHand.id === item.id) {
            setIndexesToDelete.push(index);
          }
        });

        // Elimina i set dagli indici trovati (in ordine inverso per evitare problemi con la rimozione degli indici)
        setIndexesToDelete.reverse().forEach((index) => {
          sets.splice(index, 1);
        });
        break;
    }
    this.characterService.updateSets(this.selectedCharData.id, sets);
  }

  setColor(rarity: string): string {
    switch (rarity) {
      case 'Comune':
        // return '#212121' // Quando le icone saranno state modificate con lo sfondo di questo colore
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

  private sortInventory() {
    this.inventoryData.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  // TOOLTIP ====================================================================================

  public currentTooltipItem: any;
  public showItemTooltip: boolean = false;
  public tooltipPosition: { top: number | string, left: number | string } = { top: 0, left: 0 };

  public showTooltip(event: MouseEvent, item: any) {
    if (window.innerWidth < 768) return;
    this.currentTooltipItem = item;
    this.showItemTooltip = true;
    setTimeout(() => {
      const tooltip = document.getElementById('item-tooltip') as HTMLElement;
      if (!tooltip) return;
      const rect = tooltip.getBoundingClientRect();
      if (event.clientY + rect.height > window.innerHeight) {
        // this.tooltipPosition.top = window.innerHeight - rect.height - 10;
        this.tooltipPosition = { top: window.innerHeight + 50 - rect.height, left: event.clientX - 175 };
      } else {
        this.tooltipPosition = { top: event.clientY, left: event.clientX - 175 };
      }
    }, 1);
    // this.tooltipPosition = { top: event.clientY, left: event.clientX-175};
  }

  public hideTooltip() {
    this.showItemTooltip = false;
  }
}
