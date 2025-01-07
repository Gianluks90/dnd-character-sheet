import { Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-parametri-vitali-level-up',
    templateUrl: './parametri-vitali-level-up.component.html',
    styleUrls: ['./parametri-vitali-level-up.component.scss'],
    standalone: false
})
export class ParametriVitaliLevelUpComponent {

  public group: FormGroup | null = null;
  public groupVita: FormGroup | null = null;
  public modDestrezza: number = 0;

  public dadiVita: FormArray;

  constructor(public formService: FormService, private fb: FormBuilder) {
    this.dadiVita = this.fb.array([]);
  }

  ngOnInit(): void {
    this.formService.formLevelUpSubject.subscribe((form: any) => {
      if (form) {
        this.group = form as FormGroup;
        this.groupVita = form.get('parametriVitali') as FormGroup;
        this.dadiVita = this.groupVita.get('dadiVita') as FormArray;

        this.group.get('caratteristiche')?.valueChanges.subscribe((value: any) => {
          this.modDestrezza = Math.floor((value.destrezza - 10) / 2);
          this.group?.get('iniziativa')?.setValue(this.modDestrezza);
        });

        this.groupVita.get('massimoPuntiFerita').valueChanges.subscribe((value: any) => {
          this.groupVita?.get('puntiFeritaAttuali')?.setValue(value);
        });
      }
    });
  }

  addDadoVita() {
    const dadoVita = this.fb.group({
      tipologia: ['', Validators.required],
      quantita: [0, Validators.required],
      used: []
    });
    this.dadiVita.push(dadoVita);
  }

  deleteDadoVita(index: number) {
    this.dadiVita.removeAt(index);
  }

  public setValoreAttuale(index: number, value: any) {
    const dadoVita = this.dadiVita.at(index) as FormGroup;
    const used = new Array(parseInt(value)).fill(false);
    dadoVita.removeControl('used');
    dadoVita.addControl('used', this.fb.array(used));
  }
}
