import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NewEncounterDialogComponent } from './new-encounter-dialog/new-encounter-dialog.component';
import { CampaignService } from 'src/app/services/campaign.service';
import { J } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-campaign-encounter-tab',
    templateUrl: './campaign-encounter-tab.component.html',
    styleUrls: ['./campaign-encounter-tab.component.scss'],
    standalone: false
})
export class CampaignEncounterTabComponent {

  public charData: any[] = [];
  @Input() set characters(characters: any[]) {
    if (!characters) return;
    this.charData = characters;
  }

  public campId: string = '';
  public addonsData: any;
  public encounterData: any;
  @Input() set campaign(campaign: any) {
    if (!campaign) return;
    this.campId = campaign.id;
    this.addonsData = campaign.addons;
    this.encounterData = campaign.encounter;
  }

  public isOwnerData: boolean = false;
  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner || false;
  }

  public isMobile: boolean = window.innerWidth < 768;

  constructor(private dialog: MatDialog, private campService: CampaignService) {}

  public openNewEncounterDialog(): void {
    this.dialog.open(NewEncounterDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      disableClose: true,
      data: { characters: this.charData, addons: this.addonsData }
    }).afterClosed().subscribe((result: any) => {
      if(result && result.status === 'success') {
        this.campService.newEncounter(this.campId, result.encounter);
      }
    });
  }

  public clearEncounter(): void {
    const encounter: any = {
      list: [],
      started: false,
      activeIndex: 0,
      roundCounter: 0
    }
    this.campService.newEncounter(this.campId, encounter);
  }

  public hpTimer: any = null;
  public hpCounter: number = 0;
  public showCounter: boolean = false;
  public HPaction(action: string, index: number): void {
    if (this.hpTimer) {
      clearTimeout(this.hpTimer);
    }
    switch(action) {
      case 'remove':
        if (this.encounterData.list[index].HP <= 0) return;
        this.hpCounter -= 1;
        this.encounterData.list[index].HP -= 1;
        break;
      case 'add':
        if (this.encounterData.list[index].HP >= this.encounterData.list[index].HPmax) return;
        this.hpCounter += 1;
        this.encounterData.list[index].HP += 1;
        break;
    }
    const spanCounter = document.getElementById('counter_' + index);
    if (spanCounter) {
      spanCounter.style.opacity = '1';
      spanCounter.innerText = this.hpCounter.toString();
    }

    this.hpTimer = setTimeout(() => {
      this.campService.newEncounter(this.campId, {...this.encounterData}).then(() => {
        this.hpTimer = null;
        this.hpCounter = 0;
        this.showCounter = false;
        if (spanCounter) {
          spanCounter.style.opacity = '0';
          spanCounter.innerText = '0';
        }
      });
    }, 3000);
  }

  public getHealthSituationString(hp: number, hpMax: number) {
    const perc = (hp / hpMax) * 100;
    if (perc >= 75) {
      return 'In salute';
    } else if (perc >= 50) {
      return 'Ferito';
    } else if (perc >= 25) {
      return 'Barcollante';
    } else if (perc >= 10) {
      return 'Morente';
    } else if (perc === 0) {
      return 'Sconfitto';
    } else {
      return 'Agonizzante';
    }
  }

  public enemiesSelected(): any[] {
    const result = JSON.parse(JSON.stringify(this.encounterData.list.filter((e: any) => e.type === 'enemy')));
    result.forEach((e: any) => {
      const lastSpaceIndex = e.name.lastIndexOf(' ');
      if (lastSpaceIndex !== -1) {
        e.name = e.name.substring(0, lastSpaceIndex);
      }
    });

    return result.filter((e: any, index: number, self: any[]) => {
      return self.findIndex((el: any) => el.name === e.name) === index;
    });
  }

  public nextActive(): void {
    let activeIndex = this.encounterData.activeIndex + 1;
    if (activeIndex >= this.encounterData.list.length) {
      activeIndex = 0;
      this.encounterData.roundCounter += 1;
    }
    if (this.encounterData.list[activeIndex].type === 'enemy' && this.encounterData.list[activeIndex].HP <= 0) activeIndex++;
    
    this.campService.newEncounter(this.campId, { ...this.encounterData, activeIndex });

    const doc = document.getElementById('card_' + activeIndex);
    doc.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  public startEncounter(): void {
    this.encounterData.roundCounter = 1;
    this.campService.newEncounter(this.campId, { ...this.encounterData, started: true });
  }
}
