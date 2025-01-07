import { Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-informazioni-base-level-up',
    templateUrl: './informazioni-base-level-up.component.html',
    styleUrls: ['./informazioni-base-level-up.component.scss'],
    standalone: false
})
export class InformazioniBaseLevelUpComponent {

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
    this.formService.formLevelUpSubject.subscribe((form: any) => {
      if (form) {
        this.groupInfo = form.get('informazioniBase') as FormGroup;
        this.classi = this.groupInfo.get('classi') as FormArray;
        this.risorseAggiuntive = this.groupInfo.get('risorseAggiuntive') as FormArray;
        this.totalLevel = this.groupInfo.get('livello')?.value;
      }
    });
  }

  public addClasse() {
    if (this.groupInfo.get('livello')?.value === 20) {
      // this.notification.openSnackBar('Livello massimo raggiunto', 'error', 3000);
      return;
    }
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
      color: ['', Validators.required]
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
