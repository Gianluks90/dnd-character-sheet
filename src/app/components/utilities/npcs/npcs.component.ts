import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NPC } from 'src/app/models/npcModel';
import { CharacterService } from 'src/app/services/character.service';
import { AddNpcDialogComponent } from './add-npc-dialog/add-npc-dialog.component';
import { AddOrganizationDialogComponent } from './add-organization-dialog/add-organization-dialog.component';
import { CampaignService } from 'src/app/services/campaign.service';
import { getAuth } from 'firebase/auth';
import { ResourcesService } from '../../resources-page/resources.service';
import { AddAlliesResourcesDialogComponent } from './add-allies-resources-dialog/add-allies-resources-dialog.component';
import { AddAddonsResourcesDialogComponent } from './add-addons-resources-dialog/add-addons-resources-dialog.component';
import { AddOrganizationsResourcesDialogComponent } from './add-organizations-resources-dialog/add-organizations-resources-dialog.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-npcs',
    templateUrl: './npcs.component.html',
    styleUrl: './npcs.component.scss',
    standalone: false
})
export class NpcsComponent {

  public npcsData: NPC[] = [];
  public adddonsData: any[] = [];
  public organizationsData: any[] = [];
  public isTab: boolean = false;
  public isDM: boolean = false;
  public isOwner: boolean = false;
  public isCampaign: boolean = false;
  public isCharacterPage: boolean = false;
  public addonTimer: any = null;

  constructor(
    private dialog: MatDialog,
    private charService: CharacterService,
    private campaignService: CampaignService,
    private resService: ResourcesService, 
    private notificationService: NotificationService) {
    this.isCampaign = window.location.href.includes('campaign-view') || false;
    this.isCharacterPage = window.location.href.includes('character-view') || false;

    const userId = getAuth().currentUser.uid;
    this.resService.getResourcesByUserId(userId).then((res) => {
      if (res) {
        this.isResources = true;
        this.addonsResources = res.addons;
        this.alliesResources = res.allies;
        this.orgResources = res.organizations;
      } else {
        this.isResources = false;
      }
    });
  }

  public isResources: boolean = false;
  public addonsResources: NPC[] = [];
  public alliesResources: NPC[] = [];
  public orgResources: NPC[] = [];

  @Input() set npcs(npcs: any[]) {
    this.npcsData = npcs;
    this.sortNpcs();
  }

  @Input() set addons(addons: any[]) {
    this.adddonsData = addons;
    this.sortAddons();
  }

  @Input() set organizations(organizations: any[]) {
    this.organizationsData = organizations;
  }

  @Input() set tab(tab: boolean) {
    this.isTab = tab;
  }

  @Input() set isCampaignOwner(isOwner: boolean) {
    this.isOwner = isOwner;
  }

  @Input() set dm(isDM: boolean) {
    this.isDM = isDM;
  }

  public listTitleData: string = '';
  @Input() set listTitle(title: string) {
    this.listTitleData = title;
  }

