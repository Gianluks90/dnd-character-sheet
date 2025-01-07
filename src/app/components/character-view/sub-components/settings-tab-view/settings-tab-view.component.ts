import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DescriptionTooltipService } from 'src/app/components/utilities/description-tooltip/description-tooltip.service';
import { CampaignService } from 'src/app/services/campaign.service';
import { CharacterService } from 'src/app/services/character.service';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-settings-tab-view',
    templateUrl: './settings-tab-view.component.html',
    styleUrl: './settings-tab-view.component.scss',
    standalone: false
})
export class SettingsTabViewComponent {

  public charData: any;
  public sheetColorData: string = '';
  public sheetColorTitleData: string = '';
  public campaignIdData: string = '';
  public campaignData: any;
  public isFavorite: boolean = false;
  public prideFlags: any[] = [];

  public formColor: FormGroup;

  constructor(
    private charService: CharacterService, 
    private campaignService: CampaignService, 
    private router: Router, 
    private fb: FormBuilder, 
    public tooltip: DescriptionTooltipService,
  private http: HttpClient) {
    this.formColor = this.fb.group({
      sheetColor: '#FFFFFF40',
      sheetTitleColor: '#212121',
      prideFlag: ''
    });

    this.http.get('./assets/settings/inclusivityFlags.json').subscribe((data: any[]) => {
      this.prideFlags = data;
    });
   }
  
  // @Input() set sheetColor(sheetColor: string) {
  //   this.sheetColorData = sheetColor.split('40')[0];
  // }

  @Input() set character(character: any) {
    this.charData = character;
    this.formColor.patchValue({
      sheetColor: character.status.sheetColor.split('40')[0],
      sheetTitleColor: character.status.sheetTitleColor || '#212121',
      prideFlag: character.status.prideFlag || ''
    });
    // this.sheetColorData = character.status.sheetColor.split('40')[0];
    // this.sheetColorTitleData = character.status.sheetColor || '#212121';
    this.campaignIdData = character.campaignId;
    if (this.campaignIdData !== '') {
      this.campaignService.getCampaignById(this.campaignIdData).then((data) => {
        this.campaignData = data;
      });
    }
    this.charService.checkFavoriteCharacter(character.id).then((data) => {
      this.isFavorite = data;
    });
  }

  // public updateSheetColor(event: any) {
  //   const newColor = event + '40';
  //   this.charService.updateCharacterSheetColorById(window.location.href.split('/').pop()!, newColor).then(() => {
  //     // window.location.reload();
  //   });
  // }

  // public resetColor() {
  //   this.charService.updateCharacterSheetColorById(window.location.href.split('/').pop()!, '#FFFFFF40').then(() => {
  //     // window.location.reload();
  //   });
  // }

  public updateSheetColors() {
    const newSheetColor = this.formColor.value.sheetColor + '40';
    const newSheetTitleColor = this.formColor.value.sheetTitleColor;
    this.charService.updateCharacterSheetColorById(this.charData.id, newSheetColor, newSheetTitleColor);
  }

  public resetColors() {
    const newSheetColor = '#FFFFFF40';
    const newSheetTitleColor = '#212121';
    this.charService.updateCharacterSheetColorById(this.charData.id, newSheetColor, newSheetTitleColor);
  }

  public togglePrideRule(event: any) {
    this.charService.updatePrideRule(window.location.href.split('/').pop()!, event.target.checked);
  }

  public updatePrideFlag(): void {
    const newPrideFlag = this.formColor.value.prideFlag;
    this.charService.updatePrideFlag(window.location.href.split('/').pop()!, newPrideFlag);
  }

  public toggleWeightRule(event: any) {
    this.charService.updateWeightRule(window.location.href.split('/').pop()!, event.target.checked);
  }

  public toggleOpacityInventoryRule(event: any) {
    this.charService.updateOpacityInventoryRule(window.location.href.split('/').pop()!, event.target.checked);
  } 

  public async setFavoriteChar() {
    await this.charService.setFavoriteCharacter(this.charData.id);
    // setTimeout(() => {
    //   window.location.reload();
    // }, 100);
  }

  public parseExport() {
    // const formValue = this.charData;
    // formValue.informazioniBase.urlImmaginePersonaggio = '';
    // formValue.informazioniBase.nomeImmaginePersonaggio = '';
    const jsonFile = JSON.stringify(this.charData);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonFile);
    const exportButton = document.getElementById('export-button');
    const characterName = this.charData.informazioniBase.nomePersonaggioEsteso !== '' ? this.charData.informazioniBase.nomePersonaggioEsteso.split(' ')[0] : this.charData.informazioniBase.nomePersonaggio.split(' ')[0];
    const fileName = characterName + '_' + (new Date().getTime().toString()) + '.json';
    exportButton.setAttribute("href", dataStr );
    exportButton.setAttribute("download", fileName);
  }

  exportPDF() {
    console.log("Solo per tester");
    
    // const endpoint = "https://fastapi-production-6b43.up.railway.app/api/schedabase/";
    // fetch(endpoint, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(this.formService.formSubject.value.value),
    //   redirect: 'follow'
    // }).then(res => {
    //   return res.blob();
    // }).then(blob => {
    //   var a = document.createElement("a");
    //   a.href = window.URL.createObjectURL(blob);
    //   a.download = this.formService.formSubject.value.value.informazioniBase.nomePersonaggio.split(' ')[0] + '.pdf';
    //   document.body.appendChild(a);
    //   a.click();
    // });
  }

  public jumpToCampaign(id: string) {
    this.router.navigate(['/campaign-view/' + this.campaignIdData]);
  }
}
