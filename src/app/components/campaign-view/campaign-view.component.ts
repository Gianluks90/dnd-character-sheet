import { Component, ViewChild, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CampaignService } from 'src/app/services/campaign.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { TicketCampaignDialogComponent } from '../campaign-list/ticket-campaign-dialog/ticket-campaign-dialog.component';
import { CharacterService } from 'src/app/services/character.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NextSessionDialogComponent } from './next-session-dialog/next-session-dialog.component';
import { DescriptionTooltipService } from '../utilities/description-tooltip/description-tooltip.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AdventurerUser } from 'src/app/models/adventurerUser';
import { AdventureService } from 'src/app/services/adventure.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { DiceRollerComponent } from '../utilities/dice-roller/dice-roller.component';
import { AddEntryDialogComponent } from './sub-components/campaign-entries-tab/add-entry-dialog/add-entry-dialog.component';

@Component({
  selector: 'app-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrl: './campaign-view.component.scss'
})
export class CampaignViewComponent {
  public user: AdventurerUser | null;

  public campaignData: any;
  public charData: any[] = [];
  public logsData: any;
  public logs: any[] = [];
  public selectedLog: any = null;
  public isOwner: boolean = false;
  public selectedChar: any;
  public sessionNumber: number = 1;
  public today = new Date();

  public adventureData: any;
  public showAdventure: boolean = false;
  public adventureExpanded: boolean = false;
  public showNotification: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private diceSelector: MatBottomSheet,
    private campaignService: CampaignService,
    private sidenavService: SidenavService,
    private adventureService: AdventureService,
    private notificationService: NotificationService,
    private matDialog: MatDialog,
    private charService: CharacterService,
    public tooltip: DescriptionTooltipService,
    private router: Router) {

    effect(() => {
      this.user = this.firebaseService.userSignal();
      if (!this.user) return;
      this.charService.getSignalCharacters(window.location.href.split('campaign-view/').pop());
    });

    effect(() => {
      this.charData = this.charService.campaignCharacters();
      if (!this.charData && !this.user) return;

      const id = window.location.href.split('campaign-view/').pop();
      this.charData = this.charData.filter((char: any) => char.campaignId === id);
      this.charData.sort((a, b) => a.informazioniBase.nomePersonaggio.localeCompare(b.informazioniBase.nomePersonaggio));
      this.charData.forEach((char) => {
        if (char.status.userId === this.user.id) {
          this.selectedChar = char;
        }
      });

      // if (!this.campaignData) {
      this.campaignService.getSignalSingleCampaing(id);
      // }
    });

    effect(() => {
      const campaigns = this.campaignService.campaigns();
      if (campaigns.length <= 0) return;

      const id = window.location.href.split('campaign-view/').pop();
      this.campaignData = campaigns.find((campaign: any) => campaign.id === id);
      if (!this.campaignData) return;
      this.campaignData.id = id;
      if (!this.adventureData) {
        if (this.campaignData.adventure && this.campaignData.adventure !== '') {
          this.adventureService.getAdventureById(this.campaignData.adventure).then((adventure) => {
            this.adventureData = adventure;
          });
        }
      }
      this.calcSessionNumber();
      this.isOwner = this.user.id === this.campaignData.ownerId;
      if (!this.isOwner) {
        const alreadyJoined = this.campaignData.partecipants.find((player: any) => player === this.user.id);
        if (!alreadyJoined) {
          this.matDialog.open(TicketCampaignDialogComponent, {
            width: window.innerWidth < 768 ? '90%' : '60%',
            autoFocus: false,
            disableClose: true,
          }).afterClosed().subscribe((result) => {
            if (result && result.status === 'success') {
              window.location.reload();
            }
          });
        }
      }
      this.notificationService.getSignalLogs(id);
    });

    effect(() => {
      this.logsData = this.notificationService.logs();
      if (!this.logsData) return;
      this.logs = this.logsData.logs.length > 0 ? this.logsData.logs.sort((a: any, b: any) => b.createdAt - a.createdAt) : [];
      if (this.logs.length > 0 && !this.logs[0].read) {
        this.selectedLog = this.logs[0];
        if (this.selectedLog) {
          setTimeout(() => {
            this.selectedLog.read = true;
            this.notificationService.updateLogs(this.campaignData.id, this.logs).then(() => {
              this.selectedLog = null;
            });
            
          }, 5000);
        }
      }
    });
  }


  @ViewChild('tabGroup') tabGroup: any;
  public onCharEmitted(charId: string) {
    this.selectedChar = this.charData.find((char) => char.id === charId);
    this.tabGroup.selectedIndex = 2;
  }

  public openSidenav() {
    this.sidenavService.toggle();
  }

  private calcSessionNumber() {
    let result = this.campaignData.story.length;
    this.campaignData.archive.forEach((element: any) => {
      result += element.story.length;
    });
    this.sessionNumber = result;
  }

  public openNextSessionDialog() {
    this.matDialog.open(NextSessionDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '30%',
      autoFocus: false,
    }).afterClosed().subscribe((result) => {
      this.notificationService.newLog(this.campaignData.id, {
        message: `Prossima sessione è stata programmata per il ${result.date}.`,
        type: 'text-calendar'
      });
    });
  }

  public toggleAdventure() {
    this.showAdventure = !this.showAdventure;
  }

  public toggleNotification() {
    this.showNotification = !this.showNotification;
  }

  public clearNotification() {
    this.notificationService.clearLogs(this.campaignData.id);
  }

  public editAdventure() {
    this.showAdventure = !this.showAdventure;
    this.router.navigate(['adventures/' + this.adventureData.id]);
  }

  public openDiceRollerDialog(): void {
    this.matDialog.open(DiceRollerComponent, {
      width: window.innerWidth < 768 ? '90%' : '500px',
      autoFocus: false,
      disableClose: true,
      data: {
        char: this.isOwner ? null : this.selectedChar,
        formula: null,
        extra: null
      }
    });
  }

  public fastNote(): void {
    this.matDialog.open(AddEntryDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '500px',
      autoFocus: false,
      disableClose: true,
      data: { entry: null }
    }).afterClosed().subscribe((result: any) => {
      if (result.status !== 'success') return;
      this.campaignService.addEntry(window.location.href.split('/').pop(), result.entry);
    });
  }

  public toggleSidenavExpanded(): void {
    this.adventureExpanded = !this.adventureExpanded;
  }
}
