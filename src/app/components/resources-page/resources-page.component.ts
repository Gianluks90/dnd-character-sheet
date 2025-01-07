import { Component, effect } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';
import { ResourcesService } from './resources.service';
import { MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { AddNpcDialogComponent } from '../utilities/npcs/add-npc-dialog/add-npc-dialog.component';
import { AddItemDialogComponent } from '../utilities/inventory/add-item-dialog/add-item-dialog.component';
import { AddOrganizationDialogComponent } from '../utilities/npcs/add-organization-dialog/add-organization-dialog.component';
import { AddSpellDialogComponent } from '../character-view/sub-components/trucchetti-incantesimi-tab-view/add-spell-dialog/add-spell-dialog.component';
import { Spell } from 'src/app/models/spell';
import { DescriptionTooltipService } from '../utilities/description-tooltip/description-tooltip.service';
import { Item } from 'src/app/models/item';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AdventurerUser } from 'src/app/models/adventurerUser';
import { ManageResourcesDialogComponent } from './manage-resources-dialog/manage-resources-dialog.component';
import { Platform } from '@angular/cdk/platform';

@Component({
    selector: 'app-resources-page',
    templateUrl: './resources-page.component.html',
    styleUrl: './resources-page.component.scss',
    standalone: false
})
export class ResourcesPageComponent {

  public user: AdventurerUser | null;

  constructor(
    private firebaseService: FirebaseService,
    public sidenavService: SidenavService,
    private resService: ResourcesService,
    private dialog: MatDialog,
    public tooltip: DescriptionTooltipService) {
    // const userId: string = getAuth().currentUser.uid;
    effect(() => {
      this.user = this.firebaseService.userSignal();
      if (!this.user) return;
      this.resService.getSignalResourcesByUserId(this.user.id);
    });

    effect(() => {
        this.resourcesData = this.resService.resources();
        if (this.resourcesData) {
          this.retryGetUserCharactersAndCampaigns(this.user.id, 5, 5000)
      .then((result) => {
        this.characters = result.characters;
        this.campaigns = result.campaigns;
      })
      .catch((error) => {
        console.error("Failed to fetch user characters and campaigns:", error);
      });
        }
    });
    
    // if (user) {
    //   this.resService.getSignalResourcesByUserId(user.id);
    //   effect(() => {
    //     this.resourcesData = this.resService.resources();
    //   });
    // }
  }

  // ngAfterViewInit() {
  //   const userId: string = getAuth().currentUser.uid;
  //   this.retryGetUserCharactersAndCampaigns(userId, 5, 5000)
  //     .then((result) => {
  //       this.characters = result.characters;
  //       this.campaigns = result.campaigns;
  //     })
  //     .catch((error) => {
  //       console.error("Failed to fetch user characters and campaigns:", error);
  //     });
  // }

