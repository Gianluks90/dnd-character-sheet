import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CampaignService } from 'src/app/services/campaign.service';

@Component({
    selector: 'app-next-session-dialog',
    templateUrl: './next-session-dialog.component.html',
    styleUrl: './next-session-dialog.component.scss',
    standalone: false
})
export class NextSessionDialogComponent {
  public form: FormGroup = new FormGroup({});
  public tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));

  constructor(
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<NextSessionDialogComponent>, 
    private campaignService: CampaignService) {
    this.form = this.fb.group({
      nextDate: ['', Validators.required],
    });
  }

  public confirm() {
    this.campaignService.updateNextSession(window.location.href.split('campaign-view/').pop(), this.form.value.nextDate).then(() => {
      this.dialogRef.close(
        { date: this.form.value.nextDate.toLocaleDateString() }
      );
    });
  }
}