  public openAddNpcDialog(npc?: any, index?: number, isTab?: boolean) {
    this.dialog.open(AddNpcDialogComponent, {
      width: window.innerWidth < 600 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { npcs: this.npcsData, npc: npc, isTab: isTab }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          if (!this.isCampaign) {
            this.charService.addAlly(window.location.href.split('/').pop(), result.npc).then(() => {
              // this.npcsData.push(NPC.fromData(result.npc));
              this.sortNpcs();
            });
          } else {
            this.campaignService.addAlly(window.location.href.split('/').pop(), result.npc).then(() => {
              // this.npcsData.push(NPC.fromData(result.npc));
              this.sortNpcs();
            });
          }
          break;
        case 'edited':
          this.calcModifiers(result.npc);
          this.npcsData[index] = result.npc;
          if (!this.isCampaign) {
            this.charService.updateAllies(window.location.href.split('/').pop(), this.npcsData);
          } else {
            this.campaignService.updateAllies(window.location.href.split('/').pop(), this.npcsData).then(() => {
              this.notificationService.newLog(window.location.href.split('/').pop(), {
                message: `Il PNG "${result.npc.name}" è stato appena aggiornato.`,
                type: 'text-edited'
              
              });
            });
          }
          // this.charService.updateAllies(window.location.href.split('/').pop(), this.npcsData);
          break;
        case 'deleted':
          this.npcsData.splice(index, 1);
          if (!this.isCampaign) {
            this.charService.updateAllies(window.location.href.split('/').pop(), this.npcsData);
          } else {
            this.campaignService.updateAllies(window.location.href.split('/').pop(), this.npcsData);
          }
          // this.charService.updateAllies(window.location.href.split('/').pop(), this.npcsData);
          break;
      }
    });
  }

  openAlliesResourcesDialog() {
    this.dialog.open(AddAlliesResourcesDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { allies: this.alliesResources }
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.allies.length > 0) {
          result.allies.forEach((ally: any) => {
            if (!this.isCampaign) {
              this.charService.addAlly(window.location.href.split('/').pop(), ally);
            } else {
              this.campaignService.addAlly(window.location.href.split('/').pop(), ally);
            }
          });
        }
      }
    });
  }

  public openAddonDialog(addon?: any, index?: number) {
    this.dialog.open(AddNpcDialogComponent, {
      width: window.innerWidth < 600 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { npcs: this.adddonsData, npc: addon, isTab: true }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          if (!this.isCampaign) {
            this.charService.addAddon(window.location.href.split('/').pop(), result.npc).then(() => {
              // this.adddonsData.push(NPC.fromData(result.npc));
              this.sortAddons();
            });
          } else {
            this.campaignService.addAddon(window.location.href.split('/').pop(), result.npc).then(() => {
              // this.adddonsData.push(NPC.fromData(result.npc));
              this.sortAddons();
            });
          }
          break;
        case 'edited':
          this.calcModifiers(result.npc);
          this.adddonsData[index] = result.npc;
          if (!this.isCampaign) {
            this.charService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
          } else {
            this.campaignService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
          }
          // this.charService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
          break;
        case 'deleted':
          this.adddonsData.splice(index, 1);
          if (!this.isCampaign) {
            this.charService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
          } else {
            this.campaignService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
          }
          // this.charService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
          break;
      }
    });
  }

  openAddonResourcesDialog() {
    this.dialog.open(AddAddonsResourcesDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { addons: this.addonsResources }
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.addons.length > 0) {
          result.addons.forEach((addon: any) => {
            if (!this.isCampaign) {
              this.charService.addAddon(window.location.href.split('/').pop(), addon);
            } else {
              this.campaignService.addAddon(window.location.href.split('/').pop(), addon);
            }
          });
        }
      }
    });
  }

  public openAddOrganizationDialog(organization?: any, index?: number) {
    this.dialog.open(AddOrganizationDialogComponent, {
      width: window.innerWidth < 600 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { organizations: this.organizationsData, organization: organization }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          if (!this.isCampaign) {
            this.charService.addOrganization(window.location.href.split('/').pop(), result.organization).then(() => {
              // this.organizationsData.push(result.organization);
            });
          } else {
            this.campaignService.addOrganization(window.location.href.split('/').pop(), result.organization).then(() => {
              // this.organizationsData.push(result.organization);
            });
          }
          // this.charService.addOrganization(window.location.href.split('/').pop(), result.organization).then(() => {
          //   this.organizationsData.push(result.organization);
          // });
          break;
        case 'edited':
          this.organizationsData[index] = result.organization;
          if (!this.isCampaign) {
            this.charService.updateOrganizations(window.location.href.split('/').pop(), this.organizationsData);
          } else {
            this.campaignService.updateOrganizations(window.location.href.split('/').pop(), this.organizationsData).then(() => {
              this.notificationService.newLog(window.location.href.split('/').pop(), {
                message: `L'Organizzazione "${result.organization.name}" è stata appena aggiornata.`,
                type: 'text-edited'
              });
            });
          }
          // this.charService.updateOrganizations(window.location.href.split('/').pop(), this.organizationsData);
          break;
        case 'deleted':
          this.organizationsData.splice(index, 1);
          if (!this.isCampaign) {
            this.charService.updateOrganizations(window.location.href.split('/').pop(), this.organizationsData);
          } else {
            this.campaignService.updateOrganizations(window.location.href.split('/').pop(), this.organizationsData);
          }
          // this.charService.updateOrganizations(window.location.href.split('/').pop(), this.organizationsData);
          break;
      }
    });
  }

  openOrganizationsResourcesDialog() {
    this.dialog.open(AddOrganizationsResourcesDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { organizations: this.orgResources }
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.orgs.length > 0) {
          result.orgs.forEach((org: any) => {
            if (!this.isCampaign) {
              this.charService.addOrganization(window.location.href.split('/').pop(), org);
            } else {
              this.campaignService.addOrganization(window.location.href.split('/').pop(), org);
            }
          });
        }
      }
    });
  }

  filterSearch(event: any) {
    const filter = event.target.value.toLowerCase().trim();
    this.adddonsData = this.adddonsData.map((item) => {
      return {
        ...item, filtered: !item.name.toLowerCase().includes(filter)
      }
    });
  }

  private sortNpcs() {
    this.npcsData.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  private sortAddons() {
    this.adddonsData.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  private calcModifiers(npc: NPC) {
    npc.strengthMod = Math.floor((npc.strength - 10) / 2);
    npc.dexterityMod = Math.floor((npc.dexterity - 10) / 2);
    npc.constitutionMod = Math.floor((npc.constitution - 10) / 2);
    npc.intelligenceMod = Math.floor((npc.intelligence - 10) / 2);
    npc.wisdomMod = Math.floor((npc.wisdom - 10) / 2);
    npc.charismaMod = Math.floor((npc.charisma - 10) / 2);
  }

  // public updateNpcHP(action: string, index: number) {
  //   switch (action) {
  //     case 'add':
  //       this.adddonsData[index].HP = this.adddonsData[index].HP + 1 > this.adddonsData[index].HPmax ? this.adddonsData[index].HPmax : this.adddonsData[index].HP + 1;
  //       break;
  //     case 'sub':
  //       this.adddonsData[index].HP = this.adddonsData[index].HP - 1 < 0 ? 0 : this.adddonsData[index].HP - 1;
  //       break;
  //     default:
  //       break;
  //   }
  // }

  public updateNpcHP(action: string, index: number) {
    if (this.addonTimer) {
      clearTimeout(this.addonTimer);
    }
    switch (action) {
      case 'add':
        this.adddonsData[index].HP = this.adddonsData[index].HP + 1 > this.adddonsData[index].HPmax ? this.adddonsData[index].HPmax : this.adddonsData[index].HP + 1;
        break;
      case 'sub':
        this.adddonsData[index].HP = this.adddonsData[index].HP - 1 < 0 ? 0 : this.adddonsData[index].HP - 1;
        break;
      default:
        break;
    }
    this.addonTimer = setTimeout(() => {
      this.charService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
      this.addonTimer = null;
    }, 3000);
  }

  public fullRestore(index: number) {
    this.adddonsData[index].HP = this.adddonsData[index].HPmax;
    this.charService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
  }

  public collapseAll() {
    const details = document.querySelectorAll('details');
    details.forEach((detail: any) => {
      detail.open = false;
    });
  }

  public charData: any;
  @Input() set character(character: any) {
    this.charData = character;
  }

  public addToCharSheet(type: string, index: number) {
    switch (type) {
      case 'allies':
        if (!this.charData.allies.find((ally: any) => ally.name === this.npcsData[index].name)) {
          this.npcsData[index].imgUrl = '';
          this.charData.allies.push(this.npcsData[index]);
          this.charService.updateAllies(this.charData.id, this.charData.allies);
        }
        break;

      case 'organizations':
        if (!this.charData.organizations.find((org: any) => org.name === this.organizationsData[index].name)) {
          this.organizationsData[index].imgUrl = '';
          this.charData.organizations.push(this.organizationsData[index]);
          this.charService.updateOrganizations(this.charData._id, this.charData.organizations);
        }
        break;
    }
  }
}
