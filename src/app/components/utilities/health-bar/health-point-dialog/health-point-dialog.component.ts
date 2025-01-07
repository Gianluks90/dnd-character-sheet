import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-health-point-dialog',
    templateUrl: './health-point-dialog.component.html',
    styleUrls: ['./health-point-dialog.component.scss'],
    standalone: false
})
export class HealthPointDialogComponent {

  public hpForm = this.fb.group({
    value: [0, Validators.pattern('^[0-9]*$')],
    // valueTemp: [0, Validators.pattern('^[0-9]*$')],
  });

  constructor(private formService: FormService, @Inject(MAT_DIALOG_DATA) public data: { parametriVitali: any },
    private dialogRef: MatDialogRef<HealthPointDialogComponent>, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  public add() {
    const pfAttuali = this.data.parametriVitali.pf;
    const pfMassimi = this.data.parametriVitali.pfMax;
    if (pfAttuali + this.hpForm.value.value > pfMassimi) {
      this.data.parametriVitali.pf = pfMassimi;
    } else {
      this.data.parametriVitali.pf += this.hpForm.value.value;
    }
    this.hpForm.reset();
  }

  public remove() {
    const pfAttuali = this.data.parametriVitali.pf;
    if (this.data.parametriVitali.pft > 0) {
      this.data.parametriVitali.pft -= this.hpForm.value.value;
      if (this.data.parametriVitali.pft <= 0) {
        this.data.parametriVitali.pf -= Math.abs(this.data.parametriVitali.pft);
        this.data.parametriVitali.pft = 0;
        this.data.parametriVitali.pftMax = 0;
      }
    } else {
      if (pfAttuali - this.hpForm.value.value <= 0) {
        this.data.parametriVitali.pf = 0;
      } else {
        this.data.parametriVitali.pf -= this.hpForm.value.value;
      }
    }
    this.hpForm.reset();
  }

  public addTemp() {
    this.data.parametriVitali.pft = this.hpForm.value.value;
    this.data.parametriVitali.pftMax = this.hpForm.value.value;
    this.hpForm.reset();
  }

  // public removeTemp() {
  //   const pftAttuali = this.data.parametriVitali.puntiFeritaTemporaneiAttuali;
  //   const pftMassimi = this.data.parametriVitali.massimoPuntiFeritaTemporanei;

  //   if (pftAttuali - this.hpForm.value.valueTemp <= 0) {
  //     this.data.group.get('puntiFeritaTemporaneiAttuali')?.setValue(0);
  //     this.data.group.get('massimoPuntiFeritaTemporanei')?.setValue(0);
  //   } else {
  //     this.data.group.get('puntiFeritaTemporaneiAttuali')?.setValue(pftAttuali - this.hpForm.value.valueTemp);
  //   }
  //   this.hpForm.reset();
  // }

  public restore() {
    this.data.parametriVitali.pf = this.data.parametriVitali.pfMax;
    this.data.parametriVitali.pft = 0;
    this.data.parametriVitali.pftMax = 0;
    this.hpForm.reset();
  }

  public close() {
    this.dialogRef.close({ status: 'success', newValue: this.data.parametriVitali });
  }
}
