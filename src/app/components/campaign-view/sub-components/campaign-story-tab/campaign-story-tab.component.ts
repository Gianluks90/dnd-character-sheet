import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddStoryDialogComponent } from './add-story-dialog/add-story-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { CampaignService } from 'src/app/services/campaign.service';
import { ArchiveStoryDialogComponent } from './archive-story-dialog/archive-story-dialog.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-campaign-story-tab',
    templateUrl: './campaign-story-tab.component.html',
    styleUrl: './campaign-story-tab.component.scss',
    standalone: false
})
export class CampaignStoryTabComponent {

  public descriptionData: string = '';
  public chapterUrl: string = '';
  public storyData: any[] = [];
  public archiveData: any[] = [];
  public sessionNumberData: number = 1;
  public isOwnerData: boolean = false;

  constructor(
    private dialog: MatDialog,
    private platform: Platform, 
    private campaignService: CampaignService,
    private notificationService: NotificationService) {}

  public campaignData: any;
  @Input() set campaign(campaign: any) {
    this.campaignData = campaign;
    this.storyData = campaign.story;
    this.archiveData = campaign.archive;
    this.descriptionData = campaign.description;
    this.chapterUrl = campaign.chapterUrl || '';
    this.storyData = this.sortStoryByLastUpdate(this.storyData);
  }

  @Input() set sessionNumber(value: number) {
    this.sessionNumberData = value;
  }

  @Input() set isOwner(value: boolean) {
    this.isOwnerData = value;
  }

  public openStoryDialog(story?: any, index?: number) {
    this.dialog.open(AddStoryDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false,
      disableClose: true,
      data: { story: story }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          this.campaignService.addStory(window.location.href.split('/').pop(), result.story).then(() => {
            this.storyData = this.sortStoryByLastUpdate(this.storyData);
            this.notificationService.newLog(this.campaignData.id, {
              message: `Nuovo resoconto: "${result.story.title}"`,
              type: 'text-added'
            });
          });
        break;
        case 'edited':
          this.storyData[index] = result.story;
          this.campaignService.updateCampaignStory(window.location.href.split('/').pop(), this.storyData)
        break;
        default:
        break;
      }
    });
  }

  private sortStoryByLastUpdate(list: any[]) {
    if (list.length > 0) {
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

  public openArchiveStoryDialog(): void {
    this.dialog.open(ArchiveStoryDialogComponent, {
      width: window.innerWidth < 600 ? '80%' : '50%',
      autoFocus: false,
      data: { archive: this.archiveData }
    })
  }
}
