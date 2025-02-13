import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { ResourcesService } from 'src/app/components/resources-page/resources.service';
import { AddAddonsResourcesDialogComponent } from 'src/app/components/utilities/npcs/add-addons-resources-dialog/add-addons-resources-dialog.component';
import { AddNpcDialogComponent } from 'src/app/components/utilities/npcs/add-npc-dialog/add-npc-dialog.component';
import { NPC } from 'src/app/models/npcModel';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-char-next-addons',
  standalone: false,

  templateUrl: './char-next-addons.component.html',
  styleUrl: './char-next-addons.component.scss'
})
export class CharNextAddonsComponent {

  constructor(private matDialog: MatDialog, private resService: ResourcesService, private charService: CharacterService) {
    this.resService.getResourcesByUserId(getAuth().currentUser.uid).then((resources: any) => {
      if (resources) {
        this.resourcesReady = true;
        this.addonsResources = resources.addons.sort((a: NPC, b: NPC) => a.name.localeCompare(b.name));
      } else {
        this.resourcesReady = false;
      }
    });
  }

  public resourcesReady: boolean = false;
  public addonsResources: NPC[] = [];

  public _char: any;
  @Input() set char(char: any) {
    if (!char) return;
    this._char = char;
    this.initAddons();
  }

  public _edit: boolean = false;
  @Input() set edit(edit: boolean) {
    this._edit = edit;
  }

  public addons: NPC[] = [];
  private initAddons(): void {
    this.addons = [];
    this._char.addons.forEach(addon => {
      this.addons.push(NPC.fromData(addon));
    })
  }

  public openAddonResourcesDialog() {
    this.matDialog.open(AddAddonsResourcesDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: { addons: this.addonsResources }
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.addons.length > 0) {
          result.addons.forEach((addon: any) => {
            this.charService.addAddon(window.location.href.split('/').pop(), addon);
          });
        }
      }
    });
  }

  public openAddonDialog(addon?: any, index?: number) {
    this.matDialog.open(AddNpcDialogComponent, {
      width: window.innerWidth < 600 ? '90%' : '50%',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: { npcs: this._char.addons, npc: addon }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          result.npc.category = 'Evocazione/Trasformazione/Altro';
          this.charService.addAddon(window.location.href.split('/').pop(), result.npc);
          break;
        case 'edited':
          this._char.addons[index] = result.npc;
          this.charService.updateAddons(window.location.href.split('/').pop(), this._char.addons);
          break;
        case 'deleted':
          this._char.addons.splice(index, 1);
          this.charService.updateAddons(window.location.href.split('/').pop(), this._char.addons);
          break;
      }
    });
  }
}
