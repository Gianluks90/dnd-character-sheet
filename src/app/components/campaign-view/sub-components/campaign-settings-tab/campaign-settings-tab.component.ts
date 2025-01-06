import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CampaignService } from 'src/app/services/campaign.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NewChapterDialogComponent } from './new-chapter-dialog/new-chapter-dialog.component';
import { RemoveCharDialogComponent } from './remove-char-dialog/remove-char-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RemoveCampaignDialogComponent } from './remove-campaign-dialog/remove-campaign-dialog.component';
import { Router } from '@angular/router';
import { AdventureService } from 'src/app/services/adventure.service';
import { getAuth } from 'firebase/auth';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-campaign-settings-tab',
  templateUrl: './campaign-settings-tab.component.html',
  styleUrl: './campaign-settings-tab.component.scss'
})
export class CampaignSettingsTabComponent {

  constructor(
    private campaignService: CampaignService,
    private charService: CharacterService,
    private adventureService: AdventureService,
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private router: Router) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      chapterUrl: [''],
      adventure: ['']
    })

    this.adventureService.getAdventuresByUserId().then((adventures) => {
      this.adventures = adventures;
    });
  }

  public campaignData: any;
  public charData: any;
  public isOwnerData: boolean = false;

  public form: FormGroup;
  public adventures: any[] = [];

  @Input() set campaign(data: any) {
    this.campaignData = data;
    this.form.patchValue(data);
  }

  @Input() set characters(data: any) {
    this.charData = data;
  }

  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }

  public startCampaign(): void {
    this.campaignService.startCampaign(this.campaignData.id).then(() => {
      window.location.reload();
    });
  }

  public openNewChapterDialog(): void {
    this.matDialog.open(NewChapterDialogComponent, {
      width: window.innerWidth < 768 ? '80%' : '50%',
      autoFocus: false,
      disableClose: true
    }).afterClosed().subscribe((result: any) => {
      if (result.status !== 'success') return;
      this.campaignService.newChapter(window.location.href.split('/').pop(), this.campaignData, result.title, result.description);
    });
  }

  public openDisableCharDialog(index: number): void {
    this.matDialog.open(RemoveCharDialogComponent, {
      width: window.innerWidth < 768 ? '80%' : '50%',
      autoFocus: false,
      disableClose: true,
      data: { disablingChar: true }
    }).afterClosed().subscribe((result: any) => {
      if (result && result == 'disable') {
        const char = this.charData[index];
        this.charService.disableCharCampaign(char.id).then(() => {
          console.log('Char disabled');
        });
      }
    });
  }

  public enableChar(index: number): void {
    this.charService.enableCharCampaign(this.charData[index].id, this.campaignData.id).then(() => {
      console.log('Char enabled');
    });
  }  

  public openRemoveCharDialog(index: number): void {
    this.matDialog.open(RemoveCharDialogComponent, {
      width: window.innerWidth < 768 ? '80%' : '50%',
      autoFocus: false,
      disableClose: true
    }).afterClosed().subscribe((result: any) => {
      if (result !== 'delete') return;
      const char = this.charData[index];
      this.campaignService.removeChar(this.campaignData.id, char);
    });
  }

  public openRemoveCampaignDialog(): void {
    this.matDialog.open(RemoveCampaignDialogComponent, {
      width: window.innerWidth < 768 ? '80%' : '50%',
      autoFocus: false,
      disableClose: true
    }).afterClosed().subscribe((result: any) => {
      if (result !== 'success') return;
      const requests = this.campaignData.characters.map((char: any) => {
        return this.campaignService.removeChar(this.campaignData.id, char);
      });
      Promise.all(requests).then(() => {
        this.campaignService.deleteCampaignById(this.campaignData.id).then(() => {
          this.router.navigate(['/campaigns']);
        });
      });
    });
  }

  public editTitleDescription(): void {
    this.campaignService.editTitleDescription(this.campaignData.id, this.form.value);
  }

  public exportJSON(section: string, isDelete?: boolean): void {
    let result: any = {};
    const exportButton = document.getElementById(isDelete ? 'delete-' + section : 'export-' + section);
    const campaignTitle = this.campaignData.title.replace(/ /g, '_');
    let fileName = campaignTitle + '_' + new Date().getTime().toString();

    switch (section) {
      case 'all':
        fileName = 'ALL_' + fileName;
        result = {
          metadata: {
            generatedAt: new Date().toISOString(),
            fileName: fileName + '.json',
            section: 'all'
          },
          data: this.campaignData
        };
        break;
      default:
        fileName = section.toUpperCase() + '_' + fileName;
        result = {
          metadata: {
            generatedAt: new Date().toISOString(),
            fileName: fileName + '.json',
            section: section
          },
          data: this.campaignData[section]
        };
        break;
    }

    fileName += '.json';
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));
    exportButton.setAttribute("href", dataStr);
    exportButton.setAttribute("download", fileName);
  }


  public importJSON(section: string, file: any): void {
    const input = file.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const json = JSON.parse(content);
          if (json.metadata && json.metadata.section === section) {
            // Il file è corretto, procedi con l'importazione
            this.updateDatabase(json.data, section);
          } else {
            // Il file non è corretto, mostra un messaggio di errore
            alert('Il file caricato non è valido per questa sezione.');
          }
        } catch (error) {
          // Il file non è un JSON valido, mostra un messaggio di errore
          alert('Il file caricato non è un JSON valido.');
        }
      };
      reader.readAsText(input.files[0]);
    }
  }

  private updateDatabase(data: any, section: string): void {
    // Aggiorna i dati della campagna con i nuovi elementi
    data.forEach((element: any) => {
      element.imgUrl = './assets/images/unknown.png';
      if (!this.campaignData[section].find((e: any) => e.name === element.name)) {
        this.campaignData[section].push(element);
      }
    });

    // Aggiorna la campagna in base alla sezione
    switch (section) {
      case 'addons':
        this.campaignService.updateAddons(this.campaignData.id, this.campaignData.addons);
        break;
      case 'inventory':
        this.campaignService.updateInventory(this.campaignData.id, this.campaignData.inventory);
        break;
      case 'allies':
        this.campaignService.updateAllies(this.campaignData.id, this.campaignData.allies);
        break;
      case 'organizations':
        this.campaignService.updateOrganizations(this.campaignData.id, this.campaignData.organizations);
        break;
    }
  }

  public emptySection(section: string): void {
    if (section === 'all') return;

    this.exportJSON(section, true);

    setTimeout(() => {
      switch (section) {
        case 'addons':
          this.campaignService.updateAddons(this.campaignData.id, []);
          break;
        case 'inventory':
          this.campaignService.updateInventory(this.campaignData.id, []);
          break;
        case 'allies':
          this.campaignService.updateAllies(this.campaignData.id, []);
          break;
        case 'organizations':
          this.campaignService.updateOrganizations(this.campaignData.id, []);
          break;
      }
    }, 100);
  }

}
