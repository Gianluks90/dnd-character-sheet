import { Platform } from '@angular/cdk/platform';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CampaignService } from 'src/app/services/campaign.service';
import { AddAchievementDialogComponent } from './add-achievement-dialog/add-achievement-dialog.component';
import { ArchiveAchievementDialogComponent } from './archive-achievement-dialog/archive-achievement-dialog.component';
import { getAuth } from 'firebase/auth';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-campaign-achievements-tab',
    templateUrl: './campaign-achievements-tab.component.html',
    styleUrl: './campaign-achievements-tab.component.scss',
    standalone: false
})
export class CampaignAchievementsTabComponent {

  public charSelectedId: string = '';
  public achievementsData: any[];
  public achievementReclamedBy: number = 0;
  public archiveData: any[] = [];
  public isOwnerData: boolean = false;
  public charactersData: any[];

  constructor(
    private dialog: MatDialog, 
    private platform: Platform, 
    private campaignService: CampaignService, 
    private notificationService: NotificationService) {}

  @Input() set campaign(campaign: any) {
    this.achievementsData = campaign.achievements;
    this.achievementsData = this.sortRuleAlphabetical(this.achievementsData);
    this.achievementReclamedBy = this.achievementsData.filter((achievement: any) => achievement.reclamedBy && achievement.reclamedBy.length > 0).length;
    this.archiveData = campaign.archive;
  }

  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }

  @Input() set characters(characters: any) {
    this.charactersData = characters;
    const userId = getAuth().currentUser?.uid;
    this.charactersData.find((character: any) => {
      if (character.status.userId === userId) {
        this.charSelectedId = character.id;
      }
    });
    
    this.achievementsData.map((achievement: any) => {
      if (achievement.reclamedBy && achievement.reclamedBy.length > 0 && this.charactersData) {
        achievement.urls = this.charactersData.filter((character: any) => achievement.reclamedBy.includes(character.id)).map((character: any) => character.informazioniBase.urlImmaginePersonaggio);
      }
    });
  }

  public openAchievementDialog(achievement?: any, index?: number) {
    this.dialog.open(AddAchievementDialogComponent, {
      width: (this.platform.ANDROID || this.platform.IOS) ? '80%' : '50%',
      autoFocus: false,
      disableClose: true,
      data: { achievement: achievement, characters: this.charactersData }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          this.campaignService.addAchievement(window.location.href.split('/').pop(), result.achievement).then(() => {
            // this.achievementsData = this.sortRuleAlphabetical(this.achievementsData);
            if (result.achievement.reclamedBy && result.achievement.reclamedBy.length > 0) {
              this.notificationService.newLog(window.location.href.split('/').pop(), {
                message: `Nuovo obiettivo reclamato da uno o più Personaggi: "${result.achievement.title}"`,
                type: 'text-trophy'
              })
            }
          });
        break;
        case 'edited':
          this.achievementsData[index] = result.achievement;
          this.campaignService.updateCampaignAchievement(window.location.href.split('/').pop(), this.achievementsData).then(() => {
            if (result.achievement.reclamedBy && result.achievement.reclamedBy.length > 0) {
              this.notificationService.newLog(window.location.href.split('/').pop(), {
                message: `Un obbiettivo è stato reclamato da uno o più Personaggi: "${result.achievement.title}"`,
                type: 'text-trophy'
              })
            }
          });
        break;
        case 'deleted':
          this.achievementsData.splice(index, 1);
          this.campaignService.updateCampaignAchievement(window.location.href.split('/').pop(), this.achievementsData);
        break;
        default:
        break;
      }
      this.achievementsData = this.sortRuleAlphabetical(this.achievementsData);
    });
  }

  private sortRuleAlphabetical(list: any[]) {
    return list.sort((a, b) => a.title.localeCompare(b.title));
  }

  public collapseAll() {
    const details = document.querySelectorAll('details');
    details.forEach((detail: any) => {
      detail.open = false;
    });
  }

  public openArchiveAchievementDialog(): void {
    this.dialog.open(ArchiveAchievementDialogComponent, {
      width: window.innerWidth < 600 ? '80%' : '50%',
      autoFocus: false,
      data: { archive: this.archiveData }
    })
  }

  public reclamedByYou(achievement: any): boolean {
    if (!achievement || !achievement.reclamedBy) {
      return false; // Se achievement o reclamedBy sono nulli o undefined, restituisci false
    }
    return achievement.reclamedBy.some(item => item.id === this.charSelectedId);
  }
}
