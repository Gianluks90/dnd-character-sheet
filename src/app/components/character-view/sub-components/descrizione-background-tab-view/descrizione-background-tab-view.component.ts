import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';
import { EditStoryDialogComponent } from './edit-story-dialog/edit-story-dialog.component';
import { CharacterService } from 'src/app/services/character.service';

@Component({
    selector: 'app-descrizione-background-tab-view',
    templateUrl: './descrizione-background-tab-view.component.html',
    styleUrls: ['./descrizione-background-tab-view.component.scss'],
    standalone: false
})
export class DescrizioneBackgroundTabViewComponent {

  public editModeData: boolean = false;
  public charData: any;
  public infoBaseData: any;
  public backgroundInfoData: any;

  public backgroundData: {
    trattiCaratteriali: string,
    ideali: string,
    legami: string,
    difetti: string,
  };

  public storiaData: string = '';

  public caratteristicheFisicheData: {
    eta: number,
    altezza: number,
    peso: number,
    occhi: string,
    carnagione: string,
    capelli: string,
  };

  public immaginePersonaggioData: any;
  public inCampaign: boolean = false;

  public nomiPersonaggioData: {
    nome: string,
    nomeEsteso: string,
  }

  constructor(private notification: NotificationService, private formService: FormService, private matDialog: MatDialog, private charService: CharacterService) { 
    if (window.location.href.includes('campaign-view/')) {
      this.inCampaign = true;
    }
  }

  @Input() set editMode(editMode: boolean) {
    this.editModeData = editMode;
  }

  @Input() set character(character: any) {
    this.charData = character;
  }

  @Output() pictureEmitter: EventEmitter<any> = new EventEmitter<any>();

  public onPicSelected(event: any) {
    if (event.target.files[0].size > 500000) {
      // this.notification.openSnackBar('Immagine troppo grande, dim. massima: 500kb.', 'warning', 3000, 'yellow');
    } else {
      this.formService.uploadImage(event).then((result) => {
        if (result !== 'error') {
          // this.groupInfo?.patchValue({
          //   urlImmaginePersonaggio: result.url,
          //   nomeImmaginePersonaggio: result.name,
          // });
          this.pictureEmitter.emit({
            urlImmaginePersonaggio: result.url,
            nomeImmaginePersonaggio: result.name,
          })
          this.formService.updatePicCharacter(window.location.href.split('/').pop(), result.url, result.name).then(() => {
            // this.notification.openSnackBar('Immagine caricata con successo!', 'add_photo_alternate', 3000, 'limegreen');
          });
        } else {
          // this.notification.openSnackBar('Errore nel caricamento dell\'immagine', 'error');
        }
      })
    }
    (<HTMLInputElement>document.getElementById("file")).value = null;
  }

  public deletePic(nomeImmagine: string) {
    this.formService.deleteImage(nomeImmagine).then((result) => {
      if (result === 'success') {
        // this.groupInfo?.patchValue({
        //   urlImmaginePersonaggio: '',
        //   nomeImmaginePersonaggio: '',
        // })
        this.pictureEmitter.emit({
          urlImmaginePersonaggio: '',
          nomeImmaginePersonaggio: '',
        })
        this.formService.updatePicCharacter(window.location.href.split('/').pop(), '', '').then(() => {
          // this.notification.openSnackBar('Immagine eliminata con successo', 'check');
        });
      }
    });
  }

  public openEditStoryDialog() {
    this.matDialog.open(EditStoryDialogComponent, {
      width: window.innerWidth < 768 ? '80%' : '60%',
      autoFocus: false,
      data: { story: this.charData.storiaPersonaggio }
    }).afterClosed().subscribe((result) => {
      if (result && result.status === 'success') {
        this.charService.updateStory(this.charData.id, result.story);
      }
    });
  }
}

