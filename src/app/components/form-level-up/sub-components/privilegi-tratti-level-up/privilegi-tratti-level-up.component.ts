import { Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-privilegi-tratti-level-up',
    templateUrl: './privilegi-tratti-level-up.component.html',
    styleUrls: ['./privilegi-tratti-level-up.component.scss'],
    standalone: false
})
export class PrivilegiTrattiLevelUpComponent {

  public form: FormGroup | null = null;
  public privilegiTratti: FormArray;

  constructor(public formService: FormService, private fb: FormBuilder) {
    this.privilegiTratti = this.fb.array([]);
  }

  ngOnInit(): void {
    this.formService.formLevelUpSubject.subscribe((form: any) => {
      if (form) {
        this.form = form;
        this.privilegiTratti = this.form.controls['privilegiTratti'] as FormArray;
      }
    });
  }


  addPrivilegioTratto() {
    const privilegioTratto = this.fb.group({
      nome: ['', Validators.required],
      tipologia: ['privilegio', Validators.required],
      riferimento: '',
      descrizione: ['', Validators.required],
      tag: ''
    });
    this.privilegiTratti.push(privilegioTratto);
  }

  deletePrivilegioTratto(index: number) {
    this.privilegiTratti.removeAt(index);
  }
}
