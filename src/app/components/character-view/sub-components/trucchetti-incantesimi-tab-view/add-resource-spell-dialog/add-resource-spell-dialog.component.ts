import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Spell } from 'src/app/models/spell';

@Component({
    selector: 'app-add-resource-spell-dialog',
    templateUrl: './add-resource-spell-dialog.component.html',
    styleUrl: './add-resource-spell-dialog.component.scss',
    standalone: false
})
export class AddResourceSpellDialogComponent {
  constructor(
    private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: { spells: Spell[] }, 
    private dialogRef: MatDialogRef<AddResourceSpellDialogComponent>) { }

  public form: FormGroup = this.fb.group({
    items: [],
  });

  public confirm() {
    this.dialogRef.close({
      spells: this.form.value.items
    })
  }
}
