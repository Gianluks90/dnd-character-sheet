import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';

@Component({
    selector: 'app-add-resource-item-dialog',
    templateUrl: './add-resource-item-dialog.component.html',
    styleUrl: './add-resource-item-dialog.component.scss',
    standalone: false
})
export class AddResourceItemDialogComponent {

  constructor(
    private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: { items: Item[] }, 
    private dialogRef: MatDialogRef<AddResourceItemDialogComponent>) { }

  public form: FormGroup = this.fb.group({
    items: [],
  });

  public confirm() {
    this.dialogRef.close({
      items: this.form.value.items
    })
  }
}