  private retryGetUserCharactersAndCampaigns(userId: string, retries: number, delay: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const attempt = (remainingRetries: number) => {
        this.resService.getUserCharactersAndCampaigns(userId)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            if (remainingRetries > 0) {
              setTimeout(() => {
                console.log(`Retrying due to error... ${remainingRetries} attempts left`, error);
                attempt(remainingRetries - 1);
              }, delay);
            } else {
              reject(new Error('Failed to fetch data after multiple attempts'));
            }
          });
      };

      attempt(retries);
    });
  }

  public resourcesData: any;
  public characters: any[] = [];
  public campaigns: any[] = [];

  public resourcesInit() {
    const userId: string = getAuth().currentUser.uid;
    if (userId) {
      this.resService.resourcesInit(userId);
    }
  }

  public async import(type: string): Promise<void> {
    let count: number = 0;
    try {
      const [charactersImported, campaignsImported] = await Promise.all([
        this.importFromCharacters(type),
        this.importFromCampaigns(type)
      ]);

      if (charactersImported == 0 && campaignsImported == 0) {
        alert('Nessun nuovo elemento importato.');
        return;
      };

      count += charactersImported;
      count += campaignsImported;

      alert(`Importati ${count} nuovi elementi.`);
    } catch (error) {
      console.error("Error during import:", error);
    }
  }

  private async importFromCharacters(type: string): Promise<number> {
    let imported: number = 0;
    console.log(`Importing from characters for type: ${type}`);
    for (const char of this.characters) {
      switch (type) {
        case 'allies':
          char.allies.forEach((ally) => {
            if (!this.resourcesData.allies.find((a) => a.name === ally.name)) {
              ally.visible = false;
              this.resourcesData.allies.push(ally);
              imported++;
            }
          });
          break;
        case 'addons':
          char.addons.forEach((addon) => {
            if (!this.resourcesData.addons.find((a) => a.name === addon.name)) {
              addon.visible = false;
              this.resourcesData.addons.push(addon);
              imported++;
            }
          });
          break;
        case 'inventory':
          char.equipaggiamento.forEach((item) => {
            if (!this.resourcesData.items.find((i) => i.id === item.id)) {
              item.quantity = 0;
              item.weared = false;
              this.resourcesData.items.push(item);
              imported++;
            }
          });
          break;
        case 'organizations':
          char.organizations.forEach((org) => {
            if (!this.resourcesData.organizations.find((o) => o.name === org.name)) {
              this.resourcesData.organizations.push(org);
              imported++;
            }
          });
          break;
        case 'spells':
          char.magia.trucchettiIncantesimi.forEach((spell) => {
            if (!this.resourcesData.spells.find((s) => s.nome === spell.nome)) {
              spell.preparato = false;
              this.resourcesData.spells.push(spell);
              imported++;
            }
          });
          break;
      }
    }

    if (imported > 0) {
      await this.resService.updateResources(this.resourcesData.id, this.resourcesData);
    }

    return imported;
  }

  private async importFromCampaigns(type: string): Promise<number> {
    let imported: number = 0;
    for (const camp of this.campaigns) {
      switch (type) {
        case 'allies':
          camp.allies.forEach((ally) => {
            if (!this.resourcesData.allies.find((a) => a.name === ally.name)) {
              this.resourcesData.allies.push(ally);
              imported++;
            }
          });
          break;
        case 'addons':
          camp.addons.forEach((addon) => {
            if (!this.resourcesData.addons.find((a) => a.name === addon.name)) {
              this.resourcesData.addons.push(addon);
              imported++;
            }
          });
          break;
        case 'inventory':
          camp.inventory.forEach((item) => {
            if (!this.resourcesData.items.find((i) => i.id === item.id)) {
              this.resourcesData.items.push(item);
              imported++;
            }
          });
          break;
        case 'organizations':
          camp.organizations.forEach((org) => {
            if (!this.resourcesData.organizations.find((o) => o.name === org.name)) {
              this.resourcesData.organizations.push(org);
              imported++;
            }
          });
          break;
      }
    }

    if (imported > 0) {
      await this.resService.updateResources(this.resourcesData.id, this.resourcesData);
    }

    return imported;
  }

  openAddItemDialog() {
    this.dialog.open(AddItemDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { inventory: this.resourcesData.items }
    }).afterClosed().subscribe((result: any) => {
      if (result.status === 'success') {
        const userId: string = getAuth().currentUser.uid;
        this.resService.addResource(userId, 'items', result.item);
      }
    })
  }

  openEditItemDialog(item: Item, index: number) {
    this.dialog.open(AddItemDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { inventory: [], item: item }
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        const userId: string = getAuth().currentUser.uid;
        switch (result.status) {
          case 'edited':
            this.resourcesData.items[index] = result.item;
            this.resService.updateResources(userId, this.resourcesData);
            break;
          case 'deleted':
            this.resourcesData.items.splice(index, 1);
            this.resService.updateResources(userId, this.resourcesData);
            break;
        }
      }
    })
  }

  openAddSpellDialog(spell?: Spell, index?: number) {
    this.dialog.open(AddSpellDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { spells: this.resourcesData.spells, spell: spell }
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        const userId: string = getAuth().currentUser.uid;
        switch (result.status) {
          case 'success':
            this.resService.addResource(userId, 'spells', result.spell);
            break;
          case 'edited':
            this.resourcesData.spells[index] = result.spell;
            this.resService.updateResources(userId, this.resourcesData);
            break;
          case 'deleted':
            this.resourcesData.spells.splice(index, 1);
            this.resService.updateResources(userId, this.resourcesData);
            break;
        }
      }
    })
  }

  public openAddNpcDialog(npc?: any, index?: number) {
    this.dialog.open(AddNpcDialogComponent, {
      width: window.innerWidth < 600 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { npcs: this.resourcesData.allies, npc: npc, isTab: false }
    }).afterClosed().subscribe((result) => {
      if (result) {
        const userId: string = getAuth().currentUser.uid;
        switch (result.status) {
          case 'success':
            this.resService.addResource(userId, 'allies', result.npc);
            break;
          case 'edited':
            this.resourcesData.allies[index] = result.npc;
            this.resService.updateResources(userId, this.resourcesData);
            break;
          case 'deleted':
            this.resourcesData.allies.splice(index, 1);
            this.resService.updateResources(userId, this.resourcesData);
            break;
        }
      }
    });
  }

  public openAddOrganizationDialog(organization?: any, index?: number) {
    this.dialog.open(AddOrganizationDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { organizations: this.resourcesData.organizations, organization: organization }
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        const userId: string = getAuth().currentUser.uid;
        switch (result.status) {
          case 'success':
            this.resService.addResource(userId, 'organizations', result.organization);
            break;
          case 'edited':
            this.resourcesData.organizations[index] = result.organization;
            this.resService.updateResources(userId, this.resourcesData);
            break;
          case 'deleted':
            this.resourcesData.organizations.splice(index, 1);
            this.resService.updateResources(userId, this.resourcesData);
            break;
        }
      }
    });
  }

  public openAddonDialog(addon?: any, index?: number) {
    this.dialog.open(AddNpcDialogComponent, {
      width: window.innerWidth < 600 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { npcs: this.resourcesData.addons, npc: addon, isTab: true }
    }).afterClosed().subscribe((result: any) => {
      if (result) {        
        const userId: string = getAuth().currentUser.uid;
        switch (result.status) {
          case 'success':
            this.resService.addResource(userId, 'addons', result.npc);
            break;
          case 'edited':
            this.resourcesData.addons[index] = result.npc;
            this.resService.updateResources(userId, this.resourcesData);
            break;
          case 'deleted':
            this.resourcesData.addons.splice(index, 1);
            this.resService.updateResources(userId, this.resourcesData);
            break;
        }
      }
    });
  }

  public openManageResourcesDialog() {
    this.dialog.open(ManageResourcesDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      data: { user: this.user }
    })
  }
}
