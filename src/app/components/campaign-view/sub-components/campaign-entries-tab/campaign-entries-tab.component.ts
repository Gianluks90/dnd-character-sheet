import { Platform } from '@angular/cdk/platform';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CampaignService } from 'src/app/services/campaign.service';
import { AddEntryDialogComponent } from './add-entry-dialog/add-entry-dialog.component';
import { getAuth } from 'firebase/auth';

@Component({
    selector: 'app-campaign-entries-tab',
    templateUrl: './campaign-entries-tab.component.html',
    styleUrl: './campaign-entries-tab.component.scss',
    standalone: false
})
export class CampaignEntriesTabComponent {

  private allEntries: any[] = [];
  public entriesData: any[] = [];
  public isOwnerData: boolean;
  public tags: string[] = [];
  public userId: string = getAuth().currentUser.uid;

  @Input() set entries(entries: any[]) {
    this.allEntries = entries;
    this.entriesData = entries.filter((entry: any) => entry.userId === this.userId);
    this.tags = [...new Set(this.entriesData.map((entry: any) => entry.tag.toLowerCase()))];
    this.tags = this.tags.filter((tag: string) => tag !== '').sort();
    // this.entriesData = this.sortRuleAlphabetical(this.entriesData);
  }

  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }

  constructor(private dialog: MatDialog, private platform: Platform, private campaignService: CampaignService) {}

  public openEntryDialog(entry?: any, index?: number) {
    this.dialog.open(AddEntryDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false,
      disableClose: true,
      data: { entry: entry }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          this.campaignService.addEntry(window.location.href.split('/').pop(), result.entry).then(() => {
            this.entriesData = this.sortRuleAlphabetical(this.entriesData);
          });
        break;
        case 'edited':
          this.entriesData[index] = result.entry;
          this.allEntries.forEach((entry: any, i: number) => {
            if (entry.userId === this.userId && entry.id === result.entry.id) {
              this.allEntries[i] = result.entry;
            }
          });
          this.campaignService.updateCampaignEntries(window.location.href.split('/').pop(), this.allEntries);
        break;
        case 'deleted':
          this.allEntries.forEach((entry: any, i: number) => {
            if (entry.userId === this.userId && entry.title === result.entry.title) {
              this.allEntries.splice(i, 1);
            }
          });
          this.campaignService.updateCampaignEntries(window.location.href.split('/').pop(), this.allEntries);
        break;
        default:
        break;
      }
    });
  }

  private sortRuleAlphabetical(list: any[]) {
    return list.sort((a, b) => a.title.localeCompare(b.title));
  }
}
