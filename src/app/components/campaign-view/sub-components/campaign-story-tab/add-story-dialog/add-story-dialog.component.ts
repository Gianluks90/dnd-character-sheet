import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add-story-dialog',
    templateUrl: './add-story-dialog.component.html',
    styleUrl: './add-story-dialog.component.scss',
    standalone: false
})
export class AddStoryDialogComponent {

  public form = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    lastUpdate: new Date(),
    visible: true
  });

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddStoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { story: any }) {}

  ngOnInit() {
    if (this.data.story) {
      this.form.patchValue(this.data.story);
    }
  }

  public confirm() {
    if (this.data.story) {
      this.dialogRef.close({
        status: 'edited',
        story: this.form.value
      })
    } else {
      this.dialogRef.close({
        status: 'success',
        story: this.form.value
      })
    }
  }
}
