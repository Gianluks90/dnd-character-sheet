import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-remove-campaign-dialog',
    templateUrl: './remove-campaign-dialog.component.html',
    styleUrl: './remove-campaign-dialog.component.scss',
    standalone: false
})
export class RemoveCampaignDialogComponent {

  constructor(public dialogRef: MatDialogRef<RemoveCampaignDialogComponent>) {}
  
  public confirm() {
    this.dialogRef.close('success');
  }
}
