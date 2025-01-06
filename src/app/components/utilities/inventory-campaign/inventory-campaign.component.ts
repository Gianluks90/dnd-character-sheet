import { Component, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';
import { CampaignService } from 'src/app/services/campaign.service';
import { CharacterService } from 'src/app/services/character.service';
import { AddItemDialogComponent } from '../inventory/add-item-dialog/add-item-dialog.component';
import { ItemInfoSheetComponent } from '../inventory/item-info-sheet/item-info-sheet.component';
import { ExchangeDialogComponent } from './exchange-dialog/exchange-dialog.component';
import { AddResourceItemDialogComponent } from '../inventory/add-resource-item-dialog/add-resource-item-dialog.component';
import { getAuth } from 'firebase/auth';
import { ResourcesService } from '../../resources-page/resources.service';

@Component({
  selector: 'app-inventory-campaign',
  templateUrl: './inventory-campaign.component.html',
  styleUrl: './inventory-campaign.component.scss'
})
export class InventoryCampaignComponent {

  constructor(
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private characterService: CharacterService,
    private campaignService: CampaignService,
    private resService: ResourcesService) {
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

  public isResources: boolean = false;
  public itemResources: Item[] = [];

  public inventoryData: Item[] = [];
  public commonInventoryData: Item[] = [];
  public somethingToReclame: boolean = false;
  // @Input() set inventory(inventory: Item[]) {
  //   this.inventoryData = inventory;
  //   this.sortInventory();
  // }

  @Input() set campaign(campaign: any) {
    this.inventoryData = campaign.inventory || [];
    this.commonInventoryData = campaign.commonInventory || [];
    this.sortInventory();
  }

  private sortInventory() {
    this.inventoryData.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
    this.commonInventoryData.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
    this.inventoryData.find((item) => item.quantity > 0 && item.visible) ? this.somethingToReclame = true : this.somethingToReclame = false;
  }

  public filterSearch(event: any) {
    const filter = event.target.value.toLowerCase().trim();
    this.inventoryData = this.inventoryData.map((item) => {
      return {
        ...item, filtered: !item.name.toLowerCase().includes(filter)
      }
    })
  }

  public setColor(rarity: string): string {
    switch (rarity) {
      case 'Comune':
        // return '#212121' // Quando le icone saranno state modificate con lo sfondo di questo colore
        return '000000'
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

  public isOwnerData: boolean = false;
  @Input() set isCampaignOwner(isCampaignOwner: boolean) {
    this.isOwnerData = isCampaignOwner;
  }

  public selectedCharData: any;
  @Input() set selectedChar(selectedChar: string) {
    if (!selectedChar) return;
    this.selectedCharData = selectedChar;
  }

  public charsData: any[] = [];
  @Input() set characters(characters: any) {
    this.charsData = characters;
  }

  openAddItemDialog() {
    this.dialog.open(AddItemDialogComponent, {
      width: window.innerWidth < 500 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { inventory: this.inventoryData, isOwner: this.isOwnerData, createdBy: this.selectedCharData?.id || '' }
    }).afterClosed().subscribe((result: any) => {
      if (result.status === 'success') {
        this.campaignService.addItemInventory(window.location.href.split('/').pop(), result.item);
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
            item.quantity = 0;
            item.visible = false;
            if (!this.inventoryData.find((i) => i.id === item.id)) this.inventoryData.push(item);
          });
          this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
          this.sortInventory();
        }
      }
    });
  }

  public openInfoSheet(item: Item, index: number, deposit: boolean) {
    this.bottomSheet.open(ItemInfoSheetComponent, {
      // disableClose: true,
      panelClass: 'item-info-sheet',
      autoFocus: false,
      data: { item: item, isOwner: this.isOwnerData, fromEquip: false, reclame: true, edit: true }
    }).afterDismissed().subscribe((result: any) => {
      if (result && result.status === 'edited') {
        this.inventoryData[index] = result.item;
        this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
      }
      if (result && result.status === 'deleted') {
        this.inventoryData.splice(index, 1);
        this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
      }
      if (result && result.status === 'reclamed' && this.selectedCharData) {
        const itemExists = this.selectedCharData.equipaggiamento.find((item) => item.id === result.item.id);
        if (itemExists) {
          this.selectedCharData.equipaggiamento.find((item) => item.id === result.item.id).quantity += result.quantity;
          this.characterService.updateInventory(this.selectedCharData.id, this.selectedCharData.equipaggiamento).then(() => {
            if (!deposit) {
              this.inventoryData[index].quantity -= result.quantity;
              this.inventoryData[index].visible = this.inventoryData[index].quantity > 0;
              this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
            } else {
              this.commonInventoryData[index].quantity -= result.quantity;
              if (this.commonInventoryData[index].quantity === 0) {
                this.commonInventoryData.splice(index, 1); // Use splice instead of slice
              }
              this.campaignService.updateCommonInventory(window.location.href.split('/').pop(), this.commonInventoryData);
            }
          });
        } else {
          const resultItem = { ...result.item };
          resultItem.quantity = result.quantity;
          this.characterService.addItemInventory(this.selectedCharData.id, resultItem).then(() => {
            if (!deposit) {
              this.inventoryData[index].quantity -= result.quantity;
              this.inventoryData[index].visible = this.inventoryData[index].quantity > 0;
              this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
            } else {
              this.commonInventoryData[index].quantity -= result.quantity;
              if (this.commonInventoryData[index].quantity === 0) {
                this.commonInventoryData.splice(index, 1); // Use splice instead of slice
              }
              this.campaignService.updateCommonInventory(window.location.href.split('/').pop(), this.commonInventoryData);
            }
          });
        }
      }
      if (result && result.status === 'consumed') {
        this.inventoryData[index].quantity--;
        this.characterService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
      }
      if (result && result.status === 'duplicate') {
        this.inventoryData.push({
          ...result.item,
          name: result.item.name + ' (Copia)',
          id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          quantity: 0,
          visible: false
        });
        this.campaignService.updateInventory(window.location.href.split('/').pop(), this.inventoryData);
      }
    });
  }

  public openExchangeDialog() {
    const filteredChars = this.charsData.filter((char) => char.id !== this.selectedCharData.id);
    console.log(filteredChars);
    
    this.dialog.open(ExchangeDialogComponent, {
      width: window.innerWidth < 500 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { selectedChar: this.selectedCharData, characters: filteredChars }
      // data: { selectedChar: this.charsData[0], characters: this.charsData } // TEMPORARY
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
