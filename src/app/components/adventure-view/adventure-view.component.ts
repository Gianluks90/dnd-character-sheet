import { Component, Input } from '@angular/core';
import { Adventure } from '../adventure-editor/models/adventure';
import { MatDialog } from '@angular/material/dialog';
import { AddOrganizationDialogComponent } from '../utilities/npcs/add-organization-dialog/add-organization-dialog.component';
import { AdventureService } from 'src/app/services/adventure.service';
import { AddNpcDialogComponent } from '../utilities/npcs/add-npc-dialog/add-npc-dialog.component';
import { CampaignService } from 'src/app/services/campaign.service';

@Component({
  selector: 'app-adventure-view',
  templateUrl: './adventure-view.component.html',
  styleUrl: './adventure-view.component.scss'
})
export class AdventureViewComponent {

  constructor(private dialog: MatDialog, private adventureService: AdventureService, private campService: CampaignService) { }

  public adventureConnected: boolean = false;
  public campaign: any = null;

  public adventureData: Adventure | null = null;
  @Input() set adventure(adventure: Adventure) {
    this.adventureData = adventure;
    if (this.adventureData) {
      this.checkConnection().then(() => {
        setTimeout(() => {
          this.adventureData.chapters.forEach((chapter) => {
            const chapterIndex = this.adventureData.chapters.findIndex((c) => c.elements.some((element) => element.bookmarked)) || 0;
            const elementIndex = chapter.elements.findIndex((element) => element.bookmarked);
            setTimeout(() => {
              this.scrollToElement(chapterIndex, elementIndex);
            }, 100);
          });
        }, 1);
      });
    }
    // this.createSubtitle();
  }

  public async checkConnection(): Promise<void> {
    const campaignId: string = window.location.href.split('/campaign-view/').pop() || null;
    if (campaignId) {
      await this.campService.getCampaignById(campaignId).then((campaign) => {
        if (campaign.adventure === this.adventureData.id) {
          this.adventureConnected = true;
          this.campaign = campaign;
          console.log('Connected to campaign:', campaign);
          
        }
      });
    }
  }

  public editOrg(chapterIndex: number, elementIndex: number, orgIndex: number): void {
    const org = this.adventureData.chapters[chapterIndex].elements[elementIndex].organizations[orgIndex];
    this.dialog.open(AddOrganizationDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { organizations: this.adventureData.chapters[chapterIndex].elements[elementIndex].organizations, organization: org }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'edited':
          this.adventureData.chapters[chapterIndex].elements[elementIndex].organizations[orgIndex] = result.organization;
          this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
          break;
        case 'deleted':
          this.adventureData.chapters[chapterIndex].elements[elementIndex].organizations.splice(orgIndex, 1);
          this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
          break;
      }
    });
  }

  public editNpc(chapterIndex: number, elementIndex: number, npcIndex: number): void {
    const npc = this.adventureData.chapters[chapterIndex].elements[elementIndex].npcs[npcIndex];
    this.dialog.open(AddNpcDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { npcs: this.adventureData.chapters[chapterIndex].elements[elementIndex].npcs, npc, isTab: false }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'edited':
          this.adventureData.chapters[chapterIndex].elements[elementIndex].npcs[npcIndex] = result.npc;
          this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
          break;
        case 'deleted':
          this.adventureData.chapters[chapterIndex].elements[elementIndex].npcs.splice(npcIndex, 1);
          this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
          break;
      }
    });
  }

  public editAddon(chapterIndex: number, elementIndex: number, addonIndex: number): void {
    const addon = this.adventureData.chapters[chapterIndex].elements[elementIndex].addons[addonIndex];
    this.dialog.open(AddNpcDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { npcs: this.adventureData.chapters[chapterIndex].elements[elementIndex].addons, npc: addon, isTab: true }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'edited':
          this.adventureData.chapters[chapterIndex].elements[elementIndex].addons[addonIndex] = result.npc;
          this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
          break;
        case 'deleted':
          this.adventureData.chapters[chapterIndex].elements[elementIndex].addons.splice(addonIndex, 1);
          this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
          break;
      }
    });
  }

  public chapterBookmarkToggle(index: number): void {
    this.adventureData.chapters.map((chapter, i) => {
      if (i === index) {
        chapter.bookmarked = !chapter.bookmarked;
      } else {
        chapter.bookmarked = false;
      }
      return chapter;
    });
    this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
  }

  public elementBookmarkToggle(chapterIndex: number, index: number): void {
    this.adventureData.chapters[chapterIndex].elements.map((element, i) => {
      if (i === index) {
        element.bookmarked = !element.bookmarked;
      } else {
        element.bookmarked = false;
      }
      return element;
    });
    this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
  }

  private scrollToElement(chapterIndex: number, bookmarkIndex: number): void {
    if (bookmarkIndex !== -1) {
      const element = document.getElementById(`elem_${chapterIndex}_${bookmarkIndex}`);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  public addQuestToCampaign(quest: any): void {
    const questToAdd = {
      ...quest,
      steps: []
    };
    if (!(this.campaign.quests as any[]).includes(quest.title)) {
      this.campService.addQuest(this.campaign.id, questToAdd);
    }
  }

  public setColor(rarity: string): string {
    switch (rarity) {
      case 'Comune':
        return '#212121'
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
}