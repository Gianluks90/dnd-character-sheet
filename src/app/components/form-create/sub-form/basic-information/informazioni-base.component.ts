import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-informazioni-base',
    templateUrl: './informazioni-base.component.html',
    styleUrls: ['./informazioni-base.component.scss'],
    standalone: false
})
export class InformazioniBaseComponent {
  public groupInfo: FormGroup | null = null;
  public groupCaratteristiche: FormGroup | null = null;

  public classi: FormArray;
  public risorseAggiuntive: FormArray;

  public totalLevel: number = 0;

  constructor(
    public formService: FormService,
    private stepper: MatStepper,
    private fb: FormBuilder,
    private notification: NotificationService) {
    this.classi = this.fb.array([]);
    this.risorseAggiuntive = this.fb.array([]);
  }

  ngOnInit(): void {
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.groupInfo = form.get('informazioniBase') as FormGroup;
        this.groupCaratteristiche = form.get('caratteristicheFisiche') as FormGroup;
        this.classi = this.groupInfo.get('classi') as FormArray;
        this.risorseAggiuntive = this.groupInfo.get('risorseAggiuntive') as FormArray;
        this.totalLevel = this.groupInfo.get('livello')?.value;
      }
    });
  }

  public onPicSelected(event: any) {
    if (event.target.files[0].size > 500000) {
      // this.notification.openSnackBar('Immagine troppo grande, dim. massima: 500kb.', 'warning', 3000, 'yellow');
    } else {
      this.formService.uploadImage(event).then((result) => {
        if (result !== 'error') {
          this.groupInfo?.patchValue({
            urlImmaginePersonaggio: result.url,
            nomeImmaginePersonaggio: result.name,
          });
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
        this.groupInfo?.patchValue({
          urlImmaginePersonaggio: '',
          nomeImmaginePersonaggio: '',
        })
        this.formService.updatePicCharacter(window.location.href.split('/').pop(), '', '').then(() => {
          // this.notification.openSnackBar('Immagine eliminata con successo', 'check');
        });
      }
    });
  }

  public resetRazza() {
    this.groupInfo?.patchValue({
      razza: '',
      razzaPersonalizzata: '',
      sottorazza: '',
    });
  }

  public jumpToSpecificStep(index: number) {
    this.stepper.selectedIndex = index;
  }

  public addClasse() {
    let maxLevelValidator = 20 - this.totalLevel;
    const classe = this.fb.group({
      nome: ['', Validators.required],
      nomePersonalizzato: '',
      livello: [1, [Validators.max(maxLevelValidator), Validators.required]],
      sottoclasse: '',
    });
    this.classi.push(classe);

    classe.get('nome')?.valueChanges.subscribe((value: string) => {
      if (value === 'Altro') {
        classe.get('nomePersonalizzato')?.setValidators(Validators.required);
        classe.updateValueAndValidity();
      }
    });
    this.totalLevel += classe.get('livello')?.value;
  }

  public deleteClasse(index: number) {
    this.totalLevel -= this.classi.at(index).get('livello')?.value;
    this.classi.removeAt(index);
  }

  public addRisorsa() {
    const risorsa = this.fb.group({
      nome: ['', Validators.required],
      valoreMassimo: [0, Validators.required],
      valoreAttuale: 0,
      used: [],
      color: ['', Validators.required],
    });
    this.risorseAggiuntive.push(risorsa);
  }

  public deleteRisorsa(index: number) {
    this.risorseAggiuntive.removeAt(index);
  }

  public setValoreAttuale(index: number, value: any) {
    const risorsa = this.risorseAggiuntive.at(index) as FormGroup;
    const used = new Array(parseInt(value)).fill(false);
    risorsa.removeControl('used');
    risorsa.addControl('used', this.fb.array(used));
  }


  public onLevelChange(event: any) {
    const classi = this.groupInfo.get('classi') as FormArray;
    let levels = 0;
    classi.controls.forEach((classe: FormGroup) => {
      levels += classe.get('livello')?.value;
    });
    this.totalLevel = levels;
    if (this.totalLevel > 20) {
      // this.notification.openSnackBar('Livello massimo raggiunto', 'error', 3000);
      this.totalLevel = 20;
    }
    this.groupInfo?.get('livello')?.setValue(this.totalLevel);
  }
}
