import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { EditStoryDialogComponent } from 'src/app/components/character-view/sub-components/descrizione-background-tab-view/edit-story-dialog/edit-story-dialog.component';
import { ResourcesService } from 'src/app/components/resources-page/resources.service';
import { AddAlliesResourcesDialogComponent } from 'src/app/components/utilities/npcs/add-allies-resources-dialog/add-allies-resources-dialog.component';
import { AddNpcDialogComponent } from 'src/app/components/utilities/npcs/add-npc-dialog/add-npc-dialog.component';
import { AddOrganizationDialogComponent } from 'src/app/components/utilities/npcs/add-organization-dialog/add-organization-dialog.component';
import { AddOrganizationsResourcesDialogComponent } from 'src/app/components/utilities/npcs/add-organizations-resources-dialog/add-organizations-resources-dialog.component';
import { NPC } from 'src/app/models/npcModel';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-char-next-background',
  standalone: false,
  templateUrl: './char-next-background.component.html',
  styleUrl: './char-next-background.component.scss'
})
export class CharNextBackgroundComponent {
  constructor(
    private matDialog: MatDialog,
    private charService: CharacterService,
    private resService: ResourcesService) {
    const userId: string = getAuth().currentUser.uid;
    this.resService.getResourcesByUserId(userId).then((resources: any) => {
      if (resources) {
        this.resourcesReady = true;
        this.alliesResources = resources.allies;
        this.addonsResources = resources.addons;
        this.orgResources = resources.organizations;
        console.log(this.orgResources);
        
      } else {
        this.resourcesReady = true;
      }
    });
  }

  public _char: any;
  @Input() set char(char: any) {
    this._char = char;
  }

  public _edit: boolean;
  @Input() set edit(edit: boolean) {
    this._edit = edit;
  }

  public resourcesReady: boolean = false;
  public addonsResources: NPC[] = [];
  public alliesResources: NPC[] = [];
  public orgResources: NPC[] = [];


  public openEditStoryDialog() {
    this.matDialog.open(EditStoryDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      backdropClass: 'as-dialog-backdrop',
      data: { story: this._char.storiaPersonaggio }
    }).afterClosed().subscribe((result) => {
      if (result && result.status === 'success') {
        this.charService.updateStory(this._char.id, result.story);
      }
    });
  }

  // Add Edit dialogs

  public openAddAllyDialog(npc?: any, index?: number, isTab?: boolean) {
    this.matDialog.open(AddNpcDialogComponent, {
      width: window.innerWidth < 600 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: { npcs: this._char.allies, npc: npc, isTab: isTab }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          this.charService.addAlly(window.location.href.split('/').pop(), result.npc);
          break;
        case 'edited':
          this._char.allies[index] = result.npc;
          this.charService.updateAllies(window.location.href.split('/').pop(), this._char.allies);
          break;
        case 'deleted':
          this._char.allies.splice(index, 1);
          this.charService.updateAllies(window.location.href.split('/').pop(), this._char.allies);
          break;
      }
    });
  }

  public openAddOrganizationDialog(organization?: any, index?: number) {
    this.matDialog.open(AddOrganizationDialogComponent, {
      width: window.innerWidth < 600 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: { organizations: this._char.organizations, organization: organization }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          this.charService.addOrganization(window.location.href.split('/').pop(), result.organization);
          break;
        case 'edited':
          this._char.organizations[index] = result.organization;
          this.charService.updateOrganizations(window.location.href.split('/').pop(), this._char.organizations);
          break;
        case 'deleted':
          this._char.organizations.splice(index, 1);
          this.charService.updateOrganizations(window.location.href.split('/').pop(), this._char.organizations);
          break;
      }
    });
  }

  // Resources dialogs

  openAlliesResourcesDialog() {
    this.matDialog.open(AddAlliesResourcesDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: {
        allies: this.alliesResources
      }
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.allies.length > 0) {
          result.allies.forEach((ally: any) => {
            this.charService.addAlly(window.location.href.split('/').pop(), ally);
          });
        }
      }
    });
  }

  openOrganizationsResourcesDialog() {
    this.matDialog.open(AddOrganizationsResourcesDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: {
        organizations: this.orgResources
      }
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.orgs.length > 0) {
          result.orgs.forEach((org: any) => {
            this.charService.addOrganization(window.location.href.split('/').pop(), org);
          });
        }
      }
    });
  }
}
