import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-edit-privilegio-tratto-dialog',
    templateUrl: './edit-privilegio-tratto-dialog.component.html',
    styleUrl: './edit-privilegio-tratto-dialog.component.scss',
    standalone: false
})
export class EditPrivilegioTrattoDialogComponent {

  public form: FormGroup | null = null;
  public bonuses: FormArray;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<EditPrivilegioTrattoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { privilegioTratto: any }) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      descrizione: ['', Validators.required],
      tag: [''],
      tipologia: ['', Validators.required],
      riferimento: [''],
      bonuses: this.fb.array([]),
    })
    this.bonuses = this.fb.array([]);
    this.bonuses = this.form.controls['bonuses'] as FormArray;
  }

  ngOnInit(): void {
    if (this.data) {
      // console.log(this.data.privilegioTratto);
      this.form.patchValue(this.data.privilegioTratto);
      this.bonuses = this.fb.array([]);
      this.bonuses = this.form.controls['bonuses'] as FormArray;
      if (this.data.privilegioTratto.bonuses) {
        this.data.privilegioTratto.bonuses.forEach((bonus: any) => {
          this.bonuses.push(this.fb.group(bonus));
        });
      }
    }
  }

  public addBonus(): void {
    this.bonuses.push(this.fb.group({
      element: ['', Validators.required],
      value: ['', Validators.required],
    }));
  }

  public removeBonus(index: number): void {
    this.bonuses.removeAt(index);
  }

  public confirm(): void {
    this.dialogRef.close({ status: 'success', data: this.form.value });
  }

  public delete(): void {
    this.dialogRef.close({ status: 'delete' });
  }
}
