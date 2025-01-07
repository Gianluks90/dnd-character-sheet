import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-trucchetti-incantesimi',
    templateUrl: './trucchetti-incantesimi.component.html',
    styleUrls: ['./trucchetti-incantesimi.component.scss'],
    standalone: false
})
export class TrucchettiIncantesimiComponent {

  public form: FormGroup | null = null;
  public trucchettiIncantesimi: FormArray;
  public slotIncantesimi: FormArray;

  public slotFormVisibility = false;
  public slotIncantesimiForm = this.fb.group({
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
    level6: 0,
    level7: 0,
    level8: 0,
    level9: 0,
  });

  public selectIcons: any[] = [];

  constructor(public formService: FormService, private fb: FormBuilder, private httpClient: HttpClient) {
    this.trucchettiIncantesimi = this.fb.array([]);
    this.slotIncantesimi = this.fb.array([]);
  }

  ngOnInit(): void {
    this.httpClient.get('./assets/settings/selectIconsSpells.json').subscribe((data: any[]) => {
      this.selectIcons = data;
    });
    this.formService.formSubject.subscribe((form: any) => {
      if (form) {
        this.form = form.get('magia') as FormGroup;
        this.trucchettiIncantesimi = this.form.controls['trucchettiIncantesimi'] as FormArray;
        this.slotIncantesimi = this.form.controls['slotIncantesimi'] as FormArray;
        this.patchSlotArrayForm();
      }
    });
  }

  addTrucchettoIncantesimo() {
    const trucchettoIncantesimo = this.fb.group({
      tipologia: ['trucchetto', Validators.required],
      nome: ['', Validators.required],
      scuola: ['', Validators.required],
      scuolaPersonalizzata: '',
      livello: [0, [Validators.required, Validators.min(0), Validators.max(9)]],
      tempoLancio: ['', Validators.required],
      gittata: ['', Validators.required],
      componenti: ['', Validators.required],
      formula: '',
      durata: ['', Validators.required],
      descrizione: ['', Validators.required],
      livelloSuperiore: '',
      riferimento: '',
      preparato: false,
      icon: '',
      filtered: false
    });
    trucchettoIncantesimo.get('scuola')?.valueChanges.subscribe((value) => {
      if (value === 'Altro') {
        trucchettoIncantesimo.get('scuolaPersonalizzata')?.setValidators(Validators.required);
        trucchettoIncantesimo.updateValueAndValidity();
      } else {
        trucchettoIncantesimo.get('scuolaPersonalizzata')?.clearValidators();
        trucchettoIncantesimo.updateValueAndValidity();
      }
    });
    this.trucchettiIncantesimi.push(trucchettoIncantesimo);
  }

  
  public resetScuola(form: any) {
    form.patchValue({
      scuola: '',
      scuolaPersonalizzata: '',
    });
  }

  deleteTrucchettoIncantesimo(index: number) {
    this.trucchettiIncantesimi.removeAt(index);
  }

  patchSlotArrayForm() {
    this.slotIncantesimi.controls.forEach((slot: any) => {
      this.slotIncantesimiForm.controls[slot.value.levelLabel].setValue(slot.value.max);
    });
  }

  toggleSlot() {
    this.slotFormVisibility = !this.slotFormVisibility;
  }

  updateSlot() {
    if (this.slotIncantesimiForm.valid) {
      this.slotIncantesimi.clear();
      const slotIncantesimi = this.fb.group({
        level1: {
          levelLabel: 'level1',
          max: this.slotIncantesimiForm.controls['level1'].value,
          used: new Array(this.slotIncantesimiForm.controls['level1'].value).fill(false)
        },
        level2: {
          levelLabel: 'level2',
          max: this.slotIncantesimiForm.controls['level2'].value,
          used: new Array(this.slotIncantesimiForm.controls['level2'].value).fill(false)
        },
        level3: {
          levelLabel: 'level3',
          max: this.slotIncantesimiForm.controls['level3'].value,
          used: new Array(this.slotIncantesimiForm.controls['level3'].value).fill(false)
        },
        level4: {
          levelLabel: 'level4',
          max: this.slotIncantesimiForm.controls['level4'].value,
          used: new Array(this.slotIncantesimiForm.controls['level4'].value).fill(false)
        },
        level5: {
          levelLabel: 'level5',
          max: this.slotIncantesimiForm.controls['level5'].value,
          used: new Array(this.slotIncantesimiForm.controls['level5'].value).fill(false)
        },
        level6: {
          levelLabel: 'level6',
          max: this.slotIncantesimiForm.controls['level6'].value,
          used: new Array(this.slotIncantesimiForm.controls['level6'].value).fill(false)
        },
        level7: {
          levelLabel: 'level7',
          max: this.slotIncantesimiForm.controls['level7'].value,
          used: new Array(this.slotIncantesimiForm.controls['level7'].value).fill(false)
        },
        level8: {
          levelLabel: 'level8',
          max: this.slotIncantesimiForm.controls['level8'].value,
          used: new Array(this.slotIncantesimiForm.controls['level8'].value).fill(false)
        },
        level9: {
          levelLabel: 'level9',
          max: this.slotIncantesimiForm.controls['level9'].value,
          used: new Array(this.slotIncantesimiForm.controls['level9'].value).fill(false)
        },
      });

      // let result = [];
      Object.keys(slotIncantesimi.controls).forEach((key) => {
        this.slotIncantesimi.push(slotIncantesimi.controls[key]);
      });
      this.toggleSlot();
    }
  }
}
