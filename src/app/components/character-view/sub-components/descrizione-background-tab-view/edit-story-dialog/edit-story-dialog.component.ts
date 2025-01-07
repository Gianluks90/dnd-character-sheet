import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-edit-story-dialog',
    templateUrl: './edit-story-dialog.component.html',
    styleUrl: './edit-story-dialog.component.scss',
    standalone: false
})
export class EditStoryDialogComponent {
  public form: FormGroup;
  constructor(
    private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: { story: string }, 
    private dialogRef: MatDialogRef<EditStoryDialogComponent>) {
    this.form = this.fb.group({
      story: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.form.get('story').setValue(this.data.story);
  }

  public confirm(): void {
    this.dialogRef.close({
      status: 'success',
      story: this.form.get('story').value
    });
  }

}
