import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-char-rest-dialog',
  templateUrl: './char-rest-dialog.component.html',
  styleUrl: './char-rest-dialog.component.scss'
})
export class CharRestDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<CharRestDialogComponent>) { }

  public confirm() {
      this.dialogRef.close({
        status: 'success'
      })
  }
}
