import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NPC } from 'src/app/models/npcModel';

@Component({
    selector: 'app-add-allies-resources-dialog',
    templateUrl: './add-allies-resources-dialog.component.html',
    styleUrl: './add-allies-resources-dialog.component.scss',
    standalone: false
})
export class AddAlliesResourcesDialogComponent {
  constructor(
    private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: { allies: NPC[] }, 
    private dialogRef: MatDialogRef<AddAlliesResourcesDialogComponent>) { }

  public form: FormGroup = this.fb.group({
    allies: [],
  });

  public confirm() {
    this.dialogRef.close({
      allies: this.form.value.allies
    })
  }
}
