import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HealthPointDialogComponent } from './health-point-dialog/health-point-dialog.component';
import { Platform } from '@angular/cdk/platform';
import { CharacterService } from 'src/app/services/character.service';
import { DescriptionTooltipService } from '../description-tooltip/description-tooltip.service';

@Component({
    selector: 'app-health-bar',
    templateUrl: './health-bar.component.html',
    styleUrl: './health-bar.component.scss',
    standalone: false
})

export class HealthBarComponent {

  public sheetTitleColor: string = '';
  public isCampaign: boolean = false;

  @Input() set char(character: any) {
    this.idData = character.id;
    this.parametriVitaliData.pfMax = character.parametriVitali.massimoPuntiFerita;
    this.parametriVitaliData.pf = character.parametriVitali.puntiFeritaAttuali;
    this.parametriVitaliData.pftMax = character.parametriVitali.massimoPuntiFeritaTemporanei;
    this.parametriVitaliData.pft = character.parametriVitali.puntiFeritaTemporaneiAttuali;
    this.sheetTitleColor = character.status.sheetTitleColor && !this.isCampaign ? character.status.sheetTitleColor : '#212121';
  }

  public editModeData: boolean = false;
  @Input() set editMode(editMode: boolean) {
    this.editModeData = editMode;
  }

  constructor(
    private dialog: MatDialog,
    private charService: CharacterService,
    public tooltip: DescriptionTooltipService) {
      this.isCampaign = window.location.href.includes('campaign-view');
    }

  public parametriVitaliData: any = {
    pf: 0,
    pfMax: 0,
    pft: 0,
    pftMax: 0
  }

  public idData: string = '';

  public openHPDialog() {
    // const characterId = window.location.href.split('/').pop();
    this.dialog.open(HealthPointDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      data: {
        parametriVitali: this.parametriVitaliData,
      }
    }).afterClosed().subscribe((result: any) => {
      if (result.status === 'success') {
        this.parametriVitaliData = result.newValue;
        this.charService.updateCharacterPFById(this.idData, this.parametriVitaliData);
      }
    });
  }

  public pfTimer: any = null;
  public pfCounter: number = 0;
  public showCounter: boolean = false;
  public PFAction(action: string) {
    if (this.pfTimer) {
      clearTimeout(this.pfTimer);
    }
    this.showCounter = true;

    switch (action) {
      case 'add':
        this.pfCounter += 1;
        this.parametriVitaliData.pf += 1;
        break;
      case 'remove':
        this.pfCounter -= 1;
        if (this.parametriVitaliData.pft > 0) {
          this.parametriVitaliData.pft -= 1;
          if (this.parametriVitaliData.pft <= 0) {
            this.parametriVitaliData.pf -= Math.abs(this.parametriVitaliData.pft);
            this.parametriVitaliData.pft = 0;
            this.parametriVitaliData.pftMax = 0;
          }
        } else {
          this.parametriVitaliData.pf -= 1;
        }
        break;
      default:
        break;
    }

    this.pfTimer = setTimeout(() => {
      this.charService.updateCharacterPFById(this.idData, this.parametriVitaliData);
      this.pfTimer = null;
      this.pfCounter = 0;
      this.showCounter = false;
    }, 3000);
  }

}
