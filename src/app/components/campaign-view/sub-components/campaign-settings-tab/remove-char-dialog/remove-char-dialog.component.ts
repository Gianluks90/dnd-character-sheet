import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-char-dialog',
  templateUrl: './remove-char-dialog.component.html',
  styleUrl: './remove-char-dialog.component.scss'
})
export class RemoveCharDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<RemoveCharDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: {disablingChar: boolean}) {}

  public disable() {
    this.dialogRef.close('disable');
  }

  public confirm() {
    this.dialogRef.close('delete');
  }
}
