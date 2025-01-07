import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NPC } from 'src/app/models/npcModel';

@Component({
    selector: 'app-add-addons-resources-dialog',
    templateUrl: './add-addons-resources-dialog.component.html',
    styleUrl: './add-addons-resources-dialog.component.scss',
    standalone: false
})
export class AddAddonsResourcesDialogComponent {
  constructor(
    private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: { addons: NPC[] }, 
    private dialogRef: MatDialogRef<AddAddonsResourcesDialogComponent>) { }

  public form: FormGroup = this.fb.group({
    addons: [],
  });

  public confirm() {
    this.dialogRef.close({
      addons: this.form.value.addons
    })
  }
}
