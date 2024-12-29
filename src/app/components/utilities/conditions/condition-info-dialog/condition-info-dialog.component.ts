import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-condition-info-dialog',
  templateUrl: './condition-info-dialog.component.html',
  styleUrl: './condition-info-dialog.component.scss'
})
export class ConditionInfoDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConditionInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { condition: any }) { }

    public delete() {
      this.dialogRef.close({
        status: 'delete',
      });
    }
}
