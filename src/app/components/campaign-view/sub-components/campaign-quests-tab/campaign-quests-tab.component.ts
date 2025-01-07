import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestDialogComponent } from './add-quest-dialog/add-quest-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { CampaignService } from 'src/app/services/campaign.service';
import { ArchiveQuestDialogComponent } from './archive-quest-dialog/archive-quest-dialog.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-campaign-quests-tab',
    templateUrl: './campaign-quests-tab.component.html',
    styleUrl: './campaign-quests-tab.component.scss',
    standalone: false
})
export class CampaignQuestsTabComponent {

  public campId: string;
  public questsData: any[] = [];
  public archiveData: any[] = [];
  public isOwnerData: boolean = false;

  @Input() set campaign(value: any) {
    this.campId = value.id;
    this.questsData = value.quests;
    this.archiveData = value.archive;
    this.questsData = this.sortQuestByLastUpdate(this.questsData);
  }

  @Input() set isOwner(value: boolean) {
    this.isOwnerData = value;
  }

  constructor(
    private dialog: MatDialog, 
    private platform: Platform, 
    private campaignService: CampaignService,
    private notificationService: NotificationService) { }

  public openQuestDialog(quest?: any, index?: number) {
    this.dialog.open(AddQuestDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false,
      disableClose: true,
      data: { quest: quest }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          this.campaignService.addQuest(window.location.href.split('/').pop(), result.quest);
          break;
        case 'edited':
          this.questsData[index] = result.quest;
          this.campaignService.updateCampaignQuest(window.location.href.split('/').pop(), this.questsData).then(() => {
            this.notificationService.newLog(this.campId, {
              message: `La Missione "${quest.title}" è stata appena aggiornata.`,
              type: 'text-edited'
            })
          });
          break;
        case 'delete':
          this.questsData.splice(index, 1);
          this.campaignService.updateCampaignQuest(window.location.href.split('/').pop(), this.questsData).then(() => {
            this.notificationService.newLog(this.campId, {
              message: `La Missione "${quest.title}" è stata eliminata.`,
              type: 'text-removed'
            })
          });
          break;
        default:
          break;
      }
      this.questsData = this.sortQuestByLastUpdate(this.questsData);
    });
  }

  private sortQuestByLastUpdate(list: any[]) {
    if (list && list.length > 0) {
      return list.sort((a, b) => {
        if (a.lastUpdate > b.lastUpdate) {
          return -1;
        } else if (a.lastUpdate < b.lastUpdate) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      return list;
    }
  }

  public collapseAll() {
    const details = document.querySelectorAll('details');
    details.forEach((detail: any) => {
      detail.open = false;
    });
  }

  public openArchiveQuestsDialog(): void {
    this.dialog.open(ArchiveQuestDialogComponent, {
      width: window.innerWidth < 600 ? '80%' : '50%',
      autoFocus: false,
      data: { archive: this.archiveData }
    })
  }

  public questToggleVisibility(index: number): void {
    this.questsData[index].visible = !this.questsData[index].visible;
    this.campaignService.updateCampaignQuest(window.location.href.split('/').pop(), this.questsData).then(() => {
      if (this.questsData[index].visible) {
        this.notificationService.newLog(this.campId, {
          message: `La Missione "${this.questsData[index].title}" è stata rivelata.`,
          type: 'text-visibility'
        });
      }
    });
  }
}
