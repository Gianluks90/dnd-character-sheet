import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormService } from 'src/app/services/form.service';
import { AddCharacterDialogComponent } from '../../character-list/add-character-dialog/add-character-dialog.component';

@Component({
    selector: 'app-add-campaign-dialog',
    templateUrl: './add-campaign-dialog.component.html',
    styleUrl: './add-campaign-dialog.component.scss',
    standalone: false
})
export class AddCampaignDialogComponent {

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddCharacterDialogComponent>,
    public formService: FormService){}

  public campForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    password:['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    dmName: ['', [Validators.required, Validators.minLength(1)]],
    description: '',
    chapterUrl: ''
  });

  public confirm() {
    this.dialogRef.close({
      status: 'confirm',
      title:this.campForm.value.title,
      password: this.campForm.value.password,
      dmName: this.campForm.value.dmName,
      description: this.campForm.value.description
    });
  }
}
