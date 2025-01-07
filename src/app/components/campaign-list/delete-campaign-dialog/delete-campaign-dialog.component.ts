import { Component, Inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CampaignService } from 'src/app/services/campaign.service';
import { CharacterService } from 'src/app/services/character.service';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-delete-campaign-dialog',
    templateUrl: './delete-campaign-dialog.component.html',
    styleUrl: './delete-campaign-dialog.component.scss',
    standalone: false
})
export class DeleteCampaignDialogComponent {

  public form = this.fb.group({
    confirm: [false, Validators.requiredTrue]
  });

  constructor(
    public dialogRef: MatDialogRef<DeleteCampaignDialogComponent>,
    private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: {id: string},
    private campaignService: CampaignService ) { }

    public confirm() {
      this.campaignService.deleteCampaignById(this.data.id).then(() => {
        // this.formService.deleteImage(this.data.id).then((result) => {
        //   this.dialogRef.close('confirm');
        // });
        this.dialogRef.close('confirm')
      })
    }
}
